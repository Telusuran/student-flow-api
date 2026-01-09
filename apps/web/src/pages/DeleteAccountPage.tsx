import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDeleteAccount } from '../hooks/useCurrentUser';
import { signOut } from '../lib/auth-client';

export const DeleteAccountPage: React.FC = () => {
    const navigate = useNavigate();
    const [confirmText, setConfirmText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const deleteAccount = useDeleteAccount();

    const isDeleteEnabled = confirmText === 'DELETE';

    const handleCancel = () => {
        navigate('/settings/account');
    };

    const handleDelete = async () => {
        if (!isDeleteEnabled || isDeleting) return;

        setIsDeleting(true);
        try {
            await deleteAccount.mutateAsync();
            await signOut();
            navigate('/account-deleted');
        } catch (error) {
            console.error('Failed to delete account:', error);
            alert('Failed to delete account. Please try again.');
            setIsDeleting(false);
        }
    };

    return (
        <div className="bg-neutral-bg dark:bg-background-dark font-display text-text-main">
            <div className="relative flex min-h-screen flex-col overflow-x-hidden">
                {/* Top Navigation */}
                <header className="flex items-center justify-between whitespace-nowrap bg-white/80 dark:bg-[#181010]/90 backdrop-blur-md border-b border-solid border-[#f5f0f0] dark:border-[#333] px-10 py-3 sticky top-0 z-50">
                    <div className="flex items-center gap-4 text-text-main dark:text-white">
                        <div className="size-8 flex items-center justify-center bg-error/10 rounded-lg text-error">
                            <span className="material-symbols-outlined">school</span>
                        </div>
                        <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">Student Tracker</h2>
                    </div>
                    <div className="flex flex-1 justify-end gap-8 items-center">
                        <div className="hidden md:flex items-center gap-9">
                            <Link to="/project" className="text-text-main dark:text-gray-200 text-sm font-medium leading-normal hover:text-error transition-colors">Projects</Link>
                            <Link to="/data-insights" className="text-text-main dark:text-gray-200 text-sm font-medium leading-normal hover:text-error transition-colors">Progress</Link>
                            <Link to="/settings/account" className="text-text-main dark:text-gray-200 text-sm font-medium leading-normal hover:text-error transition-colors">Settings</Link>
                        </div>
                        <div className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border-2 border-white shadow-sm" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD6pcH3GpjJMa3c-n1jaHchBfo0oZPM39fcCMHv-tUm738PZlgBdl9KzhjU0_imBuOVxbYe5CcxdImkFnkvIx4HikhzL3cG5FRaz-tSpkW0QWJWcWo3KAzp50IN4aoPBhfhtRDIoaEfu7VRIU8MgypbNhg6OnRAJGYzztRnng-crKJs-Z0C4KxioZWCMVWQymmudvtqOkL8SGoHfaCMXCDZSRFDvJO5PUk9edH-KG5gVlZjCNXGcqALEWQ0_ZEpRGnVc9eErBTS11U6")' }}></div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
                    {/* Central Confirmation Card */}
                    <div className="w-full max-w-[560px] bg-card-beige dark:bg-[#2a2a2a] rounded-xl shadow-soft p-8 sm:p-12 relative overflow-hidden group">
                        {/* Decorative subtle pattern overlay */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-error/5 rounded-full -mr-16 -mt-16 pointer-events-none"></div>
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary-accent/10 rounded-full -ml-12 -mb-12 pointer-events-none"></div>

                        <div className="relative z-10 flex flex-col items-center text-center">
                            {/* Warning Icon */}
                            <div className="size-16 rounded-full bg-error/10 flex items-center justify-center mb-6 animate-pulse">
                                <span className="material-symbols-outlined text-error text-4xl">warning</span>
                            </div>

                            {/* Headline */}
                            <h1 className="text-text-main dark:text-white tracking-tight text-2xl sm:text-[32px] font-bold leading-tight mb-4">
                                Are you sure you want to delete your account?
                            </h1>

                            {/* Body Text */}
                            <p className="text-text-main/80 dark:text-gray-300 text-base font-normal leading-relaxed mb-8 max-w-md">
                                This action cannot be undone. All your <span className="font-bold text-text-main dark:text-white">projects</span>, <span className="font-bold text-text-main dark:text-white">progress tracking</span>, and student data will be permanently removed from our servers.
                            </p>

                            {/* Input Field Section */}
                            <div className="w-full max-w-sm mb-8">
                                <label className="block text-left mb-2 text-sm font-medium text-text-main dark:text-gray-200">
                                    To confirm, please type <span className="font-bold text-error select-all">DELETE</span> below
                                </label>
                                <div className="relative">
                                    <input
                                        className="w-full bg-white dark:bg-[#333] border-2 border-secondary-accent/20 dark:border-gray-600 rounded-lg px-4 py-3 text-base text-text-main dark:text-white placeholder:text-secondary-accent/50 focus:outline-none focus:border-error focus:ring-1 focus:ring-error transition-all shadow-sm"
                                        placeholder="Type DELETE here"
                                        type="text"
                                        value={confirmText}
                                        onChange={(e) => setConfirmText(e.target.value)}
                                    />
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary-accent/40 pointer-events-none">
                                        <span className="material-symbols-outlined text-xl">edit</span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col-reverse sm:flex-row gap-3 w-full max-w-sm">
                                <button
                                    onClick={handleCancel}
                                    className="flex-1 h-12 px-6 rounded-lg bg-secondary-accent hover:bg-secondary-accent/90 text-white text-base font-bold transition-all transform active:scale-95 shadow-sm flex items-center justify-center gap-2"
                                >
                                    <span className="material-symbols-outlined text-xl">arrow_back</span>
                                    Cancel
                                </button>
                                <button
                                    onClick={handleDelete}
                                    disabled={!isDeleteEnabled || isDeleting}
                                    className={`flex-1 h-12 px-6 rounded-lg text-white text-base font-bold shadow-md transition-all transform active:scale-95 flex items-center justify-center gap-2 ${isDeleteEnabled && !isDeleting
                                        ? 'bg-error hover:bg-red-600 shadow-error/20 cursor-pointer'
                                        : 'bg-error/50 cursor-not-allowed'
                                        }`}
                                >
                                    {isDeleting ? (
                                        <>
                                            <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                                            Deleting...
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined text-xl">delete_forever</span>
                                            Confirm Deletion
                                        </>
                                    )}
                                </button>
                            </div>

                            <p className="mt-6 text-xs text-secondary-accent dark:text-gray-500">
                                Need to archive your data instead? <a className="underline hover:text-error transition-colors" href="#">Export your projects here.</a>
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};
