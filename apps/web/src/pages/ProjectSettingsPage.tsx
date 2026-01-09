import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useProject, useUpdateProject, useDeleteProject, useAddProjectMember, useRemoveProjectMember } from '../hooks/useProjects';
import { useSearchUsers } from '../hooks/useUsers';

export const ProjectSettingsPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const projectId = searchParams.get('projectId') || '';

    // Data Fetching
    const { data: project, isLoading } = useProject(projectId);

    // Mutations
    const updateProject = useUpdateProject();
    const deleteProject = useDeleteProject();
    const addMember = useAddProjectMember();
    const removeMember = useRemoveProjectMember();

    // Local State
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [status, setStatus] = useState('active');

    // Member Invite State
    const [inviteQuery, setInviteQuery] = useState('');
    const [isInviteOpen, setIsInviteOpen] = useState(false);
    const { data: searchResults } = useSearchUsers(inviteQuery);

    // Sync state with project data
    // Sync state with project data
    useEffect(() => {
        if (project) {
            // Only update if not already set or if project changes significantly
            // For simplicity, we assume project data is source of truth on load
            setName(prev => prev || project.name);
            setDescription(prev => prev || project.description || '');
            setDueDate(prev => prev || (project.dueDate ? new Date(project.dueDate).toISOString().split('T')[0] : ''));
            setStatus(prev => prev === 'active' ? (project.status || 'active') : prev);
        }
    }, [project]);

    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-neutral-bg"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-custom-gold"></div></div>;
    }

    if (!project) {
        return <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-bg">
            <h2 className="text-xl font-bold mb-4">Project not found</h2>
            <Link to="/project" className="text-custom-gold hover:underline">Back to Projects</Link>
        </div>;
    }

    const handleSave = () => {
        updateProject.mutate({
            id: projectId,
            data: {
                name,
                description,
                dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
                status
            }
        }, {
            onSuccess: () => {
                alert('Settings saved successfully!'); // Could use a toast here
            }
        });
    };

    const handleDelete = async () => {
        if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
            await deleteProject.mutateAsync(projectId);
            navigate('/project');
        }
    };

    const handleInvite = (userId: string) => {
        addMember.mutate({ projectId, userId }, {
            onSuccess: () => {
                setInviteQuery('');
                setIsInviteOpen(false);
            }
        });
    };

    const handleRemoveMember = (userId: string) => {
        if (window.confirm('Remove this member from the project?')) {
            removeMember.mutate({ projectId, userId });
        }
    };

    return (
        <div className="bg-neutral-bg text-text-main font-display min-h-screen flex flex-col antialiased">
            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-neutral-bg shadow-sm">
                <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-4 text-text-main">
                        <div className="size-8 text-custom-gold">
                            <span className="material-symbols-outlined text-3xl">school</span>
                        </div>
                        <h2 className="text-text-main text-lg font-bold">StudentTracker</h2>
                    </Link>
                    <nav className="hidden md:flex items-center gap-6">
                        <Link to="/" className="text-sm font-medium hover:text-custom-gold transition-colors">Dashboard</Link>
                        <Link to="/project" className="text-sm font-medium hover:text-custom-gold transition-colors">Projects</Link>
                    </nav>
                </div>
            </header>

            <main className="flex-grow w-full max-w-[1000px] mx-auto px-6 py-8">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 mb-6 text-sm text-text-sub">
                    <Link to="/project" className="hover:text-custom-gold transition-colors">Projects</Link>
                    <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                    <span className="font-semibold text-text-main">Settings</span>
                </div>

                <div className="mb-10">
                    <h1 className="text-3xl md:text-4xl font-black text-text-main mb-3 tracking-tight">Project Settings</h1>
                    <p className="text-[#555] text-lg max-w-2xl">Manage configuration and team members for <strong>{project.name}</strong>.</p>
                </div>

                <div className="flex flex-col gap-8">
                    {/* General Information */}
                    <section className="bg-custom-card rounded-xl p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-[#e8e8d8]">
                        <div className="flex items-center gap-3 mb-6 border-b border-[#e0e0c0] pb-4">
                            <span className="material-symbols-outlined text-custom-gold">edit_document</span>
                            <h2 className="text-xl font-bold text-text-main">General Information</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-sm font-semibold text-text-main mb-2">Project Name</label>
                                <input
                                    className="w-full h-12 px-4 rounded-lg border-0 bg-white text-text-main focus:ring-2 focus:ring-custom-gold shadow-sm"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="col-span-1 md:col-span-2">
                                <label className="block text-sm font-semibold text-text-main mb-2">Description</label>
                                <textarea
                                    className="w-full min-h-[120px] p-4 rounded-lg border-0 bg-white text-text-main focus:ring-2 focus:ring-custom-gold resize-y shadow-sm"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>
                            <div className="col-span-1">
                                <label className="block text-sm font-semibold text-text-main mb-2">Due Date</label>
                                <input
                                    className="w-full h-12 px-4 rounded-lg border-0 bg-white text-text-main focus:ring-2 focus:ring-custom-gold shadow-sm"
                                    type="date"
                                    value={dueDate}
                                    onChange={(e) => setDueDate(e.target.value)}
                                />
                            </div>
                            <div className="col-span-1">
                                <label className="block text-sm font-semibold text-text-main mb-2">Status</label>
                                <select
                                    className="w-full h-12 px-4 rounded-lg border-0 bg-white text-text-main focus:ring-2 focus:ring-custom-gold shadow-sm"
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                >
                                    <option value="active">Active</option>
                                    <option value="archived">Archived</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* Team Members */}
                    <section className="bg-custom-card rounded-xl p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-[#e8e8d8]">
                        <div className="flex items-center justify-between mb-6 border-b border-[#e0e0c0] pb-4">
                            <div className="flex items-center gap-3">
                                <span className="material-symbols-outlined text-custom-gold">group</span>
                                <h2 className="text-xl font-bold text-text-main">Team Members</h2>
                            </div>
                            <span className="text-sm font-medium text-text-sub bg-white px-3 py-1 rounded-full shadow-sm">
                                {project.members?.length || 0} Members
                            </span>
                        </div>

                        <div className="flex flex-col gap-4 mb-6">
                            {(project.members || []).map((member) => (
                                <div key={member.id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm group hover:shadow-md transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="size-10 rounded-full bg-gray-200 flex items-center justify-center font-bold text-gray-500">
                                            {member.user?.image ? (
                                                <img src={member.user.image} alt={member.user.name} className="size-full rounded-full object-cover" />
                                            ) : (
                                                member.user?.name?.charAt(0)
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-text-main font-semibold self-center">{member.user?.name}</p>
                                            <p className="text-xs text-text-sub">{member.role}</p>
                                        </div>
                                    </div>
                                    {member.userId !== project.ownerId && (
                                        <button
                                            onClick={() => handleRemoveMember(member.userId)}
                                            className="text-gray-400 hover:text-custom-red p-2 rounded-full hover:bg-red-50 transition-colors"
                                            title="Remove Member"
                                        >
                                            <span className="material-symbols-outlined">delete</span>
                                        </button>
                                    )}
                                    {member.userId === project.ownerId && (
                                        <span className="text-xs font-bold text-custom-gold bg-custom-gold/10 px-2 py-1 rounded">Owner</span>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className="relative">
                            <div className="flex gap-2">
                                <input
                                    className="flex-1 h-12 px-4 rounded-lg border-0 bg-white text-text-main placeholder:text-gray-400 focus:ring-2 focus:ring-custom-gold shadow-sm"
                                    placeholder="Search users by name or email..."
                                    type="text"
                                    value={inviteQuery}
                                    onChange={(e) => {
                                        setInviteQuery(e.target.value);
                                        setIsInviteOpen(true);
                                    }}
                                    onFocus={() => setIsInviteOpen(true)}
                                />
                            </div>

                            {/* User Search Dropdown */}
                            {isInviteOpen && inviteQuery.length >= 2 && searchResults && (
                                <div className="absolute top-14 left-0 w-full bg-white rounded-lg shadow-xl border border-gray-100 z-50 max-h-60 overflow-y-auto">
                                    {searchResults.length > 0 ? (
                                        searchResults.map(user => (
                                            <div
                                                key={user.id}
                                                onClick={() => handleInvite(user.id)}
                                                className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-0"
                                            >
                                                <div className="size-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold">{user.name}</p>
                                                    <p className="text-xs text-gray-500">{user.email}</p>
                                                </div>
                                                <span className="ml-auto text-custom-gold text-xs font-bold px-2 py-1 bg-custom-gold/10 rounded">Invite</span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="p-4 text-center text-sm text-gray-500">No users found</div>
                                    )}
                                </div>
                            )}
                            {isInviteOpen && inviteQuery.length > 0 && inviteQuery.length < 2 && (
                                <div className="absolute top-14 left-0 w-full bg-white rounded-lg shadow-xl border border-gray-100 z-50 p-4 text-center text-sm text-gray-500">
                                    Type at least 2 characters...
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Danger Zone */}
                    <section className="bg-custom-card rounded-xl p-8 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-[#e8e8d8] relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-full bg-custom-red"></div>
                        <div className="flex items-center gap-3 mb-6 border-b border-[#e0e0c0] pb-4">
                            <span className="material-symbols-outlined text-custom-red">warning</span>
                            <h2 className="text-xl font-bold text-text-main">Danger Zone</h2>
                        </div>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div>
                                <h3 className="font-semibold text-custom-red">Delete Project</h3>
                                <p className="text-sm text-text-sub">Once you delete a project, there is no going back. Please be certain.</p>
                            </div>
                            <button
                                onClick={handleDelete}
                                className="px-5 py-2.5 rounded-lg bg-custom-red font-medium text-white hover:bg-red-500 transition-colors shadow-sm whitespace-nowrap flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined text-sm">delete_forever</span>
                                Delete Project
                            </button>
                        </div>
                    </section>
                </div>

                {/* Save API Button */}
                <div className="sticky bottom-6 z-40 mt-8">
                    <div className="bg-white/80 backdrop-blur-md border border-[#e6e6e6] rounded-xl p-4 shadow-xl flex items-center justify-between max-w-[1000px] mx-auto">
                        <p className="text-sm text-gray-500 pl-2 hidden sm:block">Changes need to be saved</p>
                        <div className="flex gap-4 ml-auto w-full sm:w-auto justify-end">
                            <button
                                onClick={() => navigate('/project')}
                                className="px-6 py-3 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={updateProject.isPending}
                                className="px-8 py-3 rounded-lg font-bold text-white bg-custom-gold hover:bg-[#d4a015] shadow-lg shadow-custom-gold/30 transform hover:-translate-y-0.5 transition-all flex items-center gap-2 disabled:opacity-50"
                            >
                                <span className="material-symbols-outlined">save</span>
                                {updateProject.isPending ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
