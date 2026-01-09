import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProjects } from '../hooks/useProjects';
import { useProjectChannels, useChannelMessages, useSendMessage, useCreateChannel } from '../hooks/useMessaging';
import { useSession } from '../lib/auth-client';

const STORAGE_KEY = 'studentflow_last_project';

export const ProjectMessagingPage: React.FC = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const urlProjectId = searchParams.get('projectId');

    // Initialize with URL param, then localStorage, otherwise empty
    const [selectedProjectId, setSelectedProjectId] = useState<string>(() => {
        if (urlProjectId) return urlProjectId;
        return localStorage.getItem(STORAGE_KEY) || '';
    });
    const [selectedChannelId, setSelectedChannelId] = useState<string>('');
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const [isCreatingChannel, setIsCreatingChannel] = useState(false);
    const [newChannelName, setNewChannelName] = useState('');

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const { data: session } = useSession();

    const { data: projects } = useProjects();
    const { data: channels } = useProjectChannels(selectedProjectId);
    const { data: messages } = useChannelMessages(selectedChannelId);

    const sendMessage = useSendMessage();
    const createChannel = useCreateChannel();

    // Auto-select first channel
    useEffect(() => {
        if (channels && channels.length > 0 && !selectedChannelId) {
            setSelectedChannelId(channels[0].id);
        }
    }, [channels, selectedChannelId]);

    // Scroll to bottom on new messages
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Sync URL and localStorage
    useEffect(() => {
        if (selectedProjectId) {
            setSearchParams({ projectId: selectedProjectId });
            localStorage.setItem(STORAGE_KEY, selectedProjectId);
        }
    }, [selectedProjectId, setSearchParams]);

    const handleSendMessage = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!newMessage.trim() || !selectedChannelId) return;

        sendMessage.mutate({ channelId: selectedChannelId, content: newMessage });
        setNewMessage('');
    };

    const handleCreateChannel = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newChannelName.trim() || !selectedProjectId) return;

        createChannel.mutate({ projectId: selectedProjectId, name: newChannelName }, {
            onSuccess: (channel) => {
                setSelectedChannelId(channel.id);
                setIsCreatingChannel(false);
                setNewChannelName('');
            }
        });
    };

    const selectedProject = projects?.find(p => p.id === selectedProjectId);
    const selectedChannel = channels?.find(c => c.id === selectedChannelId);

    // Using selectedProject for title later
    void selectedProject; // Avoid unused warning

    return (
        <div className="bg-background-light dark:bg-background-dark h-full flex flex-col text-text-main font-display">
            {/* Top Navigation */}
            <header className="h-16 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between px-6 shadow-soft z-20 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-2 rounded-lg text-primary">
                        <span className="material-symbols-outlined">forum</span>
                    </div>
                    <div>
                        {/* Project Selector */}
                        <div className="relative group min-w-[200px]">
                            <select
                                value={selectedProjectId}
                                onChange={(e) => {
                                    setSelectedProjectId(e.target.value);
                                    setSelectedChannelId(''); // Reset channel on project switch
                                }}
                                className="w-full font-bold text-lg leading-tight bg-transparent border-none focus:outline-none cursor-pointer appearance-none pr-6"
                            >
                                <option value="">Select a project...</option>
                                {projects?.map((project) => (
                                    <option key={project.id} value={project.id}>
                                        {project.name}
                                    </option>
                                ))}
                            </select>
                            <span className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary">
                                <span className="material-symbols-outlined text-[20px]">expand_more</span>
                            </span>
                        </div>
                        <p className="text-xs text-text-secondary">Team Chat</p>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 flex overflow-hidden">
                {!selectedProjectId ? (
                    <div className="flex-1 flex flex-col items-center justify-center bg-gray-50">
                        <div className="p-4 bg-white rounded-full shadow-sm mb-4">
                            <span className="material-symbols-outlined text-4xl text-gray-400">forum</span>
                        </div>
                        <h2 className="text-xl font-bold text-gray-700">Select a Project to Chat</h2>
                    </div>
                ) : (
                    <>
                        {/* Left Sidebar: Channels */}
                        <aside className={`w-64 bg-white dark:bg-gray-800 flex flex-col border-r border-gray-100 dark:border-gray-700 shrink-0 ${isMobileMenuOpen ? 'block' : 'hidden'} md:flex`}>
                            <div className="p-5 pb-2">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Channels</h2>
                                    <button
                                        onClick={() => setIsCreatingChannel(true)}
                                        className="text-gray-400 hover:text-primary transition-colors"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">add</span>
                                    </button>
                                </div>

                                {isCreatingChannel && (
                                    <form onSubmit={handleCreateChannel} className="mb-2">
                                        <input
                                            autoFocus
                                            type="text"
                                            value={newChannelName}
                                            onChange={(e) => setNewChannelName(e.target.value)}
                                            placeholder="Channel name..."
                                            className="w-full px-2 py-1 text-sm border rounded mb-1"
                                        />
                                        <div className="flex gap-1">
                                            <button type="submit" className="text-xs bg-primary text-white px-2 py-0.5 rounded">Create</button>
                                            <button type="button" onClick={() => setIsCreatingChannel(false)} className="text-xs bg-gray-200 px-2 py-0.5 rounded">Cancel</button>
                                        </div>
                                    </form>
                                )}

                                <nav className="space-y-1">
                                    {channels?.map(channel => (
                                        <button
                                            key={channel.id}
                                            onClick={() => setSelectedChannelId(channel.id)}
                                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-all group ${selectedChannelId === channel.id
                                                ? 'bg-primary/10 text-primary'
                                                : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900'
                                                }`}
                                        >
                                            <span className="material-symbols-outlined text-[20px]">{channel.icon || 'tag'}</span>
                                            <span className="capitalize">{channel.name}</span>
                                        </button>
                                    ))}
                                    {channels?.length === 0 && (
                                        <div className="text-xs text-gray-400 italic px-3">No channels yet</div>
                                    )}
                                </nav>
                            </div>
                        </aside>

                        {/* Center: Chat Area */}
                        <section className="flex-1 flex flex-col min-w-0 bg-background-light dark:bg-background-dark relative">
                            {/* Chat Header (Mobile only toggle) */}
                            <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 border-b border-gray-100">
                                <div className="flex items-center gap-2">
                                    <span className="material-symbols-outlined text-gray-400">tag</span>
                                    <span className="font-bold capitalize">{selectedChannel?.name || 'Select Channel'}</span>
                                </div>
                                <button className="p-1" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                                    <span className="material-symbols-outlined">menu</span>
                                </button>
                            </div>

                            {/* Messages Container */}
                            <div className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6 flex flex-col">
                                {messages?.map((msg, index) => {
                                    const isMe = msg.sender.id === session?.user.id;
                                    const showHeader = index === 0 || messages[index - 1].sender.id !== msg.sender.id;

                                    return (
                                        <div key={msg.id} className={`flex gap-4 group ${isMe ? 'flex-row-reverse self-end max-w-[85%]' : 'max-w-[85%]'}`}>
                                            {!isMe && showHeader && (
                                                <div className="w-10 h-10 rounded-full bg-gray-300 bg-cover bg-center shrink-0 shadow-sm" style={{ backgroundImage: `url('${msg.sender.avatar || `https://ui-avatars.com/api/?name=${msg.sender.name}`}')` }}></div>
                                            )}
                                            {isMe && showHeader && (
                                                <div className="w-10 h-10 rounded-full bg-gray-300 bg-cover bg-center shrink-0 shadow-sm" style={{ backgroundImage: `url('${msg.sender.avatar || `https://ui-avatars.com/api/?name=${msg.sender.name}`}')` }}></div>
                                            )}
                                            {!showHeader && <div className="w-10 shrink-0"></div>}

                                            <div className={`flex flex-col gap-1 ${isMe ? 'items-end' : 'items-start'} min-w-0`}>
                                                {showHeader && (
                                                    <div className={`flex items-baseline gap-2 ${isMe ? 'flex-row-reverse' : ''}`}>
                                                        <span className="font-semibold text-sm">{msg.sender.name}</span>
                                                        <span className="text-[11px] text-gray-400">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                    </div>
                                                )}
                                                <div className={`p-3 px-4 rounded-2xl shadow-sm text-sm leading-relaxed border ${isMe
                                                    ? 'bg-primary text-white rounded-tr-none border-primary'
                                                    : 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-tl-none border-gray-100 dark:border-gray-600'
                                                    }`}>
                                                    {msg.content}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <div className="p-6 pt-2">
                                <form onSubmit={handleSendMessage} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-600 p-2 flex flex-col gap-2 relative focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                                    <textarea
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSendMessage();
                                            }
                                        }}
                                        className="w-full bg-transparent border-none text-sm text-gray-800 dark:text-white placeholder-gray-400 focus:ring-0 resize-none min-h-[48px] max-h-32 py-3 px-3 no-scrollbar"
                                        placeholder={`Message #${selectedChannel?.name || 'channel'}...`}
                                        rows={1}
                                        disabled={!selectedChannelId}
                                    ></textarea>
                                    <div className="flex items-center justify-between px-2 pb-1">
                                        <div className="flex items-center gap-1">
                                            <button type="button" className="p-2 text-gray-400 hover:text-gray-600 rounded-full transition-colors">
                                                <span className="material-symbols-outlined text-[20px]">attach_file</span>
                                            </button>
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={!newMessage.trim() || !selectedChannelId}
                                            className="bg-primary hover:bg-primary-hover disabled:bg-gray-300 text-white p-2.5 rounded-lg shadow-md transition-all flex items-center justify-center"
                                        >
                                            <span className="material-symbols-outlined text-[20px]">send</span>
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </section>
                    </>
                )}
            </main>
        </div>
    );
};
