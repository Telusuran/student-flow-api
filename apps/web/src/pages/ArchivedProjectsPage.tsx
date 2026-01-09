import React from 'react';
import { Link } from 'react-router-dom';

export const ArchivedProjectsPage: React.FC = () => {
    return (
        <div className="bg-neutral-bg dark:bg-background-dark min-h-screen flex flex-col transition-colors duration-200 font-display">
            {/* Top Navigation */}
            <header className="bg-white/80 dark:bg-[#1e1e1e]/90 backdrop-blur-md border-b border-[#E0E7F1] dark:border-gray-800 sticky top-0 z-50">
                <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-3">
                            <div className="size-8 bg-custom-gold rounded-lg flex items-center justify-center text-white">
                                <span className="material-symbols-outlined text-[20px]">school</span>
                            </div>
                            <h2 className="text-text-main dark:text-white text-lg font-bold tracking-tight">StudentTracker</h2>
                        </Link>
                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center gap-8">
                            <nav className="flex gap-6">
                                <Link to="/" className="text-text-muted hover:text-custom-gold dark:text-gray-400 dark:hover:text-custom-gold text-sm font-semibold transition-colors">Dashboard</Link>
                                <Link to="/project" className="text-text-muted hover:text-custom-gold dark:text-gray-400 dark:hover:text-custom-gold text-sm font-semibold transition-colors">Active Projects</Link>
                                <span className="text-custom-gold font-bold text-sm">Archived</span>
                                <Link to="/calendar" className="text-text-muted hover:text-custom-gold dark:text-gray-400 dark:hover:text-custom-gold text-sm font-semibold transition-colors">Schedule</Link>
                            </nav>
                        </div>
                        {/* User Profile */}
                        <div className="flex items-center gap-4">
                            <button className="text-text-muted hover:text-custom-gold dark:text-gray-400 transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                                <span className="material-symbols-outlined">notifications</span>
                            </button>
                            <div className="bg-center bg-no-repeat bg-cover rounded-full size-9 ring-2 ring-white dark:ring-gray-700 shadow-sm cursor-pointer" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDJi4aUtG-eM5nBVP051aHXExCUZS7egCo-8_fN-ztmo-FTOJR6Vh-o1EwPLMzrIN_cpFfvVXCw6mTtnwXCPQrmh305Sg6wPb7q2Qim1y6tgqLxqbgP5FeeQx7ljot1l6k7huBaROVrzu0QhA5LSIuizFIpgqVWwDexk9jyLdA4AKBMA5KU6f7nQ4UKcpc6-30GIyktdG-kiNcvPfmo00UzRbz3xQaZ4joiQUWRjchrUoVp7WILhiXO5iJNskv3RgEeRJpRTyNR41HF')" }}></div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Page Heading & Intro */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="space-y-2">
                        <h1 className="text-text-main dark:text-white text-4xl font-black leading-tight tracking-tight">Archived Projects</h1>
                        <p className="text-text-muted dark:text-gray-400 text-lg max-w-2xl">
                            View and manage your completed or shelved work. Restore projects to continue working on them or delete them permanently.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm text-sm font-medium text-text-main dark:text-gray-200 border border-transparent hover:border-gray-200 dark:hover:border-gray-700 transition-all">
                            <span className="material-symbols-outlined text-[20px]">file_download</span>
                            Export List
                        </button>
                    </div>
                </div>

                {/* Toolbar: Search & Filter */}
                <div className="bg-white dark:bg-[#1e1e1e] p-2 rounded-xl shadow-soft flex flex-col md:flex-row gap-3 items-center">
                    {/* Search Bar */}
                    <div className="relative flex-1 w-full">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="material-symbols-outlined text-gray-400">search</span>
                        </div>
                        <input className="block w-full pl-10 pr-3 py-3 border-none rounded-lg bg-gray-50 dark:bg-gray-800 text-text-main dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-custom-gold/50 text-sm" placeholder="Search by project name, subject, or tag..." type="text" />
                    </div>
                    {/* Filters */}
                    <div className="flex items-center gap-3 w-full md:w-auto px-2">
                        <div className="relative group">
                            <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-sm font-medium text-text-main dark:text-gray-200 transition-colors">
                                <span className="material-symbols-outlined text-[18px]">filter_list</span>
                                <span>Filter</span>
                                <span className="material-symbols-outlined text-[18px] text-gray-400">expand_more</span>
                            </button>
                        </div>
                        <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 mx-1 hidden md:block"></div>
                        {/* View Toggle */}
                        <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
                            <button className="p-2 rounded-md bg-white dark:bg-gray-700 shadow-sm text-text-main dark:text-white">
                                <span className="material-symbols-outlined text-[20px] block">grid_view</span>
                            </button>
                            <button className="p-2 rounded-md text-gray-500 hover:text-text-main dark:text-gray-400 dark:hover:text-white transition-colors">
                                <span className="material-symbols-outlined text-[20px] block">view_list</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Project Card 1 */}
                    <article className="group bg-custom-card dark:bg-[#2a261a] rounded-xl overflow-hidden shadow-soft hover:shadow-lg transition-all duration-300 flex flex-col h-full border border-transparent hover:border-custom-gold/20">
                        <div className="h-40 w-full bg-gray-200 relative overflow-hidden">
                            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDNee_DIKyQijL4m07ZA9J1mIpWZeatNxXDOHr8wCOzw93jyCvoy__sj0x0mqO8ab97SnYJhgKr_Q2yfHXt4OFWF1Ma38xQwUGTTmPL7T9RRWW5Q39s9U4MRRssedEAENIcUaxkOfrkqfwVQZhkMdHLDn6U-Q5xzvmD8zfbk3jyEZWyMVJL1wZS6j8TZZxhy9kiX4_Ee-3jUbhTyQGdU9R6Ip0mkfA2CTGNbZym6H7jwuvVrrLIgj4YNz8T4XKLxjeFPdMbQrkkxKxY')" }}></div>
                            <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-text-main dark:text-white uppercase tracking-wider shadow-sm">
                                Biology
                            </div>
                        </div>
                        <div className="p-5 flex flex-col flex-1">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-bold text-text-main dark:text-white leading-tight group-hover:text-custom-gold transition-colors">Cellular Mitosis Research</h3>
                            </div>
                            <div className="space-y-3 mb-6 flex-1">
                                <p className="text-sm text-text-muted dark:text-gray-400 line-clamp-2">Detailed analysis of cellular division phases with microscopic imagery and statistical growth models.</p>
                                <div className="flex flex-col gap-1.5 text-xs font-medium text-[#6b5c42] dark:text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[16px]">calendar_month</span>
                                        <span>Archived: Oct 12, 2023</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[16px]">folder_open</span>
                                        <span>Size: 245 MB</span>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-[#dcd8c5] dark:border-gray-700 flex items-center justify-between gap-3">
                                <Link to="/project/restore" className="flex-1 bg-custom-gold hover:bg-[#d4a015] text-[#3d2e07] text-sm font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors">
                                    <span className="material-symbols-outlined text-[18px] font-bold">restore_from_trash</span>
                                    Restore
                                </Link>
                                <button aria-label="Delete permanently" className="bg-white dark:bg-gray-800 hover:bg-custom-red/10 text-custom-red border border-transparent hover:border-custom-red/30 p-2.5 rounded-lg transition-colors flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[20px]">delete</span>
                                </button>
                            </div>
                        </div>
                    </article>

                    {/* Project Card 2 */}
                    <article className="group bg-custom-card dark:bg-[#2a261a] rounded-xl overflow-hidden shadow-soft hover:shadow-lg transition-all duration-300 flex flex-col h-full border border-transparent hover:border-custom-gold/20">
                        <div className="h-40 w-full bg-gray-200 relative overflow-hidden">
                            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAMddY1mqvxYX8DcX1189jiKAsyrMRUZZflxRg9gkt0w-YjklvF3v0NXRcVPuhaNdtNZam8J_-REhQ_4vWeDQBSOvmQIheVXwPTmvs6U6Q61quARlzt7bHe4gcgRKeeTk1Qt4zrhOJLe-roGrt7oK960G2vUmZDa8-dxmHXugHr7bzbYpDg56dbnds8JOz9if9VQKhingPsxRqSLSX-gNdM5axvXSU6FlJH-6lw84cB8UGEldtXiwk-AnRgUEj5argf4wZ2esAl0_B7')" }}></div>
                            <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-text-main dark:text-white uppercase tracking-wider shadow-sm">
                                Architecture
                            </div>
                        </div>
                        <div className="p-5 flex flex-col flex-1">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-bold text-text-main dark:text-white leading-tight group-hover:text-custom-gold transition-colors">Modern Library Concept</h3>
                            </div>
                            <div className="space-y-3 mb-6 flex-1">
                                <p className="text-sm text-text-muted dark:text-gray-400 line-clamp-2">Design blueprints and 3D renders for the new campus library extension project.</p>
                                <div className="flex flex-col gap-1.5 text-xs font-medium text-[#6b5c42] dark:text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[16px]">calendar_month</span>
                                        <span>Archived: Sep 28, 2023</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[16px]">folder_open</span>
                                        <span>Size: 1.2 GB</span>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-[#dcd8c5] dark:border-gray-700 flex items-center justify-between gap-3">
                                <Link to="/project/restore" className="flex-1 bg-custom-gold hover:bg-[#d4a015] text-[#3d2e07] text-sm font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors">
                                    <span className="material-symbols-outlined text-[18px] font-bold">restore_from_trash</span>
                                    Restore
                                </Link>
                                <button aria-label="Delete permanently" className="bg-white dark:bg-gray-800 hover:bg-custom-red/10 text-custom-red border border-transparent hover:border-custom-red/30 p-2.5 rounded-lg transition-colors flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[20px]">delete</span>
                                </button>
                            </div>
                        </div>
                    </article>

                    {/* Project Card 3 */}
                    <article className="group bg-custom-card dark:bg-[#2a261a] rounded-xl overflow-hidden shadow-soft hover:shadow-lg transition-all duration-300 flex flex-col h-full border border-transparent hover:border-custom-gold/20">
                        <div className="h-40 w-full bg-gray-200 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                <span className="material-symbols-outlined text-white text-[48px] opacity-50">code</span>
                            </div>
                            <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-text-main dark:text-white uppercase tracking-wider shadow-sm">
                                Comp Sci
                            </div>
                        </div>
                        <div className="p-5 flex flex-col flex-1">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-bold text-text-main dark:text-white leading-tight group-hover:text-custom-gold transition-colors">Algorithm Visualizer</h3>
                            </div>
                            <div className="space-y-3 mb-6 flex-1">
                                <p className="text-sm text-text-muted dark:text-gray-400 line-clamp-2">A React-based web application to visualize sorting algorithms in real-time.</p>
                                <div className="flex flex-col gap-1.5 text-xs font-medium text-[#6b5c42] dark:text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[16px]">calendar_month</span>
                                        <span>Archived: Aug 15, 2023</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[16px]">folder_open</span>
                                        <span>Size: 45 MB</span>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-[#dcd8c5] dark:border-gray-700 flex items-center justify-between gap-3">
                                <Link to="/project/restore" className="flex-1 bg-custom-gold hover:bg-[#d4a015] text-[#3d2e07] text-sm font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors">
                                    <span className="material-symbols-outlined text-[18px] font-bold">restore_from_trash</span>
                                    Restore
                                </Link>
                                <button aria-label="Delete permanently" className="bg-white dark:bg-gray-800 hover:bg-custom-red/10 text-custom-red border border-transparent hover:border-custom-red/30 p-2.5 rounded-lg transition-colors flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[20px]">delete</span>
                                </button>
                            </div>
                        </div>
                    </article>

                    {/* Project Card 4 */}
                    <article className="group bg-custom-card dark:bg-[#2a261a] rounded-xl overflow-hidden shadow-soft hover:shadow-lg transition-all duration-300 flex flex-col h-full border border-transparent hover:border-custom-gold/20">
                        <div className="h-40 w-full bg-gray-200 relative overflow-hidden">
                            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAWRWBPUxwOmVqVFOZxBI0lfBeVOOrTmUk0Ued87OCQ1LM1MvqMgLRHu4lY9kMcv-9BQwNUDtgaqsLfbMgprd1tmS4Umjecat5v29QHv36jENNFXY2EMJv9dca-Emn1NJjwSQntymKcNuI0SpwqklqxC6xo2ysPm0yYcVF4yoxui1L_rNINSu2zrqBzcpsziVMuurQkgKHAG5uoa5Pwwi5BxhhN79c_0paKqI76zxe8CwkiQ-8rSYUn8pvniswvVvWZrFV61WNJCwKy')" }}></div>
                            <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-text-main dark:text-white uppercase tracking-wider shadow-sm">
                                History
                            </div>
                        </div>
                        <div className="p-5 flex flex-col flex-1">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-bold text-text-main dark:text-white leading-tight group-hover:text-custom-gold transition-colors">The Industrial Revolution</h3>
                            </div>
                            <div className="space-y-3 mb-6 flex-1">
                                <p className="text-sm text-text-muted dark:text-gray-400 line-clamp-2">Final term paper exploring the socio-economic impacts of the steam engine in 19th century Europe.</p>
                                <div className="flex flex-col gap-1.5 text-xs font-medium text-[#6b5c42] dark:text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[16px]">calendar_month</span>
                                        <span>Archived: Jun 02, 2023</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[16px]">folder_open</span>
                                        <span>Size: 15 MB</span>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-[#dcd8c5] dark:border-gray-700 flex items-center justify-between gap-3">
                                <Link to="/project/restore" className="flex-1 bg-custom-gold hover:bg-[#d4a015] text-[#3d2e07] text-sm font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors">
                                    <span className="material-symbols-outlined text-[18px] font-bold">restore_from_trash</span>
                                    Restore
                                </Link>
                                <button aria-label="Delete permanently" className="bg-white dark:bg-gray-800 hover:bg-custom-red/10 text-custom-red border border-transparent hover:border-custom-red/30 p-2.5 rounded-lg transition-colors flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[20px]">delete</span>
                                </button>
                            </div>
                        </div>
                    </article>

                    {/* Project Card 5 */}
                    <article className="group bg-custom-card dark:bg-[#2a261a] rounded-xl overflow-hidden shadow-soft hover:shadow-lg transition-all duration-300 flex flex-col h-full border border-transparent hover:border-custom-gold/20">
                        <div className="h-40 w-full bg-gray-200 relative overflow-hidden">
                            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB8f7LIW71BsbG24bSe69enCdgfD_qKVjF5GbFnZouxWHgnBpijHTckLlJexfVrZB-n0X02JkVSUt5JUyd9loJYCpTSy9-Ptuk2B4sDoUlnycwXtPHZ1Be1IMWK59LkQGX_1zwG55xXrzFkuP_BEZbvN6svMKum7QCT3tAoZZPuVrTppc8NZpAm7GImWBTlcmvZqHx9XauouNeTGL-FXmRZm9Mh5wFSmqEVZ7pP8fa2GgeKgg09RZ0mc6iKdo0qomnNqMKCy0yt3SRq')" }}></div>
                            <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-text-main dark:text-white uppercase tracking-wider shadow-sm">
                                Art
                            </div>
                        </div>
                        <div className="p-5 flex flex-col flex-1">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-bold text-text-main dark:text-white leading-tight group-hover:text-custom-gold transition-colors">Color Theory Portfolio</h3>
                            </div>
                            <div className="space-y-3 mb-6 flex-1">
                                <p className="text-sm text-text-muted dark:text-gray-400 line-clamp-2">A collection of 12 studies on complementary and analogous color schemes.</p>
                                <div className="flex flex-col gap-1.5 text-xs font-medium text-[#6b5c42] dark:text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[16px]">calendar_month</span>
                                        <span>Archived: May 20, 2023</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[16px]">folder_open</span>
                                        <span>Size: 580 MB</span>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-[#dcd8c5] dark:border-gray-700 flex items-center justify-between gap-3">
                                <Link to="/project/restore" className="flex-1 bg-custom-gold hover:bg-[#d4a015] text-[#3d2e07] text-sm font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors">
                                    <span className="material-symbols-outlined text-[18px] font-bold">restore_from_trash</span>
                                    Restore
                                </Link>
                                <button aria-label="Delete permanently" className="bg-white dark:bg-gray-800 hover:bg-custom-red/10 text-custom-red border border-transparent hover:border-custom-red/30 p-2.5 rounded-lg transition-colors flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[20px]">delete</span>
                                </button>
                            </div>
                        </div>
                    </article>

                    {/* Project Card 6 */}
                    <article className="group bg-custom-card dark:bg-[#2a261a] rounded-xl overflow-hidden shadow-soft hover:shadow-lg transition-all duration-300 flex flex-col h-full border border-transparent hover:border-custom-gold/20">
                        <div className="h-40 w-full bg-[#e8e4d3] dark:bg-gray-800 relative flex flex-col items-center justify-center text-[#887f63] dark:text-gray-400">
                            <span className="material-symbols-outlined text-[64px] opacity-40">description</span>
                            <span className="text-sm font-medium opacity-60 mt-2">No Thumbnail</span>
                            <div className="absolute top-3 right-3 bg-white/90 dark:bg-black/80 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-text-main dark:text-white uppercase tracking-wider shadow-sm">
                                Literature
                            </div>
                        </div>
                        <div className="p-5 flex flex-col flex-1">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-bold text-text-main dark:text-white leading-tight group-hover:text-custom-gold transition-colors">Shakespearean Analysis</h3>
                            </div>
                            <div className="space-y-3 mb-6 flex-1">
                                <p className="text-sm text-text-muted dark:text-gray-400 line-clamp-2">Drafts and final submission for the Hamlet character study assignment.</p>
                                <div className="flex flex-col gap-1.5 text-xs font-medium text-[#6b5c42] dark:text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[16px]">calendar_month</span>
                                        <span>Archived: Apr 10, 2023</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-[16px]">folder_open</span>
                                        <span>Size: 2 MB</span>
                                    </div>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-[#dcd8c5] dark:border-gray-700 flex items-center justify-between gap-3">
                                <Link to="/project/restore" className="flex-1 bg-custom-gold hover:bg-[#d4a015] text-[#3d2e07] text-sm font-bold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors">
                                    <span className="material-symbols-outlined text-[18px] font-bold">restore_from_trash</span>
                                    Restore
                                </Link>
                                <button aria-label="Delete permanently" className="bg-white dark:bg-gray-800 hover:bg-custom-red/10 text-custom-red border border-transparent hover:border-custom-red/30 p-2.5 rounded-lg transition-colors flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[20px]">delete</span>
                                </button>
                            </div>
                        </div>
                    </article>
                </div>

                {/* Pagination / Load More */}
                <div className="flex justify-center pt-8 pb-12">
                    <button className="text-text-muted hover:text-text-main dark:text-gray-400 dark:hover:text-white font-semibold text-sm flex items-center gap-2 transition-colors px-6 py-3 rounded-full hover:bg-white/50 dark:hover:bg-gray-800">
                        Load more projects
                        <span className="material-symbols-outlined text-[20px]">expand_more</span>
                    </button>
                </div>
            </main>
        </div>
    );
};
