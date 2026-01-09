import React from 'react';

export const DashboardHeader: React.FC = () => {
    return (
        <header className="flex-none px-8 py-6 bg-neutral-bg/80 backdrop-blur-sm z-20">
            <div className="max-w-[1400px] mx-auto w-full flex flex-col gap-6">
                <div className="flex items-center gap-2 text-sm">
                    <span className="text-secondary-accent">Projects</span>
                    <span className="text-secondary-accent/50">/</span>
                    <span className="text-text-main font-medium">History Final</span>
                </div>
                <div className="flex flex-wrap items-end justify-between gap-4">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-3xl font-black tracking-tight text-text-main">History Final Project</h1>
                        <div className="flex items-center gap-4 text-sm text-secondary-accent">
                            <span>History 101</span>
                            <span className="size-1 rounded-full bg-secondary-accent"></span>
                            <span>Due Dec 15</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3 bg-white px-3 py-2 rounded-full shadow-sm border border-secondary-accent/20">
                            <span className="text-xs font-bold text-secondary-accent uppercase tracking-wide">Fokus Mode</span>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input className="sr-only peer" type="checkbox" value="" />
                                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-cta"></div>
                            </label>
                        </div>
                        <div className="h-8 w-px bg-secondary-accent/20"></div>
                        <div className="hidden sm:flex flex-col gap-2 w-40">
                            <div className="flex justify-between text-xs font-medium">
                                <span className="text-text-muted">Progress</span>
                                <span className="text-cta font-bold">45%</span>
                            </div>
                            <div className="h-2 w-full bg-white rounded-full overflow-hidden shadow-inner border border-secondary-accent/10">
                                <div className="h-full bg-cta w-[45%] rounded-full"></div>
                            </div>
                        </div>
                        <button className="flex items-center justify-center gap-2 h-10 pl-3 pr-4 bg-cta hover:bg-cta/90 text-white text-sm font-bold rounded-lg transition-colors shadow-lg shadow-cta/30">
                            <span className="material-symbols-outlined text-[20px]">add</span>
                            <span>New Task</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};
