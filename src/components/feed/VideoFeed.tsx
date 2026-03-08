'use client';

import { useState, useRef, useEffect } from 'react';
import { Reel } from '@/types';
import { VideoPlayer } from './VideoPlayer';

interface VideoFeedProps {
    initialReels: Reel[];
    onProductClick: (productId: string) => void;
}

export function VideoFeed({ initialReels, onProductClick }: VideoFeedProps) {
    const [reels] = useState<Reel[]>(initialReels);
    const [activeIndex, setActiveIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Deep linking: If reelId is in URL, scroll to it
        const params = new URLSearchParams(window.location.search);
        const reelId = params.get('reelId');
        if (reelId) {
            const index = reels.findIndex(r => r.id === reelId);
            if (index !== -1) {
                setActiveIndex(index);
                if (containerRef.current) {
                    containerRef.current.scrollTop = index * window.innerHeight;
                }
            }
        }
    }, [reels]);

    useEffect(() => {
        // Basic setup for updating active index based on scroll position
        const handleScroll = () => {
            if (!containerRef.current) return;

            const { scrollTop, clientHeight } = containerRef.current;
            // Calculate which item occupies the most space in the viewport
            const index = Math.round(scrollTop / clientHeight);

            if (index !== activeIndex && index >= 0 && index < reels.length) {
                setActiveIndex(index);
            }
        };

        const container = containerRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll, { passive: true });
        }

        return () => {
            if (container) {
                container.removeEventListener('scroll', handleScroll);
            }
        };
    }, [activeIndex, reels.length]);

    if (!reels || reels.length === 0) {
        return (
            <div className="w-full h-[100dvh] bg-ink-100 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                    <p className="text-white/70 font-medium">Loading feed...</p>
                </div>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            className="w-full h-[100dvh] overflow-y-scroll snap-y snap-mandatory bg-ink-100 md:bg-black scroll-smooth relative flex flex-col items-center"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
            {/* Hide scrollbar for Chrome/Safari via Tailwind classes in production */}
            <style dangerouslySetInnerHTML={{
                __html: `
        ::-webkit-scrollbar { display: none; }
      `}} />

            {reels.map((reel, idx) => (
                <VideoPlayer
                    key={reel.id}
                    reel={reel}
                    isActive={idx === activeIndex}
                    onProductClick={onProductClick}
                    onNext={() => {
                        if (containerRef.current) containerRef.current.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
                    }}
                    onPrev={() => {
                        if (containerRef.current) containerRef.current.scrollBy({ top: -window.innerHeight, behavior: 'smooth' });
                    }}
                />
            ))}
        </div>
    );
}
