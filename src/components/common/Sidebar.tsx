'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home as HomeIcon, Clapperboard, Sparkles, ShoppingBag, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';

export function Sidebar() {
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
        <aside className="hidden md:flex flex-col w-[260px] border-r border-white/[0.08] p-6 shrink-0 bg-[#0A0A0B] z-50">
            <Link href="/store" className="text-3xl font-display font-black tracking-[-0.03em] mb-10 text-primary hover:scale-105 transition-transform duration-500">
                ReelShop
            </Link>
            <nav className="flex flex-col gap-4">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center justify-between group text-base font-semibold hover:bg-white/10 p-3 rounded-xl transition-colors",
                                isActive ? "text-white bg-white/10" : "text-white/50"
                            )}
                        >
                            <div className="flex items-center gap-4">
                                <item.icon className="w-6 h-6 shrink-0" />
                                <span>{item.name}</span>
                            </div>
                            {item.count !== undefined && item.count > 0 && (
                                <span className="bg-primary text-white text-[10px] font-black px-2 py-0.5 rounded-full min-w-[20px] text-center">
                                    {item.count}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
