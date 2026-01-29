import React, { useState } from 'react';
import { apiClient } from '../lib/api-client';

export interface Resource {
    id: string;
    name: string;
    url?: string;
    type: string;
    isFolder: boolean;
    parentId?: string | null;
    fileSize?: string | null;
    fileType?: string;
    createdAt: string;
}

interface FileExplorerProps {
    projectId: string;
    resources: Resource[];
    currentFolderId: string | null;
    onNavigate: (folderId: string | null, folderName: string) => void;
    onRefresh: () => void;
}

export const FileExplorer: React.FC<FileExplorerProps> = ({
    projectId,
    resources,
    currentFolderId,
    onNavigate,
    onRefresh
}) => {
    const [contextMenu, setContextMenu] = useState<{ x: number; y: number; resource: Resource } | null>(null);
    const [isRenameModalOpen, setIsRenameModalOpen] = useState(false);
    const [renameValue, setRenameValue] = useState('');
    const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

    // Filter resources for current folder
    const currentResources = resources.filter(r =>
        (!currentFolderId && !r.parentId) || (r.parentId === currentFolderId)
    );

    const folders = currentResources.filter(r => r.isFolder);
    const files = currentResources.filter(r => !r.isFolder);

    const handleContextMenu = (e: React.MouseEvent, resource: Resource) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY, resource });
    };

    const handleDelete = async (resource: Resource) => {
        if (!confirm(`Are you sure you want to delete "${resource.name}"?`)) return;

        try {
            await apiClient.delete(`/projects/${projectId}/resources/${resource.id}`);
            onRefresh();
        } catch (error) {
            console.error('Failed to delete resource:', error);
            alert('Failed to delete resource');
        }
    };

    const handleRename = async () => {
        if (!selectedResource || !renameValue.trim()) return;

        try {
            await apiClient.patch(`/projects/${projectId}/resources/${selectedResource.id}`, { name: renameValue });
            onRefresh();
            setIsRenameModalOpen(false);
            setRenameValue('');
            setSelectedResource(null);
        } catch (error) {
            console.error('Failed to rename resource:', error);
            alert('Failed to rename resource');
        }
    };

    const formatFileSize = (bytes: string | null | undefined) => {
        if (!bytes) return '';
        const size = parseInt(bytes);
        if (isNaN(size)) return '';
        if (size < 1024) return `${size} B`;
        if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
        return `${(size / 1024 / 1024).toFixed(1)} MB`;
    };

    const getFileIcon = (resource: Resource) => {
        if (resource.isFolder) return 'folder';
        const type = resource.fileType?.toLowerCase() || '';
        if (type.includes('pdf')) return 'picture_as_pdf';
        if (type.includes('image')) return 'image';
        return 'description';
    };

    // Global click listener to close context menu
    React.useEffect(() => {
        const handleClick = () => setContextMenu(null);
        document.addEventListener('click', handleClick);
        return () => document.removeEventListener('click', handleClick);
    }, []);

    return (
        <div className="min-h-[400px]">
            {/* Folders */}
            {folders.length > 0 && (
                <div className="mb-6">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Folders</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                        {folders.map(folder => (
                            <div
                                key={folder.id}
                                onDoubleClick={() => onNavigate(folder.id, folder.name)}
                                onContextMenu={(e) => handleContextMenu(e, folder)}
                                className="group flex flex-col items-center p-3 bg-gray-50 rounded-lg border border-gray-100 hover:bg-white hover:shadow-md hover:border-gray-200 transition-all cursor-pointer select-none"
                            >
                                <span className="material-symbols-outlined text-4xl text-amber-400 mb-2 icon-filled">folder</span>
                                <span className="text-sm font-medium text-center text-gray-700 truncate w-full px-2" title={folder.name}>
                                    {folder.name}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Files */}
            <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Files</h3>
                {files.length === 0 && folders.length === 0 ? (
                    <div className="text-center py-12 text-gray-400 italic">
                        This folder is empty.
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
                        {files.map(file => (
                            <div
                                key={file.id}
                                onDoubleClick={() => file.url && window.open(file.url, '_blank')}
                                onContextMenu={(e) => handleContextMenu(e, file)}
                                className="group flex flex-col items-center p-3 bg-white rounded-lg border border-gray-200 hover:shadow-md hover:border-primary/30 transition-all cursor-pointer select-none"
                            >
                                <span className={`material-symbols-outlined text-4xl mb-2 ${file.fileType?.includes('pdf') ? 'text-red-500' :
                                        file.fileType?.includes('image') ? 'text-purple-500' : 'text-blue-500'
                                    }`}>
                                    {getFileIcon(file)}
                                </span>
                                <span className="text-sm font-medium text-center text-gray-700 truncate w-full px-2" title={file.name}>
                                    {file.name}
                                </span>
                                <span className="text-xs text-gray-400 mt-1">
                                    {formatFileSize(file.fileSize)}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Context Menu */}
            {contextMenu && (
                <div
                    className="fixed z-50 bg-white rounded shadow-lg border border-gray-200 py-1 min-w-[150px]"
                    style={{ left: contextMenu.x, top: contextMenu.y }}
                >
                    {!contextMenu.resource.isFolder && contextMenu.resource.url && (
                        <button
                            onClick={() => window.open(contextMenu.resource.url, '_blank')}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined text-[16px]">open_in_new</span> Open
                        </button>
                    )}
                    <button
                        onClick={() => {
                            setSelectedResource(contextMenu.resource);
                            setRenameValue(contextMenu.resource.name);
                            setIsRenameModalOpen(true);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-[16px]">edit</span> Rename
                    </button>
                    <button
                        onClick={() => handleDelete(contextMenu.resource)}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-[16px]">delete</span> Delete
                    </button>
                </div>
            )}

            {/* Rename Modal */}
            {isRenameModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-sm shadow-xl">
                        <h3 className="text-lg font-bold mb-4">Rename Item</h3>
                        <input
                            type="text"
                            value={renameValue}
                            onChange={(e) => setRenameValue(e.target.value)}
                            className="w-full px-3 py-2 border rounded mb-4 focus:ring-2 focus:ring-primary"
                            autoFocus
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setIsRenameModalOpen(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRename}
                                className="px-4 py-2 bg-primary text-white rounded hover:bg-primary-hover"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
