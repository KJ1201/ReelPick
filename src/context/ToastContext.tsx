'use client';

import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { CheckCircle2, AlertCircle, X, Info, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

type ToastType = 'success' | 'error' | 'info' | 'premium';

interface Toast {
    id: string;
    message: string;
    type: ToastType;
}

interface ToastContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 5000);
    }, []);

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed bottom-32 md:bottom-10 right-6 z-[999] flex flex-col gap-3 pointer-events-none">
                <AnimatePresence mode="popLayout">
                    {toasts.map((toast) => (
                        <motion.div
                            key={toast.id}
                            initial={{ opacity: 0, scale: 0.9, y: 20, x: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                            exit={{ opacity: 0, scale: 0.9, x: 50 }}
                            className="pointer-events-auto"
                        >
                            <div className={cn(
                                "min-w-[320px] max-w-md p-4 rounded-[24px] border backdrop-blur-2xl shadow-2xl flex items-center justify-between gap-4 select-none",
                                toast.type === 'success' && "bg-green-500/10 border-green-500/20 text-green-400",
                                toast.type === 'error' && "bg-red-500/10 border-red-500/20 text-red-400",
                                toast.type === 'info' && "bg-blue-500/10 border-blue-500/20 text-blue-400",
                                toast.type === 'premium' && "bg-primary/10 border-primary/20 text-primary"
                            )}>
                                <div className="flex items-center gap-3">
                                    <div className={cn(
                                        "w-10 h-10 rounded-full flex items-center justify-center shrink-0",
                                        toast.type === 'success' && "bg-green-500/20",
                                        toast.type === 'error' && "bg-red-500/20",
                                        toast.type === 'info' && "bg-blue-500/20",
                                        toast.type === 'premium' && "bg-primary/20"
                                    )}>
                                        {toast.type === 'success' && <CheckCircle2 className="w-5 h-5" />}
                                        {toast.type === 'error' && <AlertCircle className="w-5 h-5" />}
                                        {toast.type === 'info' && <Info className="w-5 h-5" />}
                                        {toast.type === 'premium' && <Sparkles className="w-5 h-5" />}
                                    </div>
                                    <p className="text-sm font-bold leading-tight">{toast.message}</p>
                                </div>
                                <button
                                    onClick={() => removeToast(toast.id)}
                                    className="p-1 hover:bg-white/5 rounded-full transition-colors text-white/20 hover:text-white"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}
