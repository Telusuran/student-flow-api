import React from 'react';
import { useNavigate } from 'react-router-dom';

export const ProfileSetupPage: React.FC = () => {
    const navigate = useNavigate();

    const handleComplete = () => {
        navigate('/');
    };

    return (
        <div className="bg-neutral-bg min-h-screen w-full flex flex-col items-center justify-center font-display antialiased text-text-main p-4 md:p-8">
            {/* Navbar / Minimal Header for Context */}
            <header className="fixed top-0 left-0 w-full p-6 flex justify-between items-center z-10">
                <div className="flex items-center gap-2">
                    <div className="size-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl">S</div>
                    <span className="font-bold text-xl tracking-tight text-slate-700">StudentFlow</span>
                </div>
                <div className="text-sm font-medium text-slate-500 bg-white/50 px-3 py-1 rounded-full backdrop-blur-sm">
                    Step 2 of 3
                </div>
            </header>

            {/* Main Content Container */}
            <main className="w-full max-w-[640px] relative z-0 mt-16 md:mt-0">
                {/* Profile Setup Card */}
                <div className="bg-white rounded-2xl shadow-[0_20px_40px_-5px_rgba(24,22,17,0.08),0_10px_15px_-3px_rgba(24,22,17,0.05)] overflow-hidden">
                    {/* Header Section */}
                    <div className="px-8 pt-10 pb-4 text-center">
                        <h1 className="text-3xl md:text-4xl font-black text-text-main mb-3 tracking-tight">Welcome to Your Workspace!</h1>
                        <p className="text-text-subtle text-lg font-normal leading-relaxed max-w-md mx-auto">
                            Let's get you set up. Tell us a bit about yourself to personalize your project dashboard.
                        </p>
                    </div>

                    <div className="p-8 md:px-12 md:pb-12">
                        {/* Avatar Upload Section */}
                        <div className="flex flex-col items-center mb-8">
                            <div className="relative group cursor-pointer">
                                <div className="w-32 h-32 rounded-full bg-card-beige border-4 border-white shadow-md flex items-center justify-center overflow-hidden transition-all group-hover:bg-[#ebebcf]">
                                    <span className="material-symbols-outlined text-4xl text-text-subtle opacity-50 group-hover:opacity-80">add_a_photo</span>
                                    {/* Image container for preview would go here */}
                                    <img alt="" className="absolute inset-0 w-full h-full object-cover hidden" src="" />
                                </div>
                                <div className="absolute bottom-1 right-1 bg-primary text-white p-2 rounded-full shadow-lg hover:bg-primary-hover transition-colors">
                                    <span className="material-symbols-outlined text-sm font-bold">edit</span>
                                </div>
                            </div>
                            <p className="mt-3 text-sm font-medium text-text-subtle">Upload Profile Picture</p>
                        </div>

                        {/* Form Inputs */}
                        <div className="space-y-6">
                            {/* Full Name */}
                            <label className="block">
                                <span className="text-text-main text-base font-semibold mb-2 block">Full Name</span>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-subtle">
                                        <span className="material-symbols-outlined">person</span>
                                    </span>
                                    <input className="w-full bg-card-beige border-none rounded-xl h-14 pl-12 pr-4 text-base text-text-main placeholder:text-text-subtle/70 focus:ring-2 focus:ring-primary focus:bg-white transition-all duration-200" placeholder="Enter your full name" type="text" />
                                </div>
                            </label>

                            {/* Academic Institution */}
                            <label className="block">
                                <span className="text-text-main text-base font-semibold mb-2 block">Academic Institution</span>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-subtle">
                                        <span className="material-symbols-outlined">school</span>
                                    </span>
                                    <input className="w-full bg-card-beige border-none rounded-xl h-14 pl-12 pr-4 text-base text-text-main placeholder:text-text-subtle/70 focus:ring-2 focus:ring-primary focus:bg-white transition-all duration-200" placeholder="Where do you study?" type="text" />
                                </div>
                            </label>

                            {/* Major */}
                            <label className="block">
                                <span className="text-text-main text-base font-semibold mb-2 block">Major / Field of Study</span>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-subtle">
                                        <span className="material-symbols-outlined">menu_book</span>
                                    </span>
                                    <input className="w-full bg-card-beige border-none rounded-xl h-14 pl-12 pr-4 text-base text-text-main placeholder:text-text-subtle/70 focus:ring-2 focus:ring-primary focus:bg-white transition-all duration-200" placeholder="e.g. Computer Science" type="text" />
                                </div>
                            </label>

                            {/* Bio (Optional) */}
                            <label className="block">
                                <span className="text-text-main text-base font-semibold mb-2 flex items-center justify-between">
                                    Bio
                                    <span className="text-xs font-normal text-text-subtle bg-[#f4f3f0] px-2 py-0.5 rounded">Optional</span>
                                </span>
                                <textarea className="w-full bg-card-beige border-none rounded-xl p-4 text-base text-text-main placeholder:text-text-subtle/70 focus:ring-2 focus:ring-primary focus:bg-white transition-all duration-200 resize-none h-24" placeholder="Tell us a little about your academic interests..."></textarea>
                            </label>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-10 flex flex-col gap-4">
                            <button onClick={handleComplete} className="w-full bg-primary hover:bg-primary-hover text-text-main font-bold h-14 rounded-xl text-lg shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2">
                                <span>Complete Setup</span>
                                <span className="material-symbols-outlined text-xl">arrow_forward</span>
                            </button>
                            <button onClick={handleComplete} className="text-center text-text-subtle font-medium text-sm hover:text-text-main hover:underline decoration-primary decoration-2 underline-offset-4 transition-colors">
                                Skip for now
                            </button>
                        </div>
                    </div>
                </div>

                {/* Decorative background elements for subtle depth */}
                <div className="absolute -top-12 -right-12 w-64 h-64 bg-white/20 rounded-full blur-3xl -z-10 pointer-events-none"></div>
                <div className="absolute -bottom-12 -left-12 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
            </main>

            <footer className="mt-12 text-text-subtle text-sm font-medium">
                © 2023 StudentFlow. All rights reserved.
            </footer>
        </div>
    );
};
