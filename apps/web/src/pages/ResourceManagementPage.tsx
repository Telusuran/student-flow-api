import React, { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { useResources, useDeleteResource, useCreateResource, useUploadResource } from '../hooks/useResources';
import { useProject } from '../hooks/useProjects';

export const ResourceManagementPage: React.FC = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const location = useLocation();
    const [filter, setFilter] = useState('All Resources');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Form State
    const [newResourceName, setNewResourceName] = useState('');
    const [newResourceUrl, setNewResourceUrl] = useState('');
    const [newResourceType, setNewResourceType] = useState<'linked_file' | 'external_tool'>('linked_file');

    const [activeTab, setActiveTab] = useState<'link' | 'upload'>('link');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const { data: resources, isLoading } = useResources(projectId || '');
    const { data: project } = useProject(projectId || '');
    const deleteResource = useDeleteResource();
    const createResource = useCreateResource();
    const uploadResource = useUploadResource();

    // Auto-open upload modal if navigated from dashboard
    useEffect(() => {
        const state = location.state as { openUpload?: boolean } | null;
        if (state?.openUpload) {
            setIsAddModalOpen(true);
            setActiveTab('upload');
            // Clear the state to prevent reopening on refresh
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to remove this resource?')) {
            deleteResource.mutate({ id, projectId: projectId! });
        }
    };

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!projectId) return;

        if (activeTab === 'upload') {
            if (!selectedFile) return;
            uploadResource.mutate({ projectId, file: selectedFile }, {
                onSuccess: () => {
                    setIsAddModalOpen(false);
                    setSelectedFile(null);
                }
            });
        } else {
            createResource.mutate({
                projectId,
                name: newResourceName,
                url: newResourceUrl,
                type: newResourceType,
                description: 'Added via web interface',
                tags: ['resource']
            }, {
                onSuccess: () => {
                    setIsAddModalOpen(false);
                    setNewResourceName('');
                    setNewResourceUrl('');
                }
            });
        }
    };

    if (isLoading) return <div className="p-8 text-center">Loading resources...</div>;
    if (!project) return <div className="p-8 text-center">Project not found</div>;

    const filteredResources = resources?.filter(r => {
        if (filter === 'All Resources') return true;
        if (filter === 'Linked Files') return r.type === 'linked_file';
        if (filter === 'External Tools') return r.type === 'external_tool';
        return true;
    }) || [];

    return (
        <div className="flex-1 w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumbs */}
            <nav aria-label="Breadcrumb" className="flex mb-6">
                <ol className="inline-flex items-center space-x-1 md:space-x-3">
                    <li className="inline-flex items-center">
                        <Link className="inline-flex items-center text-sm font-medium text-text-sub dark:text-gray-400 hover:text-primary" to="/">
                            <span className="material-symbols-outlined text-[18px] mr-2">home</span>
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <div className="flex items-center">
                            <span className="material-symbols-outlined text-text-sub dark:text-gray-500 text-[18px]">chevron_right</span>
                            <Link className="ml-1 text-sm font-medium text-text-sub dark:text-gray-400 hover:text-primary md:ml-2" to={`/project/${projectId}`}>
                                {project.name}
                            </Link>
                        </div>
                    </li>
                    <li aria-current="page">
                        <div className="flex items-center">
                            <span className="material-symbols-outlined text-text-sub dark:text-gray-500 text-[18px]">chevron_right</span>
                            <span className="ml-1 text-sm font-medium text-text-main dark:text-white md:ml-2">Resources</span>
                        </div>
                    </li>
                </ol>
            </nav>

            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl md:text-4xl font-black text-text-main dark:text-white tracking-tight">Resource Management</h1>
                    <p className="text-text-sub dark:text-gray-400 max-w-2xl">
                        Centralize your project assets. Link cloud files, external tools, and reference materials.
                    </p>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-[#181611] font-bold py-2.5 px-5 rounded-lg shadow-soft transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                >
                    <span className="material-symbols-outlined text-[20px]">add_link</span>
                    Add Resource
                </button>
            </div>

            {/* Filter & View Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 border-b border-gray-200 dark:border-gray-700 pb-2">
                <div className="flex items-center gap-6 w-full sm:w-auto overflow-x-auto no-scrollbar">
                    {['All Resources', 'Linked Files', 'External Tools'].map(f => (
                        <button
                            key={f}
                            className={`group flex items-center gap-2 pb-2 border-b-2 font-bold whitespace-nowrap transition-colors ${filter === f ? 'border-primary text-text-main dark:text-white' : 'border-transparent hover:border-gray-300 text-text-sub dark:text-gray-400 hover:text-text-main'}`}
                            onClick={() => setFilter(f)}
                        >
                            <span className={`material-symbols-outlined text-[20px] ${filter === f ? 'icon-filled' : ''}`}>grid_view</span>
                            {f}
                            <span className="bg-gray-100 dark:bg-gray-800 text-xs py-0.5 px-2 rounded-full text-text-sub ml-1">
                                {f === 'All Resources' ? resources?.length : resources?.filter(r =>
                                    f === 'Linked Files' ? r.type === 'linked_file' : r.type === 'external_tool'
                                ).length}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Resources Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredResources.map(resource => (
                    <div key={resource.id} className="group relative flex flex-col bg-card-light dark:bg-card-dark rounded-xl p-4 shadow-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-transparent hover:border-primary/20">
                        <div className="relative h-40 w-full rounded-lg bg-gray-200 overflow-hidden mb-4 group-hover:ring-2 ring-primary/20 transition-all">
                            {resource.thumbnailUrl ? (
                                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${resource.thumbnailUrl}')` }}></div>
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-400">
                                    <span className="material-symbols-outlined text-4xl">
                                        {resource.type === 'linked_file' ? 'description' : 'extension'}
                                    </span>
                                </div>
                            )}
                            <div className={`absolute bottom-2 left-2 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm flex items-center gap-1 ${resource.type === 'external_tool' ? 'bg-blue-600' : 'bg-red-500'}`}>
                                <span className="material-symbols-outlined text-[12px]">
                                    {resource.type === 'external_tool' ? 'link' : 'picture_as_pdf'}
                                </span>
                                {resource.type === 'external_tool' ? 'Tool' : 'File'}
                            </div>
                        </div>
                        <div className="flex-1 flex flex-col">
                            <div className="flex justify-between items-start mb-1">
                                <h3 className="font-bold text-text-main dark:text-white text-lg leading-tight line-clamp-2">{resource.name}</h3>
                            </div>
                            <p className="text-xs text-text-sub dark:text-gray-400 mb-4 flex items-center gap-1">
                                <span className="material-symbols-outlined text-[14px]">calendar_today</span> Added {new Date(resource.createdAt).toLocaleDateString()}
                            </p>
                            <div className="mt-auto flex items-center justify-between border-t border-gray-200 dark:border-gray-600 pt-3">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => resource.url && window.open(resource.url, '_blank')}
                                        className="text-text-sub hover:text-primary transition-colors"
                                        title="Open"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(resource.id)}
                                        className="text-text-sub hover:text-red-500 transition-colors"
                                        title="Remove"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">delete</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Add New Placeholder */}
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="group flex flex-col items-center justify-center bg-card-light/50 dark:bg-card-dark/50 rounded-xl p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary hover:bg-card-light dark:hover:bg-card-dark transition-all duration-300 min-h-[300px]"
                >
                    <div className="w-16 h-16 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform">
                        <span className="material-symbols-outlined text-primary text-[32px]">add</span>
                    </div>
                    <h3 className="font-bold text-text-sub dark:text-gray-400 text-lg group-hover:text-primary transition-colors">Link New Resource</h3>
                </button>
            </div>

            {/* Add Resource Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all scale-100">
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Add New Resource</h3>

                            {/* Tabs */}
                            <div className="flex gap-2 mb-4 p-1 bg-gray-100 dark:bg-neutral-700 rounded-lg">
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('link')}
                                    className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === 'link'
                                        ? 'bg-white dark:bg-neutral-600 text-primary shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                                        }`}
                                >
                                    Link URL
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setActiveTab('upload')}
                                    className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${activeTab === 'upload'
                                        ? 'bg-white dark:bg-neutral-600 text-primary shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
                                        }`}
                                >
                                    Upload File
                                </button>
                            </div>

                            <form onSubmit={handleAdd} className="space-y-4">
                                {activeTab === 'link' ? (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Resource Name
                                            </label>
                                            <input
                                                type="text"
                                                value={newResourceName}
                                                onChange={(e) => setNewResourceName(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-neutral-700 dark:text-white"
                                                placeholder="e.g., Project Guidelines"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Resource URL
                                            </label>
                                            <input
                                                type="url"
                                                value={newResourceUrl}
                                                onChange={(e) => setNewResourceUrl(e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-neutral-700 dark:text-white"
                                                placeholder="https://..."
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                Type
                                            </label>
                                            <select
                                                value={newResourceType}
                                                onChange={(e) => setNewResourceType(e.target.value as any)}
                                                className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-neutral-700 dark:text-white"
                                            >
                                                <option value="linked_file">Linked File</option>
                                                <option value="external_tool">External Tool</option>
                                            </select>
                                        </div>
                                    </>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="border-2 border-dashed border-gray-300 dark:border-neutral-600 rounded-xl p-8 hover:bg-gray-50 dark:hover:bg-neutral-700/50 transition-colors text-center cursor-pointer relative">
                                            <input
                                                type="file"
                                                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            />
                                            <div className="flex flex-col items-center gap-2">
                                                <span className="material-symbols-outlined text-4xl text-gray-400">cloud_upload</span>
                                                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                                                    {selectedFile ? selectedFile.name : 'Click to upload or drag and drop'}
                                                </span>
                                                <span className="text-xs text-gray-400">
                                                    PDF, Images, Docs (Max 10MB)
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="flex justify-end gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setIsAddModalOpen(false);
                                            setSelectedFile(null);
                                        }}
                                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors dark:bg-neutral-700 dark:text-white dark:hover:bg-neutral-600"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={createResource.isPending || uploadResource.isPending}
                                        className="px-4 py-2 text-sm font-bold text-white bg-primary hover:bg-primary-hover rounded-lg shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {(createResource.isPending || uploadResource.isPending) && (
                                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        )}
                                        {activeTab === 'upload' ? 'Upload' : 'Add Resource'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
