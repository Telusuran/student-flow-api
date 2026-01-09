import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCreateProject } from '../hooks/useProjects';

export const CreateProjectPage: React.FC = () => {
    const navigate = useNavigate();
    const createProject = useCreateProject();

    const [projectName, setProjectName] = useState('');
    const [projectDesc, setProjectDesc] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!projectName.trim()) {
            setError('Project name is required');
            return;
        }

        try {
            await createProject.mutateAsync({
                name: projectName.trim(),
                description: projectDesc.trim() || undefined,
            });
            // Navigate to projects page after successful creation
            navigate('/project');
        } catch (err) {
            console.error('Failed to create project:', err);
            setError('Failed to create project. Please try again.');
        }
    };

    return (
        <div className="bg-neutral-bg text-text-main font-display antialiased min-h-screen flex flex-col overflow-x-hidden transition-colors duration-500">
            {/* Top Navigation Bar */}
            <header className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-[#E6E8EC]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo Section */}
                        <Link to="/" className="flex items-center gap-2">
                            <div className="text-primary">
                                <span className="material-symbols-outlined text-3xl">school</span>
                            </div>
                            <h2 className="text-text-main text-lg font-bold tracking-tight">StudentTracker</h2>
                        </Link>
                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            <Link to="/" className="text-text-main text-sm font-medium hover:text-primary transition-colors flex items-center gap-2">
                                <span className="material-symbols-outlined text-[20px]">dashboard</span> Dashboard
                            </Link>
                            <Link to="/project" className="text-primary text-sm font-bold flex items-center gap-2">
                                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>folder</span> Projects
                            </Link>
                            <Link to="/calendar" className="text-text-main text-sm font-medium hover:text-primary transition-colors flex items-center gap-2">
                                <span className="material-symbols-outlined text-[20px]">calendar_today</span> Calendar
                            </Link>
                            <Link to="/settings/account" className="text-text-main text-sm font-medium hover:text-primary transition-colors flex items-center gap-2">
                                <span className="material-symbols-outlined text-[20px]">settings</span> Settings
                            </Link>
                        </div>
                        {/* User Profile */}
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 cursor-pointer">
                                <div className="h-9 w-9 rounded-full bg-gray-200 bg-cover bg-center border-2 border-white shadow-sm" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA4OCvbDFWWsGodcuz8klvslPrTZjiuwbaASt_vtpW-qBQ0cKGAjn9wpjfmR4HnSxPXoivfWlXySomDpPJgccYoU9MpBZ_s5m-Vj4rrqkxDUZUgU254iXAAlf4a3MkHoQQO43S2Um4Kov6LZxetmm31bZ6yFgycv3J_kmfQPYETSeLVILh-Tl1O74Fx3zC9FAZksQxv0iMJN-6HfGHnViL99GY6Sefs3d3BH_AwtT_ti6halAYP7M8FDnDF3Sy9eJLfFkUVaIEA48gN')" }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-grow flex items-center justify-center p-4 sm:p-6 lg:p-8">
                {/* Wizard Card */}
                <div className="w-full max-w-2xl bg-white rounded-2xl shadow-soft border border-white/50 relative overflow-hidden">
                    {/* Decorative top accent */}
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/40 via-primary to-primary/40"></div>
                    <div className="p-8 sm:p-10">
                        {/* Progress Indicator */}
                        <div className="mb-8">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-primary font-bold text-sm tracking-wide uppercase">Create Project</span>
                            </div>
                        </div>
                        {/* Header Text */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-black text-text-main mb-2 tracking-tight">Create New Project</h1>
                            <p className="text-text-sub text-lg">Let's start with the basics to get your workspace ready.</p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
                                <span className="material-symbols-outlined text-base">error</span>
                                {error}
                            </div>
                        )}

                        {/* Form Content */}
                        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                            {/* Project Name Field */}
                            <div className="flex flex-col gap-2 group">
                                <label className="text-text-main font-semibold text-sm ml-1 flex items-center gap-2" htmlFor="projectName">
                                    Project Name
                                    <span className="text-red-400 text-xs">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        className="w-full bg-custom-beige text-text-main placeholder-text-sub/70 border-0 rounded-xl px-5 py-4 focus:ring-2 focus:ring-primary/50 focus:bg-white transition-all duration-200 shadow-sm"
                                        id="projectName"
                                        placeholder="e.g., Biology Final Thesis"
                                        required
                                        type="text"
                                        value={projectName}
                                        onChange={(e) => setProjectName(e.target.value)}
                                        disabled={createProject.isPending}
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-text-sub opacity-0 group-focus-within:opacity-100 transition-opacity">
                                        <span className="material-symbols-outlined text-lg">edit</span>
                                    </div>
                                </div>
                            </div>
                            {/* Project Description Field */}
                            <div className="flex flex-col gap-2 group">
                                <label className="text-text-main font-semibold text-sm ml-1" htmlFor="projectDesc">
                                    Description
                                </label>
                                <div className="relative">
                                    <textarea
                                        className="w-full bg-custom-beige text-text-main placeholder-text-sub/70 border-0 rounded-xl px-5 py-4 min-h-[160px] resize-y focus:ring-2 focus:ring-primary/50 focus:bg-white transition-all duration-200 shadow-sm"
                                        id="projectDesc"
                                        placeholder="Briefly describe the goals, scope, and key deliverables of this project..."
                                        value={projectDesc}
                                        onChange={(e) => setProjectDesc(e.target.value)}
                                        disabled={createProject.isPending}
                                    ></textarea>
                                    <div className="absolute right-4 top-4 text-text-sub opacity-0 group-focus-within:opacity-100 transition-opacity">
                                        <span className="material-symbols-outlined text-lg">notes</span>
                                    </div>
                                </div>
                            </div>
                            {/* Action Buttons */}
                            <div className="flex items-center justify-between pt-6 mt-2 border-t border-gray-100">
                                <Link to="/" className="text-text-sub hover:text-text-main font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2">
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={createProject.isPending}
                                    className="bg-primary hover:bg-primary-hover text-white font-bold text-base px-8 py-3 rounded-xl shadow-lg shadow-primary/30 transform hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                >
                                    {createProject.isPending ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            Create Project
                                            <span className="material-symbols-outlined text-xl">check</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                {/* Helper Text / Illustration Placeholder */}
                <div className="hidden xl:flex fixed right-10 bottom-10 flex-col items-end gap-3 pointer-events-none opacity-50">
                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm">
                        <span className="material-symbols-outlined text-primary">lightbulb</span>
                        <span className="text-xs font-medium text-text-sub">Pro Tip: Keep names concise!</span>
                    </div>
                </div>
            </main>
        </div>
    );
};
