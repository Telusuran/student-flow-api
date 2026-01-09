import React from 'react';

const ActionButton: React.FC<{ icon: string; label: string }> = ({ icon, label }) => (
    <button className="flex flex-col items-center justify-center gap-2 p-4 bg-neutral-card rounded-2xl border border-white shadow-soft hover:border-dynamic-cta/50 hover:shadow-glow transition-all group">
        <div className="p-3 rounded-full bg-neutral-bg text-slate-800 group-hover:bg-dynamic-cta group-hover:text-white transition-colors shadow-sm">
            <span className="material-symbols-outlined">{icon}</span>
        </div>
        <span className="text-sm font-semibold text-slate-700">{label}</span>
    </button>
);

export const QuickActions: React.FC = () => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <ActionButton icon="add_task" label="Add Task" />
            <ActionButton icon="upload_file" label="Upload File" />
            <ActionButton icon="group_add" label="Join Group" />
            <ActionButton icon="schedule" label="Book Slot" />
        </div>
    );
};
