import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export const NotificationSettingsPage: React.FC = () => {
    // State management for toggles
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

    const handleToggle = (key: keyof typeof settings) => {
        setSettings(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const handleChange = (key: keyof typeof settings, value: any) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }));
    };

    return (
        <div className="bg-background-light dark:bg-background-dark text-text-main min-h-screen flex flex-col md:flex-row overflow-x-hidden font-display">
            {/* Side Navigation */}
            <div className="w-full md:w-80 bg-white border-r border-[#e5e3dc] flex-shrink-0 flex flex-col h-auto md:min-h-screen">
                <div className="p-6 flex flex-col gap-8 h-full">
                    {/* User Profile Summary */}
                    <div className="flex items-center gap-4">
                        <div className="bg-center bg-no-repeat bg-cover rounded-full size-12 shadow-sm" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCR5ocG2gIzjnXSO8ij6EXu0Fuawswg7Wy1vzml9jMAadcEIyZTR07u-Wgp4_2jTLgULmEL6U7dK6-Gn_gFLji2toUJO-Dl-XpzVNZMe4mpS1xfVC5-nBqJ1wCYT8Z1JCkdu7xC9j7MxT5Xm4UKxDRBOb8tyOxogOMBHJCQtaZBRxr5Hr-Mrnn3k0xbOcOXP9IoUjhUaAAI0O6wFABl63fQUcnI-rA0V3GQJ0N9CtFlA871tg6wv6_2Fja0Dae9XrSalCg8OdldZ8XR")' }}></div>
                        <div className="flex flex-col">
                            <h1 className="text-text-main text-lg font-medium leading-tight">Alex Morgan</h1>
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
                        <a className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-background-light transition-colors group" href="#">
                            <span className="material-symbols-outlined text-text-muted group-hover:text-text-main">extension</span>
                            <p className="text-text-main text-base font-medium">Integrations</p>
                        </a>
                        <Link to="/settings/account" className="flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-background-light transition-colors group">
                            <span className="material-symbols-outlined text-text-muted group-hover:text-text-main">credit_card</span>
                            <p className="text-text-main text-base font-medium">Billing</p>
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

                {/* Settings Content */}
                <div className="px-8 pb-20 max-w-5xl mx-auto w-full flex flex-col gap-8">
                    {/* Section: Task Updates */}
                    <section className="flex flex-col gap-4">
                        <h2 className="text-text-main text-xl font-bold px-1">Task Updates</h2>
                        <div className="bg-card-beige rounded-xl shadow-sm p-6 flex flex-col gap-6">
                            {/* Item 1 */}
                            <div className="flex flex-col gap-4 border-b border-[#e5e3dc] pb-6 last:border-0 last:pb-0">
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

                            {/* Item 2 */}
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
                                {/* Channels */}
                                <div className={`pl-14 flex gap-6 ${!settings.taskStatusChange ? 'opacity-50' : ''}`}>
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <input type="checkbox" className="w-4 h-4 text-primary bg-white border-gray-300 rounded focus:ring-primary focus:ring-2" disabled={!settings.taskStatusChange} />
                                        <span className="text-sm font-medium text-text-main">Email</span>
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer group">
                                        <input type="checkbox" className="w-4 h-4 text-primary bg-white border-gray-300 rounded focus:ring-primary focus:ring-2" disabled={!settings.taskStatusChange} />
                                        <span className="text-sm font-medium text-text-main">In-App</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section: Deadlines */}
                    <section className="flex flex-col gap-4">
                        <h2 className="text-text-main text-xl font-bold px-1">Deadlines & Time</h2>
                        <div className="bg-card-beige rounded-xl shadow-sm p-6 flex flex-col gap-6">
                            <div className="flex flex-col gap-4 border-b border-[#e5e3dc] pb-6 last:border-0 last:pb-0">
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
                        <button className="px-6 py-3 rounded-lg text-text-main font-medium hover:bg-black/5 transition-colors">
                            Cancel
                        </button>
                        <button className="px-8 py-3 rounded-lg bg-primary text-black font-semibold shadow-md hover:bg-[#d4a012] transition-colors flex items-center gap-2">
                            <span className="material-symbols-outlined text-[20px]">save</span>
                            Save Changes
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};
