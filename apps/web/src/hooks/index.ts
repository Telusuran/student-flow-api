// Auth hooks
export { useSession, signIn, signUp, signOut } from "../lib/auth-client";

// Project hooks
export {
    useProjects,
    useArchivedProjects,
    useProject,
    useCreateProject,
    useUpdateProject,
    useDeleteProject,
    useRestoreProject,
    useAddProjectMember,
    useRemoveProjectMember,
    projectKeys,
} from "./useProjects";

// Task hooks
export {
    useProjectTasks,
    useTask,
    useCreateTask,
    useUpdateTask,
    useUpdateTaskStatus,
    useDeleteTask,
    useAddTaskAssignee,
    useRemoveTaskAssignee,
    useTaskComments,
    useAddComment,
    useTaskAttachments,
    useAddAttachment,
    taskKeys,
} from "./useTasks";

// AI hooks
export {
    useProjectHealth,
    useProjectSuggestions,
    useProjectReport,
    useAnalyzeDocument,
    aiKeys,
} from "./useAI";
