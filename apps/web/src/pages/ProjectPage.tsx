import React, { useState, useEffect } from 'react';
import { Link, useOutletContext, useSearchParams, useNavigate } from 'react-router-dom';
import { DndContext, DragOverlay, useSensor, useSensors, PointerSensor, TouchSensor } from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { useProjects } from '../hooks/useProjects';
import { useProjectTasks, useCreateTask, useUpdateTaskStatus, useAllTasks } from '../hooks/useTasks';
import { useProjectSuggestions, useGenerateSuggestions } from '../hooks/useAI';
import type { Task } from '../lib/api/types';
import { TaskCard } from '../components/kanban/TaskCard';
import { KanbanColumn } from '../components/kanban/KanbanColumn';
import { useToast } from '../components/ui/Toast';
import { ViewSwitcher } from '../components/ViewSwitcher';

export const ProjectPage: React.FC = () => {
    const { isFocusMode } = useOutletContext<{ isFocusMode: boolean }>();
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const urlProjectId = searchParams.get('projectId');
    const { showToast } = useToast();

    // Storage key for persisting selected project
    const STORAGE_KEY = 'studentflow_last_project';

    // Initialize with URL param first, then localStorage, then 'all' (default view)
    const getInitialProjectId = () => {
        if (urlProjectId) return urlProjectId;
        const stored = localStorage.getItem(STORAGE_KEY);
        // If nothing matches, default to "all" to show all tasks
        return stored || 'all';
    };

    const [selectedProjectId, setSelectedProjectId] = useState<string>(getInitialProjectId);

    // Sync state changes to URL and localStorage
    useEffect(() => {
        if (selectedProjectId && selectedProjectId !== 'all') {
            setSearchParams({ projectId: selectedProjectId });
            localStorage.setItem(STORAGE_KEY, selectedProjectId);
        } else {
            // 'all' represents no specific project selected in terms of URL query for cleanliness
            // But we need to distinguish between "just landed" and "explicitly viewing all"
            // For now, let's just make sure url parameter matches. 
            // If it is 'all', we can remove the param to keep URL clean
            setSearchParams({});
            localStorage.setItem(STORAGE_KEY, '');
        }
    }, [selectedProjectId, setSearchParams]);

    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
    const [newTaskDueDate, setNewTaskDueDate] = useState('');
    const [addingToColumn, setAddingToColumn] = useState<string | null>(null);
    const [activeDragTask, setActiveDragTask] = useState<Task | null>(null);

    const { data: projects } = useProjects();

    // Determine which tasks to fetch
    const isAllProjectsMode = !selectedProjectId || selectedProjectId === 'all';

    const { data: allTasks, isLoading: allTasksLoading } = useAllTasks();
    const { data: projectTasks, isLoading: projectTasksLoading } = useProjectTasks(selectedProjectId && selectedProjectId !== 'all' ? selectedProjectId : '');

    const tasks = isAllProjectsMode ? allTasks : projectTasks;
    const tasksLoading = isAllProjectsMode ? allTasksLoading : (selectedProjectId ? projectTasksLoading : false);

    const { data: suggestions } = useProjectSuggestions(selectedProjectId || 'all');
    const generateSuggestionsMutation = useGenerateSuggestions();
    const [generatedSuggestions, setGeneratedSuggestions] = useState<Array<{ title: string; description: string; priority: string }> | null>(null);
    const createTask = useCreateTask();
    const updateTaskStatus = useUpdateTaskStatus();

    // Combine fetched and generated suggestions, preferring generated ones
    const displaySuggestions = generatedSuggestions || suggestions;

    // Handler to generate suggestions based on current tasks
    const handleGenerateSuggestions = async () => {
        if (!tasks || tasks.length === 0) {
            showToast('Add some tasks first before generating suggestions', 'error');
            return;
        }
        try {
            const result = await generateSuggestionsMutation.mutateAsync({
                projectId: selectedProjectId || 'all',
                tasks: tasks.map(t => ({
                    title: t.title,
                    status: t.status,
                    priority: t.priority,
                    dueDate: t.dueDate ? new Date(t.dueDate).toISOString() : null,
                })),
            });
            // Handle different response formats from AI (array or nested object)
            type SuggestionItem = { title: string; description: string; priority: string; reasoning?: string };
            let suggestionsArray: SuggestionItem[] = [];
            if (Array.isArray(result)) {
                suggestionsArray = result;
            } else if (result && typeof result === 'object') {
                // Try common wrapper keys
                const resultObj = result as Record<string, SuggestionItem[]>;
                suggestionsArray = resultObj.newTasks || resultObj.suggestions || resultObj.tasks || [];
            }
            setGeneratedSuggestions(suggestionsArray);
            if (suggestionsArray.length > 0) {
                showToast('AI suggestions generated!', 'success');
            } else {
                showToast('No suggestions generated. Try adding more tasks.', 'info');
            }
        } catch (error) {
            console.error('Failed to generate suggestions:', error);
            showToast('Failed to generate suggestions', 'error');
        }
    };

    const selectedProject = projects?.find(p => p.id === selectedProjectId);

    const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');

    // Helper for All Projects Mode
    const getProjectInfo = (projectId: string) => {
        const project = projects?.find(p => p.id === projectId);
        return project ? { name: project.name, color: project.color || 'blue' } : undefined;
    };

    // Filter tasks first
    const filteredTasks = tasks?.filter(t => {
        if (priorityFilter !== 'all' && t.priority !== priorityFilter) return false;
        return true;
    }) || [];

    // Group tasks by status
    const todoTasks = filteredTasks.filter(t => t.status === 'todo' || t.status === null);
    const inProgressTasks = filteredTasks.filter(t => t.status === 'in_progress');
    const doneTasks = filteredTasks.filter(t => t.status === 'done');

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(TouchSensor)
    );

    const handleCreateTask = async (status: string) => {
        if (!newTaskTitle.trim()) return;

        // If in All Projects mode, we need to know which project to assign to.
        // For now, we disable creation in All Projects mode or require selecting a project first.
        if (isAllProjectsMode) {
            showToast('Please select a specific project to create tasks.', 'error');
            return;
        }

        if (!selectedProjectId) return;

        try {
            await createTask.mutateAsync({
                projectId: selectedProjectId,
                data: {
                    title: newTaskTitle,
                    status,
                    priority: newTaskPriority,
                    dueDate: newTaskDueDate || undefined,
                },
            });
            setNewTaskTitle('');
            setNewTaskPriority('medium');
            setNewTaskDueDate('');
            setAddingToColumn(null);
            showToast('Task created successfully', 'success');
        } catch (error) {
            console.error('Failed to create task:', error);
            showToast('Failed to create task', 'error');
        }
    };

    const handleStatusChange = async (taskId: string, newStatus: string) => {
        try {
            await updateTaskStatus.mutateAsync({ id: taskId, status: newStatus });
            // showToast('Task updated', 'success'); // Optional, maybe too noisy for drag and drop
        } catch (error) {
            console.error('Failed to update task status:', error);
            showToast('Failed to update task', 'error');
        }
    };

    const handleDragStart = (event: DragStartEvent) => {
        const task = event.active.data.current?.task;
        setActiveDragTask(task);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveDragTask(null);

        if (!over) return;

        const taskId = active.id as string;
        const newStatus = over.id as string;

        const task = tasks?.find(t => t.id === taskId);
        if (task && task.status !== newStatus) {
            handleStatusChange(taskId, newStatus);
        }
    };

    // Handle creating task from AI suggestion
    const handleCreateFromSuggestion = async (suggestion: { title: string; description: string; priority: string; dueDate?: string }) => {
        if (isAllProjectsMode || !selectedProjectId) return;
        try {
            const priorityMap: Record<string, 'low' | 'medium' | 'high'> = {
                'high': 'high',
                'medium': 'medium',
                'low': 'low'
            };
            await createTask.mutateAsync({
                projectId: selectedProjectId,
                data: {
                    title: suggestion.title,
                    description: suggestion.description,
                    status: 'todo',
                    priority: priorityMap[suggestion.priority] || 'medium',
                    dueDate: suggestion.dueDate || undefined,
                },
            });
            showToast(`Task "${suggestion.title}" created from AI suggestion!`, 'success');
        } catch (error) {
            console.error('Failed to create task from suggestion:', error);
            showToast('Failed to create task', 'error');
        }
    };

    return (
        <div className={`font-display w-full flex flex-col relative transition-colors duration-500 h-full ${isFocusMode ? 'bg-fokus-dark text-white' : 'bg-neutral-bg text-text-main'}`}>
            <div className="flex h-full w-full">
                {/* AI Suggestions Sidebar - only show when project selected or all projects mode */}
                {!isFocusMode && (selectedProjectId || isAllProjectsMode) && (
                    <div className="w-[300px] min-w-[280px] flex-col border-r border-secondary-accent/20 bg-surface h-full relative z-20 shadow-soft lg:flex hidden transition-all">
                        <div className="p-4 border-b border-secondary-accent/10 bg-neutral-bg/30">
                            <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-purple-500">auto_awesome</span>
                                    <h3 className="text-sm font-bold text-text-main">AI Suggestions</h3>
                                </div>
                                <button
                                    onClick={handleGenerateSuggestions}
                                    disabled={generateSuggestionsMutation.isPending}
                                    className="flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold bg-purple-600 text-white hover:bg-purple-700 transition-all disabled:opacity-50"
                                    title="Generate new suggestions based on current tasks"
                                >
                                    {generateSuggestionsMutation.isPending ? (
                                        <span className="material-symbols-outlined text-sm animate-spin">refresh</span>
                                    ) : (
                                        <span className="material-symbols-outlined text-sm">bolt</span>
                                    )}
                                    Generate
                                </button>
                            </div>
                            <p className="text-xs text-text-muted mt-1">
                                {isAllProjectsMode ? 'Global insights & suggestions' : 'Click to add as a task'}
                            </p>
                        </div>
                        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
                            {displaySuggestions?.length ? displaySuggestions.map((suggestion: { title: string; description: string; priority: string; reasoning?: string; dueDate?: string }, i: number) => (
                                <div
                                    key={i}
                                    className="p-3 rounded-lg border border-purple-200 bg-purple-50 hover:border-purple-400 hover:shadow-md transition-all group"
                                >
                                    <div className="flex items-start justify-between gap-2">
                                        <p className="text-sm font-bold text-text-main flex-1">{suggestion.title}</p>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded whitespace-nowrap ${suggestion.priority === 'high' ? 'bg-red-100 text-red-600' :
                                            suggestion.priority === 'medium' ? 'bg-orange-100 text-orange-600' :
                                                'bg-blue-100 text-blue-600'
                                            }`}>
                                            {suggestion.priority}
                                        </span>
                                    </div>
                                    <p className="text-xs text-text-muted mt-2">{suggestion.description}</p>
                                    <div className="flex items-center gap-3 mt-2">
                                        {suggestion.dueDate && (
                                            <span className="text-[10px] text-gray-500 flex items-center gap-1">
                                                <span className="material-symbols-outlined text-xs">calendar_today</span>
                                                {new Date(suggestion.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        )}
                                    </div>
                                    {suggestion.reasoning && (
                                        <div className="mt-2 pt-2 border-t border-purple-200">
                                            <p className="text-[10px] text-purple-600 font-medium flex items-center gap-1">
                                                <span className="material-symbols-outlined text-xs">lightbulb</span>
                                                Why: {suggestion.reasoning}
                                            </p>
                                        </div>
                                    )}
                                    {!isAllProjectsMode && (
                                        <div className="mt-3 flex justify-end">
                                            <button
                                                onClick={() => handleCreateFromSuggestion(suggestion)}
                                                disabled={createTask.isPending}
                                                className="flex items-center gap-1 text-[11px] font-bold px-3 py-1.5 rounded bg-purple-600 text-white hover:bg-purple-700 transition-all disabled:opacity-50"
                                            >
                                                <span className="material-symbols-outlined text-sm">add</span>
                                                {createTask.isPending ? 'Adding...' : 'Add as Task'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )) : (
                                <div className="text-center py-8">
                                    <span className="material-symbols-outlined text-4xl text-purple-200 mb-2">psychology</span>
                                    <p className="text-xs text-text-muted">Click "Generate" to get AI suggestions</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Main Content Area */}
                <main className={`flex-1 flex flex-col h-full min-w-0 relative z-0 transition-colors duration-500 ${isFocusMode ? 'bg-fokus-dark text-white' : 'bg-neutral-bg text-text-main'}`}>
                    {/* Project Header */}
                    <div className={`flex-none px-8 py-6 transition-colors duration-500 ${isFocusMode ? 'bg-fokus-dark' : 'bg-neutral-bg/80 backdrop-blur-sm'}`}>
                        <div className="max-w-[1400px] mx-auto w-full flex flex-col gap-4">
                            <div className={`flex items-center gap-2 text-sm ${isFocusMode ? 'text-gray-400' : 'text-text-muted'}`}>
                                <span>{isAllProjectsMode ? 'All Tasks Overview' : 'Project Board'}</span>
                            </div>
                            <div className="flex flex-wrap items-end justify-between gap-4">
                                <div className="flex flex-col gap-2">
                                    <select
                                        value={selectedProjectId || 'all'}
                                        onChange={(e) => setSelectedProjectId(e.target.value)}
                                        className={`text-2xl font-black tracking-tight leading-tight bg-transparent border-none focus:outline-none cursor-pointer ${isFocusMode ? 'text-white' : 'text-text-main'}`}
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
                                        <div className={`flex items-center gap-3 text-sm font-medium ${isFocusMode ? 'text-gray-400' : 'text-secondary-accent'}`}>
                                            {selectedProject.courseCode && <span>{selectedProject.courseCode}</span>}
                                            {selectedProject.dueDate && (
                                                <>
                                                    <span className="size-1 rounded-full bg-secondary-accent/40"></span>
                                                    <span className="flex items-center gap-1.5">
                                                        <span className="material-symbols-outlined text-[16px]">event</span>
                                                        Due {new Date(selectedProject.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex bg-white dark:bg-neutral-800 rounded-xl border border-gray-200 dark:border-neutral-700 p-1 shadow-sm h-10 items-center">
                                        <button
                                            onClick={() => setPriorityFilter('all')}
                                            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${priorityFilter === 'all' ? 'bg-secondary-accent/10 text-secondary-accent' : 'text-gray-400 hover:text-gray-600'}`}
                                        >
                                            All
                                        </button>
                                        <div className="w-px h-4 bg-gray-200 dark:bg-neutral-700 mx-1"></div>
                                        <button
                                            onClick={() => setPriorityFilter('high')}
                                            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${priorityFilter === 'high' ? 'bg-red-100 text-red-600' : 'text-gray-400 hover:text-red-400'}`}
                                        >
                                            High
                                        </button>
                                        <button
                                            onClick={() => setPriorityFilter('medium')}
                                            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${priorityFilter === 'medium' ? 'bg-orange-100 text-orange-600' : 'text-gray-400 hover:text-orange-400'}`}
                                        >
                                            Med
                                        </button>
                                        <button
                                            onClick={() => setPriorityFilter('low')}
                                            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${priorityFilter === 'low' ? 'bg-blue-100 text-blue-600' : 'text-gray-400 hover:text-blue-400'}`}
                                        >
                                            Low
                                        </button>
                                    </div>



                                    <ViewSwitcher projectId={selectedProjectId || 'all'} currentView="board" />

                                    {!isAllProjectsMode && selectedProjectId && (
                                        <>
                                            <Link
                                                to={`/project/${selectedProjectId}/resources`}
                                                className={`flex items-center justify-center size-10 rounded-xl border transition-all ${isFocusMode
                                                    ? 'bg-white/10 border-white/10 text-white hover:bg-white/20'
                                                    : 'bg-white border-secondary-accent/20 text-secondary-accent hover:border-cta/50 hover:text-cta hover:shadow-sm'}`}
                                                title="Project Resources"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">folder_open</span>
                                            </Link>
                                            <Link
                                                to={`/project/settings?projectId=${selectedProjectId}`}
                                                className={`flex items-center justify-center size-10 rounded-xl border transition-all ${isFocusMode
                                                    ? 'bg-white/10 border-white/10 text-white hover:bg-white/20'
                                                    : 'bg-white border-secondary-accent/20 text-secondary-accent hover:border-cta/50 hover:text-cta hover:shadow-sm'}`}
                                                title="Project Settings"
                                            >
                                                <span className="material-symbols-outlined text-[20px]">settings</span>
                                            </Link>
                                        </>
                                    )}

                                    {!isAllProjectsMode && (
                                        <button
                                            onClick={() => setAddingToColumn('todo')}
                                            className={`flex items-center justify-center gap-2 h-10 px-4 rounded-xl text-sm font-bold transition-all shadow-sm hover:-translate-y-0.5 ${isFocusMode ? 'bg-white text-black hover:bg-gray-200' : 'bg-cta text-white hover:brightness-110 shadow-cta/20'}`}
                                        >
                                            <span className="material-symbols-outlined text-[20px]">add</span>
                                            <span>New Task</span>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Loading State */}
                    {tasksLoading && (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cta"></div>
                        </div>
                    )}

                    {/* Kanban Board */}
                    {!tasksLoading && (
                        <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                            <div className="flex-1 overflow-x-auto overflow-y-hidden relative">
                                <div className="h-full p-6 min-w-[900px] max-w-[1400px] mx-auto grid grid-cols-3 gap-6 relative z-10 transition-all duration-500">
                                    <KanbanColumn
                                        title="To Do"
                                        tasks={todoTasks}
                                        status="todo"
                                        color="bg-secondary-accent"
                                        count={todoTasks.length}
                                        isFocusMode={isFocusMode}
                                        onTaskClick={(id) => navigate(`/project/task/${id}`)}
                                        addingToColumn={addingToColumn}
                                        setAddingToColumn={setAddingToColumn}
                                        newTaskTitle={newTaskTitle}
                                        setNewTaskTitle={setNewTaskTitle}
                                        newTaskPriority={newTaskPriority}
                                        setNewTaskPriority={setNewTaskPriority}
                                        newTaskDueDate={newTaskDueDate}
                                        setNewTaskDueDate={setNewTaskDueDate}
                                        onCreateTask={handleCreateTask}
                                        isCreating={createTask.isPending}
                                        showProjectBadge={isAllProjectsMode}
                                        getProjectInfo={isAllProjectsMode ? getProjectInfo : undefined}
                                    />
                                    <KanbanColumn
                                        title="In Progress"
                                        tasks={inProgressTasks}
                                        status="in_progress"
                                        color="bg-cta shadow-[0_0_8px_rgba(230,179,37,0.6)]"
                                        count={inProgressTasks.length}
                                        isFocusMode={isFocusMode}
                                        onTaskClick={(id) => navigate(`/project/task/${id}`)}
                                        addingToColumn={addingToColumn}
                                        setAddingToColumn={setAddingToColumn}
                                        newTaskTitle={newTaskTitle}
                                        setNewTaskTitle={setNewTaskTitle}
                                        newTaskPriority={newTaskPriority}
                                        setNewTaskPriority={setNewTaskPriority}
                                        newTaskDueDate={newTaskDueDate}
                                        setNewTaskDueDate={setNewTaskDueDate}
                                        onCreateTask={handleCreateTask}
                                        isCreating={createTask.isPending}
                                        showProjectBadge={isAllProjectsMode}
                                        getProjectInfo={isAllProjectsMode ? getProjectInfo : undefined}
                                    />
                                    <KanbanColumn
                                        title="Done"
                                        tasks={doneTasks}
                                        status="done"
                                        color="bg-green-500"
                                        count={doneTasks.length}
                                        isFocusMode={isFocusMode}
                                        onTaskClick={(id) => navigate(`/project/task/${id}`)}
                                        addingToColumn={addingToColumn}
                                        setAddingToColumn={setAddingToColumn}
                                        newTaskTitle={newTaskTitle}
                                        setNewTaskTitle={setNewTaskTitle}
                                        newTaskPriority={newTaskPriority}
                                        setNewTaskPriority={setNewTaskPriority}
                                        newTaskDueDate={newTaskDueDate}
                                        setNewTaskDueDate={setNewTaskDueDate}
                                        onCreateTask={handleCreateTask}
                                        isCreating={createTask.isPending}
                                        showProjectBadge={isAllProjectsMode}
                                        getProjectInfo={isAllProjectsMode ? getProjectInfo : undefined}
                                    />
                                </div>
                            </div>
                            <DragOverlay>
                                {activeDragTask ? (
                                    <div className="transform rotate-3 scale-105 opacity-90 cursor-grabbing">
                                        <TaskCard
                                            task={activeDragTask}
                                            onClick={() => { }}
                                            showProjectBadge={isAllProjectsMode}
                                            projectInfo={isAllProjectsMode && activeDragTask.projectId ? getProjectInfo(activeDragTask.projectId) : undefined}
                                        />
                                    </div>
                                ) : null}
                            </DragOverlay>
                        </DndContext>
                    )}
                </main>
            </div>
        </div>
    );
};


