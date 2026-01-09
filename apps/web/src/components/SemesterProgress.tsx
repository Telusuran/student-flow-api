import React from 'react';

export const SemesterProgress: React.FC = () => {
    return (
        <div className="bg-neutral-card rounded-2xl p-6 border border-white shadow-soft relative overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-dynamic-cta/5 rounded-full blur-2xl"></div>
            <div className="flex flex-col gap-4 relative z-10">
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-slate-800 text-lg font-bold leading-normal mb-1">Semester Completion</p>
                        <p className="text-text-muted text-sm">You're doing great! Keep up the momentum.</p>
                    </div>
                    <p className="text-dynamic-cta text-3xl font-black leading-normal drop-shadow-sm">65%</p>
                </div>
                <div className="relative w-full h-4 bg-neutral-bg rounded-full overflow-hidden shadow-inner">
                    <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 via-blue-200 to-dynamic-cta shadow-[0_0_10px_rgba(230,179,37,0.4)] transition-all duration-1000 ease-out rounded-full" style={{ width: '65%' }}>
                        <div className="absolute right-0 top-0 h-full w-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImEiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTTAgNDBMODAgMCIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjIiIGZpbGw9Im5vbmUiIG9wYWNpdHk9IjAuMiIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNhKSIvPjwvc3ZnPg==')] opacity-30"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};
