export interface TaskCardProps {
    task: any;
    onClick: () => void;
    onStatusChange?: (id: string, newStatus: string) => void;
    showProjectBadge?: boolean;
    projectInfo?: { name: string; color: string };
}

export const TaskCard = ({ task, onClick, onStatusChange, showProjectBadge, projectInfo }: TaskCardProps) => {
    // Determine priority color
    const getPriorityColor = (priority: string | null) => {
        switch (priority) {
            case 'high':
                return 'text-red-500 bg-red-50';
            case 'medium':
                return 'text-amber-500 bg-amber-50';
            case 'low':
                return 'text-green-500 bg-green-50';
            default:
                return 'text-slate-500 bg-slate-50';
        }
    };

    return (
        <div
            onClick={onClick}
            className="group relative flex flex-col gap-3 p-4 bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md hover:border-custom-gold/30 transition-all cursor-pointer"
        >
            <div className="flex justify-between items-start gap-2">
                <h3 className="font-semibold text-slate-800 leading-tight line-clamp-2 group-hover:text-custom-gold transition-colors">
                    {task.title}
                </h3>
                <div className="flex items-center gap-2">
                    <span className={`flex-shrink-0 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getPriorityColor(task.priority)}`}>
                        {task.priority || 'NORMAL'}
                    </span>
                    {/* Status Actions */}
                    {onStatusChange && task.status !== 'done' && (
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onStatusChange(task.id, task.status === 'todo' ? 'in_progress' : 'done');
                                }}
                                className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-custom-gold"
                                title={task.status === 'todo' ? 'Start' : 'Complete'}
                            >
                                <span className="material-symbols-outlined text-[18px]">
                                    {task.status === 'todo' ? 'play_arrow' : 'check'}
                                </span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {showProjectBadge && projectInfo && (
                <div className="mb-0">
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md border inline-flex items-center gap-1 ${projectInfo.color ? `bg-${projectInfo.color}-100 text-${projectInfo.color}-700 border-${projectInfo.color}-200` : 'bg-gray-100 text-gray-700 border-gray-200'}`}>
                        <span className="material-symbols-outlined text-[12px]">folder</span>
                        {projectInfo.name}
                    </span>
                </div>
            )}

            {(task.description) && (
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {task.description}
                </p>
            )}

            <div className="flex items-center justify-between mt-1 pt-3 border-t border-slate-50">
                <div className="flex items-center gap-2">
                    {task.dueDate && (
                        <div className={`flex items-center gap-1 text-xs ${new Date(task.dueDate) < new Date() ? 'text-red-500 font-medium' : 'text-slate-400'}`}>
                            <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                            <span>{new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                        </div>
                    )}

                    {/* Attachments indicator */}
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                        <span className="material-symbols-outlined text-[14px]">attach_file</span>
                    </div>

                    {/* Comments indicator */}
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                        <span className="material-symbols-outlined text-[14px]">chat_bubble_outline</span>
                    </div>
                </div>

                <div className="flex -space-x-2">
                    <div className="size-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold border-2 border-white ring-1 ring-slate-100" title="Assignee">
                        {(task.createdBy?.charAt(0) || 'U')}
                    </div>
                </div>
            </div>

            {/* Hover actions */}
            <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600">
                    <span className="material-symbols-outlined text-base">more_horiz</span>
                </button>
            </div>
        </div>
    );
};
