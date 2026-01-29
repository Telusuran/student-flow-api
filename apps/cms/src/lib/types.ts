// User types for CMS
export interface User {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface UserProfile {
    userId: string;
    displayName: string | null;
    avatarUrl: string | null;
    role: 'student' | 'mentor' | 'admin';
    institution: string | null;
    major: string | null;
    bio: string | null;
    currentTerm: string | null;
    timezone: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface UserWithProfile extends User {
    profile?: UserProfile;
}

// Project types
export interface Project {
    id: string;
    name: string;
    description: string | null;
    courseCode: string | null;
    courseName: string | null;
    color: string | null;
    icon: string | null;
    status: string | null;
    dueDate: string | null;
    startDate: string | null;
    progress: number | null;
    ownerId: string;
    createdAt: string | null;
    updatedAt: string | null;
    deletedAt: string | null;
    owner?: User;
}

// Stats types
export interface DashboardStats {
    totalUsers: number;
    totalProjects: number;
    activeProjects: number;
    totalTasks: number;
}
