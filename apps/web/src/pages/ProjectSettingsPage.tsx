import React from 'react';
import { useParams, Link } from 'react-router-dom';

export const ProjectSettingsPage: React.FC = () => {
    const { projectId } = useParams<{ projectId: string }>();

    return (
        <div className="flex-1 p-8 bg-neutral-bg">
            <h1 className="text-2xl font-bold text-text-main mb-6">Project Settings</h1>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <p className="text-text-muted mb-4">Settings for project ID: {projectId}</p>
                <div className="flex gap-4">
                    <Link to="/project/delete" className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-bold hover:bg-red-100 transition-colors">
                        Delete Project
                    </Link>
                </div>
            </div>
        </div>
    );
};
