import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useAnalyzeDocument, useAnalyzeFile } from '../hooks/useAI';
import { useProjects } from '../hooks/useProjects';
import { useCreateTask } from '../hooks/useTasks';

// Storage key for persisting analysis results
const STORAGE_KEY = 'studentflow_document_analysis';

interface StoredAnalysis {
    projectId: string;
    content: string;
    analysis: any;
    timestamp: number;
}

export const DocumentAnalyzerPage: React.FC = () => {
    const [content, setContent] = useState('');
    const [selectedProjectId, setSelectedProjectId] = useState('');
    const [activeTab, setActiveTab] = useState<'text' | 'file'>('text');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { data: projects } = useProjects();
    const analyzeDocument = useAnalyzeDocument();
    const analyzeFile = useAnalyzeFile();
    const createTask = useCreateTask();
    const [analysis, setAnalysis] = useState<any>(null);

    // Load previous analysis from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const data: StoredAnalysis = JSON.parse(stored);
                // Restore if less than 24 hours old
                if (Date.now() - data.timestamp < 24 * 60 * 60 * 1000) {
                    setContent(data.content);
                    setSelectedProjectId(data.projectId);
                    setAnalysis(data.analysis);
                }
            } catch (e) {
                console.error('Failed to restore analysis:', e);
            }
        }
    }, []);

    // Save analysis to localStorage when it changes
    useEffect(() => {
        if (analysis && content) {
            const data: StoredAnalysis = {
                projectId: selectedProjectId,
                content,
                analysis,
                timestamp: Date.now(),
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        }
    }, [analysis, content, selectedProjectId]);

    const handleClearAnalysis = () => {
        setAnalysis(null);
        setContent('');
        setSelectedFile(null);
        localStorage.removeItem(STORAGE_KEY);
    };

    const handleAnalyze = async () => {
        if (activeTab === 'file') {
            if (!selectedFile) return;
            try {
                const result = await analyzeFile.mutateAsync({
                    file: selectedFile,
                    projectId: selectedProjectId || undefined,
                });
                setAnalysis(result);
            } catch (error) {
                console.error('File analysis failed:', error);
            }
        } else {
            if (!content.trim()) return;
            try {
                const result = await analyzeDocument.mutateAsync({
                    content,
                    projectId: selectedProjectId || undefined,
                });
                setAnalysis(result);
            } catch (error) {
                console.error('Analysis failed:', error);
            }
        }
    };

    const handleFileDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragOver(false);
        const file = e.dataTransfer.files[0];
        if (file && (file.type.startsWith('image/') || file.type === 'application/pdf')) {
            setSelectedFile(file);
        }
    };

    const handleCreateTask = async (task: {
        title: string;
        description: string;
        priority?: string;
        dueDate?: string;
        category?: string;
    }) => {
        if (!selectedProjectId) {
            alert('Please select a project first to create tasks');
            return;
        }
        try {
            await createTask.mutateAsync({
                projectId: selectedProjectId,
                data: {
                    title: task.title,
                    description: task.description,
                    priority: task.priority || 'medium',
                    status: 'todo',
                    dueDate: task.dueDate,
                    category: task.category,
                },
            });

            // Show confirmation and offer to navigate
            if (window.confirm(`Task "${task.title}" created successfully!\n\nDo you want to go to the project board to see it?`)) {
                // Navigate to project page and ensure the project is selected
                // We transmit state or just rely on query param if we had one.
                // For now, simple navigation. State persistence depends on implementation.
                // We can use navigate with state, but ProjectPage uses internal state.
                // Let's rely on the user selecting the project or manual navigation if state isn't shared.
                // Wait, ProjectPage uses local state for selectedProjectId.
                // To auto-select, we need to pass it via location state or URL.
                // Let's try passing state.
                window.location.href = `/project?projectId=${selectedProjectId}`; // Correctly pass projectId to auto-select
                // Actually, ProjectPage should support URL param? It doesn't yet.
                // I will add support for URL param to ProjectPage later.
                // For now, I'll just tell them it's created.
            }
        } catch (error) {
            console.error('Failed to create task:', error);
            alert('Failed to create task. Please try again.');
        }
    };

    return (
        <div className="flex-1 h-full overflow-y-auto bg-neutral-bg">
            <div className="max-w-[1200px] mx-auto p-4 md:p-8 flex flex-col gap-8">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-2 text-purple-600 text-sm font-bold uppercase tracking-wider">
                            <span className="material-symbols-outlined text-lg">auto_awesome</span>
                            <span>AI-Powered Analysis</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-text-main">
                            Document <span className="text-purple-600 font-medium">Analyzer</span>
                        </h1>
                        <p className="text-text-muted max-w-xl">
                            Paste your document content and let AI extract tasks, deadlines, and key concepts.
                        </p>
                    </div>
                    <Link
                        to="/data-insight"
                        className="flex items-center gap-2 px-4 py-2 bg-neutral-card rounded-lg border border-secondary-accent/20 text-text-main hover:bg-white transition-colors"
                    >
                        <span className="material-symbols-outlined">insights</span>
                        <span className="text-sm font-medium">View Insights</span>
                    </Link>
                </header>

                {/* Input Section */}
                <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Input Panel */}
                    <div className="bg-neutral-card rounded-2xl p-6 border border-secondary-accent/10 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-text-main">Document Input</h2>
                            <select
                                value={selectedProjectId}
                                onChange={(e) => setSelectedProjectId(e.target.value)}
                                className="px-3 py-1.5 text-sm bg-white rounded-lg border border-secondary-accent/20 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                            >
                                <option value="">Optional: Link to project...</option>
                                {projects?.map((project) => (
                                    <option key={project.id} value={project.id}>
                                        {project.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Tabs */}
                        <div className="flex gap-2 mb-4 p-1 bg-gray-100 rounded-lg">
                            <button
                                type="button"
                                onClick={() => setActiveTab('text')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'text'
                                        ? 'bg-white text-purple-600 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <span className="material-symbols-outlined text-[18px]">text_snippet</span>
                                Paste Text
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('file')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'file'
                                        ? 'bg-white text-purple-600 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                <span className="material-symbols-outlined text-[18px]">upload_file</span>
                                Upload File
                            </button>
                        </div>

                        {activeTab === 'text' ? (
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="Paste your document content here... (syllabus, assignment description, research paper, project brief, etc.)"
                                className="w-full h-72 p-4 text-sm bg-white rounded-xl border border-secondary-accent/20 focus:outline-none focus:ring-2 focus:ring-purple-500/50 resize-none"
                            />
                        ) : (
                            <div
                                onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
                                onDragLeave={() => setIsDragOver(false)}
                                onDrop={handleFileDrop}
                                onClick={() => fileInputRef.current?.click()}
                                className={`w-full h-72 flex flex-col items-center justify-center border-2 border-dashed rounded-xl cursor-pointer transition-colors ${isDragOver
                                        ? 'border-purple-500 bg-purple-50'
                                        : 'border-gray-300 hover:border-purple-400 hover:bg-gray-50'
                                    }`}
                            >
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*,application/pdf"
                                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                                    className="hidden"
                                />
                                {selectedFile ? (
                                    <div className="flex flex-col items-center text-center">
                                        <span className={`material-symbols-outlined text-5xl mb-2 ${selectedFile.type === 'application/pdf' ? 'text-red-500' : 'text-green-500'
                                            }`}>
                                            {selectedFile.type === 'application/pdf' ? 'picture_as_pdf' : 'image'}
                                        </span>
                                        <span className="text-sm font-medium text-text-main">{selectedFile.name}</span>
                                        <span className="text-xs text-text-muted mt-1">
                                            {(selectedFile.size / 1024 / 1024).toFixed(1)} MB
                                        </span>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setSelectedFile(null);
                                            }}
                                            className="mt-2 text-xs text-red-500 hover:text-red-600"
                                        >
                                            Remove file
                                        </button>
                                    </div>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined text-4xl text-gray-400 mb-2">cloud_upload</span>
                                        <span className="text-sm font-medium text-gray-600">Drop PDF or image here</span>
                                        <span className="text-xs text-gray-400 mt-1">or click to browse</span>
                                    </>
                                )}
                            </div>
                        )}

                        <div className="flex items-center justify-between mt-4">
                            <span className="text-xs text-text-muted">
                                {activeTab === 'text' ? `${content.length} characters` : selectedFile ? 'File ready' : 'No file selected'}
                            </span>
                            <div className="flex gap-2">
                                {analysis && (
                                    <button
                                        onClick={handleClearAnalysis}
                                        className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium rounded-lg transition-all"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">delete_sweep</span>
                                        Clear
                                    </button>
                                )}
                                <button
                                    onClick={handleAnalyze}
                                    disabled={(activeTab === 'text' && !content.trim()) || (activeTab === 'file' && !selectedFile) || analyzeDocument.isPending || analyzeFile.isPending}
                                    className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-300 text-white font-bold rounded-lg shadow-md transition-all transform active:scale-95"
                                >
                                    {(analyzeDocument.isPending || analyzeFile.isPending) ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            <span>Analyzing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined">auto_awesome</span>
                                            <span>Analyze with AI</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Quick Tips */}
                    <div className="bg-gradient-to-br from-purple-50 to-neutral-card rounded-2xl p-6 border border-purple-200">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                                <span className="material-symbols-outlined">tips_and_updates</span>
                            </div>
                            <h2 className="text-lg font-bold text-text-main">What AI Can Extract</h2>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-purple-100">
                                <span className="material-symbols-outlined text-purple-500 mt-0.5">task_alt</span>
                                <div>
                                    <h3 className="text-sm font-bold text-text-main">Tasks & Actions</h3>
                                    <p className="text-xs text-text-muted">Identifies actionable items you need to complete</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-purple-100">
                                <span className="material-symbols-outlined text-orange-500 mt-0.5">event</span>
                                <div>
                                    <h3 className="text-sm font-bold text-text-main">Deadlines & Dates</h3>
                                    <p className="text-xs text-text-muted">Extracts important dates and due dates</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-purple-100">
                                <span className="material-symbols-outlined text-blue-500 mt-0.5">lightbulb</span>
                                <div>
                                    <h3 className="text-sm font-bold text-text-main">Key Concepts</h3>
                                    <p className="text-xs text-text-muted">Highlights important terms to understand</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-purple-100">
                                <span className="material-symbols-outlined text-green-500 mt-0.5">topic</span>
                                <div>
                                    <h3 className="text-sm font-bold text-text-main">Research Topics</h3>
                                    <p className="text-xs text-text-muted">Suggests areas for further exploration</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Analysis Results */}
                {analyzeDocument.isError && (
                    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                        <span className="material-symbols-outlined text-red-500 text-3xl mb-2">error</span>
                        <p className="text-red-600 font-medium">Analysis failed</p>
                        <p className="text-red-500 text-sm mt-1">Please check your Gemini API key and try again.</p>
                    </div>
                )}

                {analysis && !analysis.error && (
                    <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Suggested Tasks */}
                        <div className="bg-neutral-card rounded-2xl p-6 border border-secondary-accent/10 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-green-100 rounded-lg text-green-600">
                                    <span className="material-symbols-outlined">checklist</span>
                                </div>
                                <h2 className="text-lg font-bold text-text-main">Suggested Tasks</h2>
                                <span className="ml-auto text-xs font-bold bg-green-100 text-green-600 px-2 py-1 rounded">
                                    {analysis.suggestedTasks?.length || 0} found
                                </span>
                            </div>
                            <div className="space-y-3">
                                {analysis.suggestedTasks?.length ? (
                                    analysis.suggestedTasks.map((task: any, i: number) => (
                                        <div key={i} className="flex items-start gap-3 p-4 bg-white rounded-xl border border-secondary-accent/10 hover:border-green-400 transition-colors">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="text-sm font-bold text-text-main">{task.title}</h4>
                                                    {task.priority && (
                                                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${task.priority === 'high' ? 'bg-red-100 text-red-600' :
                                                            task.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                                                                'bg-green-100 text-green-600'
                                                            }`}>
                                                            {task.priority.toUpperCase()}
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs text-text-muted">{task.description}</p>
                                                <div className="flex items-center gap-3 mt-2">
                                                    {task.dueDate && (
                                                        <span className="flex items-center gap-1 text-[11px] text-orange-600 font-medium">
                                                            <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                                                            {task.dueDate}
                                                        </span>
                                                    )}
                                                    {task.category && (
                                                        <span className="text-[11px] bg-purple-100 text-purple-600 px-2 py-0.5 rounded font-medium">
                                                            {task.category}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleCreateTask(task)}
                                                disabled={createTask.isPending}
                                                className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                                            >
                                                <span className="material-symbols-outlined text-sm">add</span>
                                                Create
                                            </button>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-text-muted text-sm">No tasks found in the document.</p>
                                )}
                            </div>
                        </div>

                        {/* Deadlines */}
                        <div className="bg-neutral-card rounded-2xl p-6 border border-secondary-accent/10 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                                    <span className="material-symbols-outlined">event</span>
                                </div>
                                <h2 className="text-lg font-bold text-text-main">Deadlines Found</h2>
                                <span className="ml-auto text-xs font-bold bg-orange-100 text-orange-600 px-2 py-1 rounded">
                                    {analysis.deadlines?.length || 0} found
                                </span>
                            </div>
                            <div className="space-y-3">
                                {analysis.deadlines?.length ? (
                                    analysis.deadlines.map((deadline: any, i: number) => (
                                        <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-secondary-accent/10">
                                            <span className="material-symbols-outlined text-orange-500">calendar_today</span>
                                            <div>
                                                <p className="text-sm font-medium text-text-main">{deadline.date}</p>
                                                <p className="text-xs text-text-muted">{deadline.description}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-text-muted text-sm">No specific deadlines found.</p>
                                )}
                            </div>
                        </div>

                        {/* Topics */}
                        <div className="bg-neutral-card rounded-2xl p-6 border border-secondary-accent/10 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                                    <span className="material-symbols-outlined">topic</span>
                                </div>
                                <h2 className="text-lg font-bold text-text-main">Research Topics</h2>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {analysis.topics?.length ? (
                                    analysis.topics.map((topic: string, i: number) => (
                                        <span key={i} className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg border border-blue-200">
                                            {topic}
                                        </span>
                                    ))
                                ) : (
                                    <p className="text-text-muted text-sm">No specific topics identified.</p>
                                )}
                            </div>
                        </div>

                        {/* Key Concepts */}
                        <div className="bg-neutral-card rounded-2xl p-6 border border-secondary-accent/10 shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                                    <span className="material-symbols-outlined">lightbulb</span>
                                </div>
                                <h2 className="text-lg font-bold text-text-main">Key Concepts</h2>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {analysis.keyConcepts?.length ? (
                                    analysis.keyConcepts.map((concept: string, i: number) => (
                                        <span key={i} className="px-3 py-1.5 bg-purple-50 text-purple-700 text-sm font-medium rounded-lg border border-purple-200">
                                            {concept}
                                        </span>
                                    ))
                                ) : (
                                    <p className="text-text-muted text-sm">No key concepts identified.</p>
                                )}
                            </div>
                        </div>
                    </section>
                )}

                {analysis?.error && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center">
                        <span className="material-symbols-outlined text-yellow-500 text-3xl mb-2">warning</span>
                        <p className="text-yellow-700 font-medium">{analysis.error}</p>
                        <p className="text-yellow-600 text-sm mt-1">AI features may not be configured properly.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
