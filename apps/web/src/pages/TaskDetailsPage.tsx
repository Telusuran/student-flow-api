import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTask, useUpdateTask, useUpdateTaskStatus, useTaskComments, useAddComment, useTaskAttachments, useAddAttachment, useDeleteTask } from '../hooks/useTasks';
import { useSession } from '../lib/auth-client';

export const TaskDetailsPage: React.FC = () => {
    const { taskId } = useParams<{ taskId: string }>();
    const navigate = useNavigate();
    const { data: session } = useSession();

    // Data Fetching
    const { data: task, isLoading, error } = useTask(taskId || '');
    const { data: comments } = useTaskComments(taskId || '');
    const { data: attachments } = useTaskAttachments(taskId || '');

    // Mutations
    const updateTask = useUpdateTask();
    const updateStatus = useUpdateTaskStatus();
    const addComment = useAddComment();
    const addAttachment = useAddAttachment(); // Add hook
    const deleteTask = useDeleteTask();

    // Local State
    const [description, setDescription] = useState('');
    const [newComment, setNewComment] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null); // Add ref

    useEffect(() => {
        if (task && task.description !== description) {
            setDescription(task.description || '');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [task?.description]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background-page">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    if (error || !task) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-background-page">
                <h2 className="text-xl font-bold text-gray-700">Task not found</h2>
                <button onClick={() => navigate(-1)} className="text-primary hover:underline mt-4">Go Back</button>
            </div>
        );
    }

    const handleDescriptionBlur = () => {
        // Only auto-save is handled here, explicit save button also available
    };

    const handleSaveDescription = () => {
        if (task && description !== task.description) {
            updateTask.mutate({ id: task.id, data: { description } }, {
                onSuccess: () => setHasUnsavedChanges(false)
            });
        }
    };

    const handleStatusChange = (status: string) => {
        updateStatus.mutate({ id: task.id, status });
    };

    const handlePriorityChange = (priority: string) => {
        updateTask.mutate({ id: task.id, data: { priority } });
    };

    const handleDueDateChange = (dueDate: string) => {
        updateTask.mutate({ id: task.id, data: { dueDate: dueDate || undefined } });
    };

    const handleSendComment = () => {
        if (!newComment.trim()) return;
        addComment.mutate({ taskId: task.id, data: { content: newComment } });
        setNewComment('');
    };

    const handleDeleteTask = async () => {
        if (!task) return;
        try {
            await deleteTask.mutateAsync({ id: task.id, projectId: task.projectId });
            navigate(-1); // Go back to where user came from
        } catch (error) {
            console.error('Failed to delete task:', error);
        }
    };

    // Track unsaved changes
    const handleDescriptionChange = (value: string) => {
        setDescription(value);
        if (task && value !== task.description) {
            setHasUnsavedChanges(true);
        } else {
            setHasUnsavedChanges(false);
        }
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !task) return;

        try {
            await addAttachment.mutateAsync({ taskId: task.id, file });
        } catch (error) {
            console.error('Failed to upload attachment:', error);
            alert('Failed to upload file. Please try again.');
        } finally {
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    return (
        <div className="bg-background-page font-display text-text-primary min-h-screen flex flex-col antialiased">
            {/* Top Navigation */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-white/50 bg-white/80 backdrop-blur-md px-10 py-3 sticky top-0 z-50 shadow-sm">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-4 text-text-primary">
                        <button
                            onClick={() => navigate(-1)}
                            className="size-8 rounded bg-primary flex items-center justify-center text-white hover:bg-primary-hover transition-colors"
                        >
                            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
                        </button>
                        <h2 className="text-text-primary text-lg font-bold leading-tight tracking-[-0.015em]">Task Details</h2>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    {hasUnsavedChanges && (
                        <span className="text-xs text-amber-600 font-medium">Unsaved changes</span>
                    )}
                    <button
                        onClick={handleSaveDescription}
                        disabled={!hasUnsavedChanges || updateTask.isPending}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-all ${hasUnsavedChanges
                            ? 'bg-primary text-white hover:bg-primary-hover shadow-sm'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                    >
                        <span className="material-symbols-outlined text-[18px]">
                            {updateTask.isPending ? 'sync' : 'save'}
                        </span>
                        {updateTask.isPending ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </header>

            <main className="flex-grow flex flex-col items-center py-8 px-4 sm:px-6 lg:px-8">
                {/* Main Content Card */}
                <div className="w-full max-w-[1200px] bg-background-card rounded-xl shadow-soft overflow-hidden flex flex-col lg:flex-row min-h-[600px]">
                    {/* Left Panel: Main Task Details */}
                    <div className="flex-1 p-8 lg:p-10 flex flex-col gap-8">
                        {/* Task Header */}
                        <div className="border-b border-gray-200/60 pb-6">
                            <div className="flex justify-between items-start gap-4 mb-4">
                                <div className="flex items-center gap-3">
                                    <span className={`text-xs font-bold px-3 py-1 rounded-full border uppercase ${(task.status || 'todo') === 'done' ? 'bg-green-100 text-green-700 border-green-200' :
                                        (task.status || 'todo') === 'in_progress' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                                            'bg-gray-100 text-gray-700 border-gray-200'
                                        }`}>
                                        {(task.status || 'todo').replace('_', ' ')}
                                    </span>
                                    <span className="text-text-secondary text-sm">
                                        Created {task.createdAt ? new Date(task.createdAt).toLocaleDateString() : 'Unknown date'}
                                    </span>
                                </div>
                            </div>
                            <h1 className="text-text-primary text-3xl md:text-4xl font-bold leading-tight tracking-tight mb-2">
                                {task.title}
                            </h1>
                        </div>

                        {/* Description Field */}
                        <div className="flex flex-col gap-3">
                            <label className="text-text-primary text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px]">description</span> Description
                                {hasUnsavedChanges && <span className="text-xs text-amber-500 font-normal normal-case">(unsaved)</span>}
                            </label>
                            <textarea
                                className="w-full min-h-[150px] p-4 rounded-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary bg-white/50 hover:bg-white transition-colors resize-y text-base"
                                value={description}
                                onChange={(e) => handleDescriptionChange(e.target.value)}
                                onBlur={handleDescriptionBlur}
                                placeholder="Add a more detailed description..."
                            />
                        </div>

                        {/* Attachments Section */}
                        <div className="flex flex-col gap-3">
                            <label className="text-text-primary text-sm font-bold uppercase tracking-wider flex items-center gap-2">
                                <span className="material-symbols-outlined text-[18px]">attachment</span> Attachments
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {attachments?.map(att => (
                                    <a key={att.id} href={att.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
                                        <div className="size-10 bg-blue-100 text-blue-500 rounded flex items-center justify-center">
                                            <span className="material-symbols-outlined">description</span>
                                        </div>
                                        <div className="flex flex-col overflow-hidden">
                                            <span className="text-sm font-medium truncate text-text-primary">{att.name}</span>
                                            <span className="text-xs text-text-secondary">{((att.size || 0) / 1024).toFixed(1)} KB</span>
                                        </div>
                                    </a>
                                ))}
                                {/* Add New Placeholder */}
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={addAttachment.isPending}
                                    className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 text-text-secondary hover:text-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {addAttachment.isPending ? (
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined">add</span>
                                            <span className="text-sm font-medium">Add File</span>
                                        </>
                                    )}
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </div>
                        </div>

                        {/* Comments Section */}
                        <div className="mt-4 pt-6 border-t border-gray-200/60">
                            <label className="text-text-primary text-sm font-bold uppercase tracking-wider flex items-center gap-2 mb-4">
                                <span className="material-symbols-outlined text-[18px]">chat</span> Discussion
                            </label>
                            <div className="space-y-6">
                                {comments?.map(comment => (
                                    <div key={comment.id} className="flex gap-4">
                                        <div className="size-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold shrink-0">
                                            {comment.user?.name?.charAt(0) || '?'}
                                        </div>
                                        <div className="flex flex-col gap-1 w-full">
                                            <div className="flex justify-between items-baseline">
                                                <span className="font-semibold text-sm">{comment.user?.name || 'Unknown User'}</span>
                                                <span className="text-xs text-text-secondary">{comment.createdAt ? new Date(comment.createdAt).toLocaleString() : ''}</span>
                                            </div>
                                            <div className="bg-white p-3 rounded-lg rounded-tl-none shadow-sm text-sm text-text-primary border border-gray-100">
                                                {comment.content}
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {/* Comment Input */}
                                <div className="flex gap-4 items-start">
                                    <div className="size-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold shrink-0">
                                        {session?.user.name.charAt(0)}
                                    </div>
                                    <div className="flex-1 relative">
                                        <textarea
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleSendComment();
                                                }
                                            }}
                                            className="w-full p-3 pr-10 rounded-lg border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary bg-white text-sm min-h-[80px] resize-none"
                                            placeholder="Write a comment..."
                                        />
                                        <button
                                            onClick={handleSendComment}
                                            disabled={!newComment.trim()}
                                            aria-label="Send comment"
                                            className="absolute bottom-3 right-3 p-1.5 bg-primary disabled:bg-gray-300 text-text-primary rounded-full hover:bg-primary-hover shadow-sm transition-transform hover:scale-105"
                                        >
                                            <span className="material-symbols-outlined text-[20px] flex">send</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Panel: Sidebar (Metadata) */}
                    <div className="w-full lg:w-80 bg-white/40 border-l border-gray-200/50 p-8 flex flex-col gap-8">

                        {/* Properties */}
                        <div className="flex flex-col gap-6">

                            {/* Due Date */}
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Due Date</label>
                                <div className="relative">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary pointer-events-none">calendar_today</span>
                                    <input
                                        type="date"
                                        value={task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''}
                                        onChange={(e) => handleDueDateChange(e.target.value)}
                                        className="w-full p-3 pl-10 bg-white border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                                    />
                                    {task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done' && (
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-red-500">Overdue</span>
                                    )}
                                </div>
                            </div>

                            {/* Priority */}
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Priority</label>
                                <div className="relative">
                                    <select
                                        value={task.priority || 'medium'}
                                        onChange={(e) => handlePriorityChange(e.target.value)}
                                        className="appearance-none w-full p-3 pl-10 bg-white border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer capitalize"
                                    >
                                        <option value="high">High Priority</option>
                                        <option value="medium">Medium Priority</option>
                                        <option value="low">Low Priority</option>
                                    </select>
                                    <span className={`material-symbols-outlined absolute left-3 top-3 text-[20px] ${task.priority === 'high' ? 'text-red-500' :
                                        task.priority === 'medium' ? 'text-amber-500' : 'text-blue-500'
                                        }`}>flag</span>
                                    <span className="material-symbols-outlined absolute right-3 top-3 text-gray-400 pointer-events-none">expand_more</span>
                                </div>
                            </div>

                            {/* Status Dropdown */}
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold text-text-secondary uppercase tracking-wider">Status</label>
                                <div className="relative">
                                    <select
                                        value={task.status || 'todo'}
                                        onChange={(e) => handleStatusChange(e.target.value)}
                                        className="appearance-none w-full p-3 bg-white border border-gray-200 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer capitalize"
                                    >
                                        <option value="todo">To Do</option>
                                        <option value="in_progress">In Progress</option>
                                        <option value="review">Review</option>
                                        <option value="done">Done</option>
                                    </select>
                                    <span className={`size-2 rounded-full absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none ml-1 ${task.status === 'done' ? 'bg-green-500' :
                                        task.status === 'in_progress' ? 'bg-blue-500' :
                                            'bg-gray-500'
                                        }`}></span>
                                    <span className="material-symbols-outlined absolute right-3 top-3 text-gray-400 pointer-events-none">expand_more</span>
                                </div>
                            </div>

                            {/* Creator Info */}
                            <div className="mt-8 pt-6 border-t border-gray-200/50 text-xs text-text-secondary">
                                <p>Created by</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <div className="size-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold shrink-0 text-[10px]">
                                        {task.creator?.name?.charAt(0) || '?'}
                                    </div>
                                    <span className="font-medium">{task.creator?.name || 'Unknown'}</span>
                                </div>
                            </div>

                            {/* Danger Zone */}
                            <div className="mt-4 pt-4 border-t border-red-200/50">
                                <button
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="w-full flex items-center justify-center gap-2 p-3 rounded-lg border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors font-medium text-sm"
                                >
                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                    Delete Task
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="h-20"></div> {/* Bottom Spacer */}
            </main>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowDeleteConfirm(false)}>
                    <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center gap-3 mb-4">
                            <div className="size-12 rounded-full bg-red-100 flex items-center justify-center">
                                <span className="material-symbols-outlined text-red-600 text-2xl">warning</span>
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Delete Task</h3>
                                <p className="text-sm text-gray-500">This action cannot be undone</p>
                            </div>
                        </div>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete "<span className="font-medium">{task.title}</span>"? All comments and attachments will also be removed.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteTask}
                                disabled={deleteTask.isPending}
                                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 transition-colors"
                            >
                                {deleteTask.isPending ? 'Deleting...' : 'Delete'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
