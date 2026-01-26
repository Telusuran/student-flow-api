import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useProjects } from '../hooks/useProjects';
import { useProjectTasks, useAllTasks } from '../hooks/useTasks';
import type { Task } from '../lib/api/types';
import { ViewSwitcher } from '../components/ViewSwitcher';

const STORAGE_KEY = 'studentflow_last_project';

export const ProjectSpacePage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const urlProjectId = searchParams.get('projectId');

    // Initialize with URL param, then localStorage, otherwise 'all'
    const [selectedProjectId, setSelectedProjectId] = useState<string>(() => {
        if (urlProjectId) return urlProjectId;
        return localStorage.getItem(STORAGE_KEY) || 'all';
    });
    const [now] = useState(() => Date.now());

    const { data: projects } = useProjects();

    // Fetch logic
    const isAllProjectsMode = selectedProjectId === 'all';
    const { data: allTasks, isLoading: allTasksLoading } = useAllTasks();
    const { data: projectTasks, isLoading: projectTasksLoading } = useProjectTasks(isAllProjectsMode ? '' : selectedProjectId);

    const tasks = isAllProjectsMode ? allTasks : projectTasks;
    const tasksLoading = isAllProjectsMode ? allTasksLoading : projectTasksLoading;

    const selectedProject = projects?.find(p => p.id === selectedProjectId);

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

    // Handle project sorting/filtering for Gantt
    const [viewMode, setViewMode] = useState<'day' | 'week'>('day');

    // Gantt Chart Logic
    const timelineData = useMemo(() => {
        if (!tasks || tasks.length === 0) return null;

        // Sort tasks by creation date
        const sortedTasks = [...(tasks || [])].sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateA - dateB;
        });

        // Determine timeline range
        // Find min start and max end
        let minDate = new Date();
        let maxDate = new Date();

        if (sortedTasks.length > 0) {
            const startDates = sortedTasks.map(t => t.createdAt ? new Date(t.createdAt).getTime() : now);
            const endDates = sortedTasks.map(t => t.dueDate ? new Date(t.dueDate).getTime() : (t.createdAt ? new Date(t.createdAt).getTime() + 86400000 : now));

            minDate = new Date(Math.min(...startDates));
            maxDate = new Date(Math.max(...endDates));
        }

        // Add padding (2 days before, 5 days after)
        minDate.setDate(minDate.getDate() - 2);
        maxDate.setDate(maxDate.getDate() + 5);

        // Generate dates array
        const dates: Date[] = [];
        const curr = new Date(minDate);
        while (curr <= maxDate) {
            dates.push(new Date(curr));
            curr.setDate(curr.getDate() + 1);
        }

        return { dates, minDate, maxDate };
    }, [tasks, now]);

    // Helper to calculate bar position and width
    const getTaskStyle = (task: Task) => {
        if (!timelineData) return {};
        const { minDate, dates } = timelineData;
        const totalDays = dates.length;

        const startDate = task.createdAt ? new Date(task.createdAt) : new Date();
        const endDate = task.dueDate ? new Date(task.dueDate) : new Date(startDate.getTime() + 86400000); // 1 day default

        // Calculate offset (days from start)
        const offsetDays = (startDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24);

        // Calculate duration (days)
        let durationDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
        if (durationDays < 1) durationDays = 1; // Min 1 day

        const leftPercent = (offsetDays / totalDays) * 100;
        const widthPercent = (durationDays / totalDays) * 100;

        return {
            left: `${Math.max(0, leftPercent)}%`,
            width: `${Math.min(100 - Math.max(0, leftPercent), widthPercent)}%`
        };
    };

    return (
        <div className="bg-neutral-bg text-text-main font-display h-screen w-full overflow-hidden flex flex-col relative text-text-main">
            <div className="flex h-full w-full">
                {/* Mini Sidebar */}
                <div className="hidden md:flex flex-col w-20 border-r border-secondary-accent/20 bg-surface items-center py-6 gap-8 z-30 shadow-soft">
                    <div className="size-10 rounded-xl bg-cta flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-cta/30">
                        P
                    </div>
                    <div className="flex flex-col gap-6 w-full items-center">
                        <Link to="/" className="p-3 rounded-xl text-secondary-accent hover:bg-neutral-bg hover:text-cta transition-colors">
                            <span className="material-symbols-outlined text-[28px]">home</span>
                        </Link>
                        <Link to="/project" className="p-3 rounded-xl text-secondary-accent hover:bg-neutral-bg hover:text-cta transition-colors">
                            <span className="material-symbols-outlined text-[28px]">folder_open</span>
                        </Link>
                        <Link to="/project/space" className="p-3 rounded-xl bg-secondary-accent/10 text-secondary-accent border border-secondary-accent/20">
                            <span className="material-symbols-outlined text-[28px]">calendar_view_week</span>
                        </Link>
                        <Link to="/calendar" className="p-3 rounded-xl text-secondary-accent hover:bg-neutral-bg hover:text-cta transition-colors">
                            <span className="material-symbols-outlined text-[28px]">calendar_month</span>
                        </Link>
                        <Link to="/data-insight" className="p-3 rounded-xl text-secondary-accent hover:bg-neutral-bg hover:text-cta transition-colors">
                            <span className="material-symbols-outlined text-[28px]">insights</span>
                        </Link>
                    </div>
                    <div className="mt-auto flex flex-col gap-6 w-full items-center">
                        <div className="size-10 rounded-full bg-cover bg-center border-2 border-secondary-accent/30" style={{ backgroundImage: "url('https://ui-avatars.com/api/?name=User&background=ramdom')" }}></div>
                    </div>
                </div>

                {/* Main Content */}
                <main className="flex-1 flex flex-col h-full bg-neutral-bg min-w-0 relative z-0">
                    <header className="flex-none px-8 py-6 bg-neutral-bg/80 backdrop-blur-sm z-20">
                        <div className="max-w-[1400px] mx-auto w-full flex flex-col gap-6">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="text-secondary-accent">Projects</span>
                                    <span className="text-secondary-accent/50">/</span>
                                    <span className="text-text-main font-medium">{selectedProject ? selectedProject.name : 'All Projects'}</span>
                                </div>
                                {selectedProjectId && <ViewSwitcher projectId={selectedProjectId} currentView="gantt" />}
                            </div>
                            <div className="flex flex-wrap items-end justify-between gap-4">
                                <div className="flex flex-col gap-2">
                                    <select
                                        value={selectedProjectId}
                                        onChange={(e) => setSelectedProjectId(e.target.value)}
                                        className="text-3xl font-black tracking-tight leading-tight bg-transparent border-none focus:outline-none cursor-pointer"
                                    >
                                        <option value="all">All Projects</option>
                                        <option disabled>──────────</option>
                                        {projects?.map((project) => (
                                            <option key={project.id} value={project.id}>
                                                {project.name}
                                            </option>
                                        ))}
                                    </select>
                                    {selectedProject && (
                                        <div className="flex items-center gap-4 text-sm text-secondary-accent">
                                            {selectedProject.courseCode && <span>{selectedProject.courseCode}</span>}
                                            {selectedProject.dueDate && (
                                                <>
                                                    <span className="size-1 rounded-full bg-secondary-accent"></span>
                                                    <span>Due {new Date(selectedProject.dueDate).toLocaleDateString()}</span>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-3 bg-white px-3 py-2 rounded-full shadow-sm border border-secondary-accent/20">
                                        <span className="text-xs font-bold text-secondary-accent uppercase tracking-wide">Fokus Mode</span>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input className="sr-only peer" type="checkbox" value="" />
                                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-cta"></div>
                                        </label>
                                    </div>
                                    <Link to={`/project?projectId=${selectedProjectId}`} className="flex items-center justify-center gap-2 h-10 px-4 bg-cta hover:bg-cta/90 text-white text-sm font-bold rounded-lg transition-colors shadow-lg shadow-cta/30">
                                        <span className="material-symbols-outlined text-[20px]">view_kanban</span>
                                        <span>Board View</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Filter Bar */}
                    <div className="flex-none px-8 py-3 bg-neutral-bg/50 border-b border-secondary-accent/10 backdrop-blur-md z-10">
                        <div className="max-w-[1400px] mx-auto w-full flex items-center gap-4">
                            <span className="text-xs font-bold uppercase tracking-wide text-text-muted">View:</span>
                            <div className="flex bg-neutral-card p-1 rounded-lg border border-secondary-accent/10 shadow-sm">
                                <button
                                    onClick={() => setViewMode('day')}
                                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${viewMode === 'day' ? 'bg-white text-cta shadow-sm ring-1 ring-black/5' : 'text-text-muted hover:text-text-main'}`}
                                >
                                    Days
                                </button>
                                <button
                                    onClick={() => setViewMode('week')}
                                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${viewMode === 'week' ? 'bg-white text-cta shadow-sm ring-1 ring-black/5' : 'text-text-muted hover:text-text-main'}`}
                                >
                                    Weeks
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Gantt Chart Area */}
                    <div className="flex-1 overflow-x-auto overflow-y-hidden relative bg-neutral-bg">
                        {tasksLoading ? (
                            <div className="flex-1 flex items-center justify-center h-full">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cta"></div>
                            </div>
                        ) : timelineData && timelineData.dates.length > 0 ? (
                            <div className="h-full p-6 min-w-[1000px] max-w-[1600px] mx-auto flex flex-col relative z-10">
                                <div className="flex-1 bg-white/40 border border-white/60 shadow-sm backdrop-blur-sm rounded-2xl flex flex-col overflow-hidden">
                                    {/* Header Row (Dates) */}
                                    <div className="flex border-b border-secondary-accent/10 bg-surface/50 h-14 shrink-0">
                                        <div className="w-72 p-4 border-r border-secondary-accent/10 flex items-center justify-between bg-neutral-bg/30">
                                            <span className="text-xs font-bold uppercase tracking-wider text-text-muted">Task Name</span>
                                        </div>
                                        <div className="flex-1 relative flex">
                                            {timelineData.dates.map((date, i) => (
                                                <div key={i} className="flex-1 border-r border-secondary-accent/10 flex flex-col items-center justify-center min-w-[40px]">
                                                    <span className="text-[10px] text-text-muted">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                                                    <span className={`font-bold ${date.toDateString() === new Date().toDateString() ? 'text-cta' : 'text-text-main'
                                                        }`}>{date.getDate()}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Task Rows */}
                                    <div className="flex-1 overflow-y-auto">
                                        <div className="w-full flex flex-col relative">
                                            {/* Background Grid Lines (Absolute) */}
                                            <div className="absolute inset-0 flex pointer-events-none pl-72">
                                                {timelineData.dates.map((_, i) => (
                                                    <div key={i} className="flex-1 border-r border-secondary-accent/5 h-full"></div>
                                                ))}
                                            </div>

                                            {/* Tasks */}
                                            {tasks?.map((task) => {
                                                const style = getTaskStyle(task);
                                                return (
                                                    <div key={task.id} className="flex h-12 border-b border-secondary-accent/5 hover:bg-white/30 transition-colors group relative z-10">
                                                        <div className="w-72 shrink-0 border-r border-secondary-accent/10 flex items-center px-4 bg-white/40 relative z-20">
                                                            <div className={`size-2 rounded-full mr-3 ${task.status === 'done' ? 'bg-green-500' :
                                                                task.status === 'in_progress' ? 'bg-cta' : 'bg-secondary-accent'
                                                                }`}></div>
                                                            <div className="flex flex-col overflow-hidden">
                                                                <span className="text-sm font-medium text-text-main truncate">{task.title}</span>
                                                                {task.dueDate && <span className="text-[10px] text-text-muted">Due {new Date(task.dueDate).toLocaleDateString()}</span>}
                                                            </div>
                                                        </div>
                                                        <div className="flex-1 relative py-2.5">
                                                            <div
                                                                className={`absolute top-2.5 h-7 rounded-lg shadow-sm flex items-center overflow-hidden cursor-pointer hover:shadow-md transition-all border ${task.status === 'done' ? 'bg-green-100 border-green-200' :
                                                                    task.status === 'in_progress' ? 'bg-white border-cta/30' :
                                                                        'bg-white border-secondary-accent/20'
                                                                    }`}
                                                                style={style}
                                                                title={`${task.title} (${task.status})`}
                                                            >
                                                                <div
                                                                    className={`h-full opacity-60 ${task.status === 'done' ? 'bg-green-500' :
                                                                        task.status === 'in_progress' ? 'bg-gradient-to-r from-white to-cta' :
                                                                            'bg-secondary-accent/20'
                                                                        }`}
                                                                    style={{ width: `${task.progress || 0}%` }}
                                                                ></div>
                                                                <span className="absolute left-2 text-[10px] font-bold text-text-main px-1 truncate w-full">
                                                                    {task.title}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}

                                            {tasks?.length === 0 && (
                                                <div className="p-8 text-center text-text-muted">
                                                    No tasks found for this project.
                                                    <Link to={`/project?projectId=${selectedProjectId}`} className="text-cta hover:underline ml-1">Create one?</Link>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : null}
                    </div>
                </main>
            </div>
        </div>
    );
};
