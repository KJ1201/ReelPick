'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home as HomeIcon, Clapperboard, Sparkles, ShoppingBag, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';

export function MobileNav() {
    const pathname = usePathname();
    const { cartCount } = useCart();

    const navItems = [
        { name: 'Store', href: '/store', icon: HomeIcon },
        { name: 'Reels', href: '/reels', icon: Clapperboard },
        { name: 'Studio', href: '/seller', icon: Sparkles },
        { name: 'Cart', href: '/cart', icon: ShoppingBag, count: cartCount },
        { name: 'Profile', href: '/profile', icon: User },
    ];

    return (
        <div className="md:hidden fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center justify-between px-4 h-[60px] bg-[#121214]/85 backdrop-blur-2xl border border-white/[0.08] rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.60)] z-[200] w-[92%] max-w-[400px]">
            {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex-1 flex flex-col items-center justify-center h-full rounded-full transition-colors",
                            isActive ? "text-primary" : "text-white/50 hover:text-white/80"
                        )}
                    >
                        <div className="relative">
                            <item.icon className="w-5 h-5" />
                            {item.count !== undefined && item.count > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 bg-primary text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center border border-[#121214]">
                                    {item.count}
                                </span>
                            )}
                        </div>
                        <span className="text-[10px] font-bold mt-1 tracking-wide">{item.name}</span>
                    </Link>
                );
            })}
        </div>
    );
}
