import React from 'react';

const DeadlineItem: React.FC<{
    month: string;
    day: string;
    title: string;
    subtitle: string;
    tag?: { label: string; colorClass: string; bgClass: string; ringClass: string };
    borderColorClass: string;
    dateColorClass: string;
}> = ({ month, day, title, subtitle, tag, borderColorClass, dateColorClass }) => (
    <div className={`flex items-start gap-4 p-4 bg-white border-l-4 ${borderColorClass} rounded-r-xl shadow-sm relative overflow-hidden`}>
        {tag?.label === "Due Today" && (
            <div className="absolute right-0 top-0 p-2 opacity-5">
                <span className="material-symbols-outlined text-6xl text-dynamic-error">warning</span>
            </div>
        )}
        <div className={`flex flex-col items-center justify-center min-w-[50px] ${dateColorClass}`}>
            <span className="text-xs font-bold uppercase tracking-wider">{month}</span>
            <span className="text-xl font-black">{day}</span>
        </div>
        <div className="flex flex-col gap-1 z-10">
            <div className="flex items-center gap-2">
                <h3 className="text-slate-900 font-bold">{title}</h3>
                {tag && (
                    <span className={`inline-flex items-center rounded-md ${tag.bgClass} px-2 py-1 text-xs font-bold ${tag.colorClass} ring-1 ring-inset ${tag.ringClass}`}>
                        {tag.label}
                    </span>
                )}
            </div>
            <p className="text-sm text-text-muted">{subtitle}</p>
        </div>
    </div>
);

export const UpcomingDeadlines: React.FC = () => {
    return (
        <div className="flex flex-col bg-neutral-card rounded-2xl border border-white shadow-soft overflow-hidden h-full card-hoverable">
            <div className="flex items-center justify-between px-6 py-5 border-b border-accent-nav/10 bg-white/30 backdrop-blur-sm">
                <h2 className="text-slate-800 text-lg font-bold tracking-tight">Upcoming Deadlines</h2>
                <button className="text-sm font-semibold text-accent-nav hover:text-slate-800">Calendar View</button>
            </div>
            <div className="flex flex-col p-4 gap-3">
                <DeadlineItem
                    month="OCT"
                    day="24"
                    title="Physics Lab Report"
                    subtitle="PHY101 • Lab Section B"
                    tag={{ label: "Due Today", colorClass: "text-red-700", bgClass: "bg-red-100", ringClass: "ring-red-600/10" }}
                    borderColorClass="border-dynamic-error"
                    dateColorClass="text-dynamic-error"
                />
                <DeadlineItem
                    month="OCT"
                    day="26"
                    title="Math Quiz"
                    subtitle="MAT200 • Chapter 4 & 5"
                    tag={{ label: "2 Days Left", colorClass: "text-yellow-800", bgClass: "bg-yellow-100", ringClass: "ring-yellow-600/20" }}
                    borderColorClass="border-dynamic-cta"
                    dateColorClass="text-dynamic-cta"
                />
                <DeadlineItem
                    month="OCT"
                    day="30"
                    title="English Literature Review"
                    subtitle="ENG105 • The Great Gatsby"
                    borderColorClass="border-accent-nav"
                    dateColorClass="text-accent-nav"
                />
            </div>
        </div>
    );
};
