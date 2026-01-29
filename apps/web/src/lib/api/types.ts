// API Types based on database schemas

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
    members?: ProjectMember[];
}

export interface ProjectMember {
    id: string;
    projectId: string;
    userId: string;
    role: string | null;
    joinedAt: string | null;
    user?: {
        id: string;
        name: string;
        email: string;
        image?: string;
    };
}

export interface CreateProjectData {
    name: string;
    description?: string;
    courseCode?: string;
    courseName?: string;
    color?: string;
    icon?: string;
    dueDate?: string;
    startDate?: string;
}

export interface UpdateProjectData {
    name?: string;
    description?: string;
    courseCode?: string;
    courseName?: string;
    color?: string;
    icon?: string;
    status?: string;
    dueDate?: string;
    startDate?: string;
    progress?: number;
}

// Task types
export interface Task {
    id: string;
    projectId: string;
    title: string;
    description: string | null;
    status: string | null;
    priority: string | null;
    category: string | null;
    dueDate: string | null;
    progress: number | null;
    order: number | null;
    createdBy: string | null;
    createdAt: string | null;
    updatedAt: string | null;
    creator?: {
        id: string;
        name: string;
        email: string;
    };
}

export interface TaskAssignee {
    taskId: string;
    userId: string;
    assignedAt: string | null;
    user?: {
        id: string;
        name: string;
        email: string;
        avatar?: string;
    };
}

export interface Comment {
    id: string;
    taskId: string;
    userId: string;
    content: string;
    createdAt: string | null;
    updatedAt: string | null;
    user?: {
        id: string;
        name: string;
        email: string;
        avatar?: string;
    };
}

export interface Attachment {
    id: string;
    taskId: string;
    name: string;
    url: string;
    type: string | null;
    size: number | null;
    uploadedBy: string | null;
    createdAt: string | null;
}

export interface CreateTaskData {
    title: string;
    description?: string;
    status?: string;
    priority?: string;
    category?: string;
    dueDate?: string;
    order?: number;
}

export interface UpdateTaskData {
    title?: string;
    description?: string;
    status?: string;
    priority?: string;
    category?: string;
    dueDate?: string;
    progress?: number;
    order?: number;
}

export interface CreateCommentData {
    content: string;
}

export interface CreateAttachmentData {
    name: string;
    url: string;
    type?: string;
    size?: number;
}

// AI types
export interface AIHealth {
    score: number;
    factors: {
        name: string;
        score: number;
        weight: number;
    }[];
    recommendations: string[];
}

export interface AISuggestion {
    id: string;
    title: string;
    description: string;
    priority: string;
    reason: string;
}

export interface AIReport {
    health: {
        score: number;
        status: 'excellent' | 'good' | 'at_risk' | 'critical';
        insights: string[];
    };
    metrics: {
        totalTasks: number;
        completedTasks: number;
        inProgressTasks: number;
        overdueTasks: number;
        daysUntilDeadline: number | null;
        tasksCompletedThisWeek: number;
        avgCompletionTime: number;
    };
    summary: string;
    achievements?: string[];
    attention?: string[];
    recommendations: string[];
}

export interface AnalyzeDocumentData {
    content: string;
    projectId?: string;
}

export interface DocumentAnalysis {
    summary: string;
    extractedTasks: {
        title: string;
        description: string;
        priority: string;
    }[];
    keyPoints: string[];
}

export interface ApiError {
    error: string;
    message?: string;
}

// Resource types
export interface CreateResourceDTO {
    projectId: string;
    parentId?: string | null;
    isFolder?: boolean;
    name: string;
    type: 'linked_file' | 'external_tool' | 'folder';
    url?: string;
    description?: string;
    source?: string;
    thumbnailUrl?: string;
    fileType?: string;
    fileSize?: string;
    tags?: string[];
}

export interface Resource {
    id: string;
    projectId: string;
    parentId: string | null;
    isFolder: boolean;
    name: string;
    description: string | null;
    type: 'linked_file' | 'external_tool' | 'folder';
    source: string | null;
    url: string | null;
    thumbnailUrl: string | null;
    fileType: string | null;
    fileSize: string | null;
    tags: string[] | null;
    addedBy: string | null;
    createdAt: string;
    updatedAt: string;
    uploader?: {
        id: string;
        name: string;
        avatar?: string;
    };
}

