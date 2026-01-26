import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useNotificationSettings, useUpdateNotificationSettings } from '../hooks/useNotificationSettings';
import { useCurrentUser } from '../hooks/useCurrentUser';

export const NotificationSettingsPage: React.FC = () => {
    const { data: user } = useCurrentUser();
    const { data: serverSettings, isLoading } = useNotificationSettings();
    const updateSettings = useUpdateNotificationSettings();

    // Local state for form
    const [settings, setSettings] = useState({
        taskAssigned: true,
        taskAssignedEmail: true,
        taskAssignedInApp: true,
        taskStatusChange: false,
        deadlineApproaching: true,
        deadlinePush: true,
        alertTime: '24 hours before',
        projectReminders: true,
        documentUploaded: false
    });

    const [hasChanges, setHasChanges] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    // Sync local state with server data
    useEffect(() => {
        if (serverSettings) {
            setSettings({
                taskAssigned: serverSettings.taskAssigned ?? true,
                taskAssignedEmail: serverSettings.taskAssignedEmail ?? true,
                taskAssignedInApp: serverSettings.taskAssignedInApp ?? true,
                taskStatusChange: serverSettings.taskStatusChange ?? false,
                deadlineApproaching: serverSettings.deadlineApproaching ?? true,
                deadlinePush: serverSettings.deadlinePush ?? true,
                alertTime: serverSettings.alertTime ?? '24 hours before',
                projectReminders: serverSettings.projectReminders ?? true,
                documentUploaded: serverSettings.documentUploaded ?? false
            });
            setHasChanges(false);
        }
    }, [serverSettings]);

    const handleToggle = (key: keyof typeof settings) => {
        setSettings(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
        setHasChanges(true);
        setSaveSuccess(false);
    };

    const handleChange = (key: keyof typeof settings, value: string | boolean) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }));
        setHasChanges(true);
        setSaveSuccess(false);
    };

    const handleSave = async () => {
        try {
            await updateSettings.mutateAsync(settings);
            setHasChanges(false);
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (error) {
            console.error('Failed to save settings:', error);
        }
    };

    const handleCancel = () => {
        if (serverSettings) {
            setSettings({
                taskAssigned: serverSettings.taskAssigned ?? true,
                taskAssignedEmail: serverSettings.taskAssignedEmail ?? true,
                taskAssignedInApp: serverSettings.taskAssignedInApp ?? true,
                taskStatusChange: serverSettings.taskStatusChange ?? false,
                deadlineApproaching: serverSettings.deadlineApproaching ?? true,
                deadlinePush: serverSettings.deadlinePush ?? true,
                alertTime: serverSettings.alertTime ?? '24 hours before',
                projectReminders: serverSettings.projectReminders ?? true,
                documentUploaded: serverSettings.documentUploaded ?? false
            });
        }
        setHasChanges(false);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-light">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="bg-background-light dark:bg-background-dark text-text-main min-h-screen flex flex-col md:flex-row overflow-x-hidden font-display">
            {/* Side Navigation */}
            <div className="w-full md:w-80 bg-white border-r border-[#e5e3dc] flex-shrink-0 flex flex-col h-auto md:min-h-screen">
                <div className="p-6 flex flex-col gap-8 h-full">
                    {/* User Profile Summary */}
                    <div className="flex items-center gap-4">
                        <div
                            className="bg-center bg-no-repeat bg-cover rounded-full size-12 shadow-sm"
                            style={{ backgroundImage: `url("${user?.image || `https://ui-avatars.com/api/?name=${user?.name || 'User'}`}")` }}
                        ></div>
                        <div className="flex flex-col">
                            <h1 className="text-text-main text-lg font-medium leading-tight">{user?.name || 'User'}</h1>
                            <p className="text-text-muted text-sm font-normal">Student Account</p>
                        </div>
                    </div>
                    {/* Navigation Links */}
                    <div className="flex flex-col gap-2">
                        <Link to="/settings/profile" className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-background-light transition-colors group">
                            <span className="material-symbols-outlined text-text-muted group-hover:text-text-main">person</span>
                            <p className="text-text-main text-base font-medium">Profile</p>
                        </Link>
                        <Link to="/settings/account" className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-background-light transition-colors group">
                            <span className="material-symbols-outlined text-text-muted group-hover:text-text-main">shield</span>
                            <p className="text-text-main text-base font-medium">Security</p>
                        </Link>
                        {/* Active State */}
                        <Link to="/settings/notifications" className="flex items-center gap-3 px-3 py-3 rounded-lg bg-card-beige shadow-sm">
                            <span className="material-symbols-outlined text-text-main filled">notifications</span>
                            <p className="text-text-main text-base font-medium">Notifications</p>
                        </Link>
                    </div>
                    <div className="mt-auto">
                        <Link to="/login" className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-red-50 transition-colors group">
                            <span className="material-symbols-outlined text-red-500">logout</span>
                            <p className="text-red-500 text-base font-medium">Sign Out</p>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 bg-background-light">
                {/* Page Heading */}
                <header className="px-8 py-10 max-w-5xl mx-auto w-full">
                    <div className="flex flex-col gap-3">
                        <h1 className="text-text-main text-4xl font-black leading-tight tracking-[-0.033em]">Notification Settings</h1>
                        <p className="text-text-muted text-lg font-normal">Customize how and when you receive alerts for your projects and deadlines.</p>
                    </div>
                </header>

                {/* Success Message */}
                {saveSuccess && (
                    <div className="px-8 max-w-5xl mx-auto w-full">
                        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3 mb-6">
                            <span className="material-symbols-outlined text-green-600">check_circle</span>
                            <p className="text-green-700 font-medium">Settings saved successfully!</p>
                        </div>
                    </div>
                )}

                {/* Settings Content */}
                <div className="px-8 pb-20 max-w-5xl mx-auto w-full flex flex-col gap-8">
                    {/* Section: Task Updates */}
                    <section className="flex flex-col gap-4">
                        <h2 className="text-text-main text-xl font-bold px-1">Task Updates</h2>
                        <div className="bg-card-beige rounded-xl shadow-sm p-6 flex flex-col gap-6">
                            {/* Item 1 - New Task Assigned */}
                            <div className="flex flex-col gap-4 border-b border-[#e5e3dc] pb-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-white rounded-lg p-2 shadow-sm text-text-main flex items-center justify-center size-10">
                                            <span className="material-symbols-outlined">assignment_add</span>
                                        </div>
                                        <div>
                                            <p className="text-text-main text-lg font-medium">New Task Assigned</p>
                                            <p className="text-text-muted text-sm">Get notified when a mentor or peer assigns you a new task.</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={settings.taskAssigned}
                                            onChange={() => handleToggle('taskAssigned')}
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                    </label>
                                </div>
                                {/* Channels */}
                                <div className="pl-14 flex gap-6">
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 text-primary bg-white border-gray-300 rounded focus:ring-primary focus:ring-2"
                                            checked={settings.taskAssignedEmail}
                                            onChange={() => handleToggle('taskAssignedEmail')}
                                            disabled={!settings.taskAssigned}
                                        />
                                        <span className={`text-sm font-medium ${!settings.taskAssigned ? 'text-gray-400' : 'text-text-main'}`}>Email</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 text-primary bg-white border-gray-300 rounded focus:ring-primary focus:ring-2"
                                            checked={settings.taskAssignedInApp}
                                            onChange={() => handleToggle('taskAssignedInApp')}
                                            disabled={!settings.taskAssigned}
                                        />
                                        <span className={`text-sm font-medium ${!settings.taskAssigned ? 'text-gray-400' : 'text-text-main'}`}>In-App</span>
                                    </label>
                                </div>
                            </div>

                            {/* Item 2 - Task Status Change */}
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-white rounded-lg p-2 shadow-sm text-text-main flex items-center justify-center size-10">
                                            <span className="material-symbols-outlined">rule</span>
                                        </div>
                                        <div>
                                            <p className="text-text-main text-lg font-medium">Task Status Change</p>
                                            <p className="text-text-muted text-sm">Notifications when a task moves to 'In Progress' or 'Completed'.</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={settings.taskStatusChange}
                                            onChange={() => handleToggle('taskStatusChange')}
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section: Deadlines */}
                    <section className="flex flex-col gap-4">
                        <h2 className="text-text-main text-xl font-bold px-1">Deadlines & Time</h2>
                        <div className="bg-card-beige rounded-xl shadow-sm p-6 flex flex-col gap-6">
                            <div className="flex flex-col gap-4 border-b border-[#e5e3dc] pb-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-white rounded-lg p-2 shadow-sm text-text-main flex items-center justify-center size-10">
                                            <span className="material-symbols-outlined">alarm</span>
                                        </div>
                                        <div>
                                            <p className="text-text-main text-lg font-medium">Deadline Approaching</p>
                                            <p className="text-text-muted text-sm">Receive alerts before a project submission is due.</p>
                                        </div>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={settings.deadlineApproaching}
                                            onChange={() => handleToggle('deadlineApproaching')}
                                        />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                    </label>
                                </div>
                                <div className="pl-14 flex flex-wrap gap-4 items-center">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 text-primary bg-white border-gray-300 rounded focus:ring-primary focus:ring-2"
                                            checked={settings.deadlinePush}
                                            onChange={() => handleToggle('deadlinePush')}
                                            disabled={!settings.deadlineApproaching}
                                        />
                                        <span className={`text-sm font-medium ${!settings.deadlineApproaching ? 'text-gray-400' : 'text-text-main'}`}>Push Notification</span>
                                    </label>
                                    <div className="h-4 w-px bg-gray-300 mx-2"></div>
                                    <span className="text-sm text-text-muted">Alert me:</span>
                                    <select
                                        className="bg-white border-none text-sm font-medium text-text-main rounded-md py-1 pl-2 pr-8 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-primary disabled:text-gray-400 disabled:bg-gray-100"
                                        value={settings.alertTime}
                                        onChange={(e) => handleChange('alertTime', e.target.value)}
                                        disabled={!settings.deadlineApproaching}
                                    >
                                        <option>24 hours before</option>
                                        <option>1 hour before</option>
                                        <option>30 minutes before</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="bg-white rounded-lg p-2 shadow-sm text-text-main flex items-center justify-center size-10">
                                        <span className="material-symbols-outlined">event_repeat</span>
                                    </div>
                                    <div>
                                        <p className="text-text-main text-lg font-medium">Project Reminders</p>
                                        <p className="text-text-muted text-sm">Weekly summaries of your progress and pending items.</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={settings.projectReminders}
                                        onChange={() => handleToggle('projectReminders')}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>
                        </div>
                    </section>

                    {/* Section: Collaboration */}
                    <section className="flex flex-col gap-4">
                        <h2 className="text-text-main text-xl font-bold px-1">Collaboration</h2>
                        <div className="bg-card-beige rounded-xl shadow-sm p-6 flex flex-col gap-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="bg-white rounded-lg p-2 shadow-sm text-text-main flex items-center justify-center size-10">
                                        <span className="material-symbols-outlined">upload_file</span>
                                    </div>
                                    <div>
                                        <p className="text-text-main text-lg font-medium">Document Uploaded</p>
                                        <p className="text-text-muted text-sm">Notify when a team member adds a file to the shared workspace.</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={settings.documentUploaded}
                                        onChange={() => handleToggle('documentUploaded')}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                </label>
                            </div>
                        </div>
                    </section>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-4 pt-4">
                        <button
                            onClick={handleCancel}
                            disabled={!hasChanges}
                            className="px-6 py-3 rounded-lg text-text-main font-medium hover:bg-black/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={!hasChanges || updateSettings.isPending}
                            className="px-8 py-3 rounded-lg bg-primary text-black font-semibold shadow-md hover:bg-[#d4a012] transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {updateSettings.isPending ? (
                                <>
                                    <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></span>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-[20px]">save</span>
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};
