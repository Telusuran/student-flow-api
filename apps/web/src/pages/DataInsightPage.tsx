import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProjects } from '../hooks/useProjects';
import { useProjectReport, useProjectSuggestions } from '../hooks/useAI';

const STORAGE_KEY = 'studentflow_last_project';

export const DataInsightPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const { data: projects } = useProjects();

    // Initialize with URL param or localStorage value or 'all'
    const [selectedProjectId, setSelectedProjectId] = useState<string>(() => {
        const paramId = searchParams.get('projectId');
        if (paramId) return paramId;
        return localStorage.getItem(STORAGE_KEY) || 'all';
    });

    // Sync to localStorage and URL when selection changes
    useEffect(() => {
        if (selectedProjectId) {
            localStorage.setItem(STORAGE_KEY, selectedProjectId);
            setSearchParams({ projectId: selectedProjectId });
        }
    }, [selectedProjectId, setSearchParams]);

    const { data: report, isLoading: reportLoading, error: reportError } = useProjectReport(selectedProjectId);
    const { data: suggestions, isLoading: suggestionsLoading } = useProjectSuggestions(selectedProjectId);

    const isLoading = reportLoading || suggestionsLoading;

    // Get health status color
    const getHealthColor = (status?: string) => {
        switch (status) {
            case 'excellent': return 'text-green-500';
            case 'good': return 'text-dynamic-cta';
            case 'at_risk': return 'text-orange-500';
            case 'critical': return 'text-red-500';
            default: return 'text-secondary-accent';
        }
    };

    const getHealthLabel = (status?: string) => {
        switch (status) {
            case 'excellent': return 'Excellent Progress';
            case 'good': return 'Good Progress';
            case 'at_risk': return 'Needs Attention';
            case 'critical': return 'Critical - Action Required';
            default: return 'Select a project';
        }
    };

    return (
        <div className="flex-1 h-full overflow-y-auto relative scroll-smooth bg-neutral-bg">
            <div className="max-w-[1200px] mx-auto p-4 md:p-8 flex flex-col gap-8">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-secondary-accent text-sm font-bold uppercase tracking-wider">
                            <span className="material-symbols-outlined text-lg">insights</span>
                            <span>AI-Powered Analytics</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-text-main">
                            Data <span className="text-secondary-accent font-medium">Insights</span>
                        </h1>
                        <p className="text-text-muted max-w-xl">
                            AI-generated analysis of your project health, progress, and recommendations.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-3">
                        <select
                            value={selectedProjectId}
                            onChange={(e) => setSelectedProjectId(e.target.value)}
                            className="px-4 py-2.5 bg-neutral-card rounded-lg border border-secondary-accent/20 shadow-sm text-sm font-medium text-text-main focus:outline-none focus:ring-2 focus:ring-dynamic-cta/50 min-w-[200px]"
                        >
                            <option value="all">All Projects</option>
                            <option disabled>──────────</option>
                            {projects?.map((project) => (
                                <option key={project.id} value={project.id}>
                                    {project.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </header>

                {/* Loading State */}
                {selectedProjectId && isLoading && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dynamic-cta mb-4"></div>
                        <p className="text-text-muted">Generating AI insights...</p>
                    </div>
                )}

                {/* Error State */}
                {reportError && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                        <span className="material-symbols-outlined text-red-500 text-3xl mb-2">error</span>
                        <p className="text-red-600 font-medium">Failed to generate insights</p>
                        <p className="text-red-500 text-sm mt-1">Please try again or check your API key.</p>
                    </div>
                )}

                {/* Insights Content */}
                {selectedProjectId && report && !isLoading && (
                    <>
                        {/* Section 1: Health Score */}
                        <section className="grid grid-cols-1 md:grid-cols-12 gap-6">
                            <div className="md:col-span-8 lg:col-span-7 bg-neutral-card rounded-2xl p-6 md:p-8 border border-secondary-accent/10 shadow-digital-lg flex flex-col sm:flex-row items-center gap-8 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-dynamic-cta/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
                                <div className="relative size-48 shrink-0">
                                    <svg className="size-full -rotate-90 transform" viewBox="0 0 100 100">
                                        <circle className="text-secondary-accent/20" cx="50" cy="50" fill="none" r="42" stroke="currentColor" strokeWidth="10"></circle>
                                        <circle
                                            className="text-dynamic-cta drop-shadow-[0_0_10px_rgba(230,179,37,0.4)] transition-all duration-1000 ease-out"
                                            cx="50" cy="50" fill="none" r="42"
                                            stroke="currentColor"
                                            strokeDasharray="264"
                                            strokeDashoffset={264 - (264 * (report.health?.score || 0)) / 100}
                                            strokeLinecap="round"
                                            strokeWidth="10"
                                        ></circle>
                                    </svg>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                                        <span className="text-5xl font-black text-text-main tracking-tighter">
                                            {report.health?.score || 0}
                                            <span className={`text-2xl align-top ${getHealthColor(report.health?.status)}`}>%</span>
                                        </span>
                                        <span className="text-xs font-bold uppercase tracking-widest text-secondary-accent mt-1">Health</span>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-4 text-center sm:text-left flex-1 z-10">
                                    <div>
                                        <h3 className={`text-xl font-bold mb-1 ${getHealthColor(report.health?.status)}`}>
                                            {getHealthLabel(report.health?.status)}
                                        </h3>
                                        <p className="text-text-muted text-sm leading-relaxed">
                                            {report.summary || 'Analyzing your project data...'}
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mt-2">
                                        <div className="bg-white/50 p-3 rounded-xl border border-secondary-accent/10 shadow-sm">
                                            <p className="text-xs text-secondary-accent mb-1">Completed</p>
                                            <p className="text-text-main font-bold">
                                                {report.metrics?.completedTasks || 0}/{report.metrics?.totalTasks || 0} Tasks
                                            </p>
                                        </div>
                                        <div className="bg-white/50 p-3 rounded-xl border border-secondary-accent/10 shadow-sm">
                                            <p className="text-xs text-secondary-accent mb-1">Overdue</p>
                                            <p className={`font-bold ${(report.metrics?.overdueTasks || 0) > 0 ? 'text-red-500' : 'text-green-500'}`}>
                                                {report.metrics?.overdueTasks || 0} Tasks
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="md:col-span-4 lg:col-span-5 grid grid-rows-2 gap-6">
                                <div className="bg-secondary-accent/10 rounded-2xl p-6 border border-secondary-accent/20 flex flex-col justify-between relative overflow-hidden shadow-digital">
                                    <div className="absolute right-4 top-4 bg-secondary-accent/20 p-2 rounded-lg text-secondary-accent">
                                        <span className="material-symbols-outlined">bolt</span>
                                    </div>
                                    <p className="text-text-muted text-sm font-medium">Tasks This Week</p>
                                    <div className="flex items-end gap-3 mt-2">
                                        <span className="text-4xl font-bold text-text-main">{report.metrics?.tasksCompletedThisWeek || 0}</span>
                                    </div>
                                    <p className="text-xs text-secondary-accent mt-1">Completed recently</p>
                                </div>
                                <div className="bg-neutral-card rounded-2xl p-6 border border-secondary-accent/10 flex flex-col justify-between shadow-digital">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <p className="text-text-muted text-sm font-medium">In Progress</p>
                                            <div className="flex items-baseline gap-2 mt-2">
                                                <span className="text-4xl font-bold text-text-main">{report.metrics?.inProgressTasks || 0}</span>
                                                <span className="text-sm text-secondary-accent">tasks</span>
                                            </div>
                                        </div>
                                        <div className="bg-neutral-bg p-2 rounded-lg text-secondary-accent">
                                            <span className="material-symbols-outlined">pending</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Section 2: Insights */}
                        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Health Insights */}
                            <div className="bg-neutral-card rounded-2xl p-6 border border-secondary-accent/10 shadow-digital">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-dynamic-cta/10 rounded-lg text-dynamic-cta">
                                        <span className="material-symbols-outlined">lightbulb</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-text-main">AI Insights</h3>
                                </div>
                                <div className="space-y-3">
                                    {report.health?.insights?.length ? (
                                        report.health.insights.map((insight: string, i: number) => (
                                            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-white/50 border border-secondary-accent/10">
                                                <span className="material-symbols-outlined text-dynamic-cta mt-0.5">chevron_right</span>
                                                <p className="text-sm text-text-main">{insight}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-text-muted text-sm">No insights available yet.</p>
                                    )}
                                </div>
                            </div>

                            {/* Recommendations */}
                            <div className="bg-neutral-card rounded-2xl p-6 border border-secondary-accent/10 shadow-digital">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-secondary-accent/20 rounded-lg text-secondary-accent">
                                        <span className="material-symbols-outlined">checklist</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-text-main">Recommendations</h3>
                                </div>
                                <div className="space-y-3">
                                    {report.recommendations?.length ? (
                                        report.recommendations.map((rec: string, i: number) => (
                                            <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-white/50 border border-secondary-accent/10">
                                                <div className="size-6 rounded-full bg-secondary-accent/20 flex items-center justify-center shrink-0">
                                                    <span className="text-xs font-bold text-secondary-accent">{i + 1}</span>
                                                </div>
                                                <p className="text-sm text-text-main">{rec}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-text-muted text-sm">No recommendations at this time.</p>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* Section 3: Achievements & Suggestions */}
                        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
                            {/* Achievements */}
                            <div className="bg-gradient-to-br from-neutral-card to-neutral-bg rounded-2xl p-6 md:p-8 border border-secondary-accent/10 shadow-digital relative overflow-hidden">
                                <div className="absolute right-0 top-0 opacity-5 text-[10rem] leading-none select-none text-secondary-accent pointer-events-none">
                                    <span className="material-symbols-outlined text-[inherit]">emoji_events</span>
                                </div>
                                <div className="flex items-center gap-3 mb-6 relative z-10">
                                    <div className="p-2 bg-dynamic-cta/10 rounded-lg text-dynamic-cta">
                                        <span className="material-symbols-outlined">emoji_events</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-text-main">Achievements</h3>
                                </div>
                                <div className="space-y-4 relative z-10">
                                    {report.achievements?.length ? (
                                        report.achievements.map((achievement: string, i: number) => (
                                            <div key={i} className="flex gap-4 items-start">
                                                <div className="mt-1 size-6 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                                                    <span className="material-symbols-outlined text-sm text-green-600 font-bold">check</span>
                                                </div>
                                                <p className="text-sm text-text-main">{achievement}</p>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-text-muted text-sm">Complete some tasks to see achievements!</p>
                                    )}
                                </div>
                            </div>

                            {/* AI Suggested Tasks */}
                            <div className="bg-neutral-card rounded-2xl p-6 md:p-8 border border-secondary-accent/10 shadow-digital">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                                        <span className="material-symbols-outlined">auto_awesome</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-text-main">AI Suggested Tasks</h3>
                                </div>
                                <div className="space-y-3">
                                    {suggestionsLoading ? (
                                        <p className="text-text-muted text-sm">Loading suggestions...</p>
                                    ) : suggestions?.length ? (
                                        suggestions.map((suggestion: any, i: number) => (
                                            <div key={i} className="p-4 rounded-xl border border-purple-200 bg-purple-50/50 hover:border-purple-400 transition-colors cursor-pointer">
                                                <div className="flex items-start justify-between gap-3">
                                                    <div>
                                                        <h4 className="text-sm font-bold text-text-main">{suggestion.title}</h4>
                                                        <p className="text-xs text-text-muted mt-1">{suggestion.description}</p>
                                                    </div>
                                                    <span className={`text-xs font-bold px-2 py-1 rounded ${suggestion.priority === 'high' ? 'bg-red-100 text-red-600' :
                                                        suggestion.priority === 'medium' ? 'bg-orange-100 text-orange-600' :
                                                            'bg-blue-100 text-blue-600'
                                                        }`}>
                                                        {suggestion.priority}
                                                    </span>
                                                </div>
                                                {suggestion.reasoning && (
                                                    <p className="text-xs text-purple-600 mt-2 italic">💡 {suggestion.reasoning}</p>
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-text-muted text-sm">Add more tasks to get AI suggestions!</p>
                                    )}
                                </div>
                            </div>
                        </section>

                        {/* Attention Areas */}
                        {(report.attention?.length ?? 0) > 0 && (
                            <section className="bg-orange-50 rounded-2xl p-6 border border-orange-200 shadow-digital">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                                        <span className="material-symbols-outlined">warning</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-orange-700">Needs Attention</h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {report.attention?.map((item: string, i: number) => (
                                        <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-white border border-orange-200">
                                            <span className="material-symbols-outlined text-orange-500">priority_high</span>
                                            <p className="text-sm text-orange-700">{item}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}

                        <footer className="flex justify-between items-center py-6 border-t border-secondary-accent/10 text-secondary-accent text-xs">
                            <p>Powered by Google Gemini AI</p>
                            <p>Report generated: {new Date().toLocaleDateString()}</p>
                        </footer>
                    </>
                )}
            </div>
        </div>
    );
};
