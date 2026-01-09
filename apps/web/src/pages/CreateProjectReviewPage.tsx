import React from 'react';
import { Link } from 'react-router-dom';

export const CreateProjectReviewPage: React.FC = () => {
    return (
        <div className="bg-neutral-bg font-display text-text-main transition-colors duration-200 min-h-screen flex flex-col">
            {/* Top Navigation */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-black/5 bg-white px-10 py-3 sticky top-0 z-50">
                <Link to="/" className="flex items-center gap-4 text-text-main">
                    <div className="size-8 flex items-center justify-center text-primary">
                        <span className="material-symbols-outlined text-3xl">school</span>
                    </div>
                    <h2 className="text-text-main text-lg font-bold leading-tight tracking-[-0.015em]">StudentHub</h2>
                </Link>
                <div className="flex flex-1 justify-end gap-8">
                    <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-primary/20" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDb9pI1mAzFMpBBD9xn00EGmiN1dtoGN5n9Pw6fEmtW96NYDmB2u6J13RCCWyAY3K60kCCFp_SzCuBsIQqOwlxsIkEtANZ2ifaploAYmnOqz78y2ri1d6MtEQ_tteOO45nSSzU1TVkAryRq2ADjOVZ167b6KeEZnbD3N6fbKp7VQYWkoEWLqQau3XnoBe4Z4vZIB63bO02quzFzbT2gAhwgGhaae-IkvdAnFgTYPMT4qU3vsz755A1W0UX1v_22BWwS_nGpzqYzJby4')" }}></div>
                </div>
            </header>

            <main className="flex-grow flex flex-col items-center justify-start py-10 px-6 md:px-20 lg:px-40">
                <div className="w-full max-w-[960px] flex flex-col gap-8">
                    {/* Page Heading & Progress */}
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-wrap justify-between items-end gap-4">
                            <div className="flex flex-col gap-2">
                                <h1 className="text-text-main text-3xl md:text-4xl font-black leading-tight tracking-tight">Review Project Details</h1>
                                <p className="text-text-muted text-base font-normal">Step 4 of 4: Final Review</p>
                            </div>
                        </div>
                        {/* Wizard Progress */}
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between text-sm font-medium text-text-main">
                                <span>Basics</span>
                                <span>Timeline</span>
                                <span>Team</span>
                                <span className="text-primary font-bold">Review</span>
                            </div>
                            <div className="h-2 w-full bg-white/50 rounded-full overflow-hidden">
                                <div className="h-full bg-primary w-full rounded-full"></div>
                            </div>
                        </div>
                    </div>

                    {/* Summary Card Container */}
                    <div className="bg-custom-card rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
                        {/* Card Header */}
                        <div className="px-8 py-6 border-b border-black/5 flex items-center justify-between bg-black/[0.02]">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-custom-create">verified</span>
                                <h3 className="text-lg font-bold text-text-main">Project Summary</h3>
                            </div>
                            <span className="text-sm text-text-muted">Please verify all information below</span>
                        </div>
                        <div className="p-8 flex flex-col gap-10">
                            {/* Section 1: Project Basics */}
                            <div className="relative group">
                                <div className="flex justify-between items-start mb-4">
                                    <h4 className="text-text-main text-lg font-bold flex items-center gap-2">
                                        <span className="material-symbols-outlined text-text-sub text-xl">description</span>
                                        Project Basics
                                    </h4>
                                    <button className="text-primary hover:text-custom-create/80 text-sm font-medium flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                        <span className="material-symbols-outlined text-lg">edit</span>
                                        Edit
                                    </button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 md:gap-8">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-text-sub text-sm uppercase tracking-wider font-semibold">Project Name</span>
                                        <p className="text-text-main text-base font-medium">Advanced Biology Research</p>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-text-sub text-sm uppercase tracking-wider font-semibold">Description</span>
                                        <p className="text-text-main text-base leading-relaxed">A comprehensive study of local ecosystems and their biodiversity, focusing on the impact of urbanization on native plant species over a 6-month period.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="h-px w-full bg-[#181611]/10"></div>

                            {/* Section 2: Logistics */}
                            <div className="relative group">
                                <div className="flex justify-between items-start mb-4">
                                    <h4 className="text-text-main text-lg font-bold flex items-center gap-2">
                                        <span className="material-symbols-outlined text-text-sub text-xl">event</span>
                                        Logistics
                                    </h4>
                                    <button className="text-primary hover:text-custom-create/80 text-sm font-medium flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                        <span className="material-symbols-outlined text-lg">edit</span>
                                        Edit
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-text-sub text-sm uppercase tracking-wider font-semibold">Due Date</span>
                                        <p className="text-text-main text-base font-medium">October 24, 2023</p>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-text-sub text-sm uppercase tracking-wider font-semibold">Status</span>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 w-fit">
                                            Active
                                        </span>
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <span className="text-text-sub text-sm uppercase tracking-wider font-semibold">Visibility</span>
                                        <p className="text-text-main text-base font-medium">Private Group</p>
                                    </div>
                                </div>
                            </div>
                            <div className="h-px w-full bg-[#181611]/10"></div>

                            {/* Section 3: Team */}
                            <div className="relative group">
                                <div className="flex justify-between items-start mb-4">
                                    <h4 className="text-text-main text-lg font-bold flex items-center gap-2">
                                        <span className="material-symbols-outlined text-text-sub text-xl">group</span>
                                        Team Members
                                    </h4>
                                    <button className="text-primary hover:text-custom-create/80 text-sm font-medium flex items-center gap-1 opacity-60 group-hover:opacity-100 transition-opacity">
                                        <span className="material-symbols-outlined text-lg">edit</span>
                                        Edit
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-4 items-center">
                                    {/* Member 1 */}
                                    <div className="flex items-center gap-3 bg-white/50 p-2 pr-4 rounded-full border border-black/5">
                                        <div className="w-10 h-10 rounded-full bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDZQRKOnfzhasO4d_zZthiUiHYwBJzsC9qaVu4mIfOLEfeNlCv0xqm3zO_lmnRDzIrouX1UmO79QQXT7x-EyQPI0zjWc1G3zXh4msonYidVB9zUjfZDT174f8AJbHEu55T4IPKRZqV0Sq82kP4gEjzMv5FCff7KxRJN9kp-6J63701MkDjIkN6kWWSAQ1_VPvYz06s65YJTEidO918h4AEmPzJ-S1I9I-UuaqXuSr4FcvSWrkZ45qnfquK3tPHP-HcdJ_n8EHOgPb-s')" }}></div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-text-main">Alice M.</span>
                                            <span className="text-xs text-text-muted">Lead</span>
                                        </div>
                                    </div>
                                    {/* Member 2 */}
                                    <div className="flex items-center gap-3 bg-white/50 p-2 pr-4 rounded-full border border-black/5">
                                        <div className="w-10 h-10 rounded-full bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCMlnU9m3cplVSASUjqu2jG6fuBGhHugxpIi-ydZZoxGUpAPf-nnt3vJTflRVs_Vy6iO8KOjaB4W8mZBYQsWwYg_4u3bW4n3eG7TD6liJ9O1Mesl_pnY9CDj6--uphS-oVsu_oPqg1OueYht6oVU2CSXNQV0Wk_jabDoEb4VMGy6UaxEW2pv6UD5ep4uah8zEO6eK01XpE8e_CZItuaZv_LWRfmMHBR552Q13UJ30WhDsfrNyg5Y8RO7XXRLyjumEolTWfN2lwi_yuT')" }}></div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-text-main">Bob D.</span>
                                            <span className="text-xs text-text-muted">Researcher</span>
                                        </div>
                                    </div>
                                    {/* Member 3 */}
                                    <div className="flex items-center gap-3 bg-white/50 p-2 pr-4 rounded-full border border-black/5">
                                        <div className="w-10 h-10 rounded-full bg-cover bg-center" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCjZnBQFKQajtjhAoRJ9kLNtk7sD6JYbF9syp8ijTy_641mOQQtq6231a1cjfdAq0X9qS4jFtDbjoMp6uInsNdVvQ951cBfqqC1fp8DVv80YR7086ODWGojs3adjsAqqc4cMQvHxlOZH2az1CuR9qs6atgnPOmdnGpSwfCDy-0YmIazablsNjITnOC8Zkz3QCIv2MEm2zj77UitWbBMGFXZb5HXSTLbzdo9wOBTX1y1ZoFbE3PFX045fCninyBF_Wv01I6z_bZW-I16')" }}></div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold text-text-main">Charlie K.</span>
                                            <span className="text-xs text-text-muted">Editor</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action Buttons Footer */}
                    <div className="flex flex-col-reverse sm:flex-row justify-between items-center gap-4 pt-4 pb-20">
                        <Link to="/create-project/timeline" className="w-full sm:w-auto px-8 py-3 rounded-lg text-white font-medium bg-custom-back hover:bg-custom-back/90 transition-colors flex items-center justify-center gap-2 shadow-sm">
                            <span className="material-symbols-outlined">arrow_back</span>
                            Back
                        </Link>
                        <Link to="/project" className="w-full sm:w-auto px-10 py-3 rounded-lg text-text-main font-bold bg-custom-create hover:bg-[#d6a520] transition-all transform hover:-translate-y-0.5 shadow-md flex items-center justify-center gap-2">
                            <span>Create Project</span>
                            <span className="material-symbols-outlined">rocket_launch</span>
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    );
};
