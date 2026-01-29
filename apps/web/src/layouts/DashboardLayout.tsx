import React, { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';

import { Sidebar } from '../components/Sidebar';

import { useNotifications } from '../hooks/useNotifications';

export const DashboardLayout: React.FC = () => {
    const [isFocusMode, setIsFocusMode] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu



    const { data: notifications } = useNotifications();
    const unreadCount = notifications?.filter(n => !n.read).length || 0;

    return (
        <div className={`relative flex h-screen w-full flex-col overflow-hidden font-display text-text-main antialiased selection:bg-dynamic-cta selection:text-white transition-colors duration-500 ${isFocusMode ? 'bg-fokus-dark' : 'bg-neutral-bg'}`}>
            {/* Header */}
            <header className={`flex items-center justify-between whitespace-nowrap border-b px-6 py-3 z-30 shadow-sm transition-colors duration-500 ${isFocusMode ? 'bg-fokus-dark border-white/5' : 'bg-header-dark border-white/10'}`}>
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-3 text-text-main">
                        {/* Hamburger Menu (Mobile Only) */}
                        {!isFocusMode && (
                            <button
                                onClick={() => setIsMobileMenuOpen(true)}
                                className="lg:hidden p-1 rounded-lg hover:bg-neutral-bg text-text-main transition-colors"
                            >
                                <span className="material-symbols-outlined text-2xl">menu</span>
                            </button>
                        )}

                        <div className={`size-8 flex items-center justify-center ${isFocusMode ? 'text-white' : 'text-dynamic-cta'}`}>
                            <span className="material-symbols-outlined text-3xl">local_florist</span>
                        </div>
                        <h2 className={`text-lg font-bold leading-tight tracking-[-0.015em] ${isFocusMode ? 'text-white' : 'text-[#D0D0D0]'}`}>StudentFlow</h2>
                    </div>
                    {!isFocusMode && (
                        <label className="hidden md:flex flex-col min-w-40 !h-10 max-w-64 secondary-header-elements">
                            <div className="flex w-full flex-1 items-stretch rounded-xl h-full bg-neutral-bg focus-within:ring-2 ring-dynamic-cta/50 transition-all border border-transparent hover:border-accent-nav/30">
                                <div className="text-secondary-accent flex border-none items-center justify-center pl-4 rounded-l-lg border-r-0">
                                    <span className="material-symbols-outlined">search</span>
                                </div>
                                <input className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl bg-transparent text-text-main focus:outline-0 focus:ring-0 border-none h-full placeholder:text-secondary-accent px-4 rounded-l-none border-l-0 pl-2 text-sm font-normal leading-normal" placeholder="Search projects..." />
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
                            <Link to="/create-project" className="hidden sm:flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-9 px-4 bg-[#0C0C0C] text-white text-sm font-bold leading-normal tracking-[0.015em] hover:brightness-125 transition-all shadow-[0px_0px_20px_rgba(37,127,230,0.30)] hover:translate-y-[-1px] secondary-header-elements">
                                <span className="truncate">Create New</span>
                            </Link>
                            <Link to="/settings/account" className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-dynamic-cta/30 shadow-sm secondary-header-elements" data-alt="User profile avatar image" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuD0oW4gh5khJP6XabfjYdoTNNFt9SmW2Z--RqnvG9uaMJcHr8rtIMEtr4IB2a91L6WS_MPbUpwT09c2YdPuzgdCTVMAz-nQ9TGwDYFT5TbArNsIhsvaRxVGWAMAqMNPNyjXSkI8JTy-UBeHXkGdndEmjyV4CBoG_1RDBA-sya1KP-ZK3_PBfa7fKbAnQF4StYYZv5X4BEhL9tygw2L7E06e-ZiJG5Cl7i9o83Lw0NpQmtBQUP9STFu5uDX6wJgByfGHE4vHJOgzjZer')" }}></Link>
                        </>
                    )}
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden relative">
                {/* Sidebar */}
                {!isFocusMode && (
                    <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
                )}

                {/* Main Content Area */}
                <main className={`flex-1 overflow-y-auto ${isFocusMode ? 'p-0' : ''} scrollbar-hide relative transition-all duration-500`}>
                    <Outlet context={{ isFocusMode }} />
                </main>
            </div>
        </div>
    );
};

