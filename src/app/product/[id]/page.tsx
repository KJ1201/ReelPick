'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { ShoppingBag, ArrowLeft, Loader2, ArrowRight, Star, CheckCircle, ShieldCheck, Truck, RefreshCw, ChevronRight, MessageSquare, ThumbsUp, Heart } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Sidebar } from '@/components/common/Sidebar';
import { MobileNav } from '@/components/common/MobileNav';

export default function ProductDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const productId = params.id as string;

    const [product, setProduct] = useState<any>(null);
    const [recommended, setRecommended] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState('M');

    // Mock reviews
    const reviews = [
        { id: 1, user: "Aravind K.", rating: 5, date: "2 days ago", comment: "The quality is absolutely premium. Fits perfectly and the fabric feels like it will last for years. Highly recommend for the price!", likes: 24, verified: true },
        { id: 2, user: "Sarah M.", rating: 4, date: "1 week ago", comment: "Beautiful design, exactly like the videos on the feed. Slightly long for me but works great with heels.", likes: 8, verified: true },
        { id: 3, user: "Vikram R.", rating: 5, date: "2 weeks ago", comment: "Finally a brand that delivers what they show! The crimson shade is stunning.", likes: 15, verified: true }
    ];

    useEffect(() => {
        if (!productId) return;

        async function fetchData() {
            setIsLoading(true);
            try {
                // 1. Fetch main product
                const { data: pData, error: pError } = await supabase
                    .from('products')
                    .select(`
                        *,
                        seller:profiles(username, avatar_url)
                    `)
                    .eq('id', productId)
                    .single();

                if (pError) throw pError;
                setProduct(pData);

                // 2. Fetch recommended (from same category)
                const { data: rData } = await supabase
                    .from('products')
                    .select('*')
                    .neq('id', productId)
                    .limit(4);

                if (rData) setRecommended(rData);

            } catch (err) {
                console.error("[Product Page] Load error:", err);
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, [productId]);

    const addToCart = () => {
        // Mock add to cart logic (could use context/provider)
        window.alert(`${product.name} (Size ${selectedSize}) added to bag!`);
    };

    const buyNow = () => {
        router.push('/checkout');
    };

    return (
        <div className="w-full h-[100dvh] flex bg-[#0A0A0B] text-white overflow-hidden">
            <Sidebar />
            <main className="flex-1 relative h-full bg-ink-100 flex flex-col overflow-y-auto pb-40 custom-scrollbar scroll-smooth">

                {/* Mobile Header */}
                <header className="md:hidden sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex items-center justify-between">
                    <button onClick={() => router.back()} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10">
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <span className="font-bold uppercase tracking-widest text-[10px]">Product Node</span>
                    <button onClick={() => router.push('/cart')} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 border border-white/10">
                        <ShoppingBag className="w-5 h-5" />
                    </button>
                </header>

                {isLoading || !product ? (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin shadow-[0_0_30px_rgba(var(--primary-rgb),0.1)]" />
                        <p className="text-white/40 font-bold uppercase tracking-widest text-[10px]">Synchronizing Production Data...</p>
                    </div>
                ) : (
                    <div className="max-w-7xl mx-auto w-full p-6 md:p-12 animate-fade-in">

                        {/* --- TOP SECTION: IMAGES & INFO --- */}
                        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 mb-24">

                            {/* Left: Sticky Media Gallery */}
                            <div className="space-y-6">
                                <div className="relative aspect-[3/4] w-full rounded-[40px] overflow-hidden shadow-2xl ring-1 ring-white/10 bg-black group">
                                    <Image
                                        src={product.image_url}
                                        alt={product.name}
                                        fill
                                        priority
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                        unoptimized
                                    />
                                    <div className="absolute top-6 left-6 px-4 py-2 bg-black/60 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-2">
                                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                        <span className="text-sm font-black">{product.rating}</span>
                                        <span className="text-white/40 text-[10px] uppercase font-bold tracking-widest border-l border-white/20 pl-2">48 Reviews</span>
                                    </div>
                                    <button className="absolute top-6 right-6 w-12 h-12 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center hover:bg-red-500/20 hover:border-red-500/50 transition-all group/heart">
                                        <Heart className="w-6 h-6 text-white group-hover/heart:fill-red-500 group-hover/heart:text-red-500 transition-colors" />
                                    </button>
                                </div>
                                <div className="grid grid-cols-4 gap-4">
                                    {[1, 2, 3, 4].map((i) => (
                                        <div key={i} className={cn(
                                            "aspect-square rounded-2xl overflow-hidden border border-white/5 cursor-pointer hover:border-primary/50 transition-all",
                                            i === 1 ? 'ring-2 ring-primary' : ''
                                        )}>
                                            <Image src={product.image_url} alt="thumbnail" width={200} height={200} className="object-cover opacity-60 hover:opacity-100" unoptimized />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Right: Detailed Info */}
                            <div className="flex flex-col pt-4">
                                <div className="flex items-center gap-3 mb-6 text-[11px] font-black uppercase tracking-[0.3em]">
                                    <span className="text-primary italic">Official Drop</span>
                                    <span className="text-white/20">•</span>
                                    <span className="text-white/40">{product.category}</span>
                                </div>

                                <h1 className="text-white text-5xl md:text-7xl font-display font-black leading-[1] mb-6 tracking-tighter italic">
                                    {product.name}
                                </h1>

                                <div className="flex flex-wrap items-center gap-6 mb-10">
                                    <div className="flex items-center gap-4">
                                        <span className="text-white text-5xl font-black">₹{product.price.toLocaleString()}</span>
                                        <span className="text-white/20 line-through text-2xl font-bold">₹{(product.price * 1.5).toLocaleString()}</span>
                                    </div>
                                    <span className="px-4 py-1.5 rounded-full bg-green-500/10 text-green-400 font-black text-xs uppercase tracking-widest border border-green-500/20 animate-pulse">
                                        33% Limited Offer
                                    </span>
                                </div>

                                <div className="space-y-10">
                                    {/* Selection */}
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Select Size</label>
                                            <span className="text-primary text-[10px] font-bold uppercase tracking-widest hover:underline cursor-pointer">Size Guide</span>
                                        </div>
                                        <div className="flex flex-wrap gap-3">
                                            {['XS', 'S', 'M', 'L', 'XL'].map((size) => (
                                                <button
                                                    key={size}
                                                    onClick={() => setSelectedSize(size)}
                                                    className={cn(
                                                        "w-16 h-14 rounded-2xl border font-bold text-sm transition-all active:scale-95",
                                                        selectedSize === size
                                                            ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                                                            : 'bg-white/5 border-white/10 text-white/50 hover:border-white/30 hover:bg-white/10'
                                                    )}
                                                >
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="grid sm:grid-cols-2 gap-4 pt-4">
                                        <button
                                            onClick={addToCart}
                                            className="h-20 rounded-[24px] border border-white/10 bg-white/5 text-white font-black text-xl hover:bg-white/10 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                                        >
                                            <ShoppingBag className="w-6 h-6" />
                                            Add to Bag
                                        </button>
                                        <button
                                            onClick={buyNow}
                                            className="h-20 rounded-[24px] bg-white text-black font-black text-xl shadow-[0_12px_40px_rgba(255,255,255,0.2)] hover:scale-105 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
                                        >
                                            Buy It Now
                                            <ChevronRight className="w-6 h-6" />
                                        </button>
                                    </div>

                                    {/* Trust Badges */}
                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-6 rounded-[32px] bg-white/5 border border-white/5">
                                        <div className="flex flex-col items-center text-center gap-2">
                                            <Truck className="w-5 h-5 text-primary" />
                                            <span className="text-[9px] font-black uppercase tracking-widest text-white/50">Fast Delivery</span>
                                        </div>
                                        <div className="flex flex-col items-center text-center gap-2">
                                            <RefreshCw className="w-5 h-5 text-primary" />
                                            <span className="text-[9px] font-black uppercase tracking-widest text-white/50">7 Day Return</span>
                                        </div>
                                        <div className="flex flex-col items-center text-center gap-2">
                                            <ShieldCheck className="w-5 h-5 text-primary" />
                                            <span className="text-[9px] font-black uppercase tracking-widest text-white/50">Quality Check</span>
                                        </div>
                                        <div className="flex flex-col items-center text-center gap-2">
                                            <CheckCircle className="w-5 h-5 text-primary" />
                                            <span className="text-[9px] font-black uppercase tracking-widest text-white/50">Verified Shop</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* --- MIDDLE SECTION: PRODUCT STORY & SPECS --- */}
                        <div className="grid md:grid-cols-2 gap-20 mb-32 border-t border-white/10 pt-20">
                            <div className="space-y-8">
                                <h3 className="text-3xl font-display font-black tracking-tight italic">The Concept Portfolio</h3>
                                <p className="text-white/60 text-lg leading-relaxed font-medium">
                                    {product.description || "A masterclass in contemporary silhouettes. This piece explores the intersection of high-street aesthetics and artisanal tailoring. Using sustainably sourced materials, each unit undergoes a 12-point quality protocol before reaching your doorstep."}
                                </p>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 text-white p-4 rounded-2xl bg-white/5 border border-white/5 transition-colors hover:bg-white/10 cursor-default">
                                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                            <CheckCircle className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">Premium GSM Fabric</p>
                                            <p className="text-xs text-white/40">Heavyweight yet breathable weave for all seasons.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-white p-4 rounded-2xl bg-white/5 border border-white/5 transition-colors hover:bg-white/10 cursor-default">
                                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                                            <CheckCircle className="w-5 h-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm">Reinforced Stitching</p>
                                            <p className="text-xs text-white/40">Industrial grade thread used for stress-point durability.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/5 border border-white/10 rounded-[40px] p-10 space-y-10 self-start shadow-2xl">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">Technical Specifications</h4>
                                <div className="grid grid-cols-2 gap-y-8 gap-x-4">
                                    <div className="space-y-1">
                                        <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest">Composition</p>
                                        <p className="text-sm font-bold">95% Silk, 5% Lycra</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest">Fit Type</p>
                                        <p className="text-sm font-bold">Standard Athletic</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest">Care Logic</p>
                                        <p className="text-sm font-bold">Cold Machine Wash</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest">Origin</p>
                                        <p className="text-sm font-bold">Mumbai Tech-Hub</p>
                                    </div>
                                </div>
                                <div className="pt-6 border-t border-white/5">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full overflow-hidden relative border border-white/10">
                                            <Image src={product.seller?.avatar_url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2'} fill alt="seller" className="object-cover" unoptimized />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-white/50 uppercase tracking-widest">Sold By</p>
                                            <p className="text-lg font-black italic">{product.seller?.username || 'Urban Threads'}</p>
                                        </div>
                                        <button className="ml-auto text-primary text-xs font-bold uppercase tracking-widest hover:underline">Profile</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* --- REVIEWS SECTION --- */}
                        <div id="reviews" className="mb-32">
                            <div className="flex items-center justify-between mb-12">
                                <div>
                                    <h3 className="text-4xl font-display font-black tracking-tight mb-2 italic">Client Testimonials</h3>
                                    <p className="text-white/40 font-bold uppercase tracking-[0.2em] text-[10px]">Real feedback from our premium community</p>
                                </div>
                                <div className="text-right">
                                    <div className="flex items-center gap-2 justify-end mb-1">
                                        <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                                        <span className="text-4xl font-black">{product.rating}</span>
                                    </div>
                                    <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest">Based on 48 verified purchases</p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-3 gap-6">
                                {reviews.map((review) => (
                                    <div key={review.id} className="bg-white/5 border border-white/5 p-8 rounded-[40px] flex flex-col hover:bg-white/[0.08] transition-all">
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={cn("w-3 h-3", i < review.rating ? "text-primary fill-primary" : "text-white/10")} />
                                                ))}
                                            </div>
                                            <span className="text-white/20 text-[10px] font-bold uppercase tracking-widest italic">{review.date}</span>
                                        </div>
                                        <p className="text-white/80 font-medium mb-8 flex-1 leading-relaxed">"{review.comment}"</p>
                                        <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-[10px] text-white/40 uppercase">
                                                    {review.user.substring(0, 1)}
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-white">{review.user}</p>
                                                    {review.verified && <span className="text-[8px] font-bold text-green-400 uppercase tracking-widest">Verified Collector</span>}
                                                </div>
                                            </div>
                                            <button className="flex items-center gap-2 text-white/20 hover:text-white transition-colors">
                                                <ThumbsUp className="w-3 h-3" />
                                                <span className="text-[10px] font-bold">{review.likes}</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button className="w-full h-14 mt-10 rounded-full border border-white/10 text-white/40 font-bold uppercase tracking-widest text-[10px] hover:bg-white/5 hover:text-white transition-all">
                                View all 48 reviews
                            </button>
                        </div>

                        {/* --- RECOMMENDED SECTION --- */}
                        <div className="mb-10">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-3xl font-display font-black tracking-tight italic">Recommended Drops</h3>
                                <button onClick={() => router.push('/store')} className="text-primary text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-2 group">
                                    Explore Store
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                                {recommended.map((item) => (
                                    <div
                                        key={item.id}
                                        onClick={() => router.push(`/product/${item.id}`)}
                                        className="group cursor-pointer space-y-4"
                                    >
                                        <div className="relative aspect-[4/5] rounded-[32px] overflow-hidden bg-white/5 border border-white/5">
                                            <Image src={item.image_url} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" unoptimized />
                                            <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-center scale-0 group-hover:scale-100 transition-transform">
                                                <ShoppingBag className="w-5 h-5" />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-bold uppercase tracking-widest text-white/30 mb-1">{item.category}</p>
                                            <h4 className="font-bold text-sm truncate group-hover:text-primary transition-colors">{item.name}</h4>
                                            <p className="text-lg font-black">₹{item.price.toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                )}
                <MobileNav />
            </main>
        </div>
    );
}
