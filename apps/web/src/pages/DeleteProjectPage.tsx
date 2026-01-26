import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const DeleteProjectPage: React.FC = () => {
    const navigate = useNavigate();
    const [inputValue, setInputValue] = useState('');
    const PROJECT_NAME = "Final Thesis";
    const isConfirmed = inputValue === PROJECT_NAME;

    const handleDelete = () => {
        if (isConfirmed) {
            // In a real app, delete logic would go here
            navigate('/project/deleted');
        }
    };

    return (
        <div className="bg-neutral-bg min-h-screen flex flex-col font-display text-text-main">
            {/* TopNavBar */}
            <header className="flex items-center justify-between whitespace-nowrap bg-white border-b border-[#f0f4f8] px-4 py-3 md:px-10 lg:px-40 sticky top-0 z-50 shadow-sm">
                <Link to="/" className="flex items-center gap-4 text-text-main">
                    <div className="size-8 flex items-center justify-center text-custom-red">
                        <span className="material-symbols-outlined text-3xl">school</span>
                    </div>
                    <h2 className="text-text-main text-lg font-bold leading-tight tracking-[-0.015em]">StudentTracker</h2>
                </Link>
                <div className="hidden md:flex flex-1 justify-end gap-8">
                    <div className="flex items-center gap-9">
                        <Link to="/project" className="text-text-main hover:text-custom-red transition-colors text-sm font-medium leading-normal">Projects</Link>
                        <a href="#" className="text-text-main hover:text-custom-red transition-colors text-sm font-medium leading-normal">Progress</a>
                        <Link to="/project" className="text-text-main hover:text-custom-red transition-colors text-sm font-medium leading-normal">Projects</Link>
                    </div>
                    <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-white shadow-sm" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCzi4wHlaYGdiKi5uCOYqDnt5iwTHqEAvyVWgiLxV9tdnd0OOWWmbHf8KFHRrxbzZ7Qt6rZHmS8NpIVZd9ij_Ku-w4a0TDaANX1IZ1eBAnyW-FJ3CPR98lcTq6LVvtNUhoXW5dzmcyz4TNmnzsyokIR_eHS1tgBERfXo_nF851rTfU7l3oZ5WOjvHGj7eR7srffjPslQXlyBR69R981Y1R5NF8_Tj1sBOHeauY4fGDwuvl5EbcDxD9JkOp4B0DquE6ca9fZu-CsUvuU')" }}></div>
                </div>
                <div className="md:hidden flex items-center">
                    <span className="material-symbols-outlined cursor-pointer">menu</span>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
                {/* Confirmation Card Container */}
                <div className="relative w-full max-w-[640px] bg-custom-card rounded-xl shadow-xl ring-1 ring-black/5 overflow-hidden flex flex-col">
                    {/* Warning Header Section */}
                    <div className="bg-custom-red/5 p-8 pb-4 flex flex-col items-center text-center">
                        <div className="size-16 rounded-full bg-custom-red/10 flex items-center justify-center mb-4">
                            <span className="material-symbols-outlined text-4xl text-custom-red">warning</span>
                        </div>
                        <h1 className="text-[#2D1B1B] text-2xl md:text-3xl font-bold tracking-tight mb-2">Delete '{PROJECT_NAME}' Project?</h1>
                        <p className="text-[#5C4A4A] text-base leading-relaxed max-w-md">
                            You are about to permanently delete this project. All associated data, including progress history and uploaded files, will be removed forever.
                        </p>
                    </div>

                    {/* Content Body */}
                    <div className="p-8 pt-4 flex flex-col gap-6">
                        {/* Info Alert Box */}
                        <div className="flex gap-3 bg-red-50 border border-red-100 rounded-lg p-4 items-start">
                            <span className="material-symbols-outlined text-red-600 mt-0.5 text-xl">info</span>
                            <div className="flex-1">
                                <p className="text-sm text-red-800 font-medium">This action cannot be undone.</p>
                                <p className="text-xs text-red-600 mt-1">Please be certain before proceeding.</p>
                            </div>
                        </div>

                        {/* Verification Input */}
                        <div className="flex flex-col gap-2">
                            <label className="text-[#2D1B1B] text-sm font-semibold" htmlFor="confirm-input">
                                To confirm, type <span className="font-mono text-custom-red bg-custom-red/10 px-1 py-0.5 rounded">{PROJECT_NAME}</span> below:
                            </label>
                            <input
                                id="confirm-input"
                                type="text"
                                className="w-full h-12 rounded-lg border-2 border-[#D1D1C7] bg-white px-4 text-base text-[#181010] placeholder:text-[#A8A899] focus:border-custom-red focus:ring-0 transition-colors"
                                placeholder="Type project name"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                            />
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col-reverse sm:flex-row gap-4 sm:justify-end mt-4 pt-4 border-t border-[#E6E6D8]">
                            <Link to="/project" className="flex items-center justify-center h-12 px-6 rounded-lg text-custom-back hover:text-[#6a7a6a] hover:bg-[#EAEAD0] font-bold text-sm transition-colors cursor-pointer w-full sm:w-auto">
                                Cancel
                            </Link>
                            <button
                                onClick={handleDelete}
                                disabled={!isConfirmed}
                                className={`flex items-center justify-center h-12 px-6 rounded-lg font-bold text-sm shadow-md transition-all transform w-full sm:w-auto group ${isConfirmed
                                    ? 'bg-custom-red hover:bg-[#ff5252] text-white shadow-custom-red/20 active:scale-95 cursor-pointer'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                <span className={`material-symbols-outlined text-[20px] mr-2 ${isConfirmed ? 'group-hover:animate-pulse' : ''}`}>delete_forever</span>
                                Confirm Deletion
                            </button>
                        </div>
                    </div>

                    {/* Subtle Texture/Pattern Overlay */}
                    <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: "radial-gradient(#8A9A8A 1px, transparent 1px)", backgroundSize: "20px 20px" }}></div>
                </div>
            </main>
        </div>
    );
};
