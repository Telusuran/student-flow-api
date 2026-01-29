import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSession, signOut } from '../lib/auth-client';

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const navigate = useNavigate();
    const { data: session } = useSession();
    const user = session?.user;
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        setIsLoggingOut(true);
        try {
            await signOut();
            navigate('/login');
        } catch (err) {
            console.error('Logout failed:', err);
        } finally {
            setIsLoggingOut(false);
        }
    };

    // Overlay for mobile
    const overlayClasses = isOpen
        ? 'fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 opacity-100 lg:hidden'
        : 'fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 opacity-0 pointer-events-none lg:hidden';

    // Sidebar classes
    const sidebarClasses = `
        flex flex-col border-r border-accent-nav/20 bg-sidebar-blue p-4 gap-4 z-50 
        transition-transform duration-300 ease-in-out
        w-64 h-full
        lg:translate-x-0 lg:static lg:flex
        fixed top-0 left-0
        ${isOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full'}
    `;

    return (
        <>
            {/* Mobile Overlay */}
            <div className={overlayClasses} onClick={onClose} aria-hidden="true" />

            <aside className={sidebarClasses}>
                <div className="flex flex-col gap-4">
                    {/* User Profile */}
                    <div className="flex gap-3 items-center p-2 mb-2 bg-[#E6F0FA]/50 rounded-xl border border-white/50 shadow-[0px_1px_2px_rgba(0,0,0,0.05)]">
                        <div
                            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12 border border-secondary-accent/30"
                            data-alt="User profile avatar large"
                            style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDl47BeNfjhcx6ewJNIBEuvfiXkF5hOkdcAxLw-_pUL-88C02ZPzPCFORi7CfY92h2_uV307m0zb1j9qkeYacesDxEvBiLApsqlk_Nm6mPKG4TyCmQunpCbP-6i41CRho4JJrIfKzT58EdxGs1RCBh4Fw8iBqarBFwRD8SMiW-VJg1FWXq2x-x6CvaZUnvkvvScGr4J_DtwECpE3sll1AHehhNho0gqYyIn5vfCwfmFczfW-OFNeKRZxWY0JoZoTAO5WIiOlQsy8vHg')" }}
                        ></div>
                        <div className="flex flex-col overflow-hidden">
                            <h1 className="text-text-main text-base font-bold leading-normal truncate">{user?.name || 'Romi'}</h1>
                            <p className="text-secondary-accent text-xs font-medium leading-normal truncate">{user?.email || 'romiiii@gmail.com'}</p>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex flex-col gap-2">
                        <NavLink
                            to="/"
                            onClick={onClose}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${isActive
                                    ? 'bg-accent-nav/15 text-slate-800 border-l-4 border-accent-nav shadow-sm'
                                    : 'text-text-muted hover:bg-neutral-bg hover:text-dynamic-cta group'
                                }`
                            }
                        >
                            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>dashboard</span>
                            <p className="text-sm font-semibold leading-normal">Dashboard</p>
                        </NavLink>
                        <NavLink
                            to="/project"
                            onClick={onClose}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${isActive
                                    ? 'bg-accent-nav/15 text-slate-800 border-l-4 border-accent-nav shadow-sm'
                                    : 'text-text-muted hover:bg-neutral-bg hover:text-dynamic-cta group'
                                }`
                            }
                        >
                            <span className="material-symbols-outlined group-hover:scale-110 transition-transform">folder</span>
                            <p className="text-sm font-medium leading-normal">Projects</p>
                        </NavLink>
                        <NavLink
                            to="/project/messages"
                            onClick={onClose}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${isActive
                                    ? 'bg-accent-nav/15 text-slate-800 border-l-4 border-accent-nav shadow-sm'
                                    : 'text-text-muted hover:bg-neutral-bg hover:text-dynamic-cta group'
                                }`
                            }
                        >
                            <span className="material-symbols-outlined group-hover:scale-110 transition-transform">chat_bubble</span>
                            <p className="text-sm font-medium leading-normal">Messages</p>
                        </NavLink>
                        <NavLink
                            to="/calendar"
                            onClick={onClose}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${isActive
                                    ? 'bg-accent-nav/15 text-slate-800 border-l-4 border-accent-nav shadow-sm'
                                    : 'text-text-muted hover:bg-neutral-bg hover:text-dynamic-cta group'
                                }`
                            }
                        >
                            <span className="material-symbols-outlined group-hover:scale-110 transition-transform">calendar_month</span>
                            <p className="text-sm font-medium leading-normal">Calendar</p>
                        </NavLink>
                        <NavLink
                            to="/data-insight"
                            onClick={onClose}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${isActive
                                    ? 'bg-accent-nav/15 text-slate-800 border-l-4 border-accent-nav shadow-sm'
                                    : 'text-text-muted hover:bg-neutral-bg hover:text-dynamic-cta group'
                                }`
                            }
                        >
                            <span className="material-symbols-outlined group-hover:scale-110 transition-transform">insights</span>
                            <p className="text-sm font-medium leading-normal">Data Insight</p>
                        </NavLink>
                        <NavLink
                            to="/ai/analyze"
                            onClick={onClose}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${isActive
                                    ? 'bg-purple-100 text-purple-800 border-l-4 border-purple-500 shadow-sm'
                                    : 'text-text-muted hover:bg-purple-50 hover:text-purple-600 group'
                                }`
                            }
                        >
                            <span className="material-symbols-outlined group-hover:scale-110 transition-transform">auto_awesome</span>
                            <p className="text-sm font-medium leading-normal">AI Analyzer</p>
                        </NavLink>
                        <NavLink
                            to="/settings/account"
                            onClick={onClose}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${isActive
                                    ? 'bg-accent-nav/15 text-slate-800 border-l-4 border-accent-nav shadow-sm'
                                    : 'text-text-muted hover:bg-neutral-bg hover:text-dynamic-cta group'
                                }`
                            }
                        >
                            <span className="material-symbols-outlined group-hover:scale-110 transition-transform">settings</span>
                            <p className="text-sm font-medium leading-normal">Settings</p>
                        </NavLink>
                        <button
                            onClick={handleLogout}
                            disabled={isLoggingOut}
                            className="flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-text-muted hover:bg-red-50 hover:text-red-600 group w-full text-left"
                        >
                            <span className="material-symbols-outlined group-hover:scale-110 transition-transform">logout</span>
                            <p className="text-sm font-medium leading-normal">{isLoggingOut ? 'Logging out...' : 'Logout'}</p>
                        </button>
                    </nav>
                </div>

                {/* Storage Info */}
                <div className="mt-auto relative">
                    <div className="absolute bottom-[-20px] right-[-20px] opacity-20 pointer-events-none">
                        <svg className="text-accent-nav" fill="currentColor" height="120" viewBox="0 0 24 24" width="120">
                            <path d="M12,22 C12,22 4,16 4,10 C4,5 8,2 12,2 C16,2 20,5 20,10 C20,16 12,22 12,22 Z M12,22 C12,22 14,16 14,12 C14,12 16,10 18,10 C20,10 22,12 22,12" fill="none" stroke="currentColor" strokeWidth="0.5"></path>
                            <path d="M12,22 V12" stroke="currentColor" strokeWidth="1"></path>
                            <path d="M12,16 C12,16 9,14 7,14" stroke="currentColor" strokeWidth="1"></path>
                        </svg>
                    </div>
                    <div className="rounded-2xl bg-white p-4 border border-secondary-accent/10 shadow-[0px_2px_4px_1px_rgba(0,0,0,0.05)_inset] relative z-10 transition-transform hover:translate-y-[-2px]">
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-slate-700 text-sm font-medium">Storage</span>
                            <span className="text-dynamic-cta text-xs font-bold">75%</span>
                        </div>
                        <div className="w-full bg-neutral-100 rounded-full h-2 mb-2">
                            <div className="bg-gradient-to-r from-secondary-accent to-dynamic-cta h-2 rounded-full" style={{ width: '75%' }}></div>
                        </div>
                        <p className="text-xs text-text-main">15GB used of 20GB</p>
                    </div>
                </div>
            </aside>
        </>
    );
};
