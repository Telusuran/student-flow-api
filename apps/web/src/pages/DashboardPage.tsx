import React, { useState, useEffect, useCallback } from 'react';
import { useOutletContext, Link, useNavigate } from 'react-router-dom';
import { useProjects } from '../hooks/useProjects';
import { useAllTasks } from '../hooks/useTasks';
import { useSession } from '../lib/auth-client';

interface DashboardContext {
    isFocusMode: boolean;
}

// Color mapping for projects
const colorMap: Record<string, { bg: string; text: string; progress: string }> = {
    '#3B82F6': { bg: 'bg-blue-100', text: 'text-blue-600', progress: 'bg-blue-500' },
    '#F97316': { bg: 'bg-orange-100', text: 'text-orange-600', progress: 'bg-orange-500' },
    '#8B5CF6': { bg: 'bg-purple-100', text: 'text-purple-600', progress: 'bg-purple-500' },
    '#10B981': { bg: 'bg-green-100', text: 'text-green-600', progress: 'bg-green-500' },
    '#EF4444': { bg: 'bg-red-100', text: 'text-red-600', progress: 'bg-red-500' },
};

const getColorClasses = (color: string | null) => {
    return colorMap[color || '#3B82F6'] || colorMap['#3B82F6'];
};

// Icon mapping
const iconMap: Record<string, string> = {
    terminal: 'terminal',
    history_edu: 'history_edu',
    design_services: 'design_services',
    folder: 'folder',
    code: 'code',
    science: 'science',
};

export const DashboardPage: React.FC = () => {
    const { isFocusMode } = useOutletContext<DashboardContext>();
    const navigate = useNavigate();
    const { data: projects, isLoading, error } = useProjects();
    const { data: allTasks } = useAllTasks();
    const { data: session } = useSession();
    const userName = session?.user?.name?.split(' ')[0] || 'there';

    // Modal and timer state
    const [showComingSoon, setShowComingSoon] = useState(false);
    const [comingSoonFeature, setComingSoonFeature] = useState('');
    const [timerDuration, setTimerDuration] = useState(60); // seconds
    const [timerRemaining, setTimerRemaining] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [breathPhase, setBreathPhase] = useState<'inhale' | 'hold' | 'exhale'>('inhale');

    // Quick action handlers
    const handleQuickAction = useCallback((action: string) => {
        switch (action) {
            case 'Add Task':
                navigate('/project');
                break;
            case 'Upload File':
                if (projects && projects.length > 0) {
                    navigate(`/project/${projects[0].id}/resources`, { state: { openUpload: true } });
                } else {
                    navigate('/create-project');
                }
                break;
            case 'Join Group':
            case 'Book Slot':
                setComingSoonFeature(action);
                setShowComingSoon(true);
                break;
        }
    }, [navigate, projects]);

    // Timer logic
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (isTimerRunning && timerRemaining > 0) {
            interval = setInterval(() => {
                setTimerRemaining(prev => {
                    if (prev <= 1) {
                        setIsTimerRunning(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning, timerRemaining]);

    // Breath phase cycling (4s inhale, 4s hold, 4s exhale)
    useEffect(() => {
        if (!isTimerRunning) return;
        const cycleTime = 12; // 4 + 4 + 4
        const elapsed = (timerDuration - timerRemaining) % cycleTime;
        if (elapsed < 4) setBreathPhase('inhale');
        else if (elapsed < 8) setBreathPhase('hold');
        else setBreathPhase('exhale');
    }, [isTimerRunning, timerRemaining, timerDuration]);

    const startTimer = () => {
        setTimerRemaining(timerDuration);
        setIsTimerRunning(true);
        setBreathPhase('inhale');
    };

    const stopTimer = () => {
        setIsTimerRunning(false);
        setTimerRemaining(0);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Calculate Semester Completion
    const completionStats = React.useMemo(() => {
        if (!allTasks || allTasks.length === 0) return { percent: 0, text: 'No tasks yet' };
        const completed = allTasks.filter(t => t.status === 'done').length;
        const total = allTasks.length;
        const percent = Math.round((completed / total) * 100);
        return { percent, text: `${completed}/${total} tasks completed` };
    }, [allTasks]);

    // Get Upcoming Deadlines
    const upcomingDeadlines = React.useMemo(() => {
        if (!allTasks) return [];
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        return allTasks
            .filter(t => t.dueDate && new Date(t.dueDate) >= now && t.status !== 'done')
            .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
            .slice(0, 3);
    }, [allTasks]);

    // Render projects from API or show loading/error state
    const renderProjects = () => {
        if (isLoading) {
            return (
                <div className="flex items-center justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <span className="ml-3 text-text-muted">Loading projects...</span>
                </div>
            );
        }

        if (error) {
            return (
                <div className="p-4 text-center text-text-muted">
                    <span className="material-symbols-outlined text-4xl mb-2 block text-slate-400">cloud_off</span>
                    <p>Unable to load projects. Please sign in or check your connection.</p>
                </div>
            );
        }

        if (!projects || projects.length === 0) {
            return (
                <div className="p-4 text-center text-text-muted">
                    <span className="material-symbols-outlined text-4xl mb-2 block text-slate-400">folder_off</span>
                    <p>No projects yet.</p>
                    <Link to="/create-project" className="text-dynamic-cta hover:text-yellow-600 font-bold underline mt-2 inline-block">
                        Create your first project!
                    </Link>
                </div>
            );
        }

        return projects.slice(0, 3).map((project) => {
            const colors = getColorClasses(project.color);
            const icon = iconMap[project.icon || 'folder'] || 'folder';
            const progress = project.progress || 0;

            return (
                <Link
                    key={project.id}
                    to={`/project?projectId=${project.id}`}
                    className="flex items-center gap-4 p-4 hover:bg-neutral-bg rounded-xl transition-colors group cursor-pointer border border-transparent hover:border-accent-nav/20"
                >
                    <div className={`${colors.bg} ${colors.text} p-3 rounded-xl shadow-sm`}>
                        <span className="material-symbols-outlined">{icon}</span>
                    </div>
                    <div className="flex flex-col flex-1 gap-1">
                        <div className="flex justify-between items-center">
                            <h3 className="text-slate-800 font-bold">{project.name}</h3>
                            {project.courseCode && (
                                <span className="text-xs font-semibold text-accent-nav bg-white px-2 py-1 rounded border border-accent-nav/10">
                                    {project.courseCode}
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex-1 h-2 bg-neutral-bg rounded-full overflow-hidden">
                                <div className={`h-2 ${colors.progress} rounded-full`} style={{ width: `${progress}%` }}></div>
                            </div>
                            <span className="text-xs font-bold text-accent-nav">{progress}%</span>
                        </div>
                    </div>
                </Link>
            );
        });
    };

    return (
        <div className={`p-4 md:p-8 lg:p-10 min-h-full ${isFocusMode ? 'max-w-[1200px] mx-auto' : ''}`}>
            {!isFocusMode && (
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-white/40 to-transparent rounded-full blur-3xl -z-10 decorative-blob"></div>
            )}

            <div className="max-w-6xl mx-auto flex flex-col gap-8 relative z-10">
                {/* Welcome Section */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                    <div className="flex flex-col gap-1">
                        <h1 className={`text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em] dashboard-greeting transition-colors ${isFocusMode ? 'text-white' : 'text-slate-800'}`}>Welcome back, {userName}! 👋</h1>
                        <p className={`text-base font-medium leading-normal dashboard-subtitle transition-colors ${isFocusMode ? 'text-[#A3B3A3]' : 'text-accent-nav'}`}>Here's your semester overview so far.</p>
                    </div>
                    {!isFocusMode && (
                        <div className="text-right hidden md:block secondary-header-elements">
                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-neutral-card border border-accent-nav/20 text-sm text-text-muted shadow-sm">
                                <span className="material-symbols-outlined text-base mr-2 text-dynamic-cta">school</span>
                                Current Term: Fall 2023
                            </div>
                        </div>
                    )}
                </div>

                {/* Semester Progress */}
                <Link to="/project" className="block transform transition-transform hover:scale-[1.01]">
                    <div className="bg-neutral-card rounded-2xl p-6 border border-white shadow-soft relative overflow-hidden group cursor-pointer hover:shadow-lg transition-shadow">
                        {!isFocusMode && (
                            <div className="absolute -right-10 -top-10 w-40 h-40 bg-dynamic-cta/5 rounded-full blur-2xl decorative-blob"></div>
                        )}
                        <div className="flex flex-col gap-4 relative z-10">
                            <div className="flex justify-between items-end">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="text-slate-800 text-lg font-bold leading-normal">Semester Completion</p>
                                        <span className="material-symbols-outlined text-text-muted text-sm transform group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                    </div>
                                    <p className="text-text-muted text-sm">{completionStats.text}</p>
                                </div>
                                <p className="text-dynamic-cta text-3xl font-black leading-normal drop-shadow-sm">{completionStats.percent}%</p>
                            </div>
                            <div className="relative w-full h-4 bg-neutral-bg rounded-full overflow-hidden shadow-inner">
                                <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 via-blue-200 to-dynamic-cta shadow-[0_0_10px_rgba(230,179,37,0.4)] transition-all duration-1000 ease-out rounded-full" style={{ width: `${completionStats.percent}%` }}>
                                    <div className="absolute right-0 top-0 h-full w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgNDBMODAgMCIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiIG9wYWNpdHk9IjAuMiIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNhKSIvPjwvc3ZnPg==')] opacity-30"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>

                {/* Grid Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Active Projects - Now uses real API data */}
                    <div className="flex flex-col bg-neutral-card rounded-2xl border border-white shadow-soft overflow-hidden h-full card-hoverable lg:col-span-2 xl:col-span-1">
                        <div className="flex items-center justify-between px-6 py-5 border-b border-accent-nav/10 bg-white/30 backdrop-blur-sm">
                            <h2 className="text-slate-800 text-lg font-bold tracking-tight">Active Projects</h2>
                            <div className="flex gap-3">
                                <Link to="/create-project" className="text-sm font-semibold text-dynamic-cta hover:text-yellow-600 transition-colors">+ New Project</Link>
                                <Link to="/project" className="text-sm font-semibold text-text-muted hover:text-slate-800 transition-colors">View All</Link>
                            </div>
                        </div>
                        <div className="flex flex-col p-2 gap-2">
                            {renderProjects()}
                        </div>
                    </div>

                    {/* Upcoming Deadlines */}
                    <div className="flex flex-col bg-neutral-card rounded-2xl border border-white shadow-soft overflow-hidden h-full card-hoverable lg:col-span-1">
                        <div className="flex items-center justify-between px-6 py-5 border-b border-accent-nav/10 bg-white/30 backdrop-blur-sm">
                            <h2 className="text-slate-800 text-lg font-bold tracking-tight">Upcoming Deadlines</h2>
                            <Link to="/calendar" className="text-sm font-semibold text-accent-nav hover:text-slate-800">Calendar View</Link>
                        </div>
                        <div className="flex flex-col p-4 gap-3">
                            {upcomingDeadlines.length > 0 ? (
                                upcomingDeadlines.map((task) => {
                                    const date = new Date(task.dueDate!);
                                    const month = date.toLocaleString('default', { month: 'short' });
                                    const day = date.getDate();
                                    const daysLeft = Math.ceil((date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

                                    let badgeColor = "bg-blue-100 text-blue-700 ring-blue-600/10";
                                    let borderColor = "border-accent-nav";
                                    let textColor = "text-accent-nav";

                                    if (daysLeft <= 0) {
                                        badgeColor = "bg-red-100 text-red-700 ring-red-600/10";
                                        borderColor = "border-dynamic-error";
                                        textColor = "text-dynamic-error";
                                    } else if (daysLeft <= 2) {
                                        badgeColor = "bg-yellow-100 text-yellow-800 ring-yellow-600/20";
                                        borderColor = "border-dynamic-cta";
                                        textColor = "text-dynamic-cta";
                                    }

                                    return (
                                        <div key={task.id} className={`flex items-start gap-4 p-4 bg-white border-l-4 ${borderColor} rounded-r-xl shadow-sm relative overflow-hidden group hover:bg-neutral-50 transition-colors`}>
                                            {daysLeft <= 0 && (
                                                <div className="absolute right-0 top-0 p-2 opacity-5">
                                                    <span className="material-symbols-outlined text-6xl text-dynamic-error">warning</span>
                                                </div>
                                            )}
                                            <div className={`flex flex-col items-center justify-center min-w-[50px] ${textColor}`}>
                                                <span className="text-xs font-bold uppercase tracking-wider">{month}</span>
                                                <span className="text-xl font-black">{day}</span>
                                            </div>
                                            <div className="flex flex-col gap-1 z-10">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="text-slate-900 font-bold line-clamp-1">{task.title}</h3>
                                                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-bold ring-1 ring-inset ${badgeColor} whitespace-nowrap`}>
                                                        {daysLeft <= 0 ? "Due Today" : `${daysLeft} days`}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-text-muted line-clamp-1">{task.category || "Task"}</p>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <div className="p-4 text-center text-text-muted">
                                    <p>No upcoming deadlines!</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Breathing Exercise Card */}
                    <div className="flex flex-col rounded-2xl border border-white/50 shadow-soft overflow-hidden h-full card-hoverable lg:col-span-3 xl:col-span-1 relative bg-[#FF9E6D] text-white">
                        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                        <div className="flex items-center justify-between px-6 py-5 border-b border-white/20 relative z-10">
                            <h2 className="text-lg font-bold tracking-tight flex items-center gap-2">
                                <span className="material-symbols-outlined">self_improvement</span>
                                Breathing Timer
                            </h2>
                            {isTimerRunning ? (
                                <span className="text-lg font-bold bg-white/30 px-3 py-1 rounded-full">{formatTime(timerRemaining)}</span>
                            ) : (
                                <select
                                    value={timerDuration}
                                    onChange={(e) => setTimerDuration(Number(e.target.value))}
                                    className="text-xs bg-white/20 px-2 py-1 rounded-full font-medium text-white border-none focus:outline-none focus:ring-2 focus:ring-white/50"
                                >
                                    <option value={30} className="text-gray-800">30 sec</option>
                                    <option value={60} className="text-gray-800">1 min</option>
                                    <option value={120} className="text-gray-800">2 min</option>
                                    <option value={180} className="text-gray-800">3 min</option>
                                    <option value={300} className="text-gray-800">5 min</option>
                                </select>
                            )}
                        </div>
                        <div className="flex flex-col flex-1 items-center justify-center p-6 relative z-10 gap-4">
                            <div className="relative flex items-center justify-center size-32">
                                <div className={`absolute inset-0 opacity-60 ${isTimerRunning ? 'animate-spin-slow' : ''}`}>
                                    <svg className="w-full h-full text-[#FFD700] fill-current" viewBox="0 0 100 100">
                                        <path d="M50 0 L60 30 L95 35 L70 55 L80 90 L50 75 L20 90 L30 55 L5 35 L40 30 Z"></path>
                                    </svg>
                                </div>
                                <div className={`size-20 rounded-full bg-[#FFD700] shadow-[0_0_40px_rgba(255,215,0,0.6)] flex items-center justify-center transition-transform duration-1000 ${isTimerRunning ? (breathPhase === 'inhale' ? 'scale-110' : breathPhase === 'exhale' ? 'scale-90' : 'scale-100') : ''}`}>
                                    <span className="material-symbols-outlined text-orange-600 text-3xl">sunny</span>
                                </div>
                            </div>
                            <div className="text-center">
                                <p className="text-lg font-bold">
                                    {isTimerRunning
                                        ? (breathPhase === 'inhale' ? 'Breathe In...' : breathPhase === 'hold' ? 'Hold...' : 'Breathe Out...')
                                        : 'Ready to relax?'
                                    }
                                </p>
                                <p className="text-sm text-white/80 mt-1">
                                    {isTimerRunning
                                        ? '4-4-4 breathing pattern'
                                        : 'Take a moment to center yourself.'
                                    }
                                </p>
                            </div>
                            {isTimerRunning ? (
                                <button
                                    onClick={stopTimer}
                                    className="mt-2 bg-white/20 text-white border-2 border-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg hover:bg-white/30 transition-colors"
                                >
                                    Stop
                                </button>
                            ) : (
                                <button
                                    onClick={startTimer}
                                    className="mt-2 bg-white text-orange-600 px-6 py-2 rounded-xl text-sm font-bold shadow-lg hover:bg-orange-50 transition-colors"
                                >
                                    Start
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                {!isFocusMode && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 secondary-header-elements">
                        {[
                            { icon: 'add_task', label: 'Add Task' },
                            { icon: 'upload_file', label: 'Upload File' },
                            { icon: 'group_add', label: 'Join Group' },
                            { icon: 'schedule', label: 'Book Slot' },
                        ].map((action, i) => (
                            <button
                                key={i}
                                onClick={() => handleQuickAction(action.label)}
                                className="flex flex-col items-center justify-center gap-2 p-4 bg-neutral-card rounded-2xl border border-white shadow-soft hover:border-dynamic-cta/50 hover:shadow-glow transition-all group"
                            >
                                <div className="p-3 rounded-full bg-neutral-bg text-slate-800 group-hover:bg-dynamic-cta group-hover:text-white transition-colors shadow-sm">
                                    <span className="material-symbols-outlined">{action.icon}</span>
                                </div>
                                <span className="text-sm font-semibold text-slate-700">{action.label}</span>
                            </button>
                        ))}
                    </div>
                )}

                {/* Background Graphic */}
                {!isFocusMode && (
                    <div className="absolute bottom-0 right-[-30px] opacity-10 pointer-events-none hidden xl:block decorative-blob">
                        <svg fill="none" height="300" viewBox="0 0 100 100" width="300" xmlns="http://www.w3.org/2000/svg">
                            <path d="M50 100V50" stroke="#8A9A8A" strokeLinecap="round" strokeWidth="2"></path>
                            <path d="M50 80C50 80 80 70 80 40C80 20 60 10 50 20C40 10 20 20 20 40C20 70 50 80 50 80Z" fill="#8A9A8A"></path>
                            <path d="M50 70C50 70 70 60 70 40" stroke="white" strokeOpacity="0.5" strokeWidth="1"></path>
                            <path d="M50 70C50 70 30 60 30 40" stroke="white" strokeOpacity="0.5" strokeWidth="1"></path>
                        </svg>
                    </div>
                )}
            </div>

            {/* Coming Soon Modal */}
            {showComingSoon && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowComingSoon(false)}>
                    <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl" onClick={e => e.stopPropagation()}>
                        <div className="size-16 mx-auto mb-4 bg-dynamic-cta/10 rounded-full flex items-center justify-center">
                            <span className="material-symbols-outlined text-dynamic-cta text-3xl">construction</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Coming Soon!</h3>
                        <p className="text-slate-600 mb-6">
                            <span className="font-semibold">{comingSoonFeature}</span> is currently under development. Stay tuned for updates!
                        </p>
                        <button
                            onClick={() => setShowComingSoon(false)}
                            className="px-6 py-2 bg-dynamic-cta text-white font-bold rounded-lg hover:bg-yellow-500 transition-colors"
                        >
                            Got it!
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

