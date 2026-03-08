'use client';

import { CheckCircle2, ShoppingBag, MessageSquare, ArrowRight, Share2, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface OrderSuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
    productName: string;
    productPrice: number;
    productImageUrl: string;
}

export function OrderSuccessModal({ isOpen, onClose, productName, productPrice, productImageUrl }: OrderSuccessModalProps) {
    if (!isOpen) return null;

    const orderNumber = Math.floor(Math.random() * 900000) + 100000;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/90 backdrop-blur-xl animate-fade-in">
            <div className="relative w-full max-w-lg bg-[#0A0A0B] border border-white/10 rounded-[40px] overflow-hidden shadow-[0_0_100px_rgba(255,255,255,0.05)]">

                {/* Confetti / Particle effect (simplified) */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
                    <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-primary/40 rounded-full blur-[80px] animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-32 h-32 bg-indigo-500/40 rounded-full blur-[80px] animate-pulse" />
                </div>

                <div className="relative p-8 md:p-12 flex flex-col items-center text-center">
                    {/* Success Icon */}
                    <div className="w-24 h-24 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-8 relative">
                        <CheckCircle2 className="w-12 h-12 text-green-400" />
                        <div className="absolute -inset-2 bg-green-400/20 rounded-full animate-ping opacity-20" />
                    </div>

                    <h2 className="text-4xl font-sans font-black tracking-tighter mb-4 uppercase">
                        Order <span className="text-primary text-primary">Confirmed</span>
                    </h2>

                    <p className="text-white/40 font-bold uppercase tracking-[0.2em] text-xs mb-8">
                        Order #RP-{orderNumber}
                    </p>

                    <div className="w-full bg-white/5 border border-white/5 rounded-3xl p-6 mb-8 flex items-center gap-6 text-left">
                        <div className="relative w-20 h-24 rounded-xl overflow-hidden shrink-0">
                            <Image src={productImageUrl} alt={productName} fill className="object-cover" unoptimized />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-lg font-bold truncate mb-1">{productName}</h4>
                            <p className="text-primary font-black text-xl">₹{productPrice.toLocaleString()}</p>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="text-[10px] font-bold text-white/30 uppercase tracking-widest">Estimated Delivery:</span>
                                <span className="text-[10px] font-black text-green-400 uppercase tracking-widest">3-5 Days</span>
                            </div>
                        </div>
                    </div>

                    {/* WhatsApp Notification Simulation */}
                    <div className="w-full bg-[#25D366]/10 border border-[#25D366]/20 rounded-2xl p-4 mb-10 flex items-start gap-3 text-left">
                        <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center shrink-0">
                            <MessageSquare className="w-4 h-4 text-white fill-white" />
                        </div>
                        <div>
                            <p className="text-[11px] font-black text-[#25D366] uppercase tracking-tight">WhatsApp Notification Sent</p>
                            <p className="text-[10px] text-white/50 mt-0.5 leading-relaxed">
                                We've sent your order tracking link to your registered number +91 99****8822.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 w-full">
                        <button
                            onClick={onClose}
                            className="h-14 rounded-2xl bg-white/5 border border-white/10 text-white/50 font-bold text-sm hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                        >
                            View Order Details
                        </button>
                        <button
                            onClick={onClose}
                            className="h-14 rounded-2xl bg-primary text-white font-black text-sm shadow-xl shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                            Continue Shopping
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="mt-8 flex items-center gap-6">
                        <button className="flex flex-col items-center gap-2 text-white/20 hover:text-white transition-colors group">
                            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <Share2 className="w-4 h-4" />
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-widest">Share Gear</span>
                        </button>
                        <button className="flex flex-col items-center gap-2 text-white/20 hover:text-white transition-colors group">
                            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center group-hover:bg-yellow-500/20 transition-colors">
                                <Star className="w-4 h-4" />
                            </div>
                            <span className="text-[9px] font-black uppercase tracking-widest">Rate Drop</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
