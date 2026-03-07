'use client';

import { useEffect, useState } from 'react';
import { VideoFeed } from '@/components/feed/VideoFeed';
import { Sidebar } from '@/components/common/Sidebar';
import { MobileNav } from '@/components/common/MobileNav';
import { Reel } from '@/types';
import { useRouter } from 'next/navigation';

export default function ReelsPage() {
    const [reels, setReels] = useState<Reel[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        async function fetchFeed() {
            try {
                const res = await fetch('/api/feed');
                if (res.ok) {
                    const data = await res.json();
                    setReels(data.reels);
                }
            } catch (error) {
                console.error("Failed to fetch feed:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchFeed();
    }, []);

    return (
        <div className="w-full h-[100dvh] flex bg-black text-white overflow-hidden">
            <Sidebar />
            <main className="flex-1 relative h-full bg-black flex flex-col items-center">
                {loading ? (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-4">
                        <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                        <p className="text-white/70 font-medium tracking-widest text-[10px] uppercase">Loading your feed...</p>
                    </div>
                ) : reels.length > 0 ? (
                    <VideoFeed initialReels={reels} onProductClick={(id) => router.push(`/product/${id}`)} />
                ) : (
                    <div className="w-full h-full flex items-center justify-center p-8 text-center text-white/50">
                        No reels found. Please check your connection.
                    </div>
                )}
                <MobileNav />
            </main>
        </div>
    );
}
