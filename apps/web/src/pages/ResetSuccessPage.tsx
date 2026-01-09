import React from 'react';
import { Link } from 'react-router-dom';

export const ResetSuccessPage: React.FC = () => {
    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-[#181611] flex flex-col min-h-screen">
            {/* Top Navigation */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#dbeafe] bg-white px-10 py-4 shadow-sm relative z-10">
                <div className="flex items-center gap-4 text-[#181611]">
                    <div className="size-8 text-primary">
                        <span className="material-symbols-outlined text-4xl">school</span>
                    </div>
                    <h2 className="text-[#181611] text-xl font-bold leading-tight tracking-[-0.015em]">StudentProject Tracker</h2>
                </div>
                <div className="flex flex-1 justify-end gap-8">
                    <div className="hidden md:flex items-center gap-9">
                        <a className="text-[#181611] text-sm font-medium leading-normal hover:text-primary transition-colors" href="#">Help Center</a>
                        <a className="text-[#181611] text-sm font-medium leading-normal hover:text-primary transition-colors" href="#">Contact Support</a>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-grow flex flex-col items-center justify-center p-6 relative overflow-hidden">
                {/* Background Decor elements for subtle depth */}
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-200/30 rounded-full blur-3xl -z-10"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-yellow-100/40 rounded-full blur-3xl -z-10"></div>

                {/* Success Card */}
                <div className="layout-content-container flex flex-col max-w-[520px] w-full">
                    <div className="bg-card-beige dark:bg-[#2a271f] rounded-2xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.1)] border border-[#e8e6d8] p-10 flex flex-col items-center text-center transform transition-all duration-500 hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)]">
                        {/* Icon/Illustration */}
                        <div className="mb-6 relative">
                            <div className="absolute inset-0 bg-green-100 rounded-full scale-150 opacity-50 blur-sm"></div>
                            <div className="relative bg-white p-4 rounded-full shadow-sm">
                                <span className="material-symbols-outlined text-6xl text-green-600">check_circle</span>
                            </div>
                        </div>
                        {/* Text Content */}
                        <h1 className="text-[#181611] dark:text-white text-3xl font-bold leading-tight tracking-tight mb-4">
                            Password Updated!
                        </h1>
                        <p className="text-[#5a5648] dark:text-[#cdcace] text-base font-normal leading-relaxed mb-8 max-w-[400px]">
                            Your password has been successfully reset. Your account is secure, and you are ready to get back to tracking your projects.
                        </p>
                        {/* Hero Image for visual context */}
                        <div className="w-full max-w-[280px] aspect-[4/3] bg-white/50 rounded-lg mb-8 overflow-hidden relative shadow-inner">
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-50 to-primary/10"></div>
                            <div className="w-full h-full bg-contain bg-center bg-no-repeat" role="img" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD09TnEBY5KeDVxPXlyIt1gGOj-g5OwGjhaIKMfm3ut6SPyKj-mQ3746f0DeR2Bv6xxy4mrzQt9KLuGWhF7sJs9v_OfjToChjSpaT4u907VdHiF8SISIMGMKqT5m0omgP-l_h832g5fpJ4mevZT196zGApSe0dDsUTqutRuvWIkQTpeWtOUs4XWnNh-dB9vx7riCTpv85fsE9p18eB1HNbk7x0DGJVnq7Ef3_6K8-6leDZl6fhXWCtmB01pjZjZBHEjcJwsQjGz9EIX")' }}>
                            </div>
                        </div>
                        {/* Action Button */}
                        <Link to="/login" className="w-full max-w-[320px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-6 bg-primary hover:bg-[#d4a21b] text-[#181611] text-base font-bold leading-normal tracking-[0.015em] transition-all shadow-md hover:shadow-lg focus:ring-4 focus:ring-primary/20 flex">
                            <span className="flex items-center justify-center gap-2">
                                <span className="truncate">Back to Login</span>
                                <span className="material-symbols-outlined text-lg">arrow_forward</span>
                            </span>
                        </Link>
                    </div>
                    {/* Additional Help Link below card */}
                    <div className="mt-8 text-center">
                        <p className="text-sm text-[#5a5648]">
                            Having trouble logging in? <a className="font-bold text-[#181611] hover:underline decoration-primary underline-offset-4" href="#">Contact Support</a>
                        </p>
                    </div>
                </div>
            </main>
            {/* Footer */}
            <footer className="flex flex-col gap-6 px-5 py-8 text-center w-full border-t border-[#dbeafe]/50 bg-white/50 backdrop-blur-sm">
                <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
                    <a className="text-[#887e63] font-medium hover:text-[#181611] transition-colors" href="#">Privacy Policy</a>
                    <span className="text-[#d1d5db]">•</span>
                    <a className="text-[#887e63] font-medium hover:text-[#181611] transition-colors" href="#">Terms of Service</a>
                    <span className="text-[#d1d5db]">•</span>
                    <a className="text-[#887e63] font-medium hover:text-[#181611] transition-colors" href="#">Security</a>
                </div>
                <p className="text-[#887e63] text-sm font-normal">© 2024 StudentProject Tracker. All rights reserved.</p>
            </footer>
        </div>
    );
};
