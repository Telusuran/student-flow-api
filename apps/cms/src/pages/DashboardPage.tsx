import { useState, useEffect } from 'react';
import { apiClient } from '../lib/api-client';
import type { DashboardStats, UserWithProfile, Project } from '../lib/types';

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [recentUsers, setRecentUsers] = useState<UserWithProfile[]>([]);
    const [recentProjects, setRecentProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        setError(null);
        try {
            // Fetch stats from the dedicated stats endpoint
            const statsRes = await apiClient.get<{ totalUsers: number; totalProjects: number; totalTasks: number }>('/admin/stats');

            // Fetch recent data
            const [usersRes, projectsRes] = await Promise.all([
                apiClient.get<UserWithProfile[]>('/admin/users?limit=5').catch(() => []),
                apiClient.get<Project[]>('/admin/projects?limit=5').catch(() => []),
            ]);

            setRecentUsers(usersRes);
            setRecentProjects(projectsRes);

            setStats({
                totalUsers: statsRes.totalUsers || 0,
                totalProjects: statsRes.totalProjects || 0,
                activeProjects: projectsRes.filter(p => p.status === 'active').length,
                totalTasks: statsRes.totalTasks || 0,
            });
        } catch (err) {
            console.error('Failed to load dashboard data:', err);
            setError('Failed to load dashboard data. Check console for details.');
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
            <h1 className="text-2xl font-display font-bold text-text-main">Dashboard</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total Users" value={stats?.totalUsers || 0} icon="👥" />
                <StatCard title="Total Projects" value={stats?.totalProjects || 0} icon="📁" />
                <StatCard title="Active Projects" value={stats?.activeProjects || 0} icon="🚀" />
                <StatCard title="Total Tasks" value={stats?.totalTasks || 0} icon="✅" />
            </div>

            {/* Recent Data */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Users */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-bold text-text-main mb-4">Recent Users</h2>
                    {recentUsers.length === 0 ? (
                        <p className="text-text-muted">No users found</p>
                    ) : (
                        <ul className="space-y-3">
                            {recentUsers.map(user => (
                                <li key={user.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold">
                                        {user.name?.charAt(0) || 'U'}
                                    </div>
                                    <div>
                                        <p className="font-medium text-text-main">{user.name}</p>
                                        <p className="text-sm text-text-muted">{user.email}</p>
                                    </div>
                                    <span className="ml-auto px-2 py-1 text-xs bg-gray-100 rounded">
                                        {user.profile?.role || 'student'}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Recent Projects */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-lg font-bold text-text-main mb-4">Recent Projects</h2>
                    {recentProjects.length === 0 ? (
                        <p className="text-text-muted">No projects found</p>
                    ) : (
                        <ul className="space-y-3">
                            {recentProjects.map(project => (
                                <li key={project.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                                    <div
                                        className="w-10 h-10 rounded flex items-center justify-center text-white font-bold"
                                        style={{ backgroundColor: project.color || '#3B82F6' }}
                                    >
                                        {project.name?.charAt(0) || 'P'}
                                    </div>
                                    <div>
                                        <p className="font-medium text-text-main">{project.name}</p>
                                        <p className="text-sm text-text-muted">{project.courseCode || 'No course'}</p>
                                    </div>
                                    <span className={`ml-auto px-2 py-1 text-xs rounded ${project.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                        {project.status || 'active'}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon }: { title: string; value: number; icon: string }) {
    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center gap-4">
                <div className="text-3xl">{icon}</div>
                <div>
                    <p className="text-sm text-text-muted">{title}</p>
                    <p className="text-2xl font-bold text-text-main">{value}</p>
                </div>
            </div>
        </div>
    );
}
