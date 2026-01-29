import { useQuery, useMutation } from "@tanstack/react-query";
import { aiService } from "../lib/api/ai.service";
import type { AnalyzeDocumentData } from "../lib/api/types";

// Query keys
export const aiKeys = {
    all: ["ai"] as const,
    health: (projectId: string) =>
        [...aiKeys.all, "health", projectId] as const,
    suggestions: (projectId: string) =>
        [...aiKeys.all, "suggestions", projectId] as const,
    report: (projectId: string) =>
        [...aiKeys.all, "report", projectId] as const,
};

/**
 * Hook to fetch AI health score for a project or globally
 */
export function useProjectHealth(projectId: string) {
    return useQuery({
        queryKey: projectId === 'all' ? ['ai', 'health', 'global'] : aiKeys.health(projectId),
        queryFn: () => projectId === 'all'
            ? aiService.getGlobalHealth()
            : aiService.getProjectHealth(projectId),
        enabled: !!projectId,
        staleTime: 1000 * 60 * 10, // 10 minutes
    });
}

/**
 * Hook to fetch AI task suggestions for a project or globally
 */
export function useProjectSuggestions(projectId: string) {
    return useQuery({
        queryKey: projectId === 'all' ? ['ai', 'suggestions', 'global'] : aiKeys.suggestions(projectId),
        queryFn: () => projectId === 'all'
            ? aiService.getGlobalSuggestions()
            : aiService.getSuggestions(projectId),
        enabled: !!projectId,
        staleTime: 1000 * 60 * 10,
    });
}

/**
 * Hook to fetch AI insights report for a project or globally
 */
export function useProjectReport(projectId: string) {
    return useQuery({
        queryKey: projectId === 'all' ? ['ai', 'report', 'global'] : aiKeys.report(projectId),
        queryFn: () => projectId === 'all'
            ? aiService.getGlobalReport()
            : aiService.getReport(projectId),
        enabled: !!projectId,
        staleTime: 1000 * 60 * 10,
    });
}

/**
 * Hook to analyze a document (text)
 */
export function useAnalyzeDocument() {
    return useMutation({
        mutationFn: (data: AnalyzeDocumentData) =>
            aiService.analyzeDocument(data),
    });
}

/**
 * Hook to analyze an uploaded file (PDF, Image)
 */
export function useAnalyzeFile() {
    return useMutation({
        mutationFn: ({ file, projectId }: { file: File; projectId?: string }) =>
            aiService.analyzeFile(file, projectId),
    });
}

/**
 * Hook to generate AI suggestions based on current tasks
 */
export function useGenerateSuggestions() {
    return useMutation({
        mutationFn: (data: { projectId: string; tasks: Array<{ title: string; status: string | null; priority: string | null; dueDate: string | null }> }) =>
            aiService.generateSuggestions(data),
    });
}

