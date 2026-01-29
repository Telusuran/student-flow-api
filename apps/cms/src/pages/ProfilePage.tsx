import { useState, useRef } from 'react';
import { useSession } from '../lib/auth-client';
import { apiClient } from '../lib/api-client';

export default function ProfilePage() {
    const { data: session } = useSession();
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Get avatar URL from session or default
    // Note: BetterAuth session user has 'image' field
    const avatarUrl = session?.user?.image;
    const userName = session?.user?.name || 'User';
    const userEmail = session?.user?.email || '';

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Reset error
        setUploadError(null);

        // Client-side validation
        if (file.size > 5 * 1024 * 1024) {
            setUploadError('File size must be less than 5MB');
            return;
        }

        if (!file.type.startsWith('image/')) {
            setUploadError('Only image files are allowed');
            return;
        }

        try {
            setIsUploading(true);

            // Upload to backend
            // The backend endpoint is POST /api/users/me/avatar
            // We strip /api because apiClient adds it, so use /users/me/avatar
            await apiClient.upload('/users/me/avatar', file, 'avatar');

            // Reload page to reflect changes (since session needs to refresh)
            // Ideally we would update the session state, but for now simple reload works
            window.location.reload();
        } catch (error: any) {
            console.error('Upload failed:', error);
            setUploadError(error.message || 'Failed to upload profile picture');
        } finally {
            setIsUploading(false);
            // Clear input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <header className="mb-8">
                <h1 className="text-3xl font-display font-bold text-text-main">Profile Settings</h1>
                <p className="text-text-muted mt-2">Manage your account settings and profile.</p>
            </header>

            <div className="bg-white rounded-xl shadow-sm border p-6">
                <h2 className="text-xl font-semibold mb-6">Personal Information</h2>

                <div className="flex flex-col md:flex-row gap-8 items-start">
                    {/* Avatar Section */}
                    <div className="flex flex-col items-center space-y-4">
                        <div className="relative group">
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100 relative">
                                {avatarUrl ? (
                                    <img
                                        src={avatarUrl}
                                        alt={userName}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-gray-400">
                                        {userName.charAt(0).toUpperCase()}
                                    </div>
                                )}

                                {isUploading && (
                                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                                className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-md hover:bg-primary-dark transition-colors disabled:opacity-50"
                                title="Change profile picture"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                            </button>
                        </div>

                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/*"
                            className="hidden"
                        />

                        <div className="text-center">
                            <p className="text-sm font-medium text-text-main">Profile Picture</p>
                            <p className="text-xs text-text-muted">JPG, PNG or GIF. Max 5MB.</p>
                            {uploadError && (
                                <p className="text-xs text-red-500 mt-1">{uploadError}</p>
                            )}
                        </div>
                    </div>

                    {/* Details Section */}
                    <div className="flex-1 w-full space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-text-main mb-1">Full Name</label>
                            <input
                                type="text"
                                value={userName}
                                disabled
                                className="w-full px-4 py-2 rounded-lg border bg-gray-50 text-gray-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-text-main mb-1">Email Address</label>
                            <input
                                type="email"
                                value={userEmail}
                                disabled
                                className="w-full px-4 py-2 rounded-lg border bg-gray-50 text-gray-500"
                            />
                        </div>

                        <div className="pt-4">
                            <p className="text-sm text-text-muted italic">
                                To update other details, please contact your administrator.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
