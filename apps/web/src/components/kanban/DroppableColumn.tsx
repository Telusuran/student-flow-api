import React from 'react';
import { useDroppable } from '@dnd-kit/core';

interface DroppableColumnProps {
    id: string;
    children: React.ReactNode;
    className?: string;
}

export const DroppableColumn: React.FC<DroppableColumnProps> = ({ id, children, className }) => {
    const { setNodeRef, isOver } = useDroppable({
        id: id,
    });

    return (
        <div
            ref={setNodeRef}
            className={`${className} transition-colors ${isOver ? 'bg-slate-100 ring-2 ring-custom-gold/20' : ''}`}
        >
            {children}
        </div>
    );
};
