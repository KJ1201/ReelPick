'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Search, ShoppingBag, Star, Filter, ChevronRight, PackageOpen } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { ProductCardSkeleton } from '@/components/common/Skeleton';
import { MOCK_PRODUCTS } from '@/data/mockProducts';
import { useToast } from '@/context/ToastContext';
import { useCart } from '@/context/CartContext';

interface StorefrontProps {
    onProductClick: (productId: string) => void;
}

export function Storefront({ onProductClick }: StorefrontProps) {
    const { showToast } = useToast();
    const { addToCart: cartAdd } = useCart();
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        async function fetchStoreProducts() {
            setIsLoading(true);
            try {
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error || !data || data.length === 0) {
                    setProducts(MOCK_PRODUCTS);
                } else {
                    setProducts(data);
                }
            } catch (err) {
                console.error("[Storefront] Fetch error, using mock:", err);
                setProducts(MOCK_PRODUCTS);
            } finally {
                setIsLoading(false);
            }
        }

        fetchStoreProducts();
    }, []);

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const addToCart = async (e: React.MouseEvent, product: any) => {
        e.stopPropagation();
        try {
            await cartAdd(product.id, 'M');
            showToast(`${product.name} added to bag!`, 'premium');
        } catch (err) {
            console.error("Cart error:", err);
            showToast("Failed to add to bag.", 'error');
        }
    };

    return (
        <div className="w-full h-full bg-[#0a0a0b] text-white overflow-y-auto pb-32 custom-scrollbar">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/10 px-4 py-4 md:pt-6">
                <div className="flex items-center gap-3">
                    <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Discover viral drops..."
                            className="w-full h-12 bg-white/5 border border-white/10 rounded-full pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        />
                    </div>
                    <button className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 hover:bg-white/10 transition-colors text-white/50">
                        <Filter className="w-5 h-5" />
                    </button>
                </div>

                {/* Categories */}
                <div className="flex overflow-x-auto gap-3 mt-4 scrollbar-none pb-1">
                    {['All Drops', 'Fashion', 'Beauty', 'Streetwear', 'Accessories'].map((cat, i) => (
                        <button
                            key={cat}
                            className={`whitespace-nowrap px-6 py-2 rounded-full text-[11px] font-black uppercase tracking-widest transition-all ${i === 0
                                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                                : 'bg-white/5 border border-white/10 text-white/40 hover:bg-white/10 hover:text-white'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Featured Banner */}
            <div className="p-4 md:p-6">
                <div className="w-full h-48 md:h-72 rounded-[32px] relative overflow-hidden group cursor-pointer border border-white/10 shadow-2xl">
                    <Image
                        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80"
                        alt="Store Banner"
                        fill
                        priority
                        sizes="(max-width: 768px) 100vw, 100vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-1000"
                        unoptimized
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent flex flex-col justify-center p-8 md:p-12">
                        <span className="text-primary font-black text-[10px] tracking-[0.3em] uppercase mb-3">Seasonal Protocol</span>
                        <h2 className="text-3xl md:text-5xl font-sans font-black text-white mb-3 leading-tight">THE SUMMER <br />EQUINOX</h2>
                        <p className="text-white/60 text-sm md:text-base max-w-[200px] md:max-w-md font-medium">Limited batch drops inspired by early tech-aesthetics.</p>
                        <button className="mt-6 px-8 py-3 bg-white text-black font-black text-[10px] uppercase tracking-widest rounded-full w-fit hover:bg-primary hover:text-white transition-all shadow-xl">Explore Collection</button>
                    </div>
                </div>
            </div>

            <div className="px-6 pb-6 flex items-center justify-between">
                <div>
                    <h3 className="text-xl md:text-2xl font-sans font-black tracking-tight">Trending Inventory</h3>
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-white/20">Recently synchronized with global feed</p>
                </div>
                <button className="text-[10px] text-primary flex items-center gap-1 font-black uppercase tracking-wider hover:underline">
                    Live Feed <ChevronRight className="w-4 h-4" />
                </button>
            </div>

            {/* Product Grid / Loading State */}
            <div className="px-6 pb-20">
                {isLoading ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(i => <ProductCardSkeleton key={i} />)}
                    </div>
                ) : filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
                        {filteredProducts.map((product) => (
                            <div
                                key={product.id}
                                onClick={() => onProductClick(product.id)}
                                className="group relative bg-white/5 border border-white/5 rounded-[32px] overflow-hidden flex flex-col cursor-pointer transition-all hover:bg-white/[0.08] hover:shadow-2xl hover:shadow-primary/5 active:scale-[0.98]"
                            >
                                <div className="relative w-full aspect-[4/5] overflow-hidden bg-black">
                                    <Image
                                        src={product.image_url}
                                        alt={product.name}
                                        fill
                                        sizes="(max-width: 768px) 50vw, 25vw"
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                        unoptimized
                                    />
                                    <div className="absolute top-4 left-4 px-3 py-1 bg-black/60 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                                        <span className="text-[10px] font-black text-white">{product.rating}</span>
                                    </div>
                                    <button
                                        onClick={(e) => addToCart(e, product)}
                                        className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-white text-black flex items-center justify-center shadow-2xl active:scale-90 transition-all translate-y-20 group-hover:translate-y-0 duration-500 hover:bg-primary hover:text-white"
                                    >
                                        <ShoppingBag className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="p-5 flex flex-col flex-1">
                                    <span className="text-white/30 text-[9px] font-black uppercase tracking-[0.2em] mb-2">{product.category}</span>
                                    <h4 className="text-white font-bold text-sm md:text-base leading-snug line-clamp-1 mb-2 group-hover:text-primary transition-colors">{product.name}</h4>
                                    <div className="mt-auto flex items-center justify-between pt-2">
                                        <span className="text-white font-black text-lg md:text-xl">₹{product.price.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="w-full py-32 bg-white/5 border border-dashed border-white/10 rounded-[40px] flex flex-col items-center justify-center text-center p-10 animate-fade-in">
                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                            <PackageOpen className="w-10 h-10 text-white/20" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">No Drops Found</h3>
                        <p className="text-white/40 text-sm max-w-xs uppercase font-bold tracking-widest">The inventory is currently being replenished. Try another filter.</p>
                        <button
                            onClick={() => setSearchQuery('')}
                            className="mt-8 text-primary font-black uppercase tracking-[0.2em] text-[10px] hover:underline"
                        >
                            Reset Protocol →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
