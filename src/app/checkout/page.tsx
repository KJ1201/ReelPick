'use client';

import { Sidebar } from '@/components/common/Sidebar';
import { MobileNav } from '@/components/common/MobileNav';
import { CreditCard, Lock, ShieldCheck, MapPin, Phone, Mail, ChevronLeft, Loader2, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useEffect } from 'react';

export default function CheckoutPage() {
    const router = useRouter();
    const { showToast } = useToast();
    const { user, loading } = useAuth();
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.push(`/auth?next=${encodeURIComponent(window.location.pathname)}`);
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return (
            <div className="w-full h-[100dvh] bg-black flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-white/10" />
            </div>
        );
    }

    const handleConfirm = () => {
        setIsProcessing(true);
        setTimeout(() => {
            showToast('Order synchronized successfully!', 'premium');
            router.push('/cart'); // In a real app we'd go to success
        }, 3000);
    };

    return (
        <div className="w-full h-[100dvh] flex bg-[#0A0A0B] text-white overflow-hidden">
            <Sidebar />
            <main className="flex-1 relative h-full bg-ink-100 flex flex-col items-center justify-start overflow-y-auto pb-40 custom-scrollbar">

                <header className="w-full p-8 pt-12 max-w-4xl flex items-center justify-between mb-10">
                    <button onClick={() => router.back()} className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all active:scale-90">
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <div className="text-center">
                        <h1 className="text-3xl font-sans font-black tracking-tight mb-1">Checkout</h1>
                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">Secure Transaction Node</p>
                    </div>
                    <div className="w-12 h-12" />
                </header>

                <div className="w-full max-w-3xl px-8 grid gap-8 animate-fade-in">

                    {/* Shipping Section */}
                    <div className="p-10 rounded-[40px] bg-white/5 border border-white/5 space-y-8 shadow-2xl">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                                <MapPin className="w-5 h-5 text-primary" />
                            </div>
                            <h2 className="text-xl font-bold">Shipping Logic</h2>
                        </div>

                        <div className="grid gap-6">
                            <div className="space-y-2">
                                <label className="text-[9px] font-bold uppercase tracking-widest text-white/30 ml-1">Street Address</label>
                                <input value="123 Fashion Ave, Block B" readOnly className="w-full h-14 bg-black/40 border border-white/5 rounded-2xl px-6 text-sm text-white/60 focus:outline-none" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold uppercase tracking-widest text-white/30 ml-1">City</label>
                                    <input value="New Delhi" readOnly className="w-full h-14 bg-black/40 border border-white/5 rounded-2xl px-6 text-sm text-white/60 focus:outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] font-bold uppercase tracking-widest text-white/30 ml-1">Pincode</label>
                                    <input value="110001" readOnly className="w-full h-14 bg-black/40 border border-white/5 rounded-2xl px-6 text-sm text-white/60 focus:outline-none" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Section */}
                    <div className="p-10 rounded-[40px] bg-white/5 border border-white/5 space-y-8 shadow-2xl">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                                <CreditCard className="w-5 h-5 text-indigo-400" />
                            </div>
                            <h2 className="text-xl font-bold">Payment Gateway</h2>
                        </div>

                        <div className="p-6 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-between group cursor-pointer hover:bg-indigo-500/20 transition-all">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                                    <ShieldCheck className="w-6 h-6 text-indigo-600" />
                                </div>
                                <div>
                                    <p className="font-bold text-white">Razorpay Wallet / UPI</p>
                                    <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Recommended Choice</p>
                                </div>
                            </div>
                            <div className="w-6 h-6 rounded-full border-2 border-indigo-500/50 flex items-center justify-center group-hover:bg-indigo-500 transition-all">
                                <div className="w-2.5 h-2.5 bg-white rounded-full scale-0 group-hover:scale-100 transition-transform shadow-lg shadow-white/50" />
                            </div>
                        </div>

                        <p className="text-center text-[10px] font-bold uppercase tracking-widest text-white/10">3D Secure v2 Authentication Required</p>
                    </div>

                    <button
                        onClick={handleConfirm}
                        disabled={isProcessing}
                        className="w-full h-18 rounded-[40px] bg-white text-black font-black text-2xl shadow-[0_12px_48px_rgba(255,255,255,0.1)] hover:bg-primary hover:text-white transition-all active:scale-[0.98] flex items-center justify-center gap-4 py-6"
                    >
                        {isProcessing ? <Loader2 className="w-8 h-8 animate-spin" /> : (
                            <>
                                <span>Confirm Purchase</span>
                                <ArrowRight className="w-6 h-6" />
                            </>
                        )}
                    </button>

                    <div className="flex items-center justify-center gap-4 text-white/20 pb-20">
                        <Lock className="w-4 h-4" />
                        <span className="text-[9px] font-black uppercase tracking-widest">End-to-End Encrypted Tunnel v4.2</span>
                    </div>

                </div>
                <MobileNav />
            </main>
        </div>
    );
}
