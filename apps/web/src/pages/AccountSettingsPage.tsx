import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCurrentUser, useUpdateProfile } from '../hooks/useCurrentUser';

export const AccountSettingsPage: React.FC = () => {
    const { data: user, isLoading } = useCurrentUser();
    const updateProfile = useUpdateProfile();

    const [newEmail, setNewEmail] = useState('');
    const [confirmEmail, setConfirmEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
    const [updateSuccess, setUpdateSuccess] = useState(false);

    const handleUpdateEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        setEmailError('');
        setUpdateSuccess(false);

        if (!newEmail || !confirmEmail) {
            setEmailError('Please fill in both email fields.');
            return;
        }

        if (newEmail !== confirmEmail) {
            setEmailError('Emails do not match.');
            return;
        }

        if (newEmail === user?.email) {
            setEmailError('New email must be different from current email.');
            return;
        }

        setIsUpdatingEmail(true);
        try {
            await updateProfile.mutateAsync({ email: newEmail });
            setUpdateSuccess(true);
            setNewEmail('');
            setConfirmEmail('');
            // Optional: show a toast or global notification
        } catch (error) {
            console.error('Failed to update email:', error);
            setEmailError('Failed to update email. It might be already taken.');
        } finally {
            setIsUpdatingEmail(false);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-bg">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="bg-neutral-bg text-text-main overflow-hidden font-display">
            <div className="flex h-screen w-full overflow-hidden">
                {/* Sidebar */}
                <aside className="hidden w-72 flex-col justify-between border-r border-[#e6e2d8] bg-white p-6 lg:flex overflow-y-auto">
                    <div className="flex flex-col gap-8">
                        <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center rounded-lg bg-primary/20 p-2">
                                <span className="material-symbols-outlined text-primary">school</span>
                            </div>
                            <h1 className="text-xl font-bold tracking-tight text-text-main">UniProjects</h1>
                        </div>
                        <div className="flex flex-col gap-2">
                            <Link to="/" className="flex items-center gap-3 rounded-lg px-3 py-3 text-text-main hover:bg-background-light transition-colors">
                                <span className="material-symbols-outlined">dashboard</span>
                                <p className="text-sm font-medium">Dashboard</p>
                            </Link>
                            <Link to="/project" className="flex items-center gap-3 rounded-lg px-3 py-3 text-text-main hover:bg-background-light transition-colors">
                                <span className="material-symbols-outlined">folder_open</span>
                                <p className="text-sm font-medium">Projects</p>
                            </Link>
                            <Link to="/data-insight" className="flex items-center gap-3 rounded-lg px-3 py-3 text-text-main hover:bg-background-light transition-colors">
                                <span className="material-symbols-outlined">bar_chart</span>
                                <p className="text-sm font-medium">Progress</p>
                            </Link>
                            <div className="my-2 h-px bg-[#f4f3f0]"></div>
                            <Link to="/settings/account" className="flex items-center gap-3 rounded-lg bg-primary/10 px-3 py-3 text-primary transition-colors">
                                <span className="material-symbols-outlined">settings</span>
                                <p className="text-sm font-medium">Account Settings</p>
                            </Link>
                            <Link to="/settings/notifications" className="flex items-center gap-3 rounded-lg px-3 py-3 text-text-main hover:bg-background-light transition-colors">
                                <span className="material-symbols-outlined">notifications</span>
                                <p className="text-sm font-medium">Notifications</p>
                            </Link>
                        </div>
                    </div>
                </aside>

                {/* Main Content Area */}
                <div className="flex flex-1 flex-col h-full overflow-hidden">
                    {/* Top Navigation */}
                    <header className="flex h-16 flex-none items-center justify-between border-b border-[#e6e2d8] bg-white px-8">
                        <div className="flex items-center gap-4 lg:hidden">
                            <button className="flex items-center justify-center text-text-main">
                                <span className="material-symbols-outlined">menu</span>
                            </button>
                            <h2 className="text-lg font-bold">Settings</h2>
                        </div>
                        {/* Search and Actions (Desktop) */}
                        <div className="hidden flex-1 items-center justify-between gap-8 lg:flex">
                            <div className="flex items-center gap-2 text-sm text-text-muted">
                                {/* Breadcrumbs inline */}
                                <Link to="/" className="cursor-pointer hover:text-text-main">Home</Link>
                                <span className="material-symbols-outlined text-xs">chevron_right</span>
                                <span className="cursor-pointer hover:text-text-main">Settings</span>
                                <span className="material-symbols-outlined text-xs">chevron_right</span>
                                <span className="font-medium text-text-main">Account</span>
                            </div>
                            <div className="flex items-center gap-6">
                                <Link to="/notifications" className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-[#f4f3f0] text-text-main hover:bg-[#e6e2d8] transition-colors">
                                    <span className="material-symbols-outlined">notifications</span>
                                </Link>
                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-full bg-cover bg-center border border-gray-200" style={{ backgroundImage: `url("${user?.image || 'https://ui-avatars.com/api/?name=' + user?.name}")` }}></div>
                                    <span className="text-sm font-medium text-text-main">{user?.name}</span>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Scrollable Content */}
                    <main className="flex-1 overflow-y-auto bg-neutral-bg p-6 md:p-10">
                        <div className="mx-auto flex max-w-4xl flex-col gap-8">
                            {/* Page Heading */}
                            <div className="flex flex-col gap-2">
                                <h1 className="text-3xl font-black tracking-tight text-text-main md:text-4xl">Account Settings</h1>
                                <p className="text-text-muted">Manage your personal information, contact details, and security preferences.</p>
                            </div>

                            {/* Profile Overview Card */}
                            <section className="rounded-xl bg-card-beige p-6 shadow-sm md:p-8">
                                <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
                                    <div className="flex gap-5">
                                        <div className="relative">
                                            <div className="h-24 w-24 rounded-full border-4 border-white bg-cover bg-center shadow-sm" style={{ backgroundImage: `url("${user?.image || 'https://ui-avatars.com/api/?name=' + user?.name}")` }}></div>
                                            <Link to="/settings/profile" className="absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-white text-text-main shadow hover:bg-gray-50">
                                                <span className="material-symbols-outlined text-sm">edit</span>
                                            </Link>
                                        </div>
                                        <div className="flex flex-col justify-center pt-2">
                                            <h3 className="text-xl font-bold text-text-main">{user?.name}</h3>
                                            <p className="text-text-muted">Student Account</p>
                                            <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 w-fit">
                                                <span className="material-symbols-outlined text-[14px]">verified</span>
                                                Active Student
                                            </div>
                                        </div>
                                    </div>
                                    <Link to="/settings/profile" className="mt-4 flex items-center justify-center gap-2 rounded-lg border border-[#e6e2d8] bg-white px-4 py-2 text-sm font-bold text-text-main hover:bg-gray-50 md:mt-0 transition-colors">
                                        <span className="material-symbols-outlined text-lg">edit</span>
                                        Edit Profile
                                    </Link>
                                </div>
                            </section>

                            {/* Email & Contact Card */}
                            <section className="rounded-xl bg-card-beige p-6 shadow-sm md:p-8">
                                <div className="mb-6 flex items-center gap-3 border-b border-[#e6e2d8] pb-4">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 text-primary">
                                        <span className="material-symbols-outlined">mail</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-text-main">Email Address</h3>
                                </div>
                                <form className="flex flex-col gap-6" onSubmit={handleUpdateEmail}>
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-sm font-bold text-text-main">Current Email</label>
                                            <div className="flex items-center rounded-lg border border-[#e6e2d8] bg-white/50 px-4 py-2.5 text-text-muted cursor-not-allowed">
                                                <span className="material-symbols-outlined mr-2 text-text-muted">lock</span>
                                                {user?.email}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid gap-6 md:grid-cols-2">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-sm font-bold text-text-main">New Email Address</label>
                                            <input
                                                className="rounded-lg border border-[#e6e2d8] bg-white px-4 py-2.5 text-text-main focus:border-primary focus:ring-primary focus:outline-none"
                                                placeholder="Enter new email"
                                                type="email"
                                                value={newEmail}
                                                onChange={(e) => setNewEmail(e.target.value)}
                                            />
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <label className="text-sm font-bold text-text-main">Confirm Email</label>
                                            <input
                                                className="rounded-lg border border-[#e6e2d8] bg-white px-4 py-2.5 text-text-main focus:border-primary focus:ring-primary focus:outline-none"
                                                placeholder="Confirm new email"
                                                type="email"
                                                value={confirmEmail}
                                                onChange={(e) => setConfirmEmail(e.target.value)}
                                            />
                                        </div>
                                    </div>

                                    {emailError && (
                                        <div className="text-sm text-red-500 font-medium bg-red-50 p-3 rounded-lg border border-red-100">
                                            {emailError}
                                        </div>
                                    )}

                                    {updateSuccess && (
                                        <div className="text-sm text-green-600 font-medium bg-green-50 p-3 rounded-lg border border-green-100 flex items-center gap-2">
                                            <span className="material-symbols-outlined text-[18px]">check_circle</span>
                                            Email updated successfully!
                                        </div>
                                    )}

                                    <div className="flex items-center justify-end pt-2">
                                        <button
                                            type="submit"
                                            disabled={isUpdatingEmail || !newEmail || !confirmEmail}
                                            className="flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-text-main hover:bg-primary-hover transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isUpdatingEmail ? (
                                                <>
                                                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-text-main"></span>
                                                    Updating...
                                                </>
                                            ) : (
                                                <>
                                                    <span className="material-symbols-outlined text-lg">save</span>
                                                    Update Email
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </section>

                            {/* Danger Zone Card */}
                            <section className="rounded-xl border border-error/30 bg-card-beige p-6 shadow-sm md:p-8 relative overflow-hidden">
                                {/* Decorative background accent */}
                                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-error/5"></div>
                                <div className="mb-6 flex items-center gap-3 border-b border-error/20 pb-4 relative z-10">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-error/10 text-error">
                                        <span className="material-symbols-outlined">warning</span>
                                    </div>
                                    <h3 className="text-xl font-bold text-error">Danger Zone</h3>
                                </div>
                                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between relative z-10">
                                    <div className="max-w-lg">
                                        <h4 className="text-base font-bold text-text-main">Delete Account</h4>
                                        <p className="mt-1 text-sm text-text-muted leading-relaxed">
                                            Once you delete your account, there is no going back. All your projects, progress tracking, and personal data will be permanently removed from our servers.
                                        </p>
                                    </div>
                                    <Link to="/settings/delete-account" className="whitespace-nowrap rounded-lg bg-error px-6 py-2.5 text-sm font-bold text-white hover:bg-red-600 transition-colors shadow-sm focus:ring-2 focus:ring-red-400 focus:ring-offset-2 focus:ring-offset-card-beige">
                                        Delete Account
                                    </Link>
                                </div>
                            </section>
                        </div>
                        {/* Footer Spacer */}
                        <div className="h-20"></div>
                    </main>
                </div>
            </div>
        </div>
    );
};
