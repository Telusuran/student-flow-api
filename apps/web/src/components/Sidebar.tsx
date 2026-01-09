import React from 'react';
import { NavLink } from 'react-router-dom';

export const Sidebar: React.FC = () => {
    // Get last selected project from localStorage for navigation
    const getProjectUrl = () => {
        const lastProject = localStorage.getItem('studentflow_last_project');
        return lastProject ? `/project?projectId=${lastProject}` : '/project';
    };

    return (
        <div className="hidden md:flex flex-col w-20 border-r border-secondary-accent/20 bg-surface items-center py-6 gap-8 z-30 shadow-soft">
            <div className="size-10 rounded-xl bg-cta flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-cta/30">
                P
            </div>
            <div className="flex flex-col gap-6 w-full items-center">
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        `p-3 rounded-xl transition-colors ${isActive ? 'bg-neutral-bg text-cta' : 'text-secondary-accent hover:bg-neutral-bg hover:text-cta'}`
                    }
                >
                    <span className="material-symbols-outlined text-[28px]">home</span>
                </NavLink>
                <NavLink
                    to={getProjectUrl()}
                    className={({ isActive }) =>
                        `p-3 rounded-xl border transition-colors ${isActive ? 'bg-secondary-accent/10 text-secondary-accent border-secondary-accent/20' : 'text-secondary-accent border-transparent hover:bg-neutral-bg hover:text-cta'}`
                    }
                >
                    <span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>folder_open</span>
                </NavLink>

                <NavLink
                    to="/data-insight"
                    className={({ isActive }) =>
                        `p-3 rounded-xl transition-colors ${isActive ? 'bg-neutral-bg text-cta' : 'text-secondary-accent hover:bg-neutral-bg hover:text-cta'}`
                    }
                >
                    <span className="material-symbols-outlined text-[28px]">analytics</span>
                </NavLink>
                <NavLink
                    to="/calendar"
                    className={({ isActive }) =>
                        `p-3 rounded-xl transition-colors ${isActive ? 'bg-neutral-bg text-cta' : 'text-secondary-accent hover:bg-neutral-bg hover:text-cta'}`
                    }
                >
                    <span className="material-symbols-outlined text-[28px]">calendar_month</span>
                </NavLink>
                <NavLink
                    to="/project/messages"
                    className={({ isActive }) =>
                        `p-3 rounded-xl transition-colors ${isActive ? 'bg-neutral-bg text-cta' : 'text-secondary-accent hover:bg-neutral-bg hover:text-cta'}`
                    }
                >
                    <span className="material-symbols-outlined text-[28px]">chat_bubble</span>
                </NavLink>
            </div>
            <div className="mt-auto flex flex-col gap-6 w-full items-center">
                <NavLink
                    to="/settings/account"
                    className={({ isActive }) =>
                        `p-3 rounded-xl transition-colors ${isActive ? 'bg-neutral-bg text-cta' : 'text-secondary-accent hover:bg-neutral-bg hover:text-cta'}`
                    }
                >
                    <span className="material-symbols-outlined text-[28px]">settings</span>
                </NavLink>
                <div
                    className="size-10 rounded-full bg-cover bg-center border-2 border-secondary-accent/30"
                    style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCdvf6TiSyGZVY1h1l3i9ZawNjZsNopDX9obIIL7RPnvnX-K0z9ZxEcZOcfgrZopGW4gy52MUkmSe6nWRT8Mm2IAwXFxS0tftUC_Fh-QSkEj59GjqSMNGAlHbTIeqz2mq04YA2WmuZbQgELNYF4Ie_84uqtsNKgnUe0VB1vTsuC7Gwi_WZecJt5wCWULSbjdRXJhndorch6x0-b-vWqIXZRl-sVKCYuOwUncRUI35cbWmDMyc5dvASw4ZJ0fOIJiDKtOjZQO7qztFpu')" }}
                ></div>
            </div>
        </div>
    );
};
