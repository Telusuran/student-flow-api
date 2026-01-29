import React, { useRef, useState } from 'react';
import { apiClient } from '../lib/api-client';

interface Attachment {
    id: string;
    name: string;
    url: string;
    size: number;
    type: string;
}

interface TaskAttachmentsProps {
    taskId: string;
    initialAttachments?: Attachment[];
}

export const TaskAttachments: React.FC<TaskAttachmentsProps> = ({ taskId, initialAttachments = [] }) => {
    const [attachments, setAttachments] = useState<Attachment[]>(initialAttachments);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const loadAttachments = async () => {
        try {
            const data = await apiClient.get<Attachment[]>(`/tasks/${taskId}/attachments`);
            setAttachments(data);
        } catch (error) {
            console.error('Failed to load attachments:', error);
        }
    };

    React.useEffect(() => {
        if (initialAttachments.length === 0) {
            loadAttachments();
        }
    }, [taskId]);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            // Using existing apiClient.upload method
            // The backend endpoint returns the attachment object
            const newAttachment = await apiClient.upload<Attachment>(`/tasks/${taskId}/attachments`, file);
            setAttachments(prev => [...prev, newAttachment]);
        } catch (error) {
            console.error('Failed to upload attachment:', error);
            alert('Failed to upload file');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    return (
        <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-bold text-gray-700 uppercase tracking-wider">Attachments</h4>
                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="text-xs flex items-center gap-1 text-primary hover:text-primary/80 font-medium"
                >
                    <span className="material-symbols-outlined text-[16px]">add</span>
                    Add File
                </button>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                />
            </div>

            <div className="grid grid-cols-1 gap-2">
                {attachments.length === 0 && (
                    <div className="text-sm text-gray-400 italic py-2">No attachments yet.</div>
                )}
                {attachments.map(att => (
                    <a
                        key={att.id}
                        href={att.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                    >
                        <div className="size-8 bg-blue-100 text-blue-500 rounded flex items-center justify-center shrink-0">
                            <span className="material-symbols-outlined text-sm">description</span>
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-medium truncate text-gray-700">{att.name}</span>
                            <span className="text-xs text-gray-500">{((att.size || 0) / 1024).toFixed(1)} KB</span>
                        </div>
                    </a>
                ))}
            </div>
            {isUploading && (
                <div className="mt-2 text-xs text-blue-500 flex items-center gap-2">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-500"></div>
                    Uploading...
                </div>
            )}
        </div>
    );
};
