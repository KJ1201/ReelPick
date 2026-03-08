'use client';

import { useState, useEffect } from 'react';
import { ShoppingBag, ChevronLeft, CreditCard, Trash2, CheckCircle2, IndianRupee, Ghost, Loader2, PackageOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Sidebar } from '@/components/common/Sidebar';
import { MobileNav } from '@/components/common/MobileNav';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { CartItemSkeleton } from '@/components/common/Skeleton';

export default function CartPage() {
    const { user, loading: authLoading } = useAuth();
    const [cartState, setCartState] = useState<'REVIEW' | 'PROCESSING' | 'SUCCESS'>('REVIEW');
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !user) {
            router.push(`/auth?next=${encodeURIComponent(window.location.pathname)}`);
        }
    }, [user, authLoading, router]);

    const fetchCart = async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('cart_items')
                .select(`
                    id,
                    quantity,
                    size,
                    product:products (
                        id,
                        name,
                        price,
                        image_url
                    )
                `);

            if (error) throw error;
            setCartItems(data || []);
        } catch (err) {
            console.error("Cart fetch error:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const deleteItem = async (id: string) => {
        try {
            const { error } = await supabase
                .from('cart_items')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setCartItems(prev => prev.filter(item => item.id !== id));
        } catch (err) {
            console.error("Delete error:", err);
        }
    };

    const totalAmount = cartItems.reduce((acc, i) => acc + (i.product.price * i.quantity), 0);

    const handleCheckout = async () => {
        setCartState('PROCESSING');
        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items: cartItems, totalAmount })
            });

            await res.json();

            // Clear cart from DB after success
            await supabase.from('cart_items').delete().neq('id', '00000000-0000-0000-0000-000000000000');

            setTimeout(() => {
                setCartState('SUCCESS');
            }, 2500);

        } catch (e) {
            console.error(e);
            setCartState('REVIEW');
        }
    };

    return (
        <div className="w-full h-[100dvh] flex bg-[#0A0A0B] text-white overflow-hidden">
            <Sidebar />
            <main className="flex-1 relative h-full bg-ink-100 flex flex-col items-center justify-start overflow-y-auto pb-40 custom-scrollbar">

                <header className="sticky top-0 z-50 w-full bg-black/60 backdrop-blur-xl border-b border-white/10 px-8 py-6 flex items-center justify-between">
                    <button onClick={() => router.back()} className="flex items-center gap-2 text-white/40 hover:text-white transition-colors group">
                        <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-bold uppercase tracking-widest text-[11px]">Return to Feed</span>
                    </button>
                    <div className="flex items-center gap-3">
                        <ShoppingBag className="w-5 h-5 text-primary" />
                        <h1 className="text-xl font-sans font-black text-white tracking-widest uppercase truncate max-w-[150px] md:max-w-none">Shopping Bag</h1>
                    </div>
                    <div className="w-20 hidden md:block" />
                </header>

                <div className="max-w-5xl w-full p-6 md:p-12 mt-4 animate-fade-in">
                    {isLoading ? (
                        <div className="space-y-6">
                            {[1, 2, 3].map(i => <CartItemSkeleton key={i} />)}
                        </div>
                    ) : cartItems.length === 0 && cartState === 'REVIEW' ? (
                        <div className="w-full py-40 flex flex-col items-center justify-center text-center animate-fade-in">
                            <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-8 border border-white/5">
                                <PackageOpen className="w-12 h-12 text-white/20" />
                            </div>
                            <h2 className="text-4xl font-sans font-black mb-4">Bag is Vacant</h2>
                            <p className="text-white/40 text-lg max-w-sm mb-12">Your personal collection is currently empty. Explore the latest drops to add some flair.</p>
                            <button onClick={() => router.push('/reels')} className="px-12 h-16 rounded-full bg-white text-black font-black hover:bg-primary hover:text-white transition-all active:scale-95 shadow-2xl">
                                Discover Content
                            </button>
                        </div>
                    ) : (
                        <>
                            {cartState === 'REVIEW' && (
                                <div className="grid lg:grid-cols-3 gap-12">
                                    {/* Items List */}
                                    <div className="lg:col-span-2 space-y-6">
                                        <div className="flex items-center justify-between mb-8">
                                            <h2 className="text-3xl font-sans font-black">Active Orders</h2>
                                            <span className="px-4 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-widest text-primary">
                                                {cartItems.length} Products
                                            </span>
                                        </div>

                                        {cartItems.map((item) => (
                                            <div key={item.id} className="group bg-white/5 border border-white/5 p-6 md:p-8 rounded-[40px] flex gap-6 md:gap-8 hover:bg-white/[0.08] transition-all relative">
                                                <div
                                                    onClick={() => router.push(`/product/${item.product.id}`)}
                                                    className="relative w-28 md:w-36 aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl ring-1 ring-white/10 bg-black shrink-0 cursor-pointer"
                                                >
                                                    <Image src={item.product.image_url} alt={item.product.name} fill unoptimized className="object-cover group-hover:scale-110 transition-transform duration-700" />
                                                </div>
                                                <div className="flex-1 flex flex-col justify-center">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h3 className="text-xl md:text-2xl font-black mb-1 max-w-[200px] truncate">{item.product.name}</h3>
                                                        <button
                                                            onClick={() => deleteItem(item.id)}
                                                            className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 text-white/20 hover:text-red-500 hover:bg-red-500/10 transition-all active:scale-90"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                    <div className="flex flex-wrap gap-4 mb-6">
                                                        <span className="text-white/40 text-[10px] font-black uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full">Size: {item.size}</span>
                                                        <span className="text-white/40 text-[10px] font-black uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full">Qty: {item.quantity}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-3xl font-black tracking-tight">₹{item.product.price.toLocaleString()}</span>
                                                        <span className="text-white/20 line-through text-lg font-bold">₹{(item.product.price * 1.5).toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Order Summary */}
                                    <div className="space-y-6">
                                        <div className="bg-white/5 border border-white/10 rounded-[40px] p-8 md:p-10 space-y-8 shadow-3xl sticky top-24">
                                            <h2 className="text-2xl font-sans font-black">Bag Summary</h2>

                                            <div className="space-y-4 pt-4 border-t border-white/5">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">Subtotal</span>
                                                    <span className="text-white font-bold text-lg">₹{totalAmount.toLocaleString()}</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-white/40 text-[10px] font-black uppercase tracking-widest">Delivery Protocol</span>
                                                    <span className="text-green-400 font-black uppercase tracking-widest text-[10px] px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20">Complimentary</span>
                                                </div>
                                                <div className="pt-6 border-t border-white/10 flex items-center justify-between">
                                                    <span className="text-xl font-black">Final Total</span>
                                                    <span className="text-4xl font-black text-primary">₹{totalAmount.toLocaleString()}</span>
                                                </div>
                                            </div>

                                            <button
                                                onClick={handleCheckout}
                                                className="w-full h-18 py-5 rounded-[40px] bg-white text-black font-black text-xl hover:bg-primary hover:text-white transition-all active:scale-95 shadow-[0_20px_40px_rgba(255,255,255,0.1)] flex items-center justify-center gap-4"
                                            >
                                                <CreditCard className="w-6 h-6" />
                                                Secure Checkout
                                            </button>

                                            <div className="flex items-center justify-center gap-4 pt-4">
                                                <div className="flex flex-col items-center">
                                                    <div className="h-10 w-px bg-white/10" />
                                                    <p className="text-[10px] uppercase font-bold tracking-widest text-white/20 whitespace-nowrap mt-2">End-to-End Encrypted Tunnel</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {cartState === 'PROCESSING' && (
                                <div className="w-full py-40 flex flex-col items-center justify-center animate-fade-in text-center">
                                    <div className="relative w-24 h-24 mb-10">
                                        <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
                                        <div className="absolute inset-0 border-4 border-t-primary rounded-full animate-spin" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <IndianRupee className="w-8 h-8 text-primary" />
                                        </div>
                                    </div>
                                    <h2 className="text-5xl font-sans font-black mb-6 tracking-tight">Syncing Ledger...</h2>
                                    <p className="text-white/40 text-lg max-w-sm font-medium">Authenticating your signature with global banking protocols. Do not exit current session.</p>
                                </div>
                            )}

                            {cartState === 'SUCCESS' && (
                                <div className="w-full py-20 flex flex-col items-center justify-center animate-fade-in text-center">
                                    <div className="w-32 h-32 rounded-full bg-green-500/10 flex items-center justify-center mb-10 shadow-[0_0_80px_rgba(34,197,94,0.15)] border border-green-500/20">
                                        <CheckCircle2 className="w-16 h-16 text-green-400" />
                                    </div>
                                    <h2 className="text-6xl font-sans font-black mb-6 tracking-tighter">Batch Reserved.</h2>
                                    <p className="text-white/50 text-xl max-w-sm mb-16 font-medium leading-relaxed">Your order has been authorized and synchronized with our logistics hub.</p>

                                    <button
                                        onClick={() => router.push('/reels')}
                                        className="h-20 px-16 rounded-full bg-white text-black font-black hover:bg-primary hover:text-white transition-all active:scale-95 text-2xl shadow-2xl"
                                    >
                                        Resume Discovery
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
                <MobileNav />
            </main>
        </div>
    );
}
