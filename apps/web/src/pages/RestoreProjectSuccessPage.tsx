import React from 'react';
import { Link } from 'react-router-dom';

export const RestoreProjectSuccessPage: React.FC = () => {
    return (
        <div className="font-display bg-neutral-bg dark:bg-background-dark text-text-main dark:text-[#f4f3f0] min-h-screen flex flex-col transition-colors duration-200">
            {/* Top Navigation */}
            <header className="w-full bg-white dark:bg-[#1a1814] border-b border-[#f4f3f0] dark:border-[#333] px-6 py-3 shadow-sm z-10">
                <div className="max-w-[1280px] mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4 text-text-main dark:text-white">
                        <div className="size-8 flex items-center justify-center bg-custom-gold/20 rounded-lg text-custom-gold">
                            <span className="material-symbols-outlined text-2xl">school</span>
                        </div>
                        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">Student Projects</h2>
                    </div>
                    <div className="flex flex-1 justify-end gap-8">
                        <nav className="hidden md:flex items-center gap-6">
                            <Link to="/" className="text-text-main dark:text-[#e0e0e0] text-sm font-medium leading-normal hover:text-custom-gold transition-colors flex items-center gap-2">
                                <span className="material-symbols-outlined text-[20px]">dashboard</span> Dashboard
                            </Link>
                            <Link to="/project" className="text-text-main dark:text-[#e0e0e0] text-sm font-medium leading-normal hover:text-custom-gold transition-colors flex items-center gap-2">
                                <span className="material-symbols-outlined text-[20px]">folder</span> Projects
                            </Link>
                            <Link to="/archived" className="text-text-main dark:text-[#e0e0e0] text-sm font-medium leading-normal hover:text-custom-gold transition-colors flex items-center gap-2">
                                <span className="material-symbols-outlined text-[20px]">archive</span> Archives
                            </Link>
                            <Link to="/settings" className="text-text-main dark:text-[#e0e0e0] text-sm font-medium leading-normal hover:text-custom-gold transition-colors flex items-center gap-2">
                                <span className="material-symbols-outlined text-[20px]">settings</span> Settings
                            </Link>
                        </nav>
                        <div className="bg-center bg-no-repeat bg-cover rounded-full size-10 border-2 border-white dark:border-[#333] shadow-sm cursor-pointer" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBrjqE2nXpmnYEeZkuUlgAnbWoGxh2PYBQpPui6X2HkQspK9Dpbk-W5zFJ72SN9WSMJ2mroeE-sI5l0TVo-kbeglYcMKFAQKhRO5mdxRsc_uPTyIJ-t1Dd2Dms2s59y3VoMcosrTZarRacANdPlKgEhmTBnkCdcuntZirUlsnajbAsDW0JfzJ2zC-zRAE_MrDkOVpf-QcAuaGilccWZ5Jn-a2WToGkOd76r9MChtPdrfZAHdMaP0XvX3CBbzV-duv1DY4RsQNbScU-T')" }}></div>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-grow flex items-center justify-center px-4 py-12 relative overflow-hidden">
                {/* Decorative background elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                    <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-custom-gold/5 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-[10%] right-[5%] w-96 h-96 bg-blue-200/20 dark:bg-blue-900/10 rounded-full blur-3xl"></div>
                </div>

                {/* Success Card */}
                <div className="bg-custom-card dark:bg-[#2c281e] w-full max-w-[520px] rounded-xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08)] p-8 flex flex-col items-center gap-6 text-center border border-white/50 dark:border-[#444] animate-in fade-in zoom-in duration-500">
                    {/* Success Icon Visual */}
                    <div className="relative">
                        <div className="size-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-2 animate-bounce">
                            <span className="material-symbols-outlined text-green-600 dark:text-green-400 text-5xl">check_circle</span>
                        </div>
                        {/* Decorative sparks */}
                        <span className="material-symbols-outlined absolute -top-1 -right-2 text-custom-gold text-xl animate-pulse">auto_awesome</span>
                        <span className="material-symbols-outlined absolute bottom-0 -left-4 text-custom-gold text-lg animate-pulse delay-75">star</span>
                    </div>

                    <div className="space-y-3 max-w-[400px]">
                        <h1 className="text-text-main dark:text-white text-2xl font-bold leading-tight tracking-tight">
                            Restoration Complete
                        </h1>
                        <p className="text-[#6b6656] dark:text-[#a09a8a] text-base font-normal leading-relaxed">
                            The project <span className="font-bold text-text-main dark:text-white">'History Final 2024'</span> has been successfully recovered from the archives. You can now edit and track its progress again.
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-3 w-full max-w-[320px] pt-2">
                        <Link to="/" className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-12 px-6 bg-custom-gold hover:bg-[#d4a21f] active:bg-[#c2911a] text-text-main text-base font-bold leading-normal tracking-[0.015em] transition-all transform hover:-translate-y-0.5 shadow-md">
                            <span className="truncate flex items-center gap-2">
                                <span className="material-symbols-outlined">dashboard</span>
                                Return to Dashboard
                            </span>
                        </Link>
                        <button className="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-6 text-[#6b6656] dark:text-[#a09a8a] hover:text-text-main dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 text-sm font-medium leading-normal transition-colors">
                            <span className="truncate">Undo action</span>
                        </button>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="flex flex-col gap-6 px-5 py-8 text-center bg-transparent border-t border-black/5 dark:border-white/5">
                <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
                    <a className="text-[#887e63] dark:text-[#888] hover:text-text-main dark:hover:text-white transition-colors text-sm font-normal" href="#">Privacy Policy</a>
                    <a className="text-[#887e63] dark:text-[#888] hover:text-text-main dark:hover:text-white transition-colors text-sm font-normal" href="#">Terms of Service</a>
                    <a className="text-[#887e63] dark:text-[#888] hover:text-text-main dark:hover:text-white transition-colors text-sm font-normal" href="#">Help Center</a>
                </div>
                <p className="text-[#887e63] dark:text-[#666] text-sm font-normal">© 2024 Student Projects. All rights reserved.</p>
            </footer>
        </div>
    );
};
