import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCurrentUser, useUpdateProfile } from '../hooks/useCurrentUser';

export const EditProfilePage: React.FC = () => {
    const navigate = useNavigate();
    const { data: user, isLoading } = useCurrentUser();
    const updateProfile = useUpdateProfile();

    const [name, setName] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    // Populate form with user data when loaded
    useEffect(() => {
        if (user?.name) {
            setName(user.name);
        }
    }, [user]);

    const handleCancel = () => {
        navigate(-1); // Go back
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setSaveSuccess(false);

        try {
            await updateProfile.mutateAsync({ name });
            setSaveSuccess(true);
            setTimeout(() => {
                navigate('/');
            }, 1000);
        } catch (error) {
            console.error('Failed to update profile:', error);
            alert('Failed to update profile. Please try again.');
        } finally {
            setIsSaving(false);
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
        <div className="bg-neutral-bg min-h-screen flex flex-col font-display text-text-main">
            {/* Top Navigation */}
            <header className="flex items-center justify-between whitespace-nowrap border-b border-white/50 bg-white/60 backdrop-blur-md px-10 py-3 sticky top-0 z-50">
                <div className="flex items-center gap-4 text-text-main">
                    <div className="size-8 flex items-center justify-center rounded-lg bg-primary/20 text-primary">
                        <span className="material-symbols-outlined text-xl">school</span>
                    </div>
                    <h2 className="text-text-main text-lg font-bold leading-tight tracking-[-0.015em]">ProjectTrack</h2>
                </div>
                <div className="flex flex-1 justify-end gap-8">
                    <div className="hidden md:flex items-center gap-9">
                        <Link to="/" className="text-text-main text-sm font-medium hover:text-primary transition-colors">Dashboard</Link>
                        <Link to="/project" className="text-text-main text-sm font-medium hover:text-primary transition-colors">Projects</Link>
                        <a className="text-text-main text-sm font-medium hover:text-primary transition-colors" href="#">Grades</a>
                    </div>
                    <div className="bg-center bg-no-repeat bg-cover rounded-full size-10 border-2 border-white shadow-sm" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuC6JXHpkCFvwjlkVzWIhw-224QZNLf8p6d6i_J4F-F6vabrZ0ACKIdB9gvDtdEzc2rnCUBOZYcfrUeEeMildd5SOvWfWs0UklgpeyRLauwXlhmrvUeItgoIv9-FxEe2oOZO0WDUNUyVrOUsCJbRSa7YTDozBlL2Ur6Yy1_dkiOhzE1I0eL7xrve_Uo8tJuazZD4t3OkFYSKtN6xDo90nGGDhF5YNLIyC5LZuWPHQrDnGMwsrr039jKKpWRBBxFBc9WxqbPE-34579gh")' }}></div>
                </div>
            </header>

            <main className="flex-grow w-full px-4 sm:px-6 lg:px-8 py-10 flex justify-center">
                <div className="w-full max-w-4xl flex flex-col gap-6">
                    {/* Breadcrumbs */}
                    <nav aria-label="Breadcrumb" className="flex px-2">
                        <ol className="flex items-center space-x-2">
                            <li>
                                <Link to="/" className="text-text-muted hover:text-primary text-sm font-medium">Home</Link>
                            </li>
                            <li>
                                <span className="text-text-muted/50 text-sm">/</span>
                            </li>
                            <li>
                                <Link to="/settings/account" className="text-text-muted hover:text-primary text-sm font-medium">Settings</Link>
                            </li>
                            <li>
                                <span className="text-text-muted/50 text-sm">/</span>
                            </li>
                            <li>
                                <span aria-current="page" className="text-text-main text-sm font-medium">Edit Profile</span>
                            </li>
                        </ol>
                    </nav>

                    {/* Page Heading */}
                    <div className="flex flex-col gap-2 px-2">
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-text-main">Edit Profile</h1>
                        <p className="text-text-muted text-base max-w-2xl">Update your personal details, academic information, and profile photo.</p>
                    </div>

                    {/* Main Content Card */}
                    <div className="bg-white rounded-2xl shadow-soft overflow-hidden border border-white/60">
                        {/* Profile Header Section */}
                        <div className="p-6 md:p-8 border-b border-gray-100 bg-gradient-to-r from-card-beige to-white">
                            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                                <div className="relative group">
                                    <div className="bg-center bg-no-repeat bg-cover rounded-full size-32 shadow-md border-4 border-white" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBSaaI-gMMkgobRraR3vK4rqYF2eN4lNF4J69X91sBXLDnfzW_8NE74PAmm6mnkV-4Bg25NJ8r_aL7rfJByAO4043HLviokzVWHPOCjD_KavBa_q4D2iQ9hIj8lNGBYEqQEubKS9xMih7q7ucdGfY_02VUquuFUHghBk9qqxGVSTYltYF8jzuky8rFJk5TTQTxtIjYE_9uMtpd0Jp5y2GrYzKb1AhDonajAMIBzGqCYbX3gcWwdGt7cxGQJwL-iQkMUiLHU5n7Zo9Jq")' }}></div>
                                    <button className="absolute bottom-0 right-0 bg-primary text-text-main p-2 rounded-full shadow-lg hover:bg-yellow-400 transition-colors" title="Upload new photo">
                                        <span className="material-symbols-outlined text-sm">photo_camera</span>
                                    </button>
                                </div>
                                <div className="flex flex-col items-center sm:items-start justify-center flex-1 pt-2">
                                    <h3 className="text-xl font-bold text-text-main">Profile Photo</h3>
                                    <p className="text-text-muted text-sm mt-1 text-center sm:text-left">This will be displayed on your profile and in project groups.</p>
                                    <div className="flex gap-3 mt-4">
                                        <button className="inline-flex items-center justify-center px-4 py-2 border border-gray-200 shadow-sm text-sm font-medium rounded-lg text-text-main bg-card-beige hover:bg-[#eae8d6] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors" type="button">
                                            Change Photo
                                        </button>
                                        <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-red-600 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors" type="button">
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Form Section */}
                        <div className="p-6 md:p-8 bg-white">
                            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                {/* Full Name */}
                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-sm font-medium text-text-main mb-2" htmlFor="full-name">Full Name</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="material-symbols-outlined text-text-muted/60">person</span>
                                        </div>
                                        <input
                                            className="block w-full pl-10 pr-3 py-3 bg-card-beige border-transparent rounded-xl text-text-main placeholder-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all sm:text-sm shadow-sm"
                                            id="full-name"
                                            name="full-name"
                                            placeholder="Enter your full name"
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                        />
                                    </div>
                                </div>

                                {/* Academic Institution */}
                                <div className="col-span-1">
                                    <label className="block text-sm font-medium text-text-main mb-2" htmlFor="institution">Academic Institution</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="material-symbols-outlined text-text-muted/60">account_balance</span>
                                        </div>
                                        <input className="block w-full pl-10 pr-3 py-3 bg-card-beige border-transparent rounded-xl text-text-main placeholder-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all sm:text-sm shadow-sm" id="institution" name="institution" placeholder="University or School" type="text" defaultValue="State University of Tech" />
                                    </div>
                                </div>

                                {/* Major */}
                                <div className="col-span-1">
                                    <label className="block text-sm font-medium text-text-main mb-2" htmlFor="major">Major / Field of Study</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="material-symbols-outlined text-text-muted/60">school</span>
                                        </div>
                                        <input className="block w-full pl-10 pr-3 py-3 bg-card-beige border-transparent rounded-xl text-text-main placeholder-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all sm:text-sm shadow-sm" id="major" name="major" placeholder="e.g. Computer Science" type="text" defaultValue="Computer Science" />
                                    </div>
                                </div>

                                {/* Student ID (Read Only) */}
                                <div className="col-span-1">
                                    <label className="block text-sm font-medium text-text-main mb-2" htmlFor="student-id">Student ID</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="material-symbols-outlined text-text-muted/60">badge</span>
                                        </div>
                                        <input className="block w-full pl-10 pr-3 py-3 bg-gray-50 border-transparent rounded-xl text-gray-500 cursor-not-allowed sm:text-sm shadow-none focus:ring-0" id="student-id" name="student-id" readOnly type="text" defaultValue="8829103" />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <span className="text-xs text-gray-400">Read-only</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="col-span-1">
                                    <label className="block text-sm font-medium text-text-main mb-2" htmlFor="email">Email Address</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <span className="material-symbols-outlined text-text-muted/60">mail</span>
                                        </div>
                                        <input
                                            className="block w-full pl-10 pr-3 py-3 bg-gray-50 border-transparent rounded-xl text-gray-500 cursor-not-allowed sm:text-sm shadow-none focus:ring-0"
                                            id="email"
                                            name="email"
                                            type="email"
                                            value={user?.email || ''}
                                            readOnly
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <span className="text-xs text-gray-400">Read-only</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Bio */}
                                <div className="col-span-1 md:col-span-2">
                                    <label className="block text-sm font-medium text-text-main mb-2" htmlFor="bio">Bio</label>
                                    <div className="relative">
                                        <textarea className="block w-full p-3 bg-card-beige border-transparent rounded-xl text-text-main placeholder-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all sm:text-sm shadow-sm resize-none" id="bio" name="bio" placeholder="Tell us a little about yourself and your academic interests..." rows={4}></textarea>
                                    </div>
                                    <p className="mt-2 text-sm text-text-muted">Brief description for your profile. URLs are hyperlinked.</p>
                                </div>

                                {/* Action Buttons */}
                                <div className="col-span-1 md:col-span-2 pt-4 flex flex-col-reverse sm:flex-row items-center justify-end gap-3 border-t border-gray-100 mt-2">
                                    <button onClick={handleCancel} className="w-full sm:w-auto px-6 py-3 border border-gray-300 shadow-sm text-sm font-bold rounded-xl text-text-main bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors" type="button">
                                        Cancel
                                    </button>
                                    <button
                                        className={`w-full sm:w-auto px-8 py-3 border border-transparent text-sm font-bold rounded-xl text-text-main focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-lg transition-all transform disabled:opacity-50 disabled:cursor-not-allowed ${saveSuccess ? 'bg-green-500 hover:bg-green-600 shadow-green-500/30' : 'bg-primary hover:bg-yellow-400 shadow-primary/30 hover:-translate-y-0.5'}`}
                                        type="submit"
                                        disabled={isSaving}
                                    >
                                        {isSaving ? (
                                            <span className="flex items-center gap-2">
                                                <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-text-main"></span>
                                                Saving...
                                            </span>
                                        ) : saveSuccess ? (
                                            <span className="flex items-center gap-2">
                                                <span className="material-symbols-outlined text-sm">check</span>
                                                Saved!
                                            </span>
                                        ) : (
                                            'Update Profile'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
