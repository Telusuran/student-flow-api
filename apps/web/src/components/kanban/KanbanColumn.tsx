import React from 'react';
import { DroppableColumn } from './DroppableColumn';
import { DraggableTaskCard } from './DraggableTaskCard';
import type { Task } from '../../lib/api/types';

interface KanbanColumnProps {
    title: string;
    tasks: Task[];
    status: string;
    color: string;
    count: number;
    isFocusMode: boolean;
    onTaskClick: (id: string) => void;
    addingToColumn: string | null;
    setAddingToColumn: (column: string | null) => void;
    newTaskTitle: string;
    setNewTaskTitle: (title: string) => void;
    newTaskPriority: 'low' | 'medium' | 'high';
    setNewTaskPriority: (priority: 'low' | 'medium' | 'high') => void;
    newTaskDueDate: string;
    setNewTaskDueDate: (date: string) => void;
    onCreateTask: (status: string) => void;
    isCreating: boolean;
    showProjectBadge?: boolean;
    getProjectInfo?: (id: string) => { name: string; color: string } | undefined;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
    title,
    tasks,
    status,
    color,
    count,
    isFocusMode,
    onTaskClick,
    addingToColumn,
    setAddingToColumn,
    newTaskTitle,
    setNewTaskTitle,
    newTaskPriority,
    setNewTaskPriority,
    newTaskDueDate,
    setNewTaskDueDate,
    onCreateTask,
    isCreating,
    showProjectBadge,
    getProjectInfo
}) => (
    <DroppableColumn
        id={status}
        className={`flex flex-col h-full max-h-[calc(100vh-200px)] rounded-2xl border shadow-sm backdrop-blur-sm transition-colors duration-500 ${isFocusMode ? 'bg-white/5 border-white/10' : 'bg-white/40 border-white/60'}`}
    >
        <div className="flex items-center justify-between p-4 pb-2">
            <div className="flex items-center gap-2">
                <div className={`size-2 rounded-full ${color}`}></div>
                <h2 className={`text-xs font-bold uppercase tracking-wider ${isFocusMode ? 'text-gray-400' : 'text-text-muted'}`}>{title}</h2>
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${isFocusMode ? 'bg-white/10 text-white' : 'bg-secondary-accent/20 text-secondary-accent'}`}>{count}</span>
            </div>
        </div>
        <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
            {tasks.map(task => (
                <DraggableTaskCard
                    key={task.id}
                    task={task}
                    onClick={() => onTaskClick(task.id)}
                    showProjectBadge={showProjectBadge}
                    projectInfo={getProjectInfo ? getProjectInfo(task.projectId) : undefined}
                />
            ))}

            {/* Add Task Form */}
            {addingToColumn === status ? (
                <div className="p-3 rounded-xl bg-white border border-secondary-accent/20 shadow-sm space-y-3">
                    <input
                        type="text"
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        placeholder="Task title..."
                        className="w-full text-sm p-2 border border-secondary-accent/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-cta/50"
                        autoFocus
                        onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && onCreateTask(status)}
                    />
                    <div className="flex gap-2">
                        <select
                            value={newTaskPriority}
                            onChange={(e) => setNewTaskPriority(e.target.value as 'low' | 'medium' | 'high')}
                            className="flex-1 text-xs p-2 border border-secondary-accent/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-cta/50 bg-white"
                        >
                            <option value="low">🟢 Low</option>
                            <option value="medium">🟡 Medium</option>
                            <option value="high">🔴 High</option>
                        </select>
                        <input
                            type="date"
                            value={newTaskDueDate}
                            onChange={(e) => setNewTaskDueDate(e.target.value)}
                            className="flex-1 text-xs p-2 border border-secondary-accent/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-cta/50"
                            placeholder="Due date"
                        />
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => onCreateTask(status)}
                            disabled={isCreating || !newTaskTitle.trim()}
                            className="flex-1 px-3 py-2 bg-cta text-white text-xs font-bold rounded-lg hover:bg-cta/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isCreating ? 'Adding...' : 'Add Task'}
                        </button>
                        <button
                            onClick={() => { setAddingToColumn(null); setNewTaskTitle(''); }}
                            className="px-3 py-2 text-gray-500 text-xs font-bold rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <button
                    onClick={() => setAddingToColumn(status)}
                    className={`flex items-center gap-2 p-2 rounded-lg text-sm transition-colors mt-2 ${isFocusMode ? 'hover:bg-white/10 text-gray-300' : 'hover:bg-white/50 text-secondary-accent'}`}
                >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    <span>Add Task</span>
                </button>
            )}
        </div>
    </DroppableColumn>
);
