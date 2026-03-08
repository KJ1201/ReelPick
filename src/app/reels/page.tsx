'use client';

import { useEffect, useState } from 'react';
import { VideoFeed } from '@/components/feed/VideoFeed';
import { Sidebar } from '@/components/common/Sidebar';
import { MobileNav } from '@/components/common/MobileNav';
import { Reel } from '@/types';
import { useRouter } from 'next/navigation';
import { Loader2, Sparkles } from 'lucide-react';
import { ReelSkeleton } from '@/components/common/Skeleton';

import { useAuth } from '@/context/AuthContext';

export default function ReelsPage() {
    const { user, loading: authLoading } = useAuth();
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
                // Keep loading for a tiny bit extra for smooth transition
                setTimeout(() => setLoading(false), 800);
            }
        }
        fetchFeed();
    }, []);



    return (
        <div className="w-full h-[100dvh] flex bg-[#0A0A0B] text-white overflow-hidden">
            <Sidebar />
            <main className="flex-1 relative h-full bg-black flex flex-col items-center">

                {loading ? (
                    <div className="w-full h-full relative">
                        <ReelSkeleton />
                    </div>
                ) : reels.length > 0 ? (
                    <VideoFeed initialReels={reels} onProductClick={(id) => router.push(`/product/${id}`)} />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center bg-[#0A0A0B]">
                        <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                            <Loader2 className="w-10 h-10 text-white/20" />
                        </div>
                        <h3 className="text-2xl font-bold mb-2">No Content Found</h3>
                        <p className="text-white/40 text-sm max-w-xs uppercase font-bold tracking-widest">Our creators are processing new drops. Check back momentarily.</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-8 text-primary font-black uppercase tracking-[0.2em] text-[10px] hover:underline"
                        >
                            Retry Handshake →
                        </button>
                    </div>
                )}
                <MobileNav />
            </main>
        </div>
    );
}
