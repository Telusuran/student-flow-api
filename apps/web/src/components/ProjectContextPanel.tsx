import React from 'react';

export const ProjectContextPanel: React.FC = () => {
    return (
        <div className="w-[380px] min-w-[320px] flex flex-col border-r border-secondary-accent/20 bg-surface h-full relative z-20 shadow-soft lg:flex hidden">
            <div className="flex-1 flex flex-col min-h-0">
                <div className="h-14 border-b border-secondary-accent/20 flex items-center justify-between px-4 bg-neutral-bg/30">
                    <div className="flex items-center gap-2 overflow-hidden">
                        <span className="material-symbols-outlined text-error">picture_as_pdf</span>
                        <span className="text-sm font-medium truncate text-text-main">Project_Requirements_v2.pdf</span>
                    </div>
                    <div className="flex gap-1">
                        <button className="p-1.5 rounded hover:bg-neutral-bg text-secondary-accent">
                            <span className="material-symbols-outlined text-[20px]">remove</span>
                        </button>
                        <button className="p-1.5 rounded hover:bg-neutral-bg text-secondary-accent">
                            <span className="material-symbols-outlined text-[20px]">add</span>
                        </button>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-6 bg-neutral-bg relative">
                    <div className="bg-white mx-auto w-full min-h-[600px] shadow-card p-8 flex flex-col gap-4 text-xs text-gray-800 leading-relaxed rounded-sm select-none relative">
                        <div className="w-2/3 h-4 bg-gray-600 mb-4 rounded-sm"></div>
                        <div className="w-full h-2 bg-gray-300 rounded-sm"></div>
                        <div className="w-full h-2 bg-gray-300 rounded-sm"></div>
                        <div className="relative p-2 -mx-2 rounded bg-cta/10 border border-cta/20">
                            <div className="absolute -right-2 -top-2 bg-cta text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm z-10">Lampu Fokus</div>
                            <div className="w-3/4 h-2 bg-gray-400 rounded-sm mb-2"></div>
                            <div className="w-full h-2 bg-gray-400 rounded-sm"></div>
                        </div>
                        <div className="w-1/3 h-3 bg-gray-500 mt-4 mb-2 rounded-sm"></div>
                        <div className="w-full h-2 bg-gray-300 rounded-sm"></div>
                        <div className="w-full h-2 bg-gray-300 rounded-sm"></div>
                        <div className="w-full h-2 bg-cta/40 rounded-sm relative mt-2"></div>
                        <div className="w-3/4 h-2 bg-cta/40 rounded-sm mb-4"></div>
                        <div className="w-full h-32 bg-gray-50 mt-4 rounded border border-gray-200" aria-label="Simulated chart inside PDF document"></div>
                        <div className="w-full h-2 bg-gray-300 rounded-sm mt-4"></div>
                    </div>
                </div>
            </div>
            <div className="h-[35%] border-t border-secondary-accent/20 bg-surface flex flex-col shadow-[0_-4px_20px_rgba(138,154,138,0.15)] relative z-10">
                <div className="p-4 flex items-center gap-2 border-b border-secondary-accent/10 bg-neutral-bg/30">
                    <span
                        className="material-symbols-outlined text-cta"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                        auto_awesome
                    </span>
                    <h3 className="text-sm font-bold tracking-wide text-text-main">AI Context Analysis</h3>
                    <span className="ml-auto text-xs text-white font-medium bg-secondary-accent px-2 py-0.5 rounded-full">3 Suggestions</span>
                </div>
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                    <div className="group p-3 rounded-lg border border-cta/30 bg-cta/5 hover:bg-cta/10 transition-colors flex gap-3 items-start">
                        <div className="mt-0.5 text-cta">
                            <span className="material-symbols-outlined text-[18px]">lightbulb</span>
                        </div>
                        <div className="flex-1 flex flex-col gap-1">
                            <p className="text-sm font-medium text-text-main">Draft Introduction</p>
                            <p className="text-xs text-text-muted leading-normal">Based on highlighted section on page 1 regarding thesis statement.</p>
                        </div>
                        <button className="shrink-0 size-8 rounded-full bg-cta text-white flex items-center justify-center hover:scale-105 transition-transform shadow-sm">
                            <span className="material-symbols-outlined text-[18px]">add</span>
                        </button>
                    </div>
                    <div className="group p-3 rounded-lg border border-secondary-accent/20 bg-neutral-card hover:border-cta/30 transition-colors flex gap-3 items-start">
                        <div className="mt-0.5 text-secondary-accent group-hover:text-cta">
                            <span className="material-symbols-outlined text-[18px]">format_list_bulleted</span>
                        </div>
                        <div className="flex-1 flex flex-col gap-1">
                            <p className="text-sm font-medium text-text-main">Research Bibliography</p>
                            <p className="text-xs text-text-muted leading-normal">Extract citations mentioned in footer notes.</p>
                        </div>
                        <button className="shrink-0 size-8 rounded-full bg-secondary-accent/20 text-secondary-accent flex items-center justify-center hover:bg-cta hover:text-white transition-colors">
                            <span className="material-symbols-outlined text-[18px]">add</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
