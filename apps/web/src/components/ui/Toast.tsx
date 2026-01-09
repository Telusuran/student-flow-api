import React, { createContext, useContext, useState, useCallback } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Math.random().toString(36).substring(2, 9);
        const toast = { id, message, type };

        setToasts((prev) => [...prev, toast]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    }, []);

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`
                            min-w-[300px] p-4 rounded-lg shadow-lg border-l-4 transform transition-all duration-300 animate-slide-in
                            ${toast.type === 'success' ? 'bg-white border-green-500 text-gray-800' : ''}
                            ${toast.type === 'error' ? 'bg-white border-red-500 text-gray-800' : ''}
                            ${toast.type === 'info' ? 'bg-white border-blue-500 text-gray-800' : ''}
                        `}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {toast.type === 'success' && <span className="material-symbols-outlined text-green-500">check_circle</span>}
                                {toast.type === 'error' && <span className="material-symbols-outlined text-red-500">error</span>}
                                {toast.type === 'info' && <span className="material-symbols-outlined text-blue-500">info</span>}
                                <span className="font-medium text-sm">{toast.message}</span>
                            </div>
                            <button onClick={() => removeToast(toast.id)} className="text-gray-400 hover:text-gray-600">
                                <span className="material-symbols-outlined text-sm">close</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};
