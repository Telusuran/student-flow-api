import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


export const DashboardPage: React.FC = () => {
    const navigate = useNavigate();
    const [isBreathing, setIsBreathing] = useState(false);

    const toggleBreathing = () => {
        setIsBreathing(!isBreathing);
    };

    return (
        <div className="flex-1 min-h-full py-10 px-20 flex flex-col items-start gap-8 relative overflow-hidden">
            {/* Background Blur Circle */}
            <div className="absolute top-0 right-[100px] w-64 h-64 bg-gradient-to-br from-white/40 to-transparent rounded-full blur-3xl pointer-events-none" />

            {/* Header Section */}
            <div className="w-full max-w-6xl flex flex-col gap-8 z-10">
                <div className="w-full h-16 flex justify-between items-end">
                    <div className="flex flex-col gap-1">
                        <div className="text-text-dark-blue text-lg font-black leading-10 font-display">
                            "People do not truly want or desire happiness... People do not actually want what they believe they want". -Zizek-
                        </div>
                        <div className="text-secondary-accent text-base font-medium leading-6 font-display">
                            Here's your progress overview so far.
                        </div>
                    </div>

                    {/* Term Pill */}
                    <div className="flex flex-col justify-start items-end">
                        <div className="px-3 py-1 bg-sidebar-blue shadow-[0px_1px_2px_rgba(0,0,0,0.05)] rounded-full border border-secondary-accent/20 flex items-center justify-between gap-2">
                            <div className="pr-2 flex flex-col justify-start items-start">
                                <div className="py-1 flex flex-col justify-start items-start">
                                    <div className="w-4 h-5 relative">
                                        <div className="w-3.5 h-3 absolute left-[0.5px] top-[3.5px] bg-[#E6B325]"></div>
                                    </div>
                                </div>
                            </div>
                            <div className="text-text-muted text-sm font-normal leading-5 font-display text-right">
                                Current Term: Fall 2023
                            </div>
                        </div>
                    </div>
                </div>

                {/* Completion Card */}
                <div className="w-full flex flex-col justify-start items-start">
                    <div className="w-full p-6 relative bg-sidebar-blue shadow-soft overflow-hidden rounded-2xl border border-white flex flex-col justify-start items-start hover:shadow-lg transition-shadow duration-300">
                        {/* Decorative Circle */}
                        <div className="absolute -top-10 right-10 w-40 h-40 bg-[#E6B325]/5 shadow-[40px_40px_40px_rgba(0,0,0,0)] rounded-full blur-xl pointer-events-none" />

                        <div className="w-full flex flex-col gap-4 z-10">
                            <div className="w-full flex justify-between items-end">
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2">
                                        <h2 className="text-text-dark-blue text-lg font-bold leading-7 font-display">Completion</h2>
                                        <div className="pb-1">
                                            <div className="w-3.5 h-4 relative">
                                                <div className="w-2.5 h-2.5 absolute left-[2px] top-[3.5px] bg-text-muted"></div>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-text-muted text-sm font-normal leading-5 font-display">0/1 tasks completed</p>
                                </div>
                                <div className="text-[#E6B325] text-3xl font-black leading-tight font-display">0%</div>
                            </div>
                            {/* Progress Bar */}
                            <div className="w-full h-4 relative bg-[#E6F0FA] shadow-inner rounded-full"></div>
                        </div>
                    </div>
                </div>

                {/* Cards Row */}
                <div className="w-full min-h-[375px] flex justify-center items-start gap-6">

                    {/* Active Projects */}
                    <div
                        onClick={() => navigate('/project')}
                        className="w-1/3 h-full self-stretch bg-sidebar-blue shadow-soft overflow-hidden rounded-2xl border border-white flex flex-col gap-0 hover:translate-y-[-2px] transition-transform duration-300 cursor-pointer group"
                    >
                        <div className="w-full py-5 px-6 bg-white/30 border-b border-secondary-accent/10 backdrop-blur-sm flex justify-between items-center group-hover:bg-white/50 transition-colors">
                            <h3 className="text-text-dark-blue text-lg font-bold leading-7 font-display">Active Projects</h3>
                            <div className="flex gap-3">
                                <button
                                    onClick={(e) => { e.stopPropagation(); navigate('/create-project'); }}
                                    className="text-[#E6B325] text-sm font-semibold leading-5 font-display hover:underline"
                                >
                                    + New Project
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); navigate('/project'); }}
                                    className="text-text-muted text-sm font-semibold leading-5 font-display hover:text-text-main"
                                >
                                    View All
                                </button>
                            </div>
                        </div>
                        <div className="w-full p-2 flex flex-col">
                            {/* Project Item */}
                            <div className="w-full p-4 rounded-xl flex items-center gap-4 hover:bg-white/40 transition-colors">
                                <div className="py-2 px-3 bg-blue-100 shadow-sm rounded-xl flex flex-col">
                                    <div className="w-6 h-7 relative">
                                        <div className="w-5 h-4 absolute left-[2px] top-[6px] bg-blue-600"></div>
                                    </div>
                                </div>
                                <div className="flex-1 flex flex-col gap-1">
                                    <div className="flex items-center">
                                        <h4 className="flex-1 text-text-dark-blue text-base font-bold leading-6 font-display">tes blob vercel</h4>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 h-2 bg-[#E6F0FA] rounded-full relative"></div>
                                        <span className="text-secondary-accent text-xs font-bold leading-4 font-display">0%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Upcoming Deadlines */}
                    <div
                        onClick={() => navigate('/calendar')}
                        className="w-1/3 h-full self-stretch bg-sidebar-blue shadow-soft overflow-hidden rounded-2xl border border-white flex flex-col gap-0 hover:translate-y-[-2px] transition-transform duration-300 cursor-pointer group"
                    >
                        <div className="w-full py-5 px-6 bg-white/30 border-b border-secondary-accent/10 backdrop-blur-sm flex justify-between items-center group-hover:bg-white/50 transition-colors">
                            <div className="flex flex-col">
                                <h3 className="text-text-dark-blue text-lg font-bold leading-7 font-display">Upcoming Deadlines</h3>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-secondary-accent text-sm font-semibold leading-5 font-display">Calendar View</span>
                            </div>
                        </div>
                        <div className="w-full p-4 flex flex-col">
                            {/* Deadline Item */}
                            <div className="w-full p-4 bg-white shadow-sm overflow-hidden rounded-r-xl border-l-[3px] border-l-[#E6B325] flex items-start gap-4 hover:bg-neutral-50 transition-colors">
                                <div className="min-w-[50px] px-3 flex flex-col justify-center items-center">
                                    <span className="text-[#E6B325] text-xs font-bold uppercase tracking-wider font-display">Jan</span>
                                    <span className="text-[#E6B325] text-xl font-black leading-7 font-display">30</span>
                                </div>
                                <div className="flex flex-col gap-1 w-full">
                                    <div className="flex items-center gap-2">
                                        <div className="overflow-hidden flex flex-col pr-1">
                                            <h4 className="text-slate-900 text-base font-bold leading-6 font-display truncate">membuat integrasi...</h4>
                                        </div>
                                        <div className="px-2 py-1 bg-yellow-100 shadow-inner rounded-md flex items-center">
                                            <span className="text-yellow-800 text-xs font-bold leading-4 font-display">1 days</span>
                                        </div>
                                    </div>
                                    <div className="overflow-hidden flex flex-col">
                                        <span className="text-text-muted text-sm font-normal leading-5 font-display">Task</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Breathing Timer (Black Card) */}
                    <div className="w-1/3 h-full self-stretch relative bg-black shadow-soft overflow-hidden rounded-2xl border border-white/50 flex flex-col gap-0 hover:translate-y-[-2px] transition-transform duration-300 group">
                        {/* Gradient Overlay */}
                        <div className="absolute inset-[1px] bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />

                        <div className="w-full py-5 px-6 border-b border-white/20 flex justify-between items-center z-10">
                            <div className="flex items-center gap-2">
                                <div className="flex flex-col">
                                    <div className="w-6 h-7 relative">
                                        <div className="w-[18px] h-4 absolute left-[3px] top-[6px] bg-white"></div>
                                    </div>
                                </div>
                                <h3 className="text-white text-lg font-bold leading-7 font-display">Breathing Timer</h3>
                            </div>
                            <div className="py-1 px-3 bg-white/20 rounded-full flex justify-center items-start">
                                <span className="text-white text-xs font-medium leading-4 font-display mr-1">{isBreathing ? 'Active' : '1 min'}</span>
                            </div>
                        </div>

                        <div className="flex-1 relative w-full z-10 flex flex-col items-center justify-center pt-6 pb-2">
                            {/* Sun/Timer Graphic */}
                            <div className={`w-32 h-32 relative flex justify-center items-center mb-8 transition-transform duration-1000 ${isBreathing ? 'scale-125' : 'group-hover:scale-105'}`}>
                                <div className={`w-20 h-20 bg-[#FFD700] shadow-[0_0_40px_rgba(255,215,0,0.6)] rounded-full flex justify-center items-center z-20 ${isBreathing ? 'animate-breathe' : 'animate-pulse'}`}>
                                    <div className="w-[30px] h-[36px] relative">
                                        <div className="w-[27px] h-[27px] absolute left-[1px] top-[4px] bg-orange-600 rounded-full"></div>
                                    </div>
                                </div>
                                <div className="absolute inset-0 opacity-60">
                                    <div className={`absolute left-[6px] top-0 w-[115px] h-[115px] bg-[#FFD700] rounded-full blur-md ${isBreathing ? 'animate-spin' : 'animate-spin-slow'}`}></div>
                                </div>
                            </div>

                            <div className="flex flex-col items-center gap-1 mb-6">
                                <h3 className="text-center text-white text-lg font-bold leading-7 font-display">
                                    {isBreathing ? 'Breathe in... Breathe out...' : 'Ready to relax?'}
                                </h3>
                                <p className="text-center text-white/80 text-sm font-normal leading-5 font-display">
                                    {isBreathing ? 'Follow the rhythm.' : 'Take a moment to center yourself.'}
                                </p>
                            </div>

                            <button
                                onClick={toggleBreathing}
                                className={`px-6 py-2 shadow-lg rounded-xl flex justify-center items-center transition-all ${isBreathing ? 'bg-orange-600 text-white hover:bg-orange-700' : 'bg-white text-orange-600 hover:bg-gray-50'}`}
                            >
                                <span className="text-sm font-bold leading-5 font-display">{isBreathing ? 'Stop' : 'Start'}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Quick Actions (Bottom Row) */}
                <div className="w-full pb-8 flex justify-start items-start gap-4">
                    {[
                        { icon: 'task', label: 'Add Task', color: '#1E293B', to: '/project' }, // Temp route
                        { icon: 'upload_file', label: 'Upload File', color: '#1E293B', to: '/project/resources/add' },
                        { icon: 'group_add', label: 'Join Group', color: '#1E293B', to: '/project/space' },
                        { icon: 'calendar_add_on', label: 'Book Slot', color: '#1E293B', to: '/calendar' }
                    ].map((action, index) => (
                        <div
                            key={index}
                            onClick={() => navigate(action.to)}
                            className="flex-1 py-4 px-20 bg-sidebar-blue shadow-soft overflow-hidden rounded-2xl border border-white flex flex-col justify-center items-center gap-2 hover:bg-blue-300/50 transition-colors cursor-pointer group"
                        >
                            <div className="p-3 bg-[#E6F0FA] shadow-sm rounded-full flex flex-col justify-start items-center group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-slate-800">{action.icon}</span>
                            </div>
                            <div className="flex flex-col justify-start items-center">
                                <span className="text-center text-slate-700 text-sm font-semibold leading-5 font-display">{action.label}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
