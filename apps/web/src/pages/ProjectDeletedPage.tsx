import React from 'react';
import { Link } from 'react-router-dom';

export const ProjectDeletedPage: React.FC = () => {
    return (
        <div className="bg-custom-bg text-text-main font-display min-h-screen flex flex-col overflow-x-hidden antialiased selection:bg-primary/30">
            {/* Navigation */}
            <header className="bg-white border-b border-custom-bg/50 sticky top-0 z-50">
                <div className="max-w-[1280px] mx-auto px-6 lg:px-10 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3 text-text-main">
                        <div className="size-8 bg-primary/20 rounded-lg flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined text-xl">grid_view</span>
                        </div>
                        <h2 className="text-lg font-bold tracking-tight">ProjectTracker</h2>
                    </div>
                    <nav className="hidden md:flex items-center gap-8">
                        <Link to="/" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">Dashboard</Link>
                        <Link to="/project" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">Projects</Link>
                        <a href="#" className="text-sm font-medium text-gray-600 hover:text-primary transition-colors">Tasks</a>
                    </nav>
                    <div className="flex items-center gap-4">
                        <button className="text-gray-500 hover:text-gray-900 md:hidden">
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                        <div className="hidden md:block bg-center bg-no-repeat bg-cover rounded-full size-9 border border-gray-200 cursor-pointer hover:ring-2 hover:ring-primary/20 transition-all" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAsEwUaTMQXhUvuhCNvKXh6eOBcZLhghEyZzfWtdxaist-ew929cUGDwSLX6Lez4CArfI2V5p1xxigN90GmYyUS1XWai1gp3nqhfifchQsGkFmSQBT_L-OweWvG-ENGLRwwLYir6FcfrqOYOVsVigZBjyFJ6sFStJ0xsZc-JE50zHspyqUOFYJ_1CzVoTjVQI2d1agvF8fMDvqZhecwF7RapO5qxzSKOrpPCl-rlO7iLxoSgHUMMNzyyxN-eSguC8DfxAx4gkKnh7aA')" }}></div>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-grow flex items-center justify-center px-4 py-12 md:py-20 relative">
                {/* Abstract Background Pattern */}
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-40">
                    <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-white blur-[100px]"></div>
                    <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-white blur-[80px]"></div>
                </div>

                {/* Success Card */}
                <div className="relative z-10 w-full max-w-[520px] bg-custom-card rounded-xl shadow-[0_20px_40px_-12px_rgba(0,0,0,0.08)] flex flex-col overflow-hidden animate-fade-in-up">
                    {/* Decorative top strip */}
                    <div className="h-2 w-full bg-custom-gold/80"></div>
                    <div className="p-8 md:p-12 flex flex-col items-center text-center">
                        {/* Success Icon */}
                        <div className="size-20 mb-6 rounded-full bg-white shadow-sm flex items-center justify-center relative">
                            <div className="absolute inset-0 bg-custom-gold/10 rounded-full animate-pulse"></div>
                            <span className="material-symbols-outlined text-5xl text-custom-gold">check_circle</span>
                        </div>
                        {/* Text Content */}
                        <h1 className="text-2xl md:text-3xl font-bold text-text-main mb-3 tracking-tight">Project Deleted</h1>
                        <p className="text-base text-[#5a5a5a] mb-8 leading-relaxed max-w-[360px]">
                            The project <span className="font-semibold text-text-main">"History Final 2023"</span> has been permanently removed from your list.
                        </p>
                        {/* Actions */}
                        <div className="flex flex-col w-full gap-4 items-center">
                            <Link to="/" className="w-full md:w-auto min-w-[240px] h-12 bg-custom-gold hover:bg-[#d4a015] active:scale-[0.98] transition-all text-text-main text-sm font-bold rounded-lg shadow-md hover:shadow-lg flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined text-[20px]">dashboard</span>
                                Return to Dashboard
                            </Link>
                            <button className="group flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-text-main transition-colors px-4 py-2 rounded-lg hover:bg-text-main/5">
                                <span className="material-symbols-outlined text-[18px] group-hover:-rotate-180 transition-transform duration-500">undo</span>
                                Undo Action
                            </button>
                        </div>
                    </div>
                    {/* Bottom decorative detail */}
                    <div className="h-px w-full bg-gradient-to-r from-transparent via-text-main/10 to-transparent"></div>
                    <div className="bg-custom-card px-6 py-3 text-xs text-center text-text-sub">
                        Need help? <a className="underline decoration-custom-gold underline-offset-2 hover:text-custom-gold" href="#">Contact Support</a>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white border-t border-[#f4f3f0]">
                <div className="max-w-[960px] mx-auto px-6 py-10 flex flex-col gap-6 text-center md:flex-row md:justify-between md:items-center md:text-left">
                    <p className="text-text-sub text-sm">© 2023 ProjectTracker Student App</p>
                    <div className="flex flex-wrap items-center justify-center gap-6 md:justify-end">
                        <a className="text-text-sub text-sm hover:text-primary transition-colors" href="#">Privacy Policy</a>
                        <a className="text-text-sub text-sm hover:text-primary transition-colors" href="#">Support</a>
                        <a className="text-text-sub text-sm hover:text-primary transition-colors" href="#">Terms</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};
