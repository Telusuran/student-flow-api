import React, { useState, useEffect } from 'react';
import { Link, useParams, useLocation, useSearchParams } from 'react-router-dom';
import {
    useResourcesInFolder,
    useDeleteResource,
    useCreateResource,
    useUploadResource,
    useCreateFolder,
    useRenameResource
} from '../hooks/useResources';
import { useProject } from '../hooks/useProjects';
import type { Resource } from '../lib/api/types';

export const ResourceManagementPage: React.FC = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    // Folder navigation state
    const currentFolderId = searchParams.get('folder') || null;
    const [folderPath, setFolderPath] = useState<{ id: string | null; name: string }[]>([
        { id: null, name: 'Root' }
    ]);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isCreateFolderModalOpen, setIsCreateFolderModalOpen] = useState(false);
    const [newFolderName, setNewFolderName] = useState('');

    // Form State
    const [newResourceName, setNewResourceName] = useState('');
    const [newResourceUrl, setNewResourceUrl] = useState('');
    const [newResourceType, setNewResourceType] = useState<'linked_file' | 'external_tool'>('linked_file');

    const [activeTab, setActiveTab] = useState<'link' | 'upload'>('link');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // Context menu state
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number; resource: Resource } | null>(null);
    const [renameMode, setRenameMode] = useState<string | null>(null);
    const [renameValue, setRenameValue] = useState('');

    const { data: resources, isLoading } = useResourcesInFolder(projectId || '', currentFolderId);
    const { data: project } = useProject(projectId || '');
    const deleteResource = useDeleteResource();
    const createResource = useCreateResource();
    const uploadResource = useUploadResource();
    const createFolder = useCreateFolder();
    const renameResource = useRenameResource();

    // Auto-open upload modal if navigated from dashboard
    useEffect(() => {
        const state = location.state as { openUpload?: boolean } | null;
        if (state?.openUpload) {
            setIsAddModalOpen(true);
            setActiveTab('upload');
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    // Close context menu on click outside
    useEffect(() => {
        const handleClick = () => setContextMenu(null);
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, []);

    const navigateToFolder = (folderId: string | null, folderName: string) => {
        if (folderId) {
            setSearchParams({ folder: folderId });
            setFolderPath(prev => [...prev, { id: folderId, name: folderName }]);
        } else {
            setSearchParams({});
            setFolderPath([{ id: null, name: 'Root' }]);
        }
    };

    const navigateToBreadcrumb = (index: number) => {
        const target = folderPath[index];
        if (target.id) {
            setSearchParams({ folder: target.id });
        } else {
            setSearchParams({});
        }
        setFolderPath(prev => prev.slice(0, index + 1));
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this item?')) {
            deleteResource.mutate({ id, projectId: projectId! });
        }
    };

    const handleCreateFolder = (e: React.FormEvent) => {
        e.preventDefault();
        if (!projectId || !newFolderName.trim()) return;

        createFolder.mutate({ projectId, name: newFolderName, parentId: currentFolderId }, {
            onSuccess: () => {
                setIsCreateFolderModalOpen(false);
                setNewFolderName('');
            }
        });
    };

    const handleRename = (id: string) => {
        if (!renameValue.trim() || !projectId) return;
        renameResource.mutate({ id, name: renameValue, projectId }, {
            onSuccess: () => {
                setRenameMode(null);
                setRenameValue('');
            }
        });
    };

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (!projectId) return;

        if (activeTab === 'upload') {
            if (!selectedFile) return;
            uploadResource.mutate({ projectId, file: selectedFile, parentId: currentFolderId }, {
                onSuccess: () => {
                    setIsAddModalOpen(false);
                    setSelectedFile(null);
                }
            });
        } else {
            createResource.mutate({
                projectId,
                parentId: currentFolderId,
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

    const handleContextMenu = (e: React.MouseEvent, resource: Resource) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY, resource });
    };

    const formatFileSize = (bytes: string | null) => {
        if (!bytes) return '';
        const size = parseInt(bytes);
        if (size < 1024) return `${size} B`;
        if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
        return `${(size / 1024 / 1024).toFixed(1)} MB`;
    };

    const getFileIcon = (resource: Resource) => {
        if (resource.isFolder) return 'folder';
        const type = resource.fileType?.toLowerCase() || '';
        if (type.includes('pdf')) return 'picture_as_pdf';
        if (type.includes('image')) return 'image';
        if (type.includes('video')) return 'video_file';
        if (type.includes('audio')) return 'audio_file';
        if (type.includes('sheet') || type.includes('excel')) return 'table_chart';
        if (type.includes('document') || type.includes('word')) return 'article';
        if (type.includes('presentation') || type.includes('powerpoint')) return 'slideshow';
        return 'description';
    };

    if (isLoading) return <div className="p-8 text-center">Loading resources...</div>;
    if (!project) return <div className="p-8 text-center">Project not found</div>;

    const folders = resources?.filter(r => r.isFolder) || [];
    const files = resources?.filter(r => !r.isFolder) || [];

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
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl md:text-4xl font-black text-text-main dark:text-white tracking-tight">File Explorer</h1>
                    <p className="text-text-sub dark:text-gray-400 max-w-2xl">
                        Manage your project files and folders. Upload, organize, and access resources easily.
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => setIsCreateFolderModalOpen(true)}
                        className="flex items-center justify-center gap-2 bg-gray-100 dark:bg-neutral-700 hover:bg-gray-200 dark:hover:bg-neutral-600 text-text-main dark:text-white font-bold py-2.5 px-4 rounded-lg transition-all"
                    >
                        <span className="material-symbols-outlined text-[20px]">create_new_folder</span>
                        New Folder
                    </button>
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-[#181611] font-bold py-2.5 px-5 rounded-lg shadow-soft transition-all transform hover:-translate-y-0.5 active:translate-y-0"
                    >
                        <span className="material-symbols-outlined text-[20px]">upload_file</span>
                        Upload
                    </button>
                </div>
            </div>

            {/* Folder Path Breadcrumbs */}
            <div className="flex items-center gap-2 mb-6 p-3 bg-gray-50 dark:bg-neutral-800 rounded-lg overflow-x-auto">
                {folderPath.map((folder, index) => (
                    <React.Fragment key={folder.id || 'root'}>
                        {index > 0 && (
                            <span className="material-symbols-outlined text-gray-400 text-[16px]">chevron_right</span>
                        )}
                        <button
                            onClick={() => navigateToBreadcrumb(index)}
                            className={`flex items-center gap-1 px-2 py-1 rounded hover:bg-gray-200 dark:hover:bg-neutral-700 transition-colors ${index === folderPath.length - 1
                                ? 'text-primary font-semibold'
                                : 'text-text-sub dark:text-gray-400'
                                }`}
                        >
                            <span className="material-symbols-outlined text-[18px]">
                                {index === 0 ? 'folder_special' : 'folder'}
                            </span>
                            {folder.name}
                        </button>
                    </React.Fragment>
                ))}
            </div>

            {/* Folders Section */}
            {folders.length > 0 && (
                <div className="mb-8">
                    <h2 className="text-sm font-semibold text-text-sub dark:text-gray-400 uppercase tracking-wider mb-4">Folders</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {folders.map(folder => (
                            <div
                                key={folder.id}
                                onDoubleClick={() => navigateToFolder(folder.id, folder.name)}
                                onContextMenu={(e) => handleContextMenu(e, folder)}
                                className="group flex flex-col items-center p-4 bg-card-light dark:bg-card-dark rounded-xl border border-transparent hover:border-primary/20 hover:shadow-lg transition-all cursor-pointer"
                            >
                                {renameMode === folder.id ? (
                                    <input
                                        type="text"
                                        value={renameValue}
                                        onChange={(e) => setRenameValue(e.target.value)}
                                        onBlur={() => handleRename(folder.id)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleRename(folder.id)}
                                        className="w-full text-center text-sm bg-transparent border-b border-primary focus:outline-none"
                                        autoFocus
                                    />
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined text-5xl text-amber-500 mb-2 icon-filled">folder</span>
                                        <span className="text-sm font-medium text-center text-text-main dark:text-white truncate w-full">{folder.name}</span>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Files Section */}
            <div>
                <h2 className="text-sm font-semibold text-text-sub dark:text-gray-400 uppercase tracking-wider mb-4">Files</h2>
                {files.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                        <span className="material-symbols-outlined text-6xl text-gray-300 dark:text-gray-600 mb-4">folder_open</span>
                        <p className="text-text-sub dark:text-gray-400 mb-4">This folder is empty</p>
                        <button
                            onClick={() => setIsAddModalOpen(true)}
                            className="text-primary hover:underline font-medium"
                        >
                            Upload your first file
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {files.map(file => (
                            <div
                                key={file.id}
                                onContextMenu={(e) => handleContextMenu(e, file)}
                                className="group flex flex-col items-center p-4 bg-card-light dark:bg-card-dark rounded-xl border border-transparent hover:border-primary/20 hover:shadow-lg transition-all cursor-pointer"
                            >
                                {renameMode === file.id ? (
                                    <input
                                        type="text"
                                        value={renameValue}
                                        onChange={(e) => setRenameValue(e.target.value)}
                                        onBlur={() => handleRename(file.id)}
                                        onKeyDown={(e) => e.key === 'Enter' && handleRename(file.id)}
                                        className="w-full text-center text-sm bg-transparent border-b border-primary focus:outline-none"
                                        autoFocus
                                    />
                                ) : (
                                    <>
                                        <div className="relative mb-2">
                                            <span className={`material-symbols-outlined text-5xl ${file.fileType?.includes('pdf') ? 'text-red-500' :
                                                file.fileType?.includes('image') ? 'text-green-500' :
                                                    file.fileType?.includes('video') ? 'text-purple-500' :
                                                        'text-blue-500'
                                                }`}>
                                                {getFileIcon(file)}
                                            </span>
                                        </div>
                                        <span className="text-sm font-medium text-center text-text-main dark:text-white truncate w-full" title={file.name}>
                                            {file.name}
                                        </span>
                                        <span className="text-xs text-text-sub dark:text-gray-400 mt-1">
                                            {formatFileSize(file.fileSize)}
                                        </span>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Context Menu */}
            {contextMenu && (
                <div
                    className="fixed z-50 bg-white dark:bg-neutral-800 rounded-lg shadow-xl border border-gray-200 dark:border-neutral-700 py-2 min-w-[160px]"
                    style={{ left: contextMenu.x, top: contextMenu.y }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {!contextMenu.resource.isFolder && contextMenu.resource.url && (
                        <button
                            onClick={() => {
                                window.open(contextMenu.resource.url!, '_blank');
                                setContextMenu(null);
                            }}
                            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-text-main dark:text-white hover:bg-gray-100 dark:hover:bg-neutral-700"
                        >
                            <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                            Open
                        </button>
                    )}
                    <button
                        onClick={() => {
                            setRenameMode(contextMenu.resource.id);
                            setRenameValue(contextMenu.resource.name);
                            setContextMenu(null);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-text-main dark:text-white hover:bg-gray-100 dark:hover:bg-neutral-700"
                    >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                        Rename
                    </button>
                    <button
                        onClick={() => {
                            handleDelete(contextMenu.resource.id);
                            setContextMenu(null);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-neutral-700"
                    >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                        Delete
                    </button>
                </div>
            )}

            {/* Create Folder Modal */}
            {isCreateFolderModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
                        <form onSubmit={handleCreateFolder} className="p-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">New Folder</h3>
                            <input
                                type="text"
                                value={newFolderName}
                                onChange={(e) => setNewFolderName(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary dark:bg-neutral-700 dark:text-white mb-4"
                                placeholder="Folder name"
                                autoFocus
                                required
                            />
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsCreateFolderModalOpen(false);
                                        setNewFolderName('');
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors dark:bg-neutral-700 dark:text-white dark:hover:bg-neutral-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={createFolder.isPending}
                                    className="px-4 py-2 text-sm font-bold text-white bg-primary hover:bg-primary-hover rounded-lg shadow-sm transition-all disabled:opacity-50"
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Resource Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all scale-100">
                        <div className="p-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Add Resource</h3>

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
