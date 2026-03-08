'use client';

import { useState, useRef, useEffect } from 'react';
import { ShoppingBag, X, Loader2, ArrowRight, Truck } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

interface ProductDrawerProps {
    productId: string;
    isOpen: boolean;
    onClose: () => void;
}

export function ProductDrawer({ productId, isOpen, onClose }: ProductDrawerProps) {
    const [product, setProduct] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Fetch product details from Supabase
    useEffect(() => {
        if (!isOpen || !productId) return;

        async function fetchProduct() {
            setIsLoading(true);
            try {
                const { data, error } = await supabase
                    .from('products')
                    .select(`
                        *,
                        seller:profiles(username)
                    `)
                    .eq('id', productId)
                    .single();

                if (error) throw error;
                setProduct(data);
            } catch (err) {
                console.error("[Product Drawer] Load error:", err);
            } finally {
                setIsLoading(false);
            }
        }

        fetchProduct();
    }, [isOpen, productId]);

    const handleClose = () => {
        onClose();
        // Delay resetting product data
        setTimeout(() => setProduct(null), 400);
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={cn(
                    "fixed inset-0 bg-black/70 backdrop-blur-[4px] z-[50] transition-opacity duration-300",
                    isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
                onClick={handleClose}
            />

            {/* Slide-Up Drawer */}
            <div
                className={cn(
                    "fixed bottom-0 bg-ink-80 border-t border-white/[0.08] rounded-t-[24px] z-[100] shadow-[0_-8px_48px_rgba(0,0,0,0.80)] transition-transform duration-500 ease-[cubic-bezier(0.25, 1, 0.5, 1)] flex flex-col",
                    "left-0 right-0 w-full",
                    "md:left-1/2 md:right-auto md:w-[450px] md:-translate-x-1/2 md:border-x",
                    isOpen ? "translate-y-0" : "translate-y-[100%]"
                )}
                style={{ height: '72dvh' }}
            >
                {/* Drag / Handle Bar */}
                <div className="w-12 h-1.5 rounded-full bg-white/10 mx-auto my-4 shrink-0" />

                <div className="flex-1 overflow-y-auto px-6 pb-32 custom-scrollbar">
                    {isLoading || !product ? (
                        <div className="w-full h-full flex flex-col items-center justify-center gap-4 py-20">
                            <Loader2 className="w-8 h-8 text-primary animate-spin" />
                            <p className="text-white/40 text-sm font-medium">Fetching details...</p>
                        </div>
                    ) : (
                        <div className="animate-fade-in">
                            <div className="flex gap-6 mb-8">
                                <div className="relative w-[120px] aspect-[3/4] rounded-2xl overflow-hidden shrink-0 shadow-2xl ring-1 ring-white/10">
                                    <Image
                                        src={product.image_url}
                                        alt={product.name}
                                        fill
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                        className="object-cover"
                                        unoptimized
                                    />
                                </div>
                                <div className="flex flex-col justify-center pt-2">
                                    <div className="flex items-center gap-2 mb-2 text-primary font-bold text-[10px] uppercase tracking-[0.2em]">
                                        <span>Official Partner</span>
                                    </div>
                                    <h2 className="text-white text-2xl font-bold leading-tight mb-2 tracking-tight line-clamp-2">
                                        {product.name}
                                    </h2>
                                    <p className="text-white/40 text-xs font-semibold uppercase tracking-widest mb-3">
                                        {product.seller?.username || 'ReelShop Select'}
                                    </p>
                                    <span className="text-white text-3xl font-black">
                                        ₹{product.price.toLocaleString()}
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-white/40 text-[10px] font-bold uppercase tracking-widest mb-3">Product Description</h3>
                                    <p className="text-white/70 text-sm leading-relaxed font-medium">
                                        {product.description || "The perfect addition to your curated wardrobe. Limited edition drop."}
                                    </p>
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 group hover:bg-white/[0.08] transition-colors cursor-pointer">
                                    <div className="flex flex-col">
                                        <span className="text-white/40 text-[9px] font-bold uppercase tracking-widest mb-1">Select Size</span>
                                        <span className="text-white text-sm font-bold">Medium (M) - 2 left</span>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-primary transition-colors" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                        <span className="text-white/40 text-[9px] font-bold uppercase tracking-widest block mb-1">Fabric</span>
                                        <span className="text-white text-sm font-bold">100% Cotton</span>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                        <span className="text-white/40 text-[9px] font-bold uppercase tracking-widest block mb-1">Delivery</span>
                                        <span className="text-white text-[10px] font-bold flex items-center gap-1.5 mt-1">
                                            <Truck className="w-3 h-3 text-primary" />
                                            Standard (3-5 Days)
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Bottom Sticky Action Bar */}
                <div className="absolute bottom-0 left-0 right-0 p-8 pt-10 bg-gradient-to-t from-ink-80 via-ink-80 to-transparent pointer-events-none">
                    <button
                        className="pointer-events-auto w-full h-14 rounded-full bg-white text-black font-black shadow-[0_8px_32px_rgba(255,255,255,0.15)] active:scale-[0.98] transition-all flex items-center justify-center gap-3 overflow-hidden group hover:bg-primary hover:text-white"
                    >
                        <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        <span className="tracking-tight text-lg">Add to Shopping Bag</span>
                    </button>
                    <button
                        onClick={handleClose}
                        className="pointer-events-auto w-full mt-4 text-white/30 text-xs font-bold uppercase tracking-[0.2em] hover:text-white/60 transition-colors"
                    >
                        Close Details
                    </button>
                </div>
            </div>
        </>
    );
}
