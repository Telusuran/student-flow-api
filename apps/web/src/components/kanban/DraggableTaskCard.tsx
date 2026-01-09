import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { TaskCard } from './TaskCard'; // Assuming TaskCard is exported individually or I need to extract it

interface DraggableTaskCardProps {
    task: any;
    onClick: () => void;
    onStatusChange?: (id: string, newStatus: string) => void;
    showProjectBadge?: boolean;
    projectInfo?: { name: string; color: string };
}

export const DraggableTaskCard: React.FC<DraggableTaskCardProps> = ({ task, onClick, onStatusChange, showProjectBadge, projectInfo }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: task.id,
        data: { task },
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : 1,
        touchAction: 'none',
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <TaskCard
                task={task}
                onClick={onClick}
                onStatusChange={onStatusChange}
                showProjectBadge={showProjectBadge}
                projectInfo={projectInfo}
            />
        </div>
    );
};
