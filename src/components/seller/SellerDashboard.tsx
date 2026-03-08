'use client';

import { useState, useEffect, useRef } from 'react';
import {
    Plus, LayoutGrid, Package, ChevronRight, Video, ArrowLeft,
    Loader2, Tag, IndianRupee, Image as ImageIcon, X, TrendingUp,
    BarChart3, Users, Eye, Trash2, Pencil, MessageSquare,
    Upload, Play, Share2, Heart, Award, ArrowUpRight, ArrowDownRight
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { SellerStudio } from './SellerStudio';
import { InventoryItemSkeleton } from '../common/Skeleton';
import { useAuth } from '@/context/AuthContext';
import { LogOut } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

type ViewState = 'DASHBOARD' | 'LIST_PRODUCTS' | 'CREATE_REEL';

interface SellerDashboardProps {
    onProductView?: (productId: string) => void;
}

export function SellerDashboard({ onProductView }: SellerDashboardProps) {
    const { user, signOut } = useAuth();
    const { showToast } = useToast();
    const [view, setView] = useState<ViewState>('DASHBOARD');
    const [products, setProducts] = useState<any[]>([]);
    const [userReels, setUserReels] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);

    // Fetch data
    const fetchData = async () => {
        setIsLoading(true);
        try {
            // Fetch Products for selection
            const { data: prodData } = await supabase
                .from('products')
                .select('*')
                .order('created_at', { ascending: false });
            if (prodData) setProducts(prodData);

            // Fetch User's Reels
            if (user) {
                const { data: reelData } = await supabase
                    .from('reels')
                    .select('*, reel_tags(product_id)')
                    .eq('seller_id', user.id)
                    .order('created_at', { ascending: false });
                if (reelData) setUserReels(reelData);
            }
        } catch (err) {
            console.error("Error fetching studio data:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [user]);

    const latestReel = userReels[0];
    const topReels = [...userReels].sort((a, b) => (b.likes_count || 0) - (a.likes_count || 0)).slice(0, 3);

    const openStudio = (product: any) => {
        setSelectedProduct(product);
        setView('CREATE_REEL');
    };

    if (view === 'CREATE_REEL' && selectedProduct) {
        return (
            <div className="w-full h-full bg-[#0a0a0b] text-white p-6 md:p-10 pb-32 overflow-y-auto custom-scrollbar">
                <div className="max-w-4xl mx-auto">
                    <SellerStudio
                        productId={selectedProduct.id}
                        productName={selectedProduct.name}
                        onBack={() => setView('LIST_PRODUCTS')}
                        onSuccess={() => {
                            setView('DASHBOARD');
                            fetchData();
                        }}
                    />
                </div>
            </div>
        );
    }

    if (view === 'LIST_PRODUCTS') {
        return (
            <div className="w-full h-full bg-[#0a0a0b] text-white p-6 md:p-10 pb-32 overflow-y-auto custom-scrollbar">
                <div className="max-w-4xl mx-auto animate-fade-in">
                    <button
                        onClick={() => setView('DASHBOARD')}
                        className="flex items-center gap-2 text-white/40 hover:text-white mb-8 group transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-[10px] font-bold uppercase tracking-widest">Back to Dashboard</span>
                    </button>

                    <h1 className="text-3xl font-sans font-bold tracking-tight mb-2">Select Product</h1>
                    <p className="text-white/40 text-sm mb-10">Choose an existing product to create a promotional reel for.</p>

                    <div className="grid gap-4">
                        {products.map((p) => (
                            <div key={p.id} className="group bg-white/5 border border-white/5 rounded-3xl p-5 flex items-center gap-6 hover:bg-white/[0.08] transition-all cursor-pointer">
                                <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
                                    <Image src={p.image_url} alt={p.name} fill unoptimized className="object-cover" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold">{p.name}</h3>
                                    <span className="text-white/40 text-[10px] font-bold uppercase tracking-widest">₹{p.price} • {p.category}</span>
                                </div>
                                <button
                                    onClick={() => openStudio(p)}
                                    className="h-10 px-6 rounded-full bg-primary text-white text-xs font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all"
                                >
                                    Select
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full bg-[#0a0a0b] text-white p-6 md:p-8 pb-32 overflow-y-auto custom-scrollbar">
            <div className="max-w-[1240px] mx-auto animate-fade-in">

                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-3xl font-sans font-black tracking-tight mb-1">Channel dashboard</h1>
                        <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.2em]">Creator Hub • Unified Node v4.2</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setView('LIST_PRODUCTS')}
                            className="bg-white text-black hover:bg-primary hover:text-white flex items-center gap-2 px-6 h-12 rounded-full font-black text-xs uppercase tracking-widest transition-all active:scale-95 shadow-xl shadow-white/5"
                        >
                            <Upload className="w-4 h-4" />
                            Upload
                        </button>
                        <button
                            onClick={async () => {
                                await signOut();
                                showToast('Logged out successfully', 'info');
                            }}
                            className="w-12 h-12 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-white/40 hover:text-red-500 hover:bg-red-500/10 transition-all"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* LEFT COLUMN: Latest Content */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-[#121214] border border-white/[0.05] rounded-[24px] overflow-hidden">
                            <div className="p-6 border-b border-white/[0.05]">
                                <h3 className="text-sm font-black uppercase tracking-widest text-white/60">Your latest upload</h3>
                            </div>
                            {latestReel ? (
                                <div className="p-6">
                                    <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-6 group cursor-pointer">
                                        <Image
                                            src={latestReel.thumbnail_url || latestReel.video_url}
                                            alt="Latest thumbnail"
                                            fill
                                            unoptimized
                                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Play className="w-10 h-10 text-white fill-white" />
                                        </div>
                                    </div>
                                    <h4 className="font-bold text-lg mb-4 line-clamp-1">{latestReel.caption}</h4>

                                    <div className="space-y-4 mb-8">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-white/40 font-bold uppercase tracking-wider">Views</span>
                                            <span className="flex items-center gap-1.5 font-black">
                                                {Math.floor(Math.random() * 500) + 100}
                                                <ArrowUpRight className="w-3 h-3 text-green-400" />
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-white/40 font-bold uppercase tracking-wider">Avg. Duration</span>
                                            <span className="font-black">0:42 <span className="text-white/20 ml-1">(84%)</span></span>
                                        </div>
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-white/40 font-bold uppercase tracking-wider">CTR</span>
                                            <span className="font-black text-green-400">12.4%</span>
                                        </div>
                                    </div>

                                    <button className="w-full h-11 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-white/40 hover:text-white hover:bg-white/5 transition-all">
                                        Go to video analytics
                                    </button>
                                </div>
                            ) : (
                                <div className="p-12 text-center">
                                    <Video className="w-8 h-8 text-white/10 mx-auto mb-4" />
                                    <p className="text-xs text-white/30 font-bold uppercase tracking-widest">No uploads yet</p>
                                </div>
                            )}
                        </div>

                        <div className="bg-[#121214] border border-white/[0.05] rounded-[24px] p-6">
                            <h3 className="text-sm font-black uppercase tracking-widest text-white/60 mb-6">What's new in Studio</h3>
                            <div className="space-y-6">
                                <div className="group cursor-pointer">
                                    <p className="text-xs font-bold text-primary mb-1 group-hover:underline">Studio Insider v4.2</p>
                                    <p className="text-xs text-white/40 leading-relaxed font-medium">New vertical engagement metrics are now live for all creators.</p>
                                </div>
                                <div className="group cursor-pointer">
                                    <p className="text-xs font-bold text-primary mb-1 group-hover:underline">Monetization Update</p>
                                    <p className="text-xs text-white/40 leading-relaxed font-medium">Shopify direct channel integration now available in limited beta.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* MIDDLE COLUMN: Activity */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-[#121214] border border-white/[0.05] rounded-[24px] p-6">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-sm font-black uppercase tracking-widest text-white/60">Top content</h3>
                                <span className="text-[10px] text-white/20 font-bold uppercase tracking-widest">Last 48 hours</span>
                            </div>

                            <div className="space-y-6">
                                {topReels.length > 0 ? topReels.map((reel, idx) => (
                                    <div key={reel.id} className="flex gap-4 group cursor-pointer">
                                        <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0">
                                            <Image src={reel.thumbnail_url || reel.video_url} alt="Top reel" fill unoptimized className="object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold truncate group-hover:text-primary transition-colors">{reel.caption}</p>
                                            <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mt-1">{(reel.likes_count || 0) * 12} views</p>
                                        </div>
                                    </div>
                                )) : (
                                    <p className="text-center py-8 text-[10px] text-white/20 font-black uppercase tracking-widest">Publish content to see stats</p>
                                )}
                            </div>

                            <button className="w-full mt-8 pt-6 border-t border-white/5 text-[10px] font-black uppercase tracking-widest text-primary hover:underline transition-all">
                                Go to channel analytics
                            </button>
                        </div>

                        <div className="bg-[#121214] border border-white/[0.05] rounded-[24px] p-6">
                            <h3 className="text-sm font-black uppercase tracking-widest text-white/60 mb-6">Recent interactions</h3>
                            <div className="space-y-6">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="flex gap-4">
                                        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 shrink-0 overflow-hidden">
                                            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`} alt="user" className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold">Patron #{i}482</p>
                                            <p className="text-[10px] text-white/40 mt-1 uppercase font-bold tracking-widest">Added to wishlist • 2h ago</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: Studio News & Summary */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-[#121214] border border-white/[0.05] rounded-[24px] p-6">
                            <h3 className="text-sm font-black uppercase tracking-widest text-white/60 mb-8">Channel analytics</h3>
                            <div className="space-y-6 mb-8">
                                <div>
                                    <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mb-1">Total Impressions</p>
                                    <div className="flex items-center gap-3">
                                        <span className="text-3xl font-black">12.4k</span>
                                        <span className="flex items-center gap-1 text-[10px] font-black text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">
                                            +18% <ArrowUpRight className="w-3 h-3" />
                                        </span>
                                    </div>
                                </div>
                                <div className="h-px bg-white/5 w-full"></div>
                                <div>
                                    <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mb-1">Conversion Rate</p>
                                    <div className="flex items-center gap-3">
                                        <span className="text-3xl font-black">4.2%</span>
                                        <span className="flex items-center gap-1 text-[10px] font-black text-red-400 bg-red-400/10 px-2 py-0.5 rounded-full">
                                            -2% <ArrowDownRight className="w-3 h-3" />
                                        </span>
                                    </div>
                                </div>
                                <div className="h-px bg-white/5 w-full"></div>
                                <div>
                                    <p className="text-[10px] text-white/30 font-bold uppercase tracking-widest mb-1">Estimated Revenue</p>
                                    <div className="flex items-center gap-3">
                                        <span className="text-3xl font-black">₹{Math.floor(Math.random() * 50000) + 10000}</span>
                                        <span className="flex items-center gap-1 text-[10px] font-black text-green-400 bg-green-400/10 px-2 py-0.5 rounded-full">
                                            +12% <ArrowUpRight className="w-3 h-3" />
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/5 rounded-2xl p-4">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">Community Tab</h4>
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                        <MessageSquare className="w-5 h-5" />
                                    </div>
                                    <p className="text-xs font-bold leading-tight">42 new comments needing response</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[#121214] border border-white/[0.05] rounded-[24px] p-6">
                            <h3 className="text-sm font-black uppercase tracking-widest text-white/60 mb-6">Creator Insider</h3>
                            <div className="aspect-video bg-white/5 rounded-xl border border-white/5 overflow-hidden relative group cursor-pointer mb-4">
                                <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500" alt="Insider news" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Play className="w-10 h-10 text-white fill-white" />
                                </div>
                            </div>
                            <p className="text-xs font-bold mb-2">Maximize your Reel Engagement</p>
                            <p className="text-[10px] text-white/40 leading-relaxed font-medium uppercase tracking-[0.05em]">Learn how the new Shoppable Tag algorithm works in v4.2.</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
