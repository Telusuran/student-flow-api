import { apiClient } from "./api-client";
import type {
    AIHealth,
    AISuggestion,
    AIReport,
    AnalyzeDocumentData,
    DocumentAnalysis,
} from "./types";

export const aiService = {
    /**
     * Get AI health score for a project
     */
    getProjectHealth: (projectId: string): Promise<AIHealth> => {
        return apiClient.get<AIHealth>(`/ai/projects/${projectId}/ai/health`);
    },

    /**
     * Get smart task suggestions for a project
     */
    getSuggestions: (projectId: string): Promise<AISuggestion[]> => {
        return apiClient.get<AISuggestion[]>(
            `/ai/projects/${projectId}/ai/suggestions`
        );
    },

    /**
     * Get AI insights report for a project
     */
    getReport: (projectId: string): Promise<AIReport> => {
        return apiClient.get<AIReport>(`/ai/projects/${projectId}/ai/report`);
    },

    /**
     * Analyze document content (text)
     */
    analyzeDocument: (data: AnalyzeDocumentData): Promise<DocumentAnalysis> => {
        return apiClient.post<DocumentAnalysis>("/ai/analyze-document", data);
    },

    /**
     * Analyze uploaded file (PDF, Image) using multimodal AI
     */
    analyzeFile: (file: File, projectId?: string): Promise<DocumentAnalysis> => {
        const formData = new FormData();
        formData.append('file', file);
        if (projectId) {
            formData.append('projectId', projectId);
        }
        return apiClient.post<DocumentAnalysis>("/ai/analyze-file", formData);
    },

    /**
     * Get Global AI health score
     */
    getGlobalHealth: (): Promise<AIHealth> => {
        return apiClient.get<AIHealth>("/ai/global-health");
    },

    /**
     * Get Global smart task suggestions
     */
    getGlobalSuggestions: (): Promise<AISuggestion[]> => {
        return apiClient.get<AISuggestion[]>("/ai/global-suggestions");
    },

    /**
     * Get Global AI insights report
     */
    getGlobalReport: (): Promise<AIReport> => {
        return apiClient.get<AIReport>("/ai/global-report");
    },

    /**
     * Generate AI suggestions based on current tasks
     */
    generateSuggestions: (data: { projectId: string; tasks: Array<{ title: string; status: string | null; priority: string | null; dueDate: string | null }> }): Promise<AISuggestion[]> => {
        return apiClient.post<AISuggestion[]>("/ai/generate-suggestions", data);
    },
};

