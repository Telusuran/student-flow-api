import React from 'react';
import { Link } from 'react-router-dom';

export const AccountDeletedPage: React.FC = () => {
    return (
        <div className="bg-neutral-bg dark:bg-background-dark font-display text-text-main flex flex-col min-h-screen transition-colors duration-300">
            {/* Top Navigation (Simplified for logged-out state) */}
            <header className="w-full flex items-center justify-between px-6 sm:px-10 py-4 bg-white/60 dark:bg-[#181611]/60 backdrop-blur-md border-b border-white/50 dark:border-white/5 sticky top-0 z-50">
                <div className="flex items-center gap-3 text-text-main dark:text-white">
                    <div className="size-8 text-primary flex items-center justify-center">
                        <span className="material-symbols-outlined text-3xl">school</span>
                    </div>
                    <h2 className="text-text-main dark:text-white text-lg font-bold leading-tight tracking-[-0.015em]">Student Project Manager</h2>
                </div>
                <div className="flex gap-3">
                    <Link to="/register" className="hidden sm:flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-transparent border border-gray-300 dark:border-gray-600 text-text-main dark:text-white text-sm font-bold leading-normal tracking-[0.015em] hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                        <span className="truncate">Sign Up</span>
                    </Link>
                    <Link to="/login" className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-primary text-white text-sm font-bold leading-normal tracking-[0.015em] shadow-sm hover:opacity-90 transition-opacity">
                        <span className="truncate">Login</span>
                    </Link>
                </div>
            </header>

            {/* Main Content: Central Success Card */}
            <main className="flex-grow flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
                {/* Abstract background elements for depth */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/20 rounded-full blur-3xl pointer-events-none mix-blend-overlay"></div>
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

                {/* Card Container */}
                <div className="relative w-full max-w-[520px] bg-card-beige dark:bg-[#2A261C] rounded-2xl p-8 sm:p-12 shadow-soft flex flex-col items-center text-center border border-white/60 dark:border-white/10">
                    {/* Success Icon */}
                    <div className="mb-6 rounded-full bg-[#E0E8D7] dark:bg-green-900/30 p-5 flex items-center justify-center shadow-inner">
                        <span className="material-symbols-outlined text-[48px] text-[#5D8545] dark:text-[#88c564]">check_circle</span>
                    </div>

                    {/* Headline */}
                    <h1 className="text-2xl sm:text-3xl font-bold text-text-main dark:text-white mb-4 tracking-tight">
                        Account Successfully Deleted
                    </h1>

                    {/* Body Text */}
                    <p className="text-text-main/70 dark:text-white/70 text-base leading-relaxed mb-8 max-w-sm">
                        Your account and all associated project data have been permanently removed from our system. We're sorry to see you go, but we hope to see you again in the future.
                    </p>

                    {/* Primary CTA Button */}
                    <Link to="/login" className="w-full sm:w-auto min-w-[240px] cursor-pointer flex items-center justify-center rounded-xl h-12 px-8 bg-primary text-white text-base font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300">
                        Return to Login Page
                    </Link>

                    {/* Secondary Action */}
                    <div className="mt-6 pt-6 border-t border-text-main/10 dark:border-white/10 w-full">
                        <p className="text-sm text-text-muted dark:text-gray-400">
                            Did you do this by mistake?
                            <a className="font-bold text-text-main dark:text-white hover:underline decoration-primary underline-offset-2 ml-1" href="#">Contact Support</a>
                        </p>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="flex flex-col gap-4 px-5 py-8 text-center bg-transparent">
                <div className="flex flex-wrap items-center justify-center gap-6">
                    <a className="text-text-muted dark:text-gray-400 text-sm font-normal leading-normal hover:text-primary transition-colors" href="#">Privacy Policy</a>
                    <a className="text-text-muted dark:text-gray-400 text-sm font-normal leading-normal hover:text-primary transition-colors" href="#">Terms of Service</a>
                    <a className="text-text-muted dark:text-gray-400 text-sm font-normal leading-normal hover:text-primary transition-colors" href="#">Help Center</a>
                </div>
                <p className="text-text-muted/60 dark:text-gray-500 text-xs font-normal leading-normal">© 2024 Student Project Manager. All rights reserved.</p>
            </footer>
        </div>
    );
};
