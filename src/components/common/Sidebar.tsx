'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home as HomeIcon, Clapperboard, Sparkles, ShoppingBag, User } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Sidebar() {
    const pathname = usePathname();

    const navItems = [
        { name: 'Store', href: '/store', icon: HomeIcon },
        { name: 'Reels', href: '/reels', icon: Clapperboard },
        { name: 'Studio', href: '/seller', icon: Sparkles },
        { name: 'Cart', href: '/cart', icon: ShoppingBag },
        { name: 'Profile', href: '/profile', icon: User },
    ];

    return (
        <aside className="hidden md:flex flex-col w-[260px] border-r border-white/10 p-6 shrink-0 bg-[#0A0A0B] z-50">
            <Link href="/reels" className="text-3xl font-display font-bold tracking-tight mb-10 text-primary">
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
                                "flex items-center gap-4 text-base font-semibold hover:bg-white/10 p-3 rounded-xl transition-colors",
                                isActive ? "text-white bg-white/10" : "text-white/50"
                            )}
                        >
                            <item.icon className="w-6 h-6" /> {item.name}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
