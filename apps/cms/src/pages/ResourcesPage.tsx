import { useState, useEffect, useRef } from 'react';
import { apiClient } from '../lib/api-client';
import { FileExplorer, type Resource } from '../components/FileExplorer';
import type { Project } from '../lib/types';

export default function ResourcesPage() {
    // Since Resources are tied to Projects, we need to select a project first or view all?
    // The implementation plan says "Replace list view with FileExplorer".
    // Usually admin might want to browse resources by project.
    // Let's implement a project selector.

    const [projects, setProjects] = useState<Project[]>([]);
    const [selectedProjectId, setSelectedProjectId] = useState<string>('');
    const [resources, setResources] = useState<Resource[]>([]);
    const [loading, setLoading] = useState(false);

    const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
    const [folderPath, setFolderPath] = useState<{ id: string | null; name: string }[]>([
        { id: null, name: 'Root' }
    ]);

    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [newFolderName, setNewFolderName] = useState('');
    const [isCreateFolderOpen, setIsCreateFolderOpen] = useState(false);

    useEffect(() => {
        loadProjects();
    }, []);

    useEffect(() => {
        if (selectedProjectId) {
            loadResources(selectedProjectId);
            // Reset folder path when switching projects
            setFolderPath([{ id: null, name: 'Root' }]);
            setCurrentFolderId(null);
        } else {
            setResources([]);
        }
    }, [selectedProjectId]);

    const loadProjects = async () => {
        try {
            const data = await apiClient.get<Project[]>('/admin/projects');
            setProjects(data);
            if (data.length > 0) {
                setSelectedProjectId(data[0].id);
            }
        } catch (error) {
            console.error('Failed to load projects:', error);
        }
    };

    const loadResources = async (projectId: string) => {
        setLoading(true);
        try {
            const data = await apiClient.get<Resource[]>(`/projects/${projectId}/resources`);
            setResources(data);
        } catch (error) {
            console.error('Failed to load resources:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleNavigate = (folderId: string | null, folderName: string) => {
        if (folderId) {
            setFolderPath(prev => [...prev, { id: folderId, name: folderName }]);
        } else {
            setFolderPath([{ id: null, name: 'Root' }]); // Reset to root if null passed (though usually we go back)
        }
        setCurrentFolderId(folderId);
    };

    const handleBreadcrumbClick = (index: number) => {
        const target = folderPath[index];
        setCurrentFolderId(target.id);
        setFolderPath(prev => prev.slice(0, index + 1));
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !selectedProjectId) return;

        setIsUploading(true);
        try {
            // Must support parentId for upload
            // The upload method in apiClient supports additional data
            await apiClient.upload(
                `/projects/${selectedProjectId}/resources`,
                file,
                'file',
                currentFolderId ? { parentId: currentFolderId } : undefined
            );
            loadResources(selectedProjectId);
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Upload failed');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleCreateFolder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newFolderName.trim() || !selectedProjectId) return;

        try {
            await apiClient.post(`/projects/${selectedProjectId}/resources/folder`, {
                name: newFolderName,
                parentId: currentFolderId
            });
            loadResources(selectedProjectId);
            setIsCreateFolderOpen(false);
            setNewFolderName('');
        } catch (error) {
            console.error('Create folder failed:', error);
            alert('Failed to create folder');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-display font-bold text-text-main">Resources</h1>
                    <p className="text-text-muted">Manage project files and folders.</p>
                </div>

                <div className="flex items-center gap-4">
                    <select
                        value={selectedProjectId}
                        onChange={(e) => setSelectedProjectId(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                        {projects.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>

                    <button
                        onClick={() => setIsCreateFolderOpen(true)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-[20px]">create_new_folder</span>
                        New Folder
                    </button>

                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                        className="px-4 py-2 bg-primary text-white font-bold rounded-lg hover:bg-primary-hover shadow-sm transition-colors flex items-center gap-2"
                    >
                        {isUploading ? (
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <span className="material-symbols-outlined text-[20px]">upload_file</span>
                        )}
                        Upload File
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                </div>
            </div>

            {/* Breadcrumbs */}
            <div className="flex items-center gap-2 p-3 bg-white rounded-lg border border-gray-200 shadow-sm overflow-x-auto">
                <span className="material-symbols-outlined text-gray-400">home_storage</span>
                {folderPath.map((folder, index) => (
                    <div key={folder.id || 'root'} className="flex items-center">
                        {index > 0 && <span className="material-symbols-outlined text-gray-300 mx-1">chevron_right</span>}
                        <button
                            onClick={() => handleBreadcrumbClick(index)}
                            className={`text-sm font-medium hover:text-primary transition-colors ${index === folderPath.length - 1 ? 'text-gray-800 font-bold' : 'text-gray-500'
                                }`}
                        >
                            {folder.name}
                        </button>
                    </div>
                ))}
            </div>

            {/* Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                {loading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <FileExplorer
                        projectId={selectedProjectId}
                        resources={resources}
                        currentFolderId={currentFolderId}
                        onNavigate={handleNavigate}
                        onRefresh={() => loadResources(selectedProjectId)}
                    />
                )}
            </div>

            {/* Create Folder Modal */}
            {isCreateFolderOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <form onSubmit={handleCreateFolder} className="bg-white rounded-lg p-6 w-full max-w-sm shadow-xl">
                        <h3 className="text-lg font-bold mb-4">New Folder</h3>
                        <input
                            type="text"
                            value={newFolderName}
                            onChange={(e) => setNewFolderName(e.target.value)}
                            placeholder="Folder Name"
                            className="w-full px-3 py-2 border rounded mb-4 focus:ring-2 focus:ring-primary"
                            autoFocus
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setIsCreateFolderOpen(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-hover"
                            >
                                Create
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
