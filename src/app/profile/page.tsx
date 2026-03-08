'use client';

import { Sidebar } from '@/components/common/Sidebar';
import { MobileNav } from '@/components/common/MobileNav';
import { User, Settings, Heart, Package, LogOut, ChevronRight, Bookmark } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function ProfilePage() {
    const { user, loading, signOut } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push(`/auth?next=${encodeURIComponent(window.location.pathname)}`);
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return (
            <div className="w-full h-[100dvh] bg-[#0A0A0B] flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-white/10" />
            </div>
        );
    }

    const sections = [
        { name: "My Orders", icon: Package, count: "2 Orders", color: "text-blue-400" },
        { name: "Wishlist", icon: Heart, count: "12 Items", color: "text-pink-400" },
        { name: "Saved Collections", icon: Bookmark, count: "4 Boards", color: "text-yellow-400" },
        { name: "Account settings", icon: Settings, count: "Preferences", color: "text-purple-400" },
    ];

    const userEmail = user.email || 'User';
    const userName = userEmail.split('@')[0];

    return (
        <div className="w-full h-[100dvh] flex bg-[#0A0A0B] text-white overflow-hidden">
            <Sidebar />
            <main className="flex-1 relative h-full bg-ink-100 flex flex-col items-center justify-start overflow-y-auto pb-40 custom-scrollbar">

                <header className="w-full p-8 pt-12 max-w-4xl animate-fade-in">
                    <div className="flex flex-col md:flex-row items-center gap-10">
                        <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden shadow-2xl ring-4 ring-white/5 bg-black p-1">
                            <Image
                                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${userEmail}`}
                                alt={userName}
                                fill
                                unoptimized
                                className="object-cover rounded-full transition-transform hover:scale-110 duration-700"
                            />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                                <h1 className="text-4xl md:text-5xl font-sans font-black tracking-tighter capitalize text-primary">{userName}</h1>
                                <span className="bg-primary/20 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest hidden md:inline border border-primary/20">Elite Patron</span>
                            </div>
                            <p className="text-white/40 font-bold tracking-[0.2em] uppercase text-xs mb-4">@{userName}_officer</p>
                            <p className="text-white/60 text-lg font-medium max-w-md leading-relaxed">Curating the future of digital commerce. Style over matter. Universal Node v2.0</p>
                        </div>
                    </div>
                </header>

                <div className="w-full max-w-4xl p-8 pt-0 grid gap-4 animate-slide-in-bottom">
                    {sections.map((item) => (
                        <div
                            key={item.name}
                            onClick={() => item.name === "My Orders" ? router.push('/orders') : null}
                            className="group p-8 rounded-[40px] bg-white/5 border border-white/5 flex items-center justify-between hover:bg-white/[0.08] transition-all cursor-pointer shadow-2xl"
                        >
                            <div className="flex items-center gap-6">
                                <div className={cn("w-16 h-16 rounded-[24px] bg-white/5 flex items-center justify-center transition-transform group-hover:rotate-6 group-hover:scale-110", item.color)}>
                                    <item.icon className="w-7 h-7" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black mb-1">{item.name}</h3>
                                    <span className="text-white/20 text-[10px] font-black uppercase tracking-widest">{item.count}</span>
                                </div>
                            </div>
                            <ChevronRight className="w-8 h-8 text-white/10 group-hover:text-primary transition-all group-hover:translate-x-2 duration-500" />
                        </div>
                    ))}

                    <button
                        onClick={() => signOut()}
                        className="mt-10 p-8 rounded-[32px] bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center gap-4 font-black text-xl hover:bg-red-500 hover:text-white transition-all active:scale-[0.98]"
                    >
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
