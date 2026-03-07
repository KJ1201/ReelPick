import Image from 'next/image';
import { Search, ShoppingBag, Star, Filter, ChevronRight } from 'lucide-react';

import { MOCK_PRODUCTS } from '@/data/mockProducts';
interface StorefrontProps {
    onProductClick: (productId: string) => void;
}

export function Storefront({ onProductClick }: StorefrontProps) {
    return (
        <div className="w-full h-full bg-[#0a0a0b] text-white overflow-y-auto pb-32">
            {/* Header */}
            <div className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/10 px-4 py-4 md:pt-6">
                <div className="flex items-center gap-3">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="w-full h-12 bg-white/10 border border-white/10 rounded-full pl-10 pr-4 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        />
                    </div>
                    <button className="w-12 h-12 rounded-full bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
                        <Filter className="w-5 h-5 text-white" />
                    </button>
                </div>

                {/* Categories */}
                <div className="flex overflow-x-auto gap-3 mt-4 scrollbar-none pb-1">
                    {['All Products', 'Fashion', 'Beauty', 'Electronics', 'Home'].map((cat, i) => (
                        <button
                            key={cat}
                            className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-semibold transition-colors ${i === 0 ? 'bg-primary text-white' : 'bg-white/5 border border-white/10 text-white/70 hover:bg-white/10'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Featured Banner */}
            <div className="p-4">
                <div className="w-full h-40 md:h-64 rounded-2xl relative overflow-hidden group cursor-pointer border border-white/10">
                    <Image
                        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80"
                        alt="Store Banner"
                        fill
                        sizes="(max-width: 768px) 100vw, 100vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent flex flex-col justify-center p-6 md:p-10">
                        <span className="text-primary font-bold text-xs md:text-sm tracking-wider uppercase mb-2">Summer Sale</span>
                        <h2 className="text-2xl md:text-4xl font-display font-bold text-white mb-2">Up to 50% Off</h2>
                        <p className="text-white/70 text-sm md:text-base max-w-[200px] md:max-w-md">Discover the latest trends in fashion and accessories.</p>
                    </div>
                </div>
            </div>

            <div className="px-4 pb-4 flex items-center justify-between mt-2">
                <h3 className="text-lg md:text-xl font-bold">Trending Now</h3>
                <button className="text-sm text-primary flex items-center gap-1 font-medium">See all <ChevronRight className="w-4 h-4" /></button>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4 pb-10">
                {MOCK_PRODUCTS.map((product) => (
                    <div
                        key={product.id}
                        onClick={() => onProductClick(product.id)}
                        className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden group flex flex-col cursor-pointer transition-all hover:bg-white/10 hover:border-white/20"
                    >
                        <div className="relative w-full aspect-[4/5] overflow-hidden bg-white/5">
                            <Image
                                src={product.image}
                                alt={product.name}
                                fill
                                sizes="(max-width: 768px) 50vw, 25vw"
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <button className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-lg active:scale-90 transition-transform hover:bg-primary/80">
                                <ShoppingBag className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-3 md:p-4 flex flex-col flex-1">
                            <span className="text-white/50 text-[10px] md:text-xs font-semibold uppercase tracking-wider mb-1">{product.category}</span>
                            <h4 className="text-white font-medium text-sm md:text-base leading-snug line-clamp-2 mb-2 group-hover:text-primary transition-colors">{product.name}</h4>
                            <div className="mt-auto flex items-center justify-between">
                                <span className="text-white font-bold text-base md:text-lg">₹{product.price}</span>
                                <div className="flex items-center gap-1">
                                    <Star className="w-3 h-3 md:w-4 md:h-4 text-yellow-400 fill-yellow-400" />
                                    <span className="text-white/70 text-xs md:text-sm font-medium">{product.rating}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
