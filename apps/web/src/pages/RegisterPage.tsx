import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signUp } from '../lib/auth-client';

export const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const getPasswordStrength = () => {
        if (password.length === 0) return { level: 0, text: 'Enter a password', color: 'text-gray-400' };
        if (password.length < 6) return { level: 1, text: 'Too short', color: 'text-red-500' };
        if (password.length < 8) return { level: 2, text: 'Weak', color: 'text-orange-500' };
        if (password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password)) {
            return { level: 4, text: 'Strong', color: 'text-green-600' };
        }
        return { level: 3, text: 'Good', color: 'text-green-600' };
    };

    const passwordStrength = getPasswordStrength();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validation
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);
        console.log('[Register] Starting registration for:', email);

        try {
            const result = await signUp.email({
                email,
                password,
                name,
            });

            console.log('[Register] Result:', result);

            if (result.error) {
                console.error('[Register] Server error:', result.error);
                setError(result.error.message || 'Registration failed. Please try again.');
            } else if (result.data) {
                console.log('[Register] Success! User:', result.data.user);
                // Redirect to dashboard on success
                navigate('/');
            } else {
                console.warn('[Register] No error but no data either');
                setError('Unexpected response. Please try again.');
            }
        } catch (err) {
            console.error('[Register] Exception caught:', err);
            setError('An error occurred. Please check console for details.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-[#181611] font-display min-h-screen flex flex-col antialiased selection:bg-cta-gold selection:text-white">
            {/* Top Navigation */}
            <header className="w-full py-4 px-6 md:px-10 flex items-center justify-between absolute top-0 left-0 z-10">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center size-10 rounded-xl bg-white/50 backdrop-blur-sm text-cta-gold shadow-sm">
                        <span className="material-symbols-outlined text-2xl">school</span>
                    </div>
                    <h2 className="text-[#181611] text-lg font-bold tracking-tight">Student Hub</h2>
                </div>
                <div className="hidden sm:flex items-center gap-4">
                    <span className="text-sm text-[#887e63] font-medium">Already a member?</span>
                    <Link to="/login" className="px-5 py-2 rounded-lg bg-white/60 hover:bg-white text-[#181611] text-sm font-bold transition-all shadow-sm hover:shadow-md">
                        Log In
                    </Link>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
                {/* Ambient Background Effects (Pencahayaan Digital) */}
                <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-white opacity-40 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
                <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-cta-gold opacity-10 rounded-full blur-[120px] -z-10 pointer-events-none"></div>

                {/* Registration Card */}
                <div className="w-full max-w-[540px] bg-white rounded-2xl shadow-soft flex flex-col relative z-0 border border-white/50">
                    {/* Progress Stepper */}
                    <div className="px-8 pt-8 pb-4">
                        <div className="flex justify-between items-end mb-3">
                            <p className="text-[#181611] text-sm font-bold uppercase tracking-wider">Create Account</p>
                            <p className="text-[#887e63] text-xs font-medium bg-[#F5F5DC] px-2 py-1 rounded">Step 1 of 2</p>
                        </div>
                        <div className="h-2 w-full bg-[#f4f3f0] rounded-full overflow-hidden flex">
                            <div className="h-full bg-cta-gold w-1/2 rounded-full shadow-[0_0_10px_rgba(229,178,36,0.5)]"></div>
                        </div>
                    </div>

                    {/* Page Heading */}
                    <div className="px-8 pt-2 pb-6">
                        <h1 className="text-3xl md:text-4xl font-bold text-[#181611] mb-2 tracking-tight">Join the Student Hub</h1>
                        <p className="text-[#887e63] text-base leading-relaxed">Create your profile to track projects and collaborate with ease.</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mx-8 mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
                            <span className="material-symbols-outlined text-base">error</span>
                            {error}
                        </div>
                    )}

                    {/* Form Fields */}
                    <form onSubmit={handleRegister} className="px-8 pb-8 flex flex-col gap-5">
                        {/* Display Name Field */}
                        <div className="space-y-1.5">
                            <label className="block text-sm font-semibold text-[#181611] ml-1" htmlFor="name">Display Name</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-[#887e63] group-focus-within:text-cta-gold transition-colors text-[20px]">badge</span>
                                </div>
                                <input
                                    className="w-full bg-surface-beige text-[#181611] placeholder-[#887e63]/60 text-base rounded-xl border-none focus:ring-2 focus:ring-cta-gold/50 focus:bg-[#fcfcf9] transition-all duration-200 h-14 pl-12 pr-4 shadow-inner"
                                    id="name"
                                    placeholder="How should we call you?"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {/* Email Field */}
                        <div className="space-y-1.5">
                            <label className="block text-sm font-semibold text-[#181611] ml-1" htmlFor="email">Institutional Email</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <span className="material-symbols-outlined text-[#887e63] group-focus-within:text-cta-gold transition-colors text-[20px]">mail</span>
                                </div>
                                <input
                                    className="w-full bg-surface-beige text-[#181611] placeholder-[#887e63]/60 text-base rounded-xl border-none focus:ring-2 focus:ring-cta-gold/50 focus:bg-[#fcfcf9] transition-all duration-200 h-14 pl-12 pr-4 shadow-inner"
                                    id="email"
                                    placeholder="student@university.edu"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {/* Password Fields Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Password */}
                            <div className="space-y-1.5">
                                <label className="block text-sm font-semibold text-[#181611] ml-1" htmlFor="password">Password</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <span className="material-symbols-outlined text-[#887e63] group-focus-within:text-cta-gold transition-colors text-[20px]">lock</span>
                                    </div>
                                    <input
                                        className="w-full bg-surface-beige/30 text-[#181611] placeholder-[#887e63]/60 text-base rounded-xl border-none focus:ring-2 focus:ring-cta-gold/50 focus:bg-white/80 transition-all duration-200 h-14 pl-12 pr-10"
                                        id="password"
                                        placeholder="Create password"
                                        type={showPassword ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        disabled={isLoading}
                                        autoComplete="new-password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                                    >
                                        <span className="material-symbols-outlined text-[#887e63] hover:text-[#181611] text-[20px] transition-colors">
                                            {showPassword ? 'visibility' : 'visibility_off'}
                                        </span>
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-1.5">
                                <label className="block text-sm font-semibold text-[#181611] ml-1" htmlFor="confirm-password">Confirm Password</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <span className="material-symbols-outlined text-[#887e63] group-focus-within:text-cta-gold transition-colors text-[20px]">verified_user</span>
                                    </div>
                                    <input
                                        className="w-full bg-surface-beige/30 text-[#181611] placeholder-[#887e63]/60 text-base rounded-xl border-none focus:ring-2 focus:ring-cta-gold/50 focus:bg-white/80 transition-all duration-200 h-14 pl-12 pr-4"
                                        id="confirm-password"
                                        placeholder="Re-enter password"
                                        type="password"
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        disabled={isLoading}
                                        autoComplete="new-password"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Password Strength & Validation Indicator */}
                        <div className="flex flex-col gap-2 mt-[-4px]">
                            <div className="w-full flex gap-1.5 h-1.5">
                                <div className={`flex-1 rounded-full ${passwordStrength.level >= 1 ? 'bg-green-500/80' : 'bg-surface-beige'}`}></div>
                                <div className={`flex-1 rounded-full ${passwordStrength.level >= 2 ? 'bg-green-500/80' : 'bg-surface-beige'}`}></div>
                                <div className={`flex-1 rounded-full ${passwordStrength.level >= 3 ? 'bg-green-500/80' : 'bg-surface-beige'}`}></div>
                                <div className={`flex-1 rounded-full ${passwordStrength.level >= 4 ? 'bg-green-500/80' : 'bg-surface-beige'}`}></div>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <p className="text-[#887e63]">Password strength: <span className={`${passwordStrength.color} font-bold`}>{passwordStrength.text}</span></p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="group w-full h-14 bg-cta-gold hover:bg-[#d4a018] active:bg-[#b58814] text-[#181611] text-base font-bold rounded-xl shadow-lg shadow-cta-gold/20 flex items-center justify-center gap-2 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#181611]"></div>
                                        <span>Creating account...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Register & Continue</span>
                                        <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Mobile Login Link */}
                        <div className="sm:hidden text-center mt-2 pb-2">
                            <span className="text-sm text-[#887e63] font-medium mr-2">Already a member?</span>
                            <Link to="/login" className="text-[#181611] text-sm font-bold hover:text-cta-gold underline decoration-cta-gold/30 underline-offset-4">Log In</Link>
                        </div>
                    </form>
                </div>

                {/* Footer Info */}
                <div className="absolute bottom-4 text-center text-[#887e63] text-xs opacity-60">
                    © 2023 Student Hub. All rights reserved.
                </div>
            </main>
        </div>
    );
};
