'use client';

import { Sidebar } from '@/components/common/Sidebar';
import { MobileNav } from '@/components/common/MobileNav';
import { Package, ChevronLeft, ExternalLink, Clock, CheckCircle2, Truck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

export default function OrdersPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState([
        { id: 'ORD-7729', date: 'March 05, 2026', total: '₹4,999', status: 'In Transit', items: 2 },
        { id: 'ORD-6612', date: 'February 28, 2026', total: '₹2,450', status: 'Delivered', items: 1 },
    ]);

    useEffect(() => {
        if (!loading && !user) {
            router.push(`/auth?next=${encodeURIComponent(window.location.pathname)}`);
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return (
            <div className="w-full h-[100dvh] bg-[#0A0A0B] flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-white/10" />
            </div>
        );
    }

    return (
        <div className="w-full h-[100dvh] flex bg-[#0A0A0B] text-white overflow-hidden">
            <Sidebar />
            <main className="flex-1 relative h-full bg-ink-100 flex flex-col items-center justify-start overflow-y-auto pb-40 custom-scrollbar">

                <header className="w-full p-8 pt-12 max-w-4xl flex items-center justify-between mb-8 animate-fade-in">
                    <button onClick={() => router.back()} className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all active:scale-90">
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <div className="text-center">
                        <h1 className="text-4xl font-sans font-black tracking-tighter text-primary">Order History</h1>
                        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30">Secure Transaction Ledger</p>
                    </div>
                    <div className="w-12 h-12" />
                </header>

                <div className="w-full max-w-3xl px-8 space-y-6 animate-slide-in-bottom">
                    {orders.map((order) => (
                        <div key={order.id} className="group bg-white/5 border border-white/5 p-8 rounded-[40px] hover:bg-white/[0.08] transition-all cursor-pointer shadow-3xl">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                        <Package className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <h3 className="text-2xl font-black">{order.id}</h3>
                                            <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${order.status === 'Delivered'
                                                ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                                : 'bg-primary/10 text-primary border-primary/20'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <p className="text-white/30 text-xs font-bold uppercase tracking-widest">{order.date} • {order.items} items</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between md:flex-col md:items-end gap-2 pr-4">
                                    <span className="text-3xl font-black tracking-tighter">{order.total}</span>
                                    <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary hover:underline">
                                        Track Order <ExternalLink className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="pt-12 text-center opacity-20">
                        <p className="text-[9px] font-black uppercase tracking-[0.4em]">End of Transcript • All Nodes Synced</p>
                    </div>
                </div>
                <MobileNav />
            </main>
        </div>
    );
}
