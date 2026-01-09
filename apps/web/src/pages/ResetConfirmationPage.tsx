import React from 'react';
import { Link } from 'react-router-dom';

export const ResetConfirmationPage: React.FC = () => {
    return (
        <div className="font-display bg-neutral-bg text-[#181611] min-h-screen flex flex-col">
            {/* Top Navigation */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#dcecf5] bg-white px-10 py-3 shadow-sm">
                <div className="flex items-center gap-4 text-[#181611]">
                    <div className="size-8 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-3xl">school</span>
                    </div>
                    <h2 className="text-[#181611] text-lg font-bold leading-tight tracking-[-0.015em]">StudentProj</h2>
                </div>
                <div className="flex flex-1 justify-end gap-8">
                    <div className="hidden md:flex items-center gap-9">
                        <Link className="text-[#181611] text-sm font-medium leading-normal hover:text-primary transition-colors" to="/">Home</Link>
                        <a className="text-[#181611] text-sm font-medium leading-normal hover:text-primary transition-colors" href="#">Projects</a>
                        <a className="text-[#181611] text-sm font-medium leading-normal hover:text-primary transition-colors" href="#">About</a>
                    </div>
                    <Link to="/login" className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-[#181611] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-yellow-500 transition-colors">
                        <span className="truncate">Login</span>
                    </Link>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-grow flex items-center justify-center p-4">
                {/* Central Card Container */}
                <div className="relative w-full max-w-md bg-card-beige rounded-xl shadow-xl overflow-hidden p-8 md:p-10 flex flex-col items-center text-center animate-fade-in-up">
                    {/* Success Icon */}
                    <div className="mb-6 rounded-full bg-primary/20 p-5 flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-5xl">mark_email_read</span>
                    </div>
                    {/* Title Header */}
                    <h1 className="text-2xl md:text-3xl font-bold text-[#181611] mb-3 tracking-tight">Check Your Inbox</h1>
                    {/* Body Text */}
                    <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-8 max-w-[320px]">
                        We have sent a password recovery instruction to your email. This link will expire in 15 minutes.
                    </p>
                    {/* Action Button */}
                    <Link to="/login" className="w-full h-12 bg-primary text-[#181611] text-sm font-bold rounded-lg hover:bg-yellow-500 transition-colors shadow-md flex items-center justify-center gap-2 mb-4">
                        <span>Back to Login</span>
                    </Link>
                    {/* Secondary Action */}
                    <div className="flex flex-col gap-2 w-full">
                        <p className="text-gray-500 text-sm font-normal">
                            Did not receive the email?
                            <button className="text-[#181611] font-semibold underline decoration-primary decoration-2 underline-offset-2 hover:text-primary transition-colors ml-1">Resend Link</button>
                        </p>
                    </div>
                    {/* Spam Folder Note */}
                    <div className="mt-8 pt-6 border-t border-[#e2dfce] w-full">
                        <p className="text-xs text-gray-400">
                            Can't find it? Please check your spam folder or <a className="underline hover:text-primary" href="#">contact support</a>.
                        </p>
                    </div>
                    {/* Decorative Visual Element */}
                    <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-primary/10 rounded-full blur-2xl pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 -mb-4 -ml-4 w-32 h-32 bg-blue-200/20 rounded-full blur-3xl pointer-events-none"></div>
                </div>
            </main>

            {/* Footer */}
            <footer className="w-full bg-white py-6 border-t border-[#dcecf5]">
                <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
                    <p className="text-gray-500 text-sm font-normal">© 2023 Student Project Manager. All rights reserved.</p>
                    <div className="flex items-center gap-6">
                        <a className="text-gray-500 hover:text-primary text-sm font-normal transition-colors" href="#">Privacy Policy</a>
                        <a className="text-gray-500 hover:text-primary text-sm font-normal transition-colors" href="#">Terms of Service</a>
                        <a className="text-gray-500 hover:text-primary text-sm font-normal transition-colors" href="#">Support</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};
