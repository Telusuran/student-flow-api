import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ViewSwitcherProps {
    projectId: string;
    currentView: 'board' | 'calendar' | 'gantt';
}

export const ViewSwitcher: React.FC<ViewSwitcherProps> = ({ projectId, currentView }) => {
    const navigate = useNavigate();

    // Helper to navigate with projectId param preservation
    const switchView = (view: 'board' | 'calendar' | 'gantt') => {
        if (view === currentView) return;

        const params = new URLSearchParams();
        if (projectId) params.set('projectId', projectId);

        switch (view) {
            case 'board':
                navigate(`/project?projectId=${projectId}`);
                break;
            case 'calendar':
                navigate(`/calendar?projectId=${projectId}`);
                break;
            case 'gantt':
                navigate(`/project/space?projectId=${projectId}`);
                break;
        }
    };

    return (
        <div className="flex items-center gap-1 bg-white dark:bg-neutral-800 p-1 rounded-lg border border-gray-200 dark:border-neutral-700 shadow-sm">
            <button
                onClick={() => switchView('board')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-bold transition-all ${currentView === 'board'
                    ? 'bg-primary/10 text-primary dark:bg-primary/20'
                    : 'text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-neutral-700'
                    }`}
                title="Kanban Board"
            >
                <span className="material-symbols-outlined text-[18px]">view_kanban</span>
                <span className="hidden sm:inline">Board</span>
            </button>
            <button
                onClick={() => switchView('calendar')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-bold transition-all ${currentView === 'calendar'
                    ? 'bg-primary/10 text-primary dark:bg-primary/20'
                    : 'text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-neutral-700'
                    }`}
                title="Calendar View"
            >
                <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                <span className="hidden sm:inline">Calendar</span>
            </button>
            <button
                onClick={() => switchView('gantt')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-bold transition-all ${currentView === 'gantt'
                    ? 'bg-primary/10 text-primary dark:bg-primary/20'
                    : 'text-gray-500 hover:bg-gray-50 dark:text-gray-400 dark:hover:bg-neutral-700'
                    }`}
                title="Gantt Chart"
            >
                <span className="material-symbols-outlined text-[18px]">waterfall_chart</span>
                <span className="hidden sm:inline">Timeline</span>
            </button>
        </div>
    );
};
