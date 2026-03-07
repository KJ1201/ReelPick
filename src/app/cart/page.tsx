'use client';

import { useState } from 'react';
import { ShoppingBag, ChevronLeft, CreditCard, Trash2, CheckCircle2, IndianRupee, Ghost } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Sidebar } from '@/components/common/Sidebar';
import { MobileNav } from '@/components/common/MobileNav';
import { useRouter } from 'next/navigation';

export default function CartPage() {
    const [cartState, setCartState] = useState<'REVIEW' | 'PROCESSING' | 'SUCCESS'>('REVIEW');
    const router = useRouter();

    // Mock cart data
    const cartItems = [
        {
            id: 'p_001',
            name: 'Crimson Flow Summer Dress',
            price: 3499,
            qty: 1,
            image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8'
        }
    ];

    const totalAmount = cartItems.reduce((acc, i) => acc + (i.price * i.qty), 0);

    const handleCheckout = async () => {
        setCartState('PROCESSING');
        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items: cartItems, totalAmount })
            });

            await res.json();
            setTimeout(() => {
                setCartState('SUCCESS');
            }, 2500);

        } catch (e) {
            console.error(e);
            setCartState('REVIEW');
        }
    };

    return (
        <div className="w-full h-[100dvh] flex bg-black text-white overflow-hidden">
            <Sidebar />
            <main className="flex-1 relative h-full bg-ink-100 flex flex-col items-center justify-start overflow-y-auto pb-40 custom-scrollbar">

                <header className="sticky top-0 z-50 w-full bg-black/60 backdrop-blur-xl border-b border-white/10 px-8 py-6 flex items-center justify-between">
                    <button onClick={() => router.back()} className="flex items-center gap-2 text-white/40 hover:text-white transition-colors group">
                        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-bold uppercase tracking-widest text-[11px]">Keep Shopping</span>
                    </button>
                    <h1 className="text-xl font-display font-bold text-primary tracking-tight">Shopping Bag</h1>
                    <div className="w-20" /> {/* Spacer */}
                </header>

                <div className="max-w-4xl w-full p-8 mt-4 animate-fade-in">
                    {cartState === 'REVIEW' && (
                        <div className="grid md:grid-cols-3 gap-12">
                            {/* Items List */}
                            <div className="md:col-span-2 space-y-6">
                                <h2 className="text-2xl font-bold mb-8">Review Order ({cartItems.length})</h2>
                                {cartItems.map((item) => (
                                    <div key={item.id} className="group bg-white/5 border border-white/5 p-6 rounded-[32px] flex gap-6 hover:bg-white/[0.08] transition-all">
                                        <div className="relative w-24 aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 bg-black shrink-0">
                                            <Image src={item.image} alt={item.name} fill unoptimized className="object-cover" />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-center">
                                            <h3 className="text-xl font-bold mb-2 line-clamp-1">{item.name}</h3>
                                            <span className="text-white/40 text-xs font-bold uppercase tracking-[0.2em] mb-4">Quantity: {item.qty}</span>
                                            <div className="flex items-center justify-between">
                                                <span className="text-2xl font-black">₹{item.price.toLocaleString()}</span>
                                                <button className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 text-white/20 hover:text-red-400 transition-colors">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Order Summary */}
                            <div className="space-y-6">
                                <div className="bg-white/5 border border-white/10 rounded-[40px] p-8 space-y-6 shadow-2xl sticky top-24">
                                    <h2 className="text-xl font-bold">Order Summary</h2>

                                    <div className="space-y-4 pt-4 border-t border-white/5">
                                        <div className="flex items-center justify-between">
                                            <span className="text-white/40 text-sm font-bold uppercase tracking-widest">Subtotal</span>
                                            <span className="text-white font-bold">₹{totalAmount.toLocaleString()}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-white/40 text-sm font-bold uppercase tracking-widest">Shipping</span>
                                            <span className="text-green-400 font-black uppercase tracking-widest text-xs">Free Delivery</span>
                                        </div>
                                        <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                                            <span className="text-lg font-bold">Total Pay</span>
                                            <span className="text-3xl font-black">₹{totalAmount.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleCheckout}
                                        className="w-full h-16 rounded-full bg-white text-black font-black text-lg hover:bg-primary hover:text-white transition-all active:scale-95 shadow-2xl flex items-center justify-center gap-3"
                                    >
                                        <CreditCard className="w-5 h-5" />
                                        Complete Purchase
                                    </button>

                                    <p className="text-center text-[10px] uppercase font-bold tracking-widest text-white/20">Secured via Razorpay Sandbox</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {cartState === 'PROCESSING' && (
                        <div className="w-full py-40 flex flex-col items-center justify-center animate-fade-in text-center">
                            <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-8" />
                            <h2 className="text-4xl font-display font-black mb-4">Securing Line...</h2>
                            <p className="text-white/40 text-lg max-w-sm">Initiating transaction protocols with banking partner. Please do not refresh.</p>
                        </div>
                    )}

                    {cartState === 'SUCCESS' && (
                        <div className="w-full py-20 flex flex-col items-center justify-center animate-fade-in text-center">
                            <div className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mb-8 shadow-[0_0_60px_rgba(34,197,94,0.1)]">
                                <CheckCircle2 className="w-12 h-12 text-green-400" />
                            </div>
                            <h2 className="text-5xl font-display font-black mb-4 tracking-tighter italic">Transaction Confirmed</h2>
                            <p className="text-white/50 text-xl max-w-sm mb-12">Your order has been verified and added to the dispatch queue. A WhatsApp notification is on the way.</p>

                            <button
                                onClick={() => router.push('/reels')}
                                className="px-10 h-14 rounded-full bg-white text-black font-black hover:bg-primary hover:text-white transition-all active:scale-95 text-lg"
                            >
                                Back to Discover
                            </button>
                        </div>
                    )}
                </div>
                <MobileNav />
            </main>
        </div>
    );
}
