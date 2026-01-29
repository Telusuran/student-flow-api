import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../lib/api-client';
import { TaskAttachments } from '../components/TaskAttachments';

interface Task {
    id: string;
    title: string;
    description: string;
    status: string;
    priority: string;
    dueDate: string;
    attachments?: any[];
}

export default function ProjectDetailsPage() {
    const { projectId } = useParams<{ projectId: string }>();
    const navigate = useNavigate();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    useEffect(() => {
        if (projectId) {
            loadData(projectId);
        }
    }, [projectId]);

    const loadData = async (id: string) => {
        setLoading(true);
        try {
            // Fetch project details - assuming endpoint exists or filtering from list
            // Just fetching tasks for now is confirmed
            const tasksData = await apiClient.get<Task[]>(`/projects/${id}/tasks`);
            setTasks(tasksData);

            // Mocking project details fetch since specific endpoint might accept filter or we use tasks to infer
            // Or ideally fetch project: await apiClient.get<Project>(`/projects/${id}`);
            // Let's try to get project list and find it for now as a fallback if no specific endpoint
            // BUT, verifying `projects.routes.ts` or similar would be better. 
            // `tasks.routes.ts` line 26: `router.get('/projects/:projectId/tasks'...)` exists.
        } catch (error) {
            console.error('Failed to load data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <button onClick={() => navigate('/projects')} className="text-gray-500 hover:text-gray-800">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
                <h1 className="text-2xl font-display font-bold text-text-main">Project Tasks</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Task List */}
                <div className="lg:col-span-2 space-y-4">
                    {tasks.map(task => (
                        <div
                            key={task.id}
                            onClick={() => setSelectedTask(task)}
                            className={`p-4 rounded-lg border cursor-pointer hover:shadow-md transition-all ${selectedTask?.id === task.id ? 'border-primary bg-primary/5' : 'border-gray-200 bg-white'
                                }`}
                        >
                            <div className="flex justify-between items-start">
                                <h3 className="font-bold text-text-main">{task.title}</h3>
                                <span className={`text-xs px-2 py-1 rounded-full ${task.status === 'done' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                                    }`}>
                                    {task.status}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">{task.description}</p>
                            <div className="flex gap-4 mt-3 text-xs text-gray-400">
                                <span>Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}</span>
                                <span className="capitalize">Priority: {task.priority}</span>
                            </div>
                        </div>
                    ))}
                    {tasks.length === 0 && (
                        <div className="text-center py-10 text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
                            No tasks found for this project.
                        </div>
                    )}
                </div>

                {/* Task Details Sidebar */}
                <div className="lg:col-span-1">
                    {selectedTask ? (
                        <div className="bg-white rounded-lg shadow-soft p-6 border border-gray-100 sticky top-6">
                            <h2 className="text-xl font-bold text-text-main mb-2">{selectedTask.title}</h2>
                            <p className="text-sm text-gray-600 mb-6">{selectedTask.description}</p>

                            <hr className="my-4 border-gray-100" />

                            <TaskAttachments taskId={selectedTask.id} initialAttachments={selectedTask.attachments} />
                        </div>
                    ) : (
                        <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-500 border border-dashed border-gray-200 h-full flex items-center justify-center">
                            Select a task to view details and attachments
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
