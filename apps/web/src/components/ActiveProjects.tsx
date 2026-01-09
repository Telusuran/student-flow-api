import React from 'react';

const ProjectItem: React.FC<{
    title: string;
    code: string;
    percentage: number;
    icon: string;
    colorClass: string;
    bgClass: string;
    barColorClass: string;
}> = ({ title, code, percentage, icon, colorClass, bgClass, barColorClass }) => (
    <div className="flex items-center gap-4 p-4 hover:bg-neutral-bg rounded-xl transition-colors group cursor-pointer border border-transparent hover:border-accent-nav/20">
        <div className={`${bgClass} ${colorClass} p-3 rounded-xl shadow-sm`}>
            <span className="material-symbols-outlined">{icon}</span>
        </div>
        <div className="flex flex-col flex-1 gap-1">
            <div className="flex justify-between items-center">
                <h3 className="text-slate-800 font-bold">{title}</h3>
                <span className="text-xs font-semibold text-accent-nav bg-white px-2 py-1 rounded border border-accent-nav/10">{code}</span>
            </div>
            <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-neutral-bg rounded-full overflow-hidden">
                    <div className={`h-2 ${barColorClass} rounded-full`} style={{ width: `${percentage}%` }}></div>
                </div>
                <span className="text-xs font-bold text-accent-nav">{percentage}%</span>
            </div>
        </div>
    </div>
);

export const ActiveProjects: React.FC = () => {
    return (
        <div className="flex flex-col bg-neutral-card rounded-2xl border border-white shadow-soft overflow-hidden h-full card-hoverable">
            <div className="flex items-center justify-between px-6 py-5 border-b border-accent-nav/10 bg-white/30 backdrop-blur-sm">
                <h2 className="text-slate-800 text-lg font-bold tracking-tight">Active Projects</h2>
                <button className="text-sm font-semibold text-dynamic-cta hover:text-yellow-600 transition-colors">View All</button>
            </div>
            <div className="flex flex-col p-2 gap-2">
                <ProjectItem
                    title="Computer Science Final"
                    code="CS101"
                    percentage={80}
                    icon="terminal"
                    colorClass="text-blue-600"
                    bgClass="bg-blue-100"
                    barColorClass="bg-blue-500"
                />
                <ProjectItem
                    title="History Essay"
                    code="HIS200"
                    percentage={40}
                    icon="history_edu"
                    colorClass="text-orange-600"
                    bgClass="bg-orange-100"
                    barColorClass="bg-orange-500"
                />
                <ProjectItem
                    title="UX Case Study"
                    code="DES300"
                    percentage={10}
                    icon="design_services"
                    colorClass="text-purple-600"
                    bgClass="bg-purple-100"
                    barColorClass="bg-purple-500"
                />
            </div>
        </div>
    );
};
