import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useProjects } from '../hooks/useProjects';
import { useProjectTasks, useCreateTask, useAllTasks } from '../hooks/useTasks';
import { ViewSwitcher } from '../components/ViewSwitcher';
import { useToast } from '../components/ui/Toast';

const STORAGE_KEY = 'studentflow_last_project';

export const ProjectCalendarPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const urlProjectId = searchParams.get('projectId');
    const { showToast } = useToast();

    // Initialize with URL param, then localStorage, otherwise 'all'
    const [selectedProjectId, setSelectedProjectId] = useState<string>(() => {
        if (urlProjectId) return urlProjectId;
        return localStorage.getItem(STORAGE_KEY) || 'all';
    });

    // Calendar State
    const [currentDate, setCurrentDate] = useState(new Date());

    const { data: projects } = useProjects();

    // Fetch logic
    const isAllProjectsMode = selectedProjectId === 'all';
    const { data: allTasks, isLoading: allTasksLoading } = useAllTasks();
    const { data: projectTasks, isLoading: projectTasksLoading } = useProjectTasks(isAllProjectsMode ? '' : selectedProjectId);

    const tasks = isAllProjectsMode ? allTasks : projectTasks;
    const tasksLoading = isAllProjectsMode ? allTasksLoading : projectTasksLoading;

    // Sync state changes to URL and localStorage
    useEffect(() => {
        if (selectedProjectId && selectedProjectId !== 'all') {
            setSearchParams({ projectId: selectedProjectId });
            localStorage.setItem(STORAGE_KEY, selectedProjectId);
        } else if (selectedProjectId === 'all') {
            setSearchParams({ projectId: 'all' });
            localStorage.setItem(STORAGE_KEY, 'all');
        } else {
            setSearchParams({});
        }
    }, [selectedProjectId, setSearchParams]);

    // Calendar Logic
    const calendarData = useMemo(() => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth(); // 0-indexed

        const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 is Sunday
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Previous month padding
        const daysInPrevMonth = new Date(year, month, 0).getDate();
        const prevMonthDays = [];
        for (let i = firstDayOfMonth - 1; i >= 0; i--) {
            prevMonthDays.push({
                day: daysInPrevMonth - i,
                isCurrentMonth: false,
                date: new Date(year, month - 1, daysInPrevMonth - i)
            });
        }

        // Current month days
        const currentMonthDays = [];
        for (let i = 1; i <= daysInMonth; i++) {
            currentMonthDays.push({
                day: i,
                isCurrentMonth: true,
                date: new Date(year, month, i)
            });
        }

        // Next month padding
        const remainingCells = 42 - (prevMonthDays.length + currentMonthDays.length); // 6 rows max
        const nextMonthDays = [];
        for (let i = 1; i <= remainingCells; i++) {
            nextMonthDays.push({
                day: i,
                isCurrentMonth: false,
                date: new Date(year, month + 1, i)
            });
        }

        return [...prevMonthDays, ...currentMonthDays, ...nextMonthDays];
    }, [currentDate]);

    // Map tasks to dates
    const getTasksForDate = (date: Date) => {
        if (!tasks) return [];
        return tasks.filter(task => {
            if (!task.dueDate) return false;
            const taskDate = new Date(task.dueDate);
            return taskDate.getDate() === date.getDate() &&
                taskDate.getMonth() === date.getMonth() &&
                taskDate.getFullYear() === date.getFullYear();
        });
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const goToToday = () => {
        setCurrentDate(new Date());
    };

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    // Upcoming deadlines for sidebar
    const upcomingTasks = useMemo(() => {
        if (!tasks) return [];
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        return tasks
            .filter(t => t.dueDate && new Date(t.dueDate) >= now && t.status !== 'done')
            .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
            .slice(0, 5);
    }, [tasks]);

    // Quick Add State
    const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');

    const createTask = useCreateTask();

    const handleQuickAdd = (e: React.FormEvent) => {
        e.preventDefault();

        if (isAllProjectsMode) {
            showToast('Please select a specific project to create tasks from the calendar.', 'error');
            // Optionally close modal or show project selector in modal (out of scope for quick fix)
            return;
        }

        if (!selectedProjectId || !newTaskTitle.trim() || !selectedDate) return;

        createTask.mutate({
            projectId: selectedProjectId,
            data: {
                title: newTaskTitle,
                status: 'todo',
                priority: newTaskPriority,
                dueDate: selectedDate.toISOString(), // Convert to ISO string for API
            }
        }, {
            onSuccess: () => {
                setIsQuickAddOpen(false);
                setNewTaskTitle('');
                setNewTaskPriority('medium');
                showToast('Task created', 'success');
            }
        });
    };

    return (
        <div className="bg-app-bg text-text-main antialiased flex flex-col font-display h-full overlay-container">
            {/* Main Content */}
            <main className="flex-1 w-full max-w-[1600px] mx-auto p-6 md:p-8 lg:p-10 flex flex-col lg:flex-row gap-8">
                {/* Left Column: Calendar View */}
                <div className="flex-1 flex flex-col gap-6">
                    {/* Header with Project Selector */}
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between gap-4 mb-2">
                            <div className="flex items-center gap-2 text-sm text-secondary-accent">
                                <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                                <span>{isAllProjectsMode ? 'All Projects Calendar' : 'Project Calendar'}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                {selectedProjectId && <ViewSwitcher projectId={selectedProjectId} currentView="calendar" />}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="relative group min-w-[300px]">
                            <select
                                value={selectedProjectId}
                                onChange={(e) => setSelectedProjectId(e.target.value)}
                                className="w-full text-3xl font-black tracking-tight leading-tight bg-transparent border-none focus:outline-none cursor-pointer appearance-none pr-8"
                            >
                                <option value="all">All Projects</option>
                                <option disabled>──────────</option>
                                {projects?.map((project) => (
                                    <option key={project.id} value={project.id}>
                                        {project.name}
                                    </option>
                                ))}
                            </select>
                            <span className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-secondary-accent group-hover:text-cta">
                                <span className="material-symbols-outlined text-[32px]">expand_more</span>
                            </span>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex items-center bg-white rounded-lg shadow-sm border border-gray-100 p-1">
                                <button onClick={prevMonth} className="p-2 hover:bg-gray-50 rounded-md text-gray-600 transition-colors">
                                    <span className="material-symbols-outlined">chevron_left</span>
                                </button>
                                <button onClick={goToToday} className="px-4 py-2 text-sm font-bold text-text-main hover:bg-gray-50 rounded-md transition-colors">Today</button>
                                <button onClick={nextMonth} className="p-2 hover:bg-gray-50 rounded-md text-gray-600 transition-colors">
                                    <span className="material-symbols-outlined">chevron_right</span>
                                </button>
                            </div>
                            <div className="text-xl font-bold text-text-main w-32 text-center">
                                {monthNames[currentDate.getMonth()]} <span className="text-text-muted">{currentDate.getFullYear()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Big Calendar Grid */}
                    <div className="bg-calendar-bg rounded-2xl shadow-digital overflow-hidden border border-[#eae8dc]">
                        {/* Days Header */}
                        <div className="grid grid-cols-7 border-b border-[#e5e3dc] bg-[#eeeadd]/50">
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div key={day} className="py-4 text-center text-sm font-bold text-text-muted uppercase tracking-wider">{day}</div>
                            ))}
                        </div>

                        {/* Days Grid */}
                        {tasksLoading ? (
                            <div className="h-[600px] flex items-center justify-center bg-calendar-bg">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cta"></div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-7 auto-rows-[minmax(120px,1fr)] bg-calendar-bg min-h-[720px]">
                                {calendarData.map((cell, index) => {
                                    const dayTasks = getTasksForDate(cell.date);
                                    return (
                                        <div
                                            key={index}
                                            className={`border-b border-r border-[#e5e3dc] p-2 transition-colors min-h-[140px] group ${!cell.isCurrentMonth ? 'bg-[#f0eee4]/50' : 'hover:bg-white/40'
                                                }`}
                                            onClick={() => {
                                                if (cell.isCurrentMonth) {
                                                    setSelectedDate(cell.date);
                                                    setIsQuickAddOpen(true);
                                                }
                                            }}
                                        >
                                            <div className="flex flex-col items-center mb-1">
                                                <div className="flex justify-between items-start w-full">
                                                    <span className={`text-sm font-semibold p-1 block rounded-full size-7 flex items-center justify-center ${cell.isCurrentMonth
                                                        ? (cell.date.toDateString() === new Date().toDateString()
                                                            ? 'bg-cta text-white shadow-sm'
                                                            : 'text-text-main')
                                                        : 'text-text-muted/50'
                                                        }`}>
                                                        {cell.day}
                                                    </span>
                                                    {cell.isCurrentMonth && (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedDate(cell.date);
                                                                setIsQuickAddOpen(true);
                                                            }}
                                                            className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-cta transition-opacity"
                                                            title="Quick Add Task"
                                                        >
                                                            <span className="material-symbols-outlined text-[16px]">add</span>
                                                        </button>
                                                    )}
                                                </div>
                                                {/* Priority Dots */}
                                                <div className="flex gap-1 mt-1 h-1.5 w-full pl-1">
                                                    {dayTasks
                                                        .sort((a, b) => {
                                                            const pA = a.priority === 'high' ? 3 : a.priority === 'medium' ? 2 : 1;
                                                            const pB = b.priority === 'high' ? 3 : b.priority === 'medium' ? 2 : 1;
                                                            return pB - pA;
                                                        })
                                                        .slice(0, 4) // Show max 4 dots
                                                        .map((task, i) => (
                                                            <div
                                                                key={i}
                                                                className={`size-1.5 rounded-full ${task.priority === 'high' ? 'bg-red-500' :
                                                                    task.priority === 'medium' ? 'bg-amber-400' :
                                                                        'bg-blue-400'
                                                                    }`}
                                                            />
                                                        ))}
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                {dayTasks.map(task => (
                                                    <Link
                                                        to={`/project/task/${task.id}`}
                                                        key={task.id}
                                                        onClick={(e) => e.stopPropagation()}
                                                        className={`text-xs font-medium px-2 py-1 rounded border truncate cursor-pointer hover:opacity-80 transition-opacity block ${task.priority === 'high' ? 'bg-red-100 text-red-800 border-red-200' :
                                                            task.priority === 'medium' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                                                                'bg-blue-100 text-blue-800 border-blue-200'
                                                            }`}
                                                    >
                                                        {task.title}
                                                    </Link>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                <aside className="w-full lg:w-80 flex flex-col gap-6">
                    {/* Legend */}
                    <div className="bg-white rounded-xl shadow-soft p-4 border border-gray-100">
                        <h3 className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Priority Legend</h3>
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center gap-2">
                                <div className="size-2 rounded-full bg-red-500"></div>
                                <span className="text-sm text-text-main">High Priority</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="size-2 rounded-full bg-amber-400"></div>
                                <span className="text-sm text-text-main">Medium Priority</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="size-2 rounded-full bg-blue-400"></div>
                                <span className="text-sm text-text-main">Low Priority</span>
                            </div>
                        </div>
                    </div>

                    {/* Upcoming Deadlines */}
                    <div className="bg-calendar-bg rounded-xl shadow-digital border border-[#e5e3dc] flex flex-col overflow-hidden">
                        <div className="p-4 border-b border-[#e5e3dc] flex justify-between items-center bg-[#eeeadd]/30">
                            <h3 className="font-bold text-text-main">Upcoming Deadlines</h3>
                            {selectedProjectId && (
                                <Link to={`/project?projectId=${selectedProjectId}`} className="text-xs font-semibold text-cta hover:underline">View Board</Link>
                            )}
                        </div>
                        <div className="p-4 flex flex-col gap-4">
                            {!selectedProjectId ? (
                                <p className="text-xs text-text-muted text-center py-4">Select a project to view deadlines</p>
                            ) : upcomingTasks.length > 0 ? (
                                upcomingTasks.map(task => (
                                    <Link to={`/project/task/${task.id}`} key={task.id} className="flex gap-3 items-start group cursor-pointer hover:bg-white/50 p-2 rounded-lg transition-colors">
                                        <div className={`mt-1 size-2 rounded-full ${task.priority === 'high' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' :
                                            'bg-amber-400'
                                            }`}></div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-bold text-text-main group-hover:text-cta transition-colors">{task.title}</h4>
                                            <p className="text-xs text-text-muted mt-0.5">
                                                {new Date(task.dueDate!).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                            </p>
                                        </div>
                                        {task.priority === 'high' && (
                                            <span className="text-[10px] font-bold bg-red-100 text-red-700 px-1.5 py-0.5 rounded uppercase">Urgent</span>
                                        )}
                                    </Link>
                                ))
                            ) : (
                                <p className="text-xs text-text-muted text-center py-4">No upcoming deadlines found.</p>
                            )}
                        </div>
                    </div>

                    {/* Helper Widget */}
                    <div className="bg-white rounded-xl shadow-soft p-4 border border-gray-100 relative overflow-hidden">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-cta/10 rounded-lg text-cta">
                                <span className="material-symbols-outlined">tips_and_updates</span>
                            </div>
                            <h3 className="text-sm font-bold text-text-main">Pro Tip</h3>
                        </div>
                        <p className="text-xs text-text-muted leading-relaxed">
                            Use the <span className="font-bold text-cta">Document Analyzer</span> to automatically extract deadlines from your syllabus and populate this calendar!
                        </p>
                        <Link to="/ai/analyze" className="block mt-3 w-full py-2 bg-[#f4f3f0] hover:bg-[#e8e6e1] text-text-main text-xs font-bold rounded-lg transition-colors text-center">
                            Try Analyzer
                        </Link>
                    </div>
                </aside>
            </main>

            {/* Quick Add Modal */}
            {
                isQuickAddOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden transform transition-all scale-100">
                            <div className="p-5">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-text-main">Quick Add Task</h3>
                                        <p className="text-xs text-text-muted">
                                            For {selectedDate?.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setIsQuickAddOpen(false)}
                                        className="text-gray-400 hover:text-gray-600 p-1"
                                    >
                                        <span className="material-symbols-outlined text-[20px]">close</span>
                                    </button>
                                </div>

                                <form onSubmit={handleQuickAdd} className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-text-sub uppercase tracking-wider mb-1">
                                            Task Title
                                        </label>
                                        <input
                                            autoFocus
                                            type="text"
                                            value={newTaskTitle}
                                            onChange={(e) => setNewTaskTitle(e.target.value)}
                                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-cta/10 focus:border-cta transition-all text-sm font-medium"
                                            placeholder="What needs to be done?"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold text-text-sub uppercase tracking-wider mb-1">
                                            Priority
                                        </label>
                                        <div className="flex gap-2">
                                            {(['low', 'medium', 'high'] as const).map((p) => (
                                                <button
                                                    key={p}
                                                    type="button"
                                                    onClick={() => setNewTaskPriority(p)}
                                                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold capitalize transition-all border ${newTaskPriority === p
                                                        ? p === 'high' ? 'bg-red-100 text-red-700 border-red-200'
                                                            : p === 'medium' ? 'bg-amber-100 text-amber-800 border-amber-200'
                                                                : 'bg-blue-100 text-blue-800 border-blue-200'
                                                        : 'bg-white text-text-muted border-gray-200 hover:bg-gray-50'
                                                        }`}
                                                >
                                                    {p}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={createTask.isPending || !newTaskTitle.trim()}
                                        className="w-full py-2.5 bg-cta hover:bg-cta-hover text-white rounded-xl font-bold text-sm shadow-soft transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
                                    >
                                        {createTask.isPending ? (
                                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        ) : (
                                            <>
                                                <span className="material-symbols-outlined text-[18px]">add_task</span>
                                                Create Task
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    );
};
