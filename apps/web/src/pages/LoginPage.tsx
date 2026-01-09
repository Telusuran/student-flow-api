import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signIn } from '../lib/auth-client';

export const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const result = await signIn.email({
                email,
                password,
            });

            if (result.error) {
                setError(result.error.message || 'Login failed. Please check your credentials.');
            } else {
                // Redirect to dashboard on success
                navigate('/');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
            console.error('Login error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-text-main antialiased min-h-screen flex flex-col font-display">
            {/* Top Navigation */}
            <header className="w-full absolute top-0 left-0 z-50">
                <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <div className="flex items-center gap-2">
                            <div className="size-8 text-primary bg-white/90 rounded-lg flex items-center justify-center shadow-sm">
                                <span className="material-symbols-outlined">school</span>
                            </div>
                            <h2 className="text-text-main text-xl font-bold tracking-tight">StudentProj</h2>
                        </div>
                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center gap-8">
                            <nav className="flex gap-6">
                                <a className="text-text-main/80 hover:text-primary font-medium text-sm transition-colors" href="#">About</a>
                                <a className="text-text-main/80 hover:text-primary font-medium text-sm transition-colors" href="#">Features</a>
                                <a className="text-text-main/80 hover:text-primary font-medium text-sm transition-colors" href="#">Contact</a>
                            </nav>
                            <div className="h-6 w-px bg-gray-300"></div>
                            <div className="flex gap-3">
                                <a className="text-text-main hover:text-primary font-semibold text-sm py-2 px-3" href="#">Log In</a>
                                <Link to="/register" className="bg-primary hover:bg-primary-hover text-text-main text-sm font-bold py-2 px-5 rounded-lg transition-colors shadow-sm">
                                    Register
                                </Link>
                            </div>
                        </div>
                        {/* Mobile Menu Button */}
                        <button className="md:hidden p-2 text-text-main">
                            <span className="material-symbols-outlined">menu</span>
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow flex items-center justify-center relative w-full pt-20 pb-10 px-4 sm:px-6 lg:px-8">
                {/* Background decorative elements */}
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-blue-200/30 rounded-full blur-3xl pointer-events-none"></div>

                <div className="max-w-[1100px] w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center z-10">
                    {/* Left Column: Hero Text & Illustration */}
                    <div className="flex flex-col gap-8 text-center lg:text-left order-2 lg:order-1">
                        <div className="space-y-4">
                            <div className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm px-3 py-1 rounded-full w-fit mx-auto lg:mx-0 border border-white/50">
                                <span className="size-2 rounded-full bg-green-500 animate-pulse"></span>
                                <span className="text-xs font-medium text-text-muted">v2.0 is now live</span>
                            </div>
                            <h1 className="text-4xl lg:text-6xl font-black text-text-main leading-[1.1] tracking-tight">
                                Master your <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">academic goals.</span>
                            </h1>
                            <p className="text-lg text-text-muted max-w-xl mx-auto lg:mx-0 leading-relaxed">
                                Track progress, collaborate with peers, and never miss a deadline. Join thousands of students achieving their potential with StudentProj.
                            </p>
                        </div>
                        <div className="hidden lg:block relative mt-4">
                            <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl bg-white border-4 border-white transform rotate-2 hover:rotate-0 transition-transform duration-500" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCorSsz3qh5Aw_HWVbEDVH-5P9KbaKf3F_2nqFv_r2PVaYT0GqL1rs5wuB3r_kRru730WaPfsm00J14I_6o2xS3PQH5NyvdaGfwJIAyxsXjA9tx79BI3fq05_qgRajViV1qedxvvm5gh9FAYHK-sA9apdhJD5V63HhLGq4VtE5TSKqq4QuNBeGI6RWZCmlzqw09rQlRiJ_Vairyx9rE8ng2FnKjbg8GBiv41beCVNuTfcvqSOrxjjNsi1onTQgOYUHzaNmzZNgFbhY-")', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
                                    <div className="text-white">
                                        <p className="font-bold text-lg">Group Study Sessions</p>
                                        <p className="text-sm opacity-90">Collaborate in real-time</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-4 justify-center lg:justify-start lg:hidden">
                            <Link to="/register" className="bg-primary hover:bg-primary-hover text-text-main font-bold py-2 px-8 rounded-lg shadow-lg shadow-primary/20 transition-all transform hover:-translate-y-0.5">
                                Get Started
                            </Link>
                            <button className="bg-white hover:bg-gray-50 text-text-main font-bold py-3 px-8 rounded-lg shadow-sm border border-gray-100 transition-all">
                                Learn More
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Login Card */}
                    <div className="w-full max-w-md mx-auto order-1 lg:order-2">
                        <div className="bg-card-beige rounded-2xl shadow-soft p-8 relative overflow-hidden border border-white/50">
                            {/* Top accent line */}
                            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50"></div>
                            <div className="mb-8 text-center">
                                <h2 className="text-2xl font-bold text-text-main mb-2">Welcome Back</h2>
                                <p className="text-text-muted text-sm">Please enter your details to sign in.</p>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-center gap-2">
                                    <span className="material-symbols-outlined text-base">error</span>
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-5">
                                {/* Email Field */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-text-main" htmlFor="email">Student Email</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                                            <span className="material-symbols-outlined text-[20px]">mail</span>
                                        </div>
                                        <input
                                            className="block w-full rounded-lg border-gray-200 bg-white pl-10 pr-4 py-3 text-text-main placeholder-gray-400 focus:border-primary focus:ring-primary sm:text-sm shadow-sm transition-shadow"
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
                                {/* Password Field */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-semibold text-text-main" htmlFor="password">Password</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-text-muted">
                                            <span className="material-symbols-outlined text-[20px]">lock</span>
                                        </div>
                                        <input
                                            className="block w-full rounded-lg border-gray-200 bg-white pl-10 pr-10 py-3 text-text-main placeholder-gray-400 focus:border-primary focus:ring-primary sm:text-sm shadow-sm transition-shadow"
                                            id="password"
                                            placeholder="••••••••"
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            disabled={isLoading}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer text-text-muted hover:text-primary transition-colors"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">
                                                {showPassword ? 'visibility' : 'visibility_off'}
                                            </span>
                                        </button>
                                    </div>
                                </div>
                                {/* Options */}
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <input className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary bg-white" id="remember-me" name="remember-me" type="checkbox" />
                                        <label className="ml-2 block text-sm text-text-muted" htmlFor="remember-me">Remember me</label>
                                    </div>
                                    <div className="text-sm">
                                        <Link to="/forgot-password" className="font-medium text-primary hover:text-primary-hover">Forgot password?</Link>
                                    </div>
                                </div>
                                {/* Submit Button */}
                                <button
                                    className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-text-main bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    type="submit"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-text-main mr-2"></div>
                                            Signing in...
                                        </>
                                    ) : (
                                        'Sign In'
                                    )}
                                </button>
                            </form>
                            <div className="mt-8">
                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-gray-300/60"></div>
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-2 bg-card-beige text-text-muted">Or continue with</span>
                                    </div>
                                </div>
                                <div className="mt-6 grid grid-cols-2 gap-3">
                                    <button className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-gray-200 rounded-lg shadow-sm bg-white text-sm font-medium text-text-main hover:bg-gray-50 transition-colors" type="button">
                                        <img alt="Google logo" className="h-5 w-5 mr-2" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDj3KlKk-Z_sLwa2yEbjLEfAoEyQOlB26p9w9k5AVErpXNHeLMuPD446mfX0ncLer6_KixDi-A0lScfLfyNhDshYbRD9Tex1bccfbEDAGoRPHfuTnfLbn_Ujsn5xiMiIsHYo1I2J9DlGvYlwDsBJEm3WDORL-8u2adhjNQ40i0grIEzes7xynvpCWo9QJeq5PuZbEVnKzYRyNb4DOhKm11VHaAxkrhZdltx2a2GiDMgqjBSI4gxcoZkStOnCb8fDjwI_7CONqOCg0a4" />
                                        Google
                                    </button>
                                    <button className="w-full inline-flex justify-center items-center py-2.5 px-4 border border-gray-200 rounded-lg shadow-sm bg-white text-sm font-medium text-text-main hover:bg-gray-50 transition-colors" type="button">
                                        <img alt="Microsoft logo" className="h-5 w-5 mr-2" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCtlzXHFWet2pa7wmQVDKd54ejk9fyipzXY0A-Ds5HwIZ4FTj0oKJNxeWlkDi3BE7dWQ3MzPFssjserB_FtpvsY3FwwWHMI_JyFNEEOmhM8QrcNBKbf0tT3dsluYBorv6VECHMl3ScKjevhNdoa_SMxQKMljGKfki1E8tNHOV462ETCLRHROHU5H4bNp-wkmjuMy8UACrUQq4uCe-8LFIwUQ_Oe0CwFUNEMokqSzAdNO2g-tg_BzrB-B0sGmVJksLu4HMdvjt8tYHAd" />
                                        Microsoft
                                    </button>
                                </div>
                            </div>
                            <div className="mt-6 text-center">
                                <p className="text-sm text-text-muted">
                                    Don't have an account?
                                    <Link to="/register" className="font-bold text-primary hover:text-primary-hover transition-colors">Register now</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            {/* Simple Footer */}
            <footer className="w-full py-6">
                <div className="max-w-[1280px] mx-auto px-4 text-center">
                    <p className="text-xs text-text-muted/60">© 2023 StudentProj Inc. All rights reserved. • <a className="hover:text-primary" href="#">Privacy</a> • <a className="hover:text-primary" href="#">Terms</a></p>
                </div>
            </footer>
        </div>
    );
};
