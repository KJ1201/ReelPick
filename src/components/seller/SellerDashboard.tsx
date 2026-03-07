'use client';

import { useState, useEffect } from 'react';
import { Plus, LayoutGrid, Package, ChevronRight, Video, ArrowLeft, Loader2, Tag, IndianRupee, Image as ImageIcon } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { SellerStudio } from './SellerStudio';

// Mock seller for demo purposes
const DEMO_SELLER_ID = '00000000-0000-0000-0000-000000000001';

type ViewState = 'LIST' | 'ADD_PRODUCT' | 'CREATE_REEL';

interface SellerDashboardProps {
    onProductView?: (productId: string) => void;
}

export function SellerDashboard({ onProductView }: SellerDashboardProps) {
    const [view, setView] = useState<ViewState>('LIST');
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);

    // Form state for adding product
    const [newProductName, setNewProductName] = useState('');
    const [newProductPrice, setNewProductPrice] = useState('');
    const [newProductDesc, setNewProductDesc] = useState('');
    const [isListing, setIsListing] = useState(false);

    // Fetch seller's products from Supabase
    const fetchProducts = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('seller_id', DEMO_SELLER_ID)
            .order('created_at', { ascending: false });

        if (!error && data) setProducts(data);
        setIsLoading(false);
    };

    useEffect(() => {
        if (view === 'LIST') fetchProducts();
    }, [view]);

    const handleListProduct = async () => {
        if (!newProductName || !newProductPrice) return;
        setIsListing(true);

        const productId = `p_${Math.random().toString(36).substring(2, 8)}`;
        const { error } = await supabase
            .from('products')
            .insert({
                id: productId,
                name: newProductName,
                description: newProductDesc,
                price: parseInt(newProductPrice),
                image_url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500', // Mock product hero image
                category: 'Fashion',
                seller_id: DEMO_SELLER_ID,
                rating: 5.0,
                reviews_count: 0
            });

        if (!error) {
            setNewProductName('');
            setNewProductPrice('');
            setNewProductDesc('');
            setView('LIST');
        } else {
            window.alert("Failed to list product: " + error.message);
        }
        setIsListing(false);
    };

    const openStudio = (product: any) => {
        setSelectedProduct(product);
        setView('CREATE_REEL');
    };

    return (
        <div className="w-full h-full bg-[#0a0a0b] text-white p-6 md:p-10 pb-32 overflow-y-auto custom-scrollbar">

            {/* --- VIEW: PRODUCT LIST --- */}
            {view === 'LIST' && (
                <div className="max-w-4xl mx-auto animate-fade-in">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h1 className="text-4xl font-display font-bold tracking-tight mb-2">My Inventory</h1>
                            <p className="text-white/40 text-sm font-medium uppercase tracking-widest">Dashboard • Official Seller</p>
                        </div>
                        <button
                            onClick={() => setView('ADD_PRODUCT')}
                            className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2 px-6 h-12 rounded-full font-bold shadow-lg shadow-primary/20 transition-all active:scale-95"
                        >
                            <Plus className="w-5 h-5" />
                            List New Product
                        </button>
                    </div>

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <Loader2 className="w-8 h-8 text-white/20 animate-spin" />
                            <p className="text-white/20 font-bold uppercase tracking-widest text-xs">Fetching Inventory...</p>
                        </div>
                    ) : products.length === 0 ? (
                        <div className="bg-white/5 border border-white/5 rounded-[40px] p-16 text-center">
                            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Package className="w-10 h-10 text-white/20" />
                            </div>
                            <h3 className="text-2xl font-bold mb-2">No Products Yet</h3>
                            <p className="text-white/40 mb-8 max-w-sm mx-auto">First list your products to start creating viral contents for them.</p>
                            <button
                                onClick={() => setView('ADD_PRODUCT')}
                                className="text-primary font-bold hover:underline"
                            >
                                Start Listing Now →
                            </button>
                        </div>
                    ) : (
                        <div className="grid gap-4">
                            {products.map((p) => (
                                <div key={p.id} className="group bg-white/5 border border-white/5 rounded-3xl p-5 flex flex-col md:flex-row items-center gap-6 hover:bg-white/[0.08] transition-all cursor-pointer">
                                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden shadow-2xl shrink-0">
                                        <Image src={p.image_url} alt={p.name} fill unoptimized className="object-cover" />
                                    </div>
                                    <div className="flex-1 text-center md:text-left">
                                        <h3 className="text-xl font-bold mb-1">{p.name}</h3>
                                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                                            <span className="text-white/40 text-xs font-bold uppercase tracking-widest">₹{p.price}</span>
                                            <span className="text-white/40 text-xs font-bold uppercase tracking-widest">•</span>
                                            <span className="text-white/40 text-xs font-bold uppercase tracking-widest">{p.category}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 w-full md:w-auto">
                                        <button
                                            onClick={() => openStudio(p)}
                                            className="flex-1 md:flex-none h-11 px-5 rounded-full bg-indigo-500 hover:bg-indigo-400 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 active:scale-95 transition-all"
                                        >
                                            <Video className="w-4 h-4" />
                                            Make Reel
                                        </button>
                                        <button
                                            onClick={() => onProductView?.(p.id)}
                                            className="h-11 px-5 rounded-full bg-white/5 text-white/70 hover:text-white text-sm font-bold flex items-center justify-center gap-2 group-hover:bg-white/10 transition-colors"
                                        >
                                            View Product
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* --- VIEW: ADD PRODUCT FORM --- */}
            {view === 'ADD_PRODUCT' && (
                <div className="max-w-2xl mx-auto animate-slide-in-top pb-10">
                    <button
                        onClick={() => setView('LIST')}
                        className="flex items-center gap-2 text-white/40 hover:text-white mb-8 group transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-bold uppercase tracking-widest text-xs">Back to Inventory</span>
                    </button>

                    <h1 className="text-4xl font-display font-bold tracking-tight mb-2">New Listing</h1>
                    <p className="text-white/40 mb-10">Start by listing your product. You can create content for it after.</p>

                    <div className="space-y-6">
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 ml-1">Product Name</label>
                            <div className="relative">
                                <Tag className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                                <input
                                    value={newProductName}
                                    onChange={(e) => setNewProductName(e.target.value)}
                                    placeholder="e.g. Classic Crimson Dress"
                                    className="w-full h-16 bg-white/5 border border-white/10 rounded-[20px] pl-14 pr-6 text-lg font-medium focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-white/10"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 ml-1">Price (₹)</label>
                            <div className="relative">
                                <IndianRupee className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20" />
                                <input
                                    type="number"
                                    value={newProductPrice}
                                    onChange={(e) => setNewProductPrice(e.target.value)}
                                    placeholder="2499"
                                    className="w-full h-16 bg-white/5 border border-white/10 rounded-[20px] pl-14 pr-6 text-lg font-semibold focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-white/10"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 ml-1">Description</label>
                            <textarea
                                value={newProductDesc}
                                onChange={(e) => setNewProductDesc(e.target.value)}
                                placeholder="Details about fabric, fit, etc..."
                                className="w-full h-32 bg-white/5 border border-white/10 rounded-[20px] p-6 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none transition-all placeholder:text-white/10"
                            />
                        </div>

                        <div className="p-6 rounded-[30px] border border-dashed border-white/10 bg-white/5 flex flex-col items-center justify-center gap-3">
                            <ImageIcon className="w-8 h-8 text-white/20" />
                            <p className="text-white/40 text-xs font-bold uppercase tracking-widest">Upload High-Res Product Photo</p>
                            <p className="text-[10px] text-white/20">(Using default mock asset for demo)</p>
                        </div>

                        <button
                            onClick={handleListProduct}
                            disabled={isListing || !newProductName || !newProductPrice}
                            className="w-full h-16 bg-white text-black rounded-[20px] font-black text-lg shadow-2xl shadow-white/5 hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-50"
                        >
                            {isListing ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : "Complete Listing"}
                        </button>
                    </div>
                </div>
            )}

            {/* --- VIEW: CREATE REEL STUDIO --- */}
            {view === 'CREATE_REEL' && selectedProduct && (
                <div className="max-w-4xl mx-auto">
                    <SellerStudio
                        productId={selectedProduct.id}
                        productName={selectedProduct.name}
                        onBack={() => setView('LIST')}
                        onSuccess={() => setView('LIST')}
                    />
                </div>
            )}
        </div>
    );
}
