import React, { useState } from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { useSession, signOut } from '../lib/auth-client';

import { useNotifications } from '../hooks/useNotifications';

export const DashboardLayout: React.FC = () => {
    const navigate = useNavigate();
    const [isFocusMode, setIsFocusMode] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const { data: session } = useSession();
    const user = session?.user;

    const { data: notifications } = useNotifications();
    const unreadCount = notifications?.filter(n => !n.read).length || 0;

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

    return (
        <div className={`relative flex h-screen w-full flex-col overflow-hidden font-display text-text-main antialiased selection:bg-dynamic-cta selection:text-white transition-colors duration-500 ${isFocusMode ? 'bg-fokus-dark' : 'bg-neutral-bg'}`}>
            {/* Header */}
            <header className={`flex items-center justify-between whitespace-nowrap border-b px-6 py-3 z-20 shadow-sm transition-colors duration-500 ${isFocusMode ? 'bg-fokus-dark border-white/5' : 'bg-neutral-card border-accent-nav/20'}`}>
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-3 text-text-main">
                        <div className={`size-8 flex items-center justify-center ${isFocusMode ? 'text-white' : 'text-dynamic-cta'}`}>
                            <span className="material-symbols-outlined text-3xl">local_florist</span>
                        </div>
                        <h2 className={`text-lg font-bold leading-tight tracking-[-0.015em] ${isFocusMode ? 'text-white' : 'text-slate-800'}`}>StudentFlow</h2>
                    </div>
                    {!isFocusMode && (
                        <label className="hidden md:flex flex-col min-w-40 !h-10 max-w-64 secondary-header-elements">
                            <div className="flex w-full flex-1 items-stretch rounded-xl h-full bg-neutral-bg focus-within:ring-2 ring-dynamic-cta/50 transition-all border border-transparent hover:border-accent-nav/30">
                                <div className="text-accent-nav flex border-none items-center justify-center pl-4 rounded-l-lg border-r-0">
                                    <span className="material-symbols-outlined">search</span>
                                </div>
                                <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl bg-transparent text-text-main focus:outline-0 focus:ring-0 border-none h-full placeholder:text-accent-nav px-4 rounded-l-none border-l-0 pl-2 text-sm font-normal leading-normal" placeholder="Search projects..." />
                            </div>
                        </label>
                    )}
                </div>
                <div className="flex flex-1 justify-end gap-6 items-center">
                    <div className="flex items-center gap-2 mr-2">
                        <span className={`text-xs font-semibold transition-colors ${isFocusMode ? 'text-dynamic-cta font-bold shadow-glow drop-shadow-[0_0_10px_rgba(230,179,37,0.3)]' : 'text-accent-nav'}`}>Fokus Mode</span>
                        <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                            <input
                                className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer border-gray-300 left-0 transition-all duration-300 top-0 checked:translate-x-full checked:border-dynamic-cta"
                                id="toggle"
                                name="toggle"
                                type="checkbox"
                                checked={isFocusMode}
                                onChange={(e) => setIsFocusMode(e.target.checked)}
                            />
                            <label
                                className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer transition-colors duration-300 ${isFocusMode ? 'bg-dynamic-cta' : 'bg-gray-300'}`}
                                htmlFor="toggle"
                            ></label>
                        </div>
                    </div>
                    {!isFocusMode && (
                        <>
                            <Link to="/notifications" className="flex items-center justify-center text-accent-nav hover:text-dynamic-cta transition-colors relative notification-trigger">
                                <span className="material-symbols-outlined">notifications</span>
                                {unreadCount > 0 && (
                                    <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-dynamic-error text-[10px] text-white border border-neutral-card">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </Link>
                            <Link to="/create-project" className="hidden sm:flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-9 px-4 bg-dynamic-cta text-white text-sm font-bold leading-normal tracking-[0.015em] hover:brightness-110 transition-all shadow-glow hover:translate-y-[-1px] secondary-header-elements">
                                <span className="truncate">Create New</span>
                            </Link>
                            <Link to="/settings/account" className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-dynamic-cta/30 shadow-sm secondary-header-elements" data-alt="User profile avatar image" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD0oW4gh5khJP6XabfjYdoTNNFt9SmW2Z--RqnvG9uaMJcHr8rtIMEtr4IB2a91L6WS_MPbUpwT09c2YdPuzgdCTVMAz-nQ9TGwDYFT5TbArNsIhsvaRxVGWAMAqMNPNyjXSkI8JTy-UBeHXkGdndEmjyV4CBoG_1RDBA-sya1KP-ZK3_PBfa7fKbAnQF4StYYZv5X4BEhL9tygw2L7E06e-ZiJG5Cl7i9o83Lw0NpQmtBQUP9STFu5uDX6wJgByfGHE4vHJOgzjZer')" }}></Link>
                        </>
                    )}
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                {!isFocusMode && (
                    <aside className="hidden lg:flex w-64 flex-col border-r border-accent-nav/20 bg-neutral-card p-4 gap-4 z-10 relative transition-all duration-300">
                        <div className="flex flex-col gap-4">
                            <div className="flex gap-3 items-center px-2 py-2 mb-2 bg-neutral-bg/50 rounded-xl border border-white/50">
                                <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12 border border-accent-nav/30" data-alt="User profile avatar large" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDl47BeNfjhcx6ewJNIBEuvfiXkF5hOkdcAxLw-_pUL-88C02ZPzPCFORi7CfY92h2_uV307m0zb1j9qkeYacesDxEvBiLApsqlk_Nm6mPKG4TyCmQunpCbP-6i41CRho4JJrIfKzT58EdxGs1RCBh4Fw8iBqarBFwRD8SMiW-VJg1FWXq2x-x6CvaZUnvkvvScGr4J_DtwECpE3sll1AHehhNho0gqYyIn5vfCwfmFczfW-OFNeKRZxWY0JoZoTAO5WIiOlQsy8vHg')" }}></div>
                                <div className="flex flex-col">
                                    <h1 className="text-text-main text-base font-bold leading-normal">{user?.name || 'Guest'}</h1>
                                    <p className="text-accent-nav text-xs font-medium leading-normal">{user?.email || 'Not logged in'}</p>
                                </div>
                            </div>
                            <nav className="flex flex-col gap-2">
                                <NavLink
                                    to="/"
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
                        <div className="mt-auto relative">
                            <div className="absolute bottom-[-20px] right-[-20px] opacity-20 pointer-events-none">
                                <svg className="text-accent-nav" fill="currentColor" height="120" viewBox="0 0 24 24" width="120">
                                    <path d="M12,22 C12,22 4,16 4,10 C4,5 8,2 12,2 C16,2 20,5 20,10 C20,16 12,22 12,22 Z M12,22 C12,22 14,16 14,12 C14,12 16,10 18,10 C20,10 22,12 22,12" fill="none" stroke="currentColor" strokeWidth="0.5"></path>
                                    <path d="M12,22 V12" stroke="currentColor" strokeWidth="1"></path>
                                    <path d="M12,16 C12,16 9,14 7,14" stroke="currentColor" strokeWidth="1"></path>
                                </svg>
                            </div>
                            <div className="rounded-2xl bg-[#E8E8D8] p-4 border border-accent-nav/10 shadow-inner relative z-10">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-slate-700 text-sm font-medium">Storage</span>
                                    <span className="text-dynamic-cta text-xs font-bold">75%</span>
                                </div>
                                <div className="w-full bg-white rounded-full h-2 mb-2">
                                    <div className="bg-gradient-to-r from-accent-nav to-dynamic-cta h-2 rounded-full" style={{ width: '75%' }}></div>
                                </div>
                                <p className="text-xs text-text-muted">15GB used of 20GB</p>
                            </div>
                        </div>
                    </aside>
                )}

                {/* Main Content Area */}
                <main className={`flex-1 overflow-y-auto ${isFocusMode ? 'p-0' : ''} scrollbar-hide relative transition-all duration-500`}>
                    <Outlet context={{ isFocusMode }} />
                </main>
            </div>
        </div>
    );
};

