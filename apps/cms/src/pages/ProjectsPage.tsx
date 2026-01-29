import { useState, useEffect } from 'react';
import { apiClient } from '../lib/api-client';
import type { Project } from '../lib/types';

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [editForm, setEditForm] = useState({ name: '', description: '', status: 'active' });

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        setError(null);
        try {
            const data = await apiClient.get<Project[]>('/admin/projects');
            setProjects(data);
        } catch (err) {
            console.error('Failed to load projects:', err);
            setError('Failed to load projects.');
        } finally {
            setLoading(false);
        }
    };

    const filteredProjects = projects.filter(project => {
        const matchesSearch = project.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.courseCode?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const updateProjectStatus = async (projectId: string, newStatus: string) => {
        try {
            await apiClient.patch(`/admin/projects/${projectId}`, { status: newStatus });
            loadProjects();
        } catch (err) {
            console.error('Failed to update project status:', err);
            alert('Failed to update project status');
        }
    };

    const deleteProject = async (projectId: string, projectName: string) => {
        if (!confirm(`Are you sure you want to delete project "${projectName}"? This will also delete all tasks and resources associated with this project. This action cannot be undone.`)) {
            return;
        }
        try {
            await apiClient.delete(`/admin/projects/${projectId}`);
            loadProjects();
        } catch (err) {
            console.error('Failed to delete project:', err);
            alert('Failed to delete project');
        }
    };

    const startEdit = (project: Project) => {
        setEditingProject(project);
        setEditForm({
            name: project.name || '',
            description: project.description || '',
            status: project.status || 'active',
        });
    };

    const saveEdit = async () => {
        if (!editingProject) return;
        try {
            await apiClient.patch(`/admin/projects/${editingProject.id}`, editForm);
            setEditingProject(null);
            loadProjects();
        } catch (err) {
            console.error('Failed to update project:', err);
            alert('Failed to update project');
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
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-display font-bold text-text-main">Project Management</h1>
                <span className="text-text-muted">{projects.length} projects total</span>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            {/* Filters */}
            <div className="flex gap-4 flex-wrap">
                <input
                    type="text"
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="archived">Archived</option>
                    <option value="deleted">Deleted</option>
                </select>
            </div>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProjects.map(project => (
                    <div key={project.id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <div
                                className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-lg"
                                style={{ backgroundColor: project.color || '#3B82F6' }}
                            >
                                {project.icon || project.name?.charAt(0) || 'P'}
                            </div>
                            <select
                                value={project.status || 'active'}
                                onChange={(e) => updateProjectStatus(project.id, e.target.value)}
                                className={`px-2 py-1 text-xs font-semibold rounded-full border-0 cursor-pointer ${project.status === 'active' ? 'bg-green-100 text-green-800' :
                                        project.status === 'archived' ? 'bg-gray-100 text-gray-800' :
                                            'bg-red-100 text-red-800'
                                    }`}
                            >
                                <option value="active">Active</option>
                                <option value="archived">Archived</option>
                                <option value="deleted">Deleted</option>
                            </select>
                        </div>

                        <h3 className="font-bold text-text-main mb-1">{project.name}</h3>
                        <p className="text-sm text-text-muted mb-2">{project.courseCode || 'No course code'}</p>

                        {project.description && (
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">{project.description}</p>
                        )}

                        <div className="flex items-center justify-between text-xs text-text-muted mb-4">
                            <span>Progress: {project.progress || 0}%</span>
                            {project.dueDate && (
                                <span>Due: {new Date(project.dueDate).toLocaleDateString()}</span>
                            )}
                        </div>

                        {/* Progress bar */}
                        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                            <div
                                className="bg-primary h-2 rounded-full transition-all"
                                style={{ width: `${project.progress || 0}%` }}
                            />
                        </div>

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => startEdit(project)}
                                className="px-3 py-1 text-sm text-primary hover:bg-primary/10 rounded"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => deleteProject(project.id, project.name || 'Unknown')}
                                className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredProjects.length === 0 && (
                <div className="text-center py-12 text-text-muted">
                    No projects found matching your criteria.
                </div>
            )}

            {/* Edit Modal */}
            {editingProject && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold text-text-main mb-4">Edit Project</h2>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                <input
                                    type="text"
                                    value={editForm.name}
                                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={editForm.description}
                                    onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                <select
                                    value={editForm.status}
                                    onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                                >
                                    <option value="active">Active</option>
                                    <option value="archived">Archived</option>
                                    <option value="deleted">Deleted</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setEditingProject(null)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={saveEdit}
                                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
