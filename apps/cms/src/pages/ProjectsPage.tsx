import { useState, useEffect } from 'react';
import { apiClient } from '../lib/api-client';
import type { Project } from '../lib/types';

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            const data = await apiClient.get<Project[]>('/admin/projects');
            setProjects(data);
        } catch (error) {
            console.error('Failed to load projects:', error);
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
        } catch (error) {
            console.error('Failed to update project status:', error);
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map(project => (
                    <div key={project.id} className="bg-white rounded-lg shadow overflow-hidden">
                        <div
                            className="h-3"
                            style={{ backgroundColor: project.color || '#3B82F6' }}
                        />
                        <div className="p-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h3 className="font-bold text-text-main">{project.name}</h3>
                                    <p className="text-sm text-text-muted">{project.courseCode || 'No course code'}</p>
                                </div>
                                <select
                                    value={project.status || 'active'}
                                    onChange={(e) => updateProjectStatus(project.id, e.target.value)}
                                    className={`px-2 py-1 text-xs font-semibold rounded-full ${project.status === 'active' ? 'bg-green-100 text-green-800' :
                                            project.status === 'archived' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                        }`}
                                >
                                    <option value="active">Active</option>
                                    <option value="archived">Archived</option>
                                    <option value="deleted">Deleted</option>
                                </select>
                            </div>

                            <p className="mt-2 text-sm text-text-muted line-clamp-2">
                                {project.description || 'No description'}
                            </p>

                            <div className="mt-4 flex items-center justify-between text-sm">
                                <span className="text-text-muted">
                                    Progress: {project.progress || 0}%
                                </span>
                                <span className="text-text-muted">
                                    {project.dueDate ? new Date(project.dueDate).toLocaleDateString() : 'No due date'}
                                </span>
                            </div>

                            <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                                <div
                                    className="bg-primary h-2 rounded-full"
                                    style={{ width: `${project.progress || 0}%` }}
                                />
                            </div>

                            <div className="mt-4 pt-4 border-t flex justify-between items-center">
                                <span className="text-xs text-text-muted">
                                    Created: {new Date(project.createdAt || '').toLocaleDateString()}
                                </span>
                                <button className="text-primary text-sm hover:underline">View Details</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredProjects.length === 0 && (
                <div className="p-8 text-center text-text-muted bg-white rounded-lg">
                    No projects found matching your criteria.
                </div>
            )}
        </div>
    );
}
