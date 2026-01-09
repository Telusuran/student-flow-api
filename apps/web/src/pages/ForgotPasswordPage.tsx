import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const ForgotPasswordPage: React.FC = () => {
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically trigger the API call
        navigate('/reset-confirmation');
    };

    return (
        <div className="font-display bg-neutral-bg flex min-h-screen flex-col text-text-main">
            {/* Top Navigation Bar */}
            <header className="w-full bg-white/80 backdrop-blur-sm border-b border-[#E6F0FA] sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2 text-text-main cursor-pointer hover:opacity-80 transition-opacity">
                            <span className="material-symbols-outlined text-primary text-3xl">school</span>
                            <h1 className="text-xl font-bold tracking-tight">StudentProj</h1>
                        </Link>
                        {/* Navigation Links */}
                        <nav className="hidden md:flex items-center gap-8">
                            <a className="text-text-main text-sm font-medium hover:text-primary transition-colors" href="#">Home</a>
                            <a className="text-text-main text-sm font-medium hover:text-primary transition-colors" href="#">About</a>
                            <a className="text-text-main text-sm font-medium hover:text-primary transition-colors" href="#">Contact</a>
                        </nav>
                        {/* Auth Buttons */}
                        <div className="flex items-center gap-4">
                            <Link to="/login" className="text-text-main text-sm font-medium hover:text-primary transition-colors hidden sm:block">
                                Login
                            </Link>
                            <Link to="/register" className="bg-primary hover:bg-primary-hover text-text-main text-sm font-bold px-5 py-2 rounded-lg transition-colors duration-200">
                                Sign Up
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-grow flex items-center justify-center p-6 relative overflow-hidden">
                {/* Decorative Background Elements (Abstract shapes for depth) */}
                <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-[#FF6B6B]/10 rounded-full blur-3xl pointer-events-none"></div>

                {/* Central Card Container */}
                <div className="w-full max-w-lg relative z-10">
                    {/* Card Body */}
                    <div className="bg-card-beige rounded-xl shadow-soft p-8 md:p-10 border border-white/50">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                                <span className="material-symbols-outlined text-3xl">lock_reset</span>
                            </div>
                            <h2 className="text-3xl font-bold text-text-main mb-3">Forgot password?</h2>
                            <p className="text-text-subtle text-base leading-relaxed">
                                No worries! Enter the email address associated with your account and we'll send you a link to reset your password.
                            </p>
                        </div>

                        {/* Form */}
                        <form className="space-y-6" onSubmit={handleSubmit}>
                            {/* Email Field */}
                            <div className="space-y-2">
                                <label className="block text-text-main text-sm font-semibold ml-1" htmlFor="email">Email Address</label>
                                <div className="relative group">
                                    <span className="absolute left-4 top-3.5 text-text-subtle group-focus-within:text-primary transition-colors">
                                        <span className="material-symbols-outlined text-[20px]">mail</span>
                                    </span>
                                    <input className="w-full pl-11 pr-4 py-3 bg-white border border-[#e5e3dc] rounded-lg text-text-main placeholder:text-text-subtle/70 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200" id="email" name="email" placeholder="student@university.edu" required type="email" />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button className="w-full bg-primary hover:bg-primary-hover text-text-main text-base font-bold h-12 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2 group" type="submit">
                                <span>Send Reset Link</span>
                                <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
                            </button>
                        </form>

                        {/* Back to Login */}
                        <div className="mt-8 pt-6 border-t border-text-subtle/10 text-center">
                            <p className="text-text-subtle text-sm">
                                Remember your password?
                                <Link to="/login" className="text-text-main font-semibold hover:text-primary hover:underline transition-colors ml-1">
                                    Back to Login
                                </Link>
                            </p>
                        </div>
                    </div>

                    {/* Help Text Below Card */}
                    <div className="mt-6 text-center">
                        <p className="text-text-subtle/80 text-xs">
                            Need help? <a className="underline hover:text-primary" href="#">Contact Support</a>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};
