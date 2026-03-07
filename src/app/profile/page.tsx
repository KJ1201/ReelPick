'use client';

import { Sidebar } from '@/components/common/Sidebar';
import { MobileNav } from '@/components/common/MobileNav';
import { User, Settings, Heart, Package, LogOut, ChevronRight, Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export default function ProfilePage() {

    // Mock user
    const user = {
        name: "Karan S.",
        handle: "@karan_official",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500",
        bio: "Curating the future of digital fashion. Style over matter."
    };

    const sections = [
        { name: "My Orders", icon: Package, count: "2 Orders", color: "text-blue-400" },
        { name: "Wishlist", icon: Heart, count: "12 Items", color: "text-pink-400" },
        { name: "Saved Collections", icon: Bookmark, count: "4 Boards", color: "text-yellow-400" },
        { name: "Account settings", icon: Settings, count: "Preferences", color: "text-purple-400" },
    ];

    return (
        <div className="w-full h-[100dvh] flex bg-[#0A0A0B] text-white overflow-hidden">
            <Sidebar />
            <main className="flex-1 relative h-full bg-ink-100 flex flex-col items-center justify-start overflow-y-auto pb-40 custom-scrollbar">

                <header className="w-full p-8 pt-12 max-w-4xl animate-fade-in">
                    <div className="flex flex-col md:flex-row items-center gap-10">
                        <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden shadow-2xl ring-4 ring-white/5 bg-black p-1">
                            <Image src={user.avatar} alt={user.name} fill unoptimized className="object-cover rounded-full" />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                                <h1 className="text-4xl md:text-5xl font-display font-black tracking-tighter italic">{user.name}</h1>
                                <span className="bg-primary/20 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest hidden md:inline">Premium Patron</span>
                            </div>
                            <p className="text-white/40 font-bold tracking-[0.2em] uppercase text-xs mb-4">{user.handle}</p>
                            <p className="text-white/60 text-lg font-medium max-w-md">{user.bio}</p>
                        </div>
                    </div>
                </header>

                <div className="w-full max-w-4xl p-8 pt-0 grid gap-4 animate-slide-in-bottom">
                    {sections.map((item) => (
                        <div key={item.name} className="group p-8 rounded-[32px] bg-white/5 border border-white/5 flex items-center justify-between hover:bg-white/[0.08] transition-all cursor-pointer">
                            <div className="flex items-center gap-6">
                                <div className={cn("w-14 h-14 rounded-full bg-white/5 flex items-center justify-center transition-transform group-hover:scale-110", item.color)}>
                                    <item.icon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-1">{item.name}</h3>
                                    <span className="text-white/30 text-xs font-bold uppercase tracking-widest">{item.count}</span>
                                </div>
                            </div>
                            <ChevronRight className="w-6 h-6 text-white/10 group-hover:text-primary transition-colors hover:translate-x-1 duration-300" />
                        </div>
                    ))}

                    <button className="mt-10 p-8 rounded-[32px] bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center gap-4 font-black text-xl hover:bg-red-500 hover:text-white transition-all active:scale-[0.98]">
                        <LogOut className="w-6 h-6" />
                        Sign Out of Session
                    </button>

                    <p className="text-center text-[10px] uppercase font-bold tracking-widest text-white/10 mt-10">ReelShop Mobile Node v2.0.4 Pre-Release</p>
                </div>
                <MobileNav />
            </main>
        </div>
    );
}
