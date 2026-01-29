import { useState, useEffect } from 'react';
import { apiClient } from '../lib/api-client';
import type { DashboardStats, UserWithProfile, Project } from '../lib/types';

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [recentUsers, setRecentUsers] = useState<UserWithProfile[]>([]);
    const [recentProjects, setRecentProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [roleStats, setRoleStats] = useState<{ students: number; mentors: number; admins: number }>({ students: 0, mentors: 0, admins: 0 });

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
                apiClient.get<UserWithProfile[]>('/admin/users?limit=10').catch(() => []),
                apiClient.get<Project[]>('/admin/projects?limit=10').catch(() => []),
            ]);

            setRecentUsers(usersRes.slice(0, 5));
            setRecentProjects(projectsRes.slice(0, 5));

            // Calculate role stats
            const students = usersRes.filter(u => !u.profile?.role || u.profile.role === 'student').length;
            const mentors = usersRes.filter(u => u.profile?.role === 'mentor').length;
            const admins = usersRes.filter(u => u.profile?.role === 'admin').length;
            setRoleStats({ students, mentors, admins });

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
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-display font-bold text-text-main">Dashboard</h1>
                <p className="text-text-muted text-sm">Last updated: {new Date().toLocaleString()}</p>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            {/* Main Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total Users" value={stats?.totalUsers || 0} icon="👥" color="bg-blue-500" />
                <StatCard title="Total Projects" value={stats?.totalProjects || 0} icon="📁" color="bg-green-500" />
                <StatCard title="Active Projects" value={stats?.activeProjects || 0} icon="🚀" color="bg-purple-500" />
                <StatCard title="Total Tasks" value={stats?.totalTasks || 0} icon="✅" color="bg-orange-500" />
            </div>

            {/* User Role Distribution */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-bold text-text-main mb-4">User Role Distribution</h2>
                <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                        <p className="text-3xl font-bold text-green-600">{roleStats.students}</p>
                        <p className="text-sm text-green-700">Students</p>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <p className="text-3xl font-bold text-blue-600">{roleStats.mentors}</p>
                        <p className="text-sm text-blue-700">Mentors</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <p className="text-3xl font-bold text-purple-600">{roleStats.admins}</p>
                        <p className="text-sm text-purple-700">Admins</p>
                    </div>
                </div>
            </div>

            {/* Recent Data */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Users */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-text-main">Recent Users</h2>
                        <a href="/users" className="text-sm text-primary hover:underline">View all →</a>
                    </div>
                    {recentUsers.length === 0 ? (
                        <p className="text-text-muted">No users found</p>
                    ) : (
                        <ul className="space-y-3">
                            {recentUsers.map(user => (
                                <li key={user.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded">
                                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-primary font-bold">
                                        {user.name?.charAt(0) || 'U'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-text-main truncate">{user.name}</p>
                                        <p className="text-sm text-text-muted truncate">{user.email}</p>
                                    </div>
                                    <span className={`px-2 py-1 text-xs rounded-full ${user.profile?.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                            user.profile?.role === 'mentor' ? 'bg-blue-100 text-blue-800' :
                                                'bg-green-100 text-green-800'
                                        }`}>
                                        {user.profile?.role || 'student'}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Recent Projects */}
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-text-main">Recent Projects</h2>
                        <a href="/projects" className="text-sm text-primary hover:underline">View all →</a>
                    </div>
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
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-text-main truncate">{project.name}</p>
                                        <p className="text-sm text-text-muted truncate">{project.courseCode || 'No course'}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className={`px-2 py-1 text-xs rounded-full ${project.status === 'active' ? 'bg-green-100 text-green-800' :
                                                project.status === 'archived' ? 'bg-gray-100 text-gray-800' :
                                                    'bg-red-100 text-red-800'
                                            }`}>
                                            {project.status || 'active'}
                                        </span>
                                        <p className="text-xs text-text-muted mt-1">{project.progress || 0}% complete</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-bold text-text-main mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <a href="/users" className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <span className="text-2xl mb-2">👥</span>
                        <span className="text-sm font-medium">Manage Users</span>
                    </a>
                    <a href="/projects" className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <span className="text-2xl mb-2">📁</span>
                        <span className="text-sm font-medium">Manage Projects</span>
                    </a>
                    <button
                        onClick={() => loadDashboardData()}
                        className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <span className="text-2xl mb-2">🔄</span>
                        <span className="text-sm font-medium">Refresh Data</span>
                    </button>
                    <button
                        onClick={() => window.open('https://student-flow-api.vercel.app/api/health', '_blank')}
                        className="flex flex-col items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <span className="text-2xl mb-2">🏥</span>
                        <span className="text-sm font-medium">API Health</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

function StatCard({ title, value, icon, color }: { title: string; value: number; icon: string; color: string }) {
    return (
        <div className="bg-white rounded-lg shadow p-6 relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-20 h-20 ${color} opacity-10 rounded-bl-full`}></div>
            <div className="flex items-center gap-4">
                <div className={`p-3 rounded-lg ${color} bg-opacity-20`}>
                    <span className="text-2xl">{icon}</span>
                </div>
                <div>
                    <p className="text-sm text-text-muted">{title}</p>
                    <p className="text-2xl font-bold text-text-main">{value.toLocaleString()}</p>
                </div>
            </div>
        </div>
    );
}
