import React from 'react';
import { Link } from 'react-router-dom';

export const CreateProjectTimelinePage: React.FC = () => {
    return (
        <div className="bg-neutral-bg text-text-main font-display overflow-x-hidden min-h-screen flex flex-col">
            {/* Top Navigation */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#f4f3f0] bg-white px-10 py-3 shadow-sm sticky top-0 z-50">
                <Link to="/" className="flex items-center gap-4 text-text-main">
                    <div className="size-8 text-primary">
                        <span className="material-symbols-outlined text-3xl">school</span>
                    </div>
                    <h2 className="text-text-main text-lg font-bold leading-tight tracking-[-0.015em]">StudentTracker</h2>
                </Link>
                <div className="flex flex-1 justify-end gap-8">
                    <div className="flex items-center gap-9 hidden md:flex">
                        <Link to="/" className="text-text-main text-sm font-medium leading-normal hover:text-primary transition-colors">Dashboard</Link>
                        <Link to="/project" className="text-text-main text-sm font-medium leading-normal hover:text-primary transition-colors">Projects</Link>
                        <Link to="/calendar" className="text-text-main text-sm font-medium leading-normal hover:text-primary transition-colors">Calendar</Link>
                        <Link to="/settings/account" className="text-text-main text-sm font-medium leading-normal hover:text-primary transition-colors">Settings</Link>
                    </div>
                    <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-white shadow-md cursor-pointer" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCjVlMQvNuFffzwInEcgAW5f5RIe7yW8PtWhbkPSkwJexAW-9whc7IkWhKjr5f-6EgOlAvlm--o13R6qzOblUYC3bTqB8Lfh9X_XNQDd25XpZvYXkkV1TV9oTotxvx-VDprRVG2_qzVOrrO5LwYOINmwV5LGvjuRZ5LJVzFYsnPHwlpN-Yd62GmJWPesUq3jodxYZ9HBRe4mXOgD95y3oiKHiKrAZZ8QqYSpli0WCTsZkZP2HABxqvTCrSXI84mj6C4TybSaKbP-1w3')" }}></div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 flex justify-center py-10 px-4 md:px-10">
                <div className="w-full max-w-[1000px] flex flex-col gap-8">
                    {/* Progress Header */}
                    <div className="flex flex-col gap-3">
                        <div className="flex gap-6 justify-between items-end">
                            <div>
                                <h1 className="text-2xl font-bold text-text-main">Create New Project</h1>
                                <p className="text-text-sub text-sm mt-1">Configure your project timeline and invite your team.</p>
                            </div>
                            <p className="text-text-main text-base font-medium leading-normal">Step 2 of 4</p>
                        </div>
                        {/* Progress Bar */}
                        <div className="rounded-full bg-white shadow-sm h-3 overflow-hidden">
                            <div className="h-full bg-primary" style={{ width: '50%' }}></div>
                        </div>
                    </div>

                    {/* Main Wizard Card */}
                    <div className="bg-neutral-card rounded-xl shadow-lg border border-[#e8e6dc] p-6 md:p-8 flex flex-col gap-8">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            {/* Left Column: Date Picker */}
                            <div className="lg:col-span-7 flex flex-col gap-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="material-symbols-outlined text-primary">calendar_month</span>
                                    <h3 className="text-lg font-bold text-text-main">Set Due Date</h3>
                                </div>
                                {/* Calendar Component */}
                                <div className="bg-white rounded-xl shadow-sm border border-[#e5e7eb] p-6">
                                    <div className="flex items-center justify-between mb-6">
                                        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-text-main">
                                            <span className="material-symbols-outlined text-xl">chevron_left</span>
                                        </button>
                                        <p className="text-text-main text-base font-bold leading-tight">October 2023</p>
                                        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors text-text-main">
                                            <span className="material-symbols-outlined text-xl">chevron_right</span>
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-7 mb-4">
                                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                                            <div key={i} className="text-text-sub text-xs font-bold text-center py-2">{day}</div>
                                        ))}
                                    </div>
                                    <div className="grid grid-cols-7 gap-1">
                                        {/* Previous month days (faded) */}
                                        {[28, 29, 30].map(day => (
                                            <button key={`prev-${day}`} className="aspect-square flex items-center justify-center text-sm text-gray-300 rounded-full hover:bg-gray-50">{day}</button>
                                        ))}
                                        {/* Current month days */}
                                        {[...Array(31)].map((_, i) => {
                                            const day = i + 1;
                                            const isSelected = day === 5;
                                            return (
                                                <button
                                                    key={`curr-${day}`}
                                                    className={`aspect-square flex items-center justify-center text-sm rounded-full ${isSelected ? 'text-white font-bold bg-primary shadow-md transform scale-105' : 'text-text-main hover:bg-neutral-card'}`}
                                                >
                                                    {day}
                                                </button>
                                            );
                                        })}
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                                        <span className="text-sm text-gray-500">Selected date:</span>
                                        <span className="text-sm font-bold text-text-main">October 5, 2023</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Members */}
                            <div className="lg:col-span-5 flex flex-col gap-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="material-symbols-outlined text-primary">group_add</span>
                                    <h3 className="text-lg font-bold text-text-main">Add Members</h3>
                                </div>
                                {/* Add Member Input */}
                                <div className="bg-white rounded-xl shadow-sm border border-[#e5e7eb] p-4 flex flex-col gap-4">
                                    <label className="text-sm font-medium text-text-main">Invite by name or email</label>
                                    <div className="relative">
                                        <input className="w-full bg-background-light border border-transparent focus:border-primary focus:ring-0 rounded-lg py-3 pl-10 pr-4 text-sm text-text-main placeholder:text-gray-400 transition-all" placeholder="Search students..." type="text" />
                                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg">search</span>
                                    </div>
                                    <div className="flex flex-col gap-2 mt-2">
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Suggested</p>
                                        {/* Suggestion Chips */}
                                        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group">
                                            <div className="bg-center bg-no-repeat bg-cover rounded-full size-8" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAwOZCZJpwn83zt82YTjp6Y--cjzRrOfowoSPFQ7iYqKwGX9o1idymvb46DvhkTykHyW9c3qiXOrJWCsJQf7d1EeOxJGT-mkSzcUXkiC5emQ5iEyhGkgJMd_oCckO1Eb9tVyR4_7A0LlXXIjZxGIVxBc74ArsYBKmwviJza7khGwecU8QWaFnP5XhxU8KdbokGh1TlWXg0PYcKPK8Tonv5mKAqBIeRCiA6vkQ4ZAcbVLQNy04IW4KFa4RvxUOtMJpHYVR2uYYktDTWk')" }}></div>
                                            <div className="flex flex-col flex-1">
                                                <span className="text-sm font-medium text-text-main">Sarah Jenkins</span>
                                                <span className="text-xs text-text-muted">Design Lead</span>
                                            </div>
                                            <button className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="material-symbols-outlined text-xl">add_circle</span>
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors group">
                                            <div className="bg-center bg-no-repeat bg-cover rounded-full size-8" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAMafHgm9M7tusaXwAMODNhjH2FYZz6v2i63uPpvvexLlIWMRjy4Cqwjw5SW56eRGt2_St43Ap0qDPbYxlSI0vP8fpnZUKrHsAvXAhaQCQtbvoltF_VHa6p46Em_E7xC13THCo9JF-oZqXhLjoLt2R8wNsst422N3PJl2ORxHq7yfzVC5JwWRHli5zuK1luqtnazRRHSwPb67YNCZJjJbUn3Ex_r-8keqNZtco6bzhH1oG5YK-_yeA6j4hQ8x5cuRpChhlPSCUfmFiv')" }}></div>
                                            <div className="flex flex-col flex-1">
                                                <span className="text-sm font-medium text-text-main">David Chen</span>
                                                <span className="text-xs text-text-muted">Developer</span>
                                            </div>
                                            <button className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                                <span className="material-symbols-outlined text-xl">add_circle</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {/* Selected Members List */}
                                <div className="flex-1 flex flex-col gap-3">
                                    <p className="text-sm font-bold text-text-main">Project Team <span className="bg-neutral-bg text-text-main text-xs py-0.5 px-2 rounded-full ml-2">3</span></p>
                                    <div className="bg-white rounded-xl shadow-sm border border-[#e5e7eb] p-1 custom-scrollbar max-h-[250px] overflow-y-auto">
                                        {/* Member 1 (You) */}
                                        <div className="flex items-center justify-between p-3 border-b border-gray-50 last:border-0">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-center bg-no-repeat bg-cover rounded-full size-10" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCZQD4vnPJh3MAJ4RnzR5aOjBEhoTXedWzpRGbu927kD_Yg8mE1NALOJt-vV5ALjQT4IUXko_e2ysW7uV8E8M2SmoTlLaODScUwxZeMz5Auf7cNPgGqhuw6f2debRi7dXR_zu-dwfMrJ5yeoJDU-c-U3xAJR6nYL2C39J49uzpJS41bonskS3Hvf_7q5uFcuCHAu1sdaMmEi77lhVJYk-HJqCvQfUPhhwPi6WdGXFobLrM2WpP_n1akAwtcc8HEsY05W7jvedrkCSmy')" }}></div>
                                                <div>
                                                    <p className="text-sm font-bold text-text-main">You</p>
                                                    <p className="text-xs text-text-muted">Owner</p>
                                                </div>
                                            </div>
                                            <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-full">ADMIN</span>
                                        </div>
                                        {/* Member 2 */}
                                        <div className="flex items-center justify-between p-3 border-b border-gray-50 last:border-0 group">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-center bg-no-repeat bg-cover rounded-full size-10" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuAeOjex4lpPCA2aVuS9RzgkWsDjQXRaJfsZ-YbsWXs3CRcs9O-T4dDcPVdiSd-VOX4d9F7Xy0E7bWqwb2xLfVFe0kcvkCGejdrKPPhPk1DSpW5hphUZCcqKIqzhxXPBNtu6tWX1-va6P8oeslokmN7xWkHF7CnKq8IjiO5FJbcBOZDZ-ZCha3Xbk_MaDiccM80BzhPlRdEmJ_HlJ-cLUWZBKxivz-OlShThz0a7BJA01v8AmtNrPt5uoL_lujjC0JG_PfILZG2W3pHz')" }}></div>
                                                <div>
                                                    <p className="text-sm font-bold text-text-main">Marcus Aurelius</p>
                                                    <p className="text-xs text-text-muted">Researcher</p>
                                                </div>
                                            </div>
                                            <button className="text-gray-300 hover:text-red-500 transition-colors">
                                                <span className="material-symbols-outlined text-xl">close</span>
                                            </button>
                                        </div>
                                        {/* Member 3 */}
                                        <div className="flex items-center justify-between p-3 border-b border-gray-50 last:border-0 group">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-center bg-no-repeat bg-cover rounded-full size-10" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuA1l6AqIoZRm16dF9yRToin6MTmSI-s0chiUkpE9ZnwNYlse8NM8HdcpxyztOm9ydjqpi2av2aX_E7KATBtoIrAEiDfktSYOeymToG1SUXzGtXe2pGw5Yw7vHhR-Q9QfSCDfFwx69vCSz8SKsa-W1VUfZtQfHNbcKN-fV1EtaS-OY4Oq3rWz7Orbyl6ejzphsBiI1S43pcqAM9gakQCbTREZ0wNHouLdk5uUn2DAFQNxHKQkhtKVeUDH3VNdEXgbXbA7HMGtCD5lP_c')" }}></div>
                                                <div>
                                                    <p className="text-sm font-bold text-text-main">Jessica Alba</p>
                                                    <p className="text-xs text-text-muted">Editor</p>
                                                </div>
                                            </div>
                                            <button className="text-gray-300 hover:text-red-500 transition-colors">
                                                <span className="material-symbols-outlined text-xl">close</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Navigation */}
                        <div className="flex items-center justify-between pt-6 border-t border-[#e8e6dc] mt-2">
                            <Link to="/create-project" className="flex items-center gap-2 px-6 py-3 rounded-lg bg-secondary-accent text-white font-medium hover:bg-[#7a8a7a] transition-colors shadow-sm">
                                <span className="material-symbols-outlined text-sm">arrow_back</span>
                                Back
                            </Link>
                            <div className="flex items-center gap-4">
                                <span className="text-xs text-text-muted font-medium hidden sm:inline-block">Auto-saved 2 mins ago</span>
                                <Link to="/create-project/review" className="flex items-center gap-2 px-8 py-3 rounded-lg bg-cta text-white font-bold hover:bg-[#d6a520] transition-colors shadow-md transform hover:-translate-y-0.5 active:translate-y-0">
                                    Next Step
                                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
