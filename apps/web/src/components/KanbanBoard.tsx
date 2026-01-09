import React from 'react';

export const KanbanBoard: React.FC = () => {
    return (
        <div className="flex-1 overflow-x-auto overflow-y-hidden relative">
            <div className="fixed bottom-0 right-0 pointer-events-none z-0 opacity-40 mix-blend-multiply">
                <svg fill="none" height="250" viewBox="0 0 200 200" width="250" xmlns="http://www.w3.org/2000/svg">
                    <path d="M60 140 L50 110 L150 110 L140 140 C140 160 120 180 100 180 C80 180 60 160 60 140 Z" fill="#8A9A8A" fillOpacity="0.3"></path>
                    <rect fill="#8A9A8A" fillOpacity="0.5" height="15" rx="2" width="110" x="45" y="100"></rect>
                    <path d="M100 110 Q90 60 50 70 Q80 100 100 110" fill="#E6B325" fillOpacity="0.2"></path>
                    <path d="M100 110 Q110 50 150 40 Q130 90 100 110" fill="#8A9A8A" fillOpacity="0.4"></path>
                    <path d="M100 110 Q95 40 70 20 Q90 70 100 110" fill="#8A9A8A" fillOpacity="0.3"></path>
                    <path d="M100 110 Q120 70 160 90 Q120 100 100 110" fill="#E6B325" fillOpacity="0.1"></path>
                    <path d="M100 110 L100 90" stroke="#8A9A8A" strokeWidth="2"></path>
                </svg>
            </div>
            <div className="h-full p-6 min-w-[900px] max-w-[1400px] mx-auto grid grid-cols-3 gap-6 relative z-10">
                {/* To Do Column */}
                <div className="flex flex-col h-full rounded-2xl bg-white/40 border border-white/60 shadow-sm backdrop-blur-sm">
                    <div className="flex items-center justify-between p-4 pb-2">
                        <div className="flex items-center gap-2">
                            <div className="size-2 rounded-full bg-secondary-accent"></div>
                            <h2 className="text-xs font-bold uppercase tracking-wider text-text-muted">To Do</h2>
                            <span className="bg-secondary-accent/20 text-secondary-accent text-[10px] font-bold px-1.5 py-0.5 rounded">3</span>
                        </div>
                        <button className="text-secondary-accent hover:text-cta transition-colors">
                            <span className="material-symbols-outlined text-[20px]">more_horiz</span>
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
                        <div className="group bg-neutral-card p-4 rounded-xl shadow-card border border-transparent hover:border-cta/50 cursor-pointer transition-all hover:-translate-y-1">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-bold text-secondary-accent bg-secondary-accent/10 px-2 py-0.5 rounded">Research</span>
                                <button className="opacity-0 group-hover:opacity-100 text-secondary-accent hover:text-cta transition-opacity">
                                    <span className="material-symbols-outlined text-[18px]">edit</span>
                                </button>
                            </div>
                            <p className="text-sm font-medium text-text-main mb-3 leading-relaxed">Find primary sources for 19th century industrialization</p>
                            <div className="flex items-center justify-between mt-auto">
                                <div className="flex -space-x-2">
                                    <div
                                        className="size-6 rounded-full border-2 border-neutral-card bg-cover bg-center"
                                        style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDuf4YbLi6ADewAuCS5uarV4gVdchYwkSUYvDRRf7RO_XIVjuDnJgrBSgAPQ28xbNzualPJcZDPsB4jHpK-kr9qMoX-6wTRnGwUzHHwzq-1PWy8InLwR9AnRhk-WfUfqfQOfMJ-iwvq2YREo9jDWjM4pZlgbNeAj5t8_SwiNid3BnAOrpr0C8Sv8AqMpe9j1gOC3gOB4IvXHbNcvqbVzR1uV5cRqX0Q9lbNhHK6Agh41XZD0wC65b2DwYGfZ2sWV-yv5HJ8Tqj0bYG3')" }}
                                    ></div>
                                </div>
                                <div className="flex items-center gap-1 text-secondary-accent text-xs">
                                    <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                                    <span>Oct 24</span>
                                </div>
                            </div>
                        </div>
                        <div className="group bg-neutral-card p-4 rounded-xl shadow-card border border-transparent hover:border-cta/50 cursor-pointer transition-all hover:-translate-y-1">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-bold text-secondary-accent bg-secondary-accent/10 px-2 py-0.5 rounded">Outline</span>
                            </div>
                            <p className="text-sm font-medium text-text-main mb-3 leading-relaxed">Structure Chapter 1 arguments</p>
                            <div className="flex items-center justify-between mt-auto">
                                <div className="flex -space-x-2">
                                    <div className="size-6 rounded-full border-2 border-neutral-card bg-secondary-accent flex items-center justify-center text-[8px] font-bold text-white">ME</div>
                                </div>
                                <div className="flex items-center gap-1 text-secondary-accent text-xs">
                                    <span className="material-symbols-outlined text-[14px]">flag</span>
                                </div>
                            </div>
                        </div>
                        <button className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/50 text-secondary-accent text-sm transition-colors mt-2">
                            <span className="material-symbols-outlined text-[18px]">add</span>
                            <span>Add Task</span>
                        </button>
                    </div>
                </div>

                {/* In Progress Column */}
                <div className="flex flex-col h-full rounded-2xl bg-white/40 border border-white/60 shadow-sm backdrop-blur-sm">
                    <div className="flex items-center justify-between p-4 pb-2">
                        <div className="flex items-center gap-2">
                            <div className="size-2 rounded-full bg-cta shadow-[0_0_8px_rgba(230,179,37,0.6)]"></div>
                            <h2 className="text-xs font-bold uppercase tracking-wider text-text-muted">In Progress</h2>
                            <span className="bg-cta/20 text-cta text-[10px] font-bold px-1.5 py-0.5 rounded">1</span>
                        </div>
                        <button className="text-secondary-accent hover:text-cta transition-colors">
                            <span className="material-symbols-outlined text-[20px]">more_horiz</span>
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
                        <div className="group bg-neutral-card p-4 rounded-xl shadow-card border-l-4 border-l-cta border-y-transparent border-r-transparent hover:shadow-md cursor-pointer transition-all">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-bold text-cta bg-cta/10 px-2 py-0.5 rounded">Reading</span>
                            </div>
                            <p className="text-sm font-medium text-text-main mb-3 leading-relaxed">Read textbook summary on "The Great Shift"</p>
                            <div className="w-full bg-white h-1.5 rounded-full mb-3 overflow-hidden border border-secondary-accent/10">
                                <div className="bg-cta h-full w-2/3"></div>
                            </div>
                            <div className="flex items-center justify-between mt-auto">
                                <div className="flex -space-x-2">
                                    <div
                                        className="size-6 rounded-full border-2 border-neutral-card bg-cover bg-center"
                                        style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDTYTV6hZ2tKuIh6VwaHqLY3-hOZ94E6nIT0wt6wspV3opIhYICeNKqjFovGtncFgJvUew6emj7S5Oq9Gx3sdGpkG6tJN0j_NzwQLFbBkH-T0MwTcn14dCfmeFYbfsAwOolI_vLERUG_0wEG8xpXRCuUSZveE3IFhnT6OvmmpLhIOKHxLiEG1Doz7KU1-jNGMy0LVIVbOF6rv431DvxS1autL8vvImyLJgV-ozuFUq3Xi0vuvSq2UaFs4hg26Q-6g4Jtbl8lIbo-3kc')" }}
                                    ></div>
                                </div>
                                <div className="flex items-center gap-1 text-cta text-xs font-bold">
                                    <span className="material-symbols-outlined text-[14px]">schedule</span>
                                    <span>2 days left</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Done Column */}
                <div className="flex flex-col h-full rounded-2xl bg-white/40 border border-white/60 shadow-sm backdrop-blur-sm opacity-90">
                    <div className="flex items-center justify-between p-4 pb-2">
                        <div className="flex items-center gap-2">
                            <div className="size-2 rounded-full bg-secondary-accent"></div>
                            <h2 className="text-xs font-bold uppercase tracking-wider text-text-muted">Done</h2>
                            <span className="bg-secondary-accent/20 text-secondary-accent text-[10px] font-bold px-1.5 py-0.5 rounded">4</span>
                        </div>
                        <button className="text-secondary-accent hover:text-cta transition-colors">
                            <span className="material-symbols-outlined text-[20px]">more_horiz</span>
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
                        <div className="group bg-neutral-card/60 p-4 rounded-xl shadow-none border border-secondary-accent/10 cursor-default hover:bg-neutral-card transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-bold text-text-muted bg-gray-200 px-2 py-0.5 rounded">Admin</span>
                                <span className="material-symbols-outlined text-secondary-accent text-[18px]">check_circle</span>
                            </div>
                            <p className="text-sm font-medium text-text-muted line-through mb-3">Select final topic</p>
                        </div>
                        <div className="group bg-neutral-card/60 p-4 rounded-xl shadow-none border border-secondary-accent/10 cursor-default hover:bg-neutral-card transition-colors">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-bold text-text-muted bg-gray-200 px-2 py-0.5 rounded">Setup</span>
                                <span className="material-symbols-outlined text-secondary-accent text-[18px]">check_circle</span>
                            </div>
                            <p className="text-sm font-medium text-text-muted line-through mb-3">Create project folder</p>
                            <div className="flex justify-end">
                                <button className="text-error opacity-0 group-hover:opacity-100 transition-opacity text-xs flex items-center gap-1 hover:underline">
                                    <span className="material-symbols-outlined text-[14px]">delete</span> Remove
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
