import React from 'react';
import { Link } from 'react-router-dom';
import { useNotifications, useMarkNotificationRead, useMarkAllNotificationsRead } from '../hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';

export const NotificationsPage: React.FC = () => {
    const { data: notifications, isLoading } = useNotifications();
    const markRead = useMarkNotificationRead();
    const markAllRead = useMarkAllNotificationsRead();

    // Calculate unread count
    const unreadCount = notifications?.filter(n => !n.read).length || 0;

    const handleNotificationClick = (n: any) => {
        if (!n.read) {
            markRead.mutate(n.id);
        }
    };

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-custom-gold"></div></div>;
    }

    return (
        <div className="bg-neutral-bg text-text-main font-display min-h-screen flex flex-col justify-start items-center p-8">
            <div className="w-full max-w-3xl space-y-6">
                <div className="flex items-center justify-between mb-8 px-2">
                    <h1 className="text-2xl font-bold text-text-main">Notifications</h1>
                    <div className="flex items-center gap-4">
                        <span className="text-text-sub text-sm">{unreadCount} Unread</span>
                        {unreadCount > 0 && (
                            <button
                                onClick={() => markAllRead.mutate()}
                                className="text-sm text-custom-gold hover:underline"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>
                </div>

                {notifications && notifications.length > 0 ? (
                    notifications.map((n) => (
                        <div
                            key={n.id}
                            className={`group relative w-full overflow-hidden rounded-xl shadow-sm transition-all duration-300 hover:shadow-md border border-transparent 
                                ${n.read ? 'bg-white opacity-70' : 'bg-white border-custom-gold/20 shadow-md'}
                            `}
                            onClick={() => handleNotificationClick(n)}
                        >
                            {!n.read && <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-custom-gold"></div>}
                            <div className="flex flex-col sm:flex-row p-6 pl-8 gap-5 items-start sm:items-center">
                                <div className="flex-shrink-0">
                                    <div className={`flex h-12 w-12 items-center justify-center rounded-full 
                                        ${n.type === 'task_assigned' ? 'bg-custom-gold/10 text-custom-gold' : 'bg-gray-100 text-gray-500'}
                                    `}>
                                        <span className="material-symbols-outlined text-[28px]">
                                            {n.type === 'task_assigned' ? 'assignment_ind' : 'notifications'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        {!n.read && (
                                            <span className="inline-flex items-center rounded-full bg-custom-gold/10 px-2 py-0.5 text-xs font-medium text-custom-gold ring-1 ring-inset ring-custom-gold/20">
                                                New
                                            </span>
                                        )}
                                        <span className="text-xs text-text-sub flex items-center gap-1">
                                            {n.createdAt && formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                                        </span>
                                    </div>
                                    <h3 className={`text-lg font-bold leading-tight mb-2 truncate pr-4 ${n.read ? 'text-gray-600' : 'text-text-main'}`}>
                                        {n.title}
                                    </h3>
                                    <p className="text-sm text-text-sub mb-3">{n.message}</p>

                                    {n.data?.taskId && (
                                        <Link
                                            to={`/project/task/${n.data.taskId}`}
                                            className="inline-flex items-center gap-1 text-sm font-medium text-custom-gold hover:underline"
                                        >
                                            View Task <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12 text-gray-500">
                        <span className="material-symbols-outlined text-4xl mb-2 text-gray-300">notifications_off</span>
                        <p>No notifications yet</p>
                    </div>
                )}
            </div>
        </div>
    );
};
