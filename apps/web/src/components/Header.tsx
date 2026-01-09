import React from 'react';

export const Header: React.FC = () => {
    return (
        <header className="flex items-center justify-between whitespace-nowrap border-b border-accent-nav/20 bg-neutral-card px-6 py-3 z-20 shadow-sm">
            <div className="flex items-center gap-8">
                <div className="flex items-center gap-3 text-text-main">
                    <div className="size-8 flex items-center justify-center text-dynamic-cta">
                        <span className="material-symbols-outlined text-3xl">local_florist</span>
                    </div>
                    <h2 className="text-lg font-bold leading-tight tracking-[-0.015em] text-slate-800">StudentFlow</h2>
                </div>
                <label className="hidden md:flex flex-col min-w-40 !h-10 max-w-64">
                    <div className="flex w-full flex-1 items-stretch rounded-xl h-full bg-neutral-bg focus-within:ring-2 ring-dynamic-cta/50 transition-all border border-transparent hover:border-accent-nav/30">
                        <div className="text-accent-nav flex border-none items-center justify-center pl-4 rounded-l-lg border-r-0">
                            <span className="material-symbols-outlined">search</span>
                        </div>
                        <input
                            className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl bg-transparent text-text-main focus:outline-0 focus:ring-0 border-none h-full placeholder:text-accent-nav px-4 rounded-l-none border-l-0 pl-2 text-sm font-normal leading-normal"
                            placeholder="Search projects..."
                        />
                    </div>
                </label>
            </div>
            <div className="flex flex-1 justify-end gap-6 items-center">
                <div className="hidden md:flex items-center gap-2 mr-2">
                    <span className="text-xs font-semibold text-accent-nav">Fokus Mode</span>
                    <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                        <input
                            className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer border-gray-300 left-0 transition-all duration-300 top-0"
                            id="toggle"
                            name="toggle"
                            type="checkbox"
                        />
                        <label
                            className="toggle-label block overflow-hidden h-5 rounded-full bg-gray-300 cursor-pointer"
                            htmlFor="toggle"
                        ></label>
                    </div>
                </div>
                <button className="flex items-center justify-center text-accent-nav hover:text-dynamic-cta transition-colors relative">
                    <span className="material-symbols-outlined">notifications</span>
                    <span className="absolute top-0 right-0 size-2 bg-dynamic-error rounded-full border border-neutral-card"></span>
                </button>
                <button className="hidden sm:flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-9 px-4 bg-dynamic-cta text-white text-sm font-bold leading-normal tracking-[0.015em] hover:brightness-110 transition-all shadow-glow hover:translate-y-[-1px]">
                    <span className="truncate">Create New</span>
                </button>
                <div
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-dynamic-cta/30 shadow-sm"
                    style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD0oW4gh5khJP6XabfjYdoTNNFt9SmW2Z--RqnvG9uaMJcHr8rtIMEtr4IB2a91L6WS_MPbUpwT09c2YdPuzgdCTVMAz-nQ9TGwDYFT5TbArNsIhsvaRxVGWAMAqMNPNyjXSkI8JTy-UBeHXkGdndEmjyV4CBoG_1RDBA-sya1KP-ZK3_PBfa7fKbAnQF4StYYZv5X4BEhL9tygw2L7E06e-ZiJG5Cl7i9o83Lw0NpQmtBQUP9STFu5uDX6wJgByfGHE4vHJOgzjZer")' }}
                />
            </div>
        </header>
    );
};
