import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const ResetPasswordPage: React.FC = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // For demonstration, we'll mimic the error state from the design if passwords don't match
    const passwordsMatch = password === confirmPassword || confirmPassword === '';
    const hasError = !passwordsMatch && confirmPassword.length > 0;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password && passwordsMatch) {
            navigate('/reset-success');
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen flex items-center justify-center font-display p-4 text-text-main">
            {/* Main Container Card */}
            <div className="w-full max-w-[480px] bg-card-beige dark:bg-[#2a261a] rounded-2xl shadow-soft overflow-hidden relative">
                {/* Subtle gradient overlay for depth */}
                <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent pointer-events-none"></div>

                <div className="relative z-10 px-8 py-10 flex flex-col gap-6">
                    {/* Header Section */}
                    <div className="flex flex-col gap-2 text-center">
                        <div className="mx-auto w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-2 text-primary">
                            <span className="material-symbols-outlined text-3xl">lock_reset</span>
                        </div>
                        <h1 className="text-[#181611] dark:text-white text-3xl font-black leading-tight tracking-[-0.033em]">Reset Your Password</h1>
                        <p className="text-[#887e63] dark:text-[#a69c80] text-base font-normal leading-normal">Please enter your new password below to access your student projects.</p>
                    </div>

                    {/* Form Section */}
                    <form className="flex flex-col gap-5 mt-2" onSubmit={handleSubmit}>
                        {/* New Password Field */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[#181611] dark:text-[#eaeaea] text-sm font-semibold leading-normal ml-1">New Password</label>
                            <div className="relative flex items-center">
                                <input
                                    className="w-full rounded-lg text-[#181611] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary border border-[#e0e0d0] dark:border-[#443f2f] bg-white/50 dark:bg-[#1a1710]/50 h-12 pl-4 pr-12 text-base font-normal placeholder:text-[#887e63]/70 transition-all shadow-sm"
                                    placeholder="Enter new password"
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button
                                    className="absolute right-0 top-0 h-full px-3 text-[#887e63] hover:text-[#181611] dark:hover:text-white transition-colors flex items-center justify-center"
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                                </button>
                            </div>
                            {/* Password Strength Meter (Static for demo visuals) */}
                            <div className="flex gap-1 mt-1 px-1">
                                <div className="h-1 flex-1 rounded-full bg-primary"></div>
                                <div className="h-1 flex-1 rounded-full bg-primary"></div>
                                <div className="h-1 flex-1 rounded-full bg-[#dcdbc8] dark:bg-[#443f2f]"></div>
                                <div className="h-1 flex-1 rounded-full bg-[#dcdbc8] dark:bg-[#443f2f]"></div>
                            </div>
                            <p className="text-[#887e63] dark:text-[#a69c80] text-xs font-medium px-1 mt-0.5">Strength: Medium</p>
                        </div>

                        {/* Confirm Password Field */}
                        <div className="flex flex-col gap-1.5">
                            <label className="text-[#181611] dark:text-[#eaeaea] text-sm font-semibold leading-normal ml-1">Confirm Password</label>
                            <div className="relative flex items-center">
                                <input
                                    className={`w-full rounded-lg text-[#181611] dark:text-white focus:outline-none focus:ring-2 border bg-white/50 dark:bg-[#1a1710]/50 h-12 pl-4 pr-12 text-base font-normal placeholder:text-[#887e63]/70 transition-all shadow-sm ${hasError ? 'border-error focus:ring-error/50 focus:border-error' : 'border-[#e0e0d0] dark:border-[#443f2f] focus:ring-primary/50 focus:border-primary'}`}
                                    placeholder="Re-enter new password"
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                                <button
                                    className="absolute right-0 top-0 h-full px-3 text-[#887e63] hover:text-[#181611] dark:hover:text-white transition-colors flex items-center justify-center"
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    <span className="material-symbols-outlined text-[20px]">{showConfirmPassword ? 'visibility_off' : 'visibility'}</span>
                                </button>
                            </div>
                            {/* Error Message */}
                            {hasError && (
                                <div className="flex items-center gap-1.5 px-1 text-error text-xs font-medium animate-pulse">
                                    <span className="material-symbols-outlined text-[14px]">error</span>
                                    <span>Passwords do not match.</span>
                                </div>
                            )}
                        </div>

                        {/* Meta Text / Requirements */}
                        <div className="bg-primary/5 dark:bg-primary/10 rounded-lg p-3 border border-primary/10">
                            <p className="text-[#181611] dark:text-[#eaeaea] text-xs font-bold mb-1">Password Requirements:</p>
                            <ul className="text-[#887e63] dark:text-[#a69c80] text-xs space-y-1 list-disc pl-4">
                                <li>Must be at least 8 characters long</li>
                                <li>Include at least one number or symbol</li>
                            </ul>
                        </div>

                        {/* Action Button */}
                        <button className="w-full cursor-pointer flex items-center justify-center rounded-lg h-12 bg-primary hover:bg-[#d4a41f] active:scale-[0.98] transition-all text-[#181611] text-base font-bold leading-normal tracking-[0.015em] shadow-md hover:shadow-lg mt-2">
                            Reset Password
                        </button>

                        {/* Back Link */}
                        <div className="flex justify-center pt-2">
                            <Link to="/login" className="group flex items-center gap-1 text-sm font-medium text-[#887e63] hover:text-[#181611] dark:text-[#a69c80] dark:hover:text-white transition-colors">
                                <span className="material-symbols-outlined text-[16px] transition-transform group-hover:-translate-x-1">arrow_back</span>
                                Back to Login
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
