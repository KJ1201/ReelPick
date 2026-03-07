'use client';

import { useState, useRef, useEffect } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { Reel } from '@/types';
import { ProductTag } from '@/components/products/ProductTag';
import { Volume2, VolumeX, Heart, MessageCircle, Share2, MoreVertical, ShoppingBag, ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface VideoPlayerProps {
    reel: Reel;
    isActive: boolean; // Managed by the parent feed list
    onProductClick: (productId: string) => void;
    onNext?: () => void;
    onPrev?: () => void;
}

export function VideoPlayer({ reel, isActive, onProductClick, onNext, onPrev }: VideoPlayerProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [currentTime, setCurrentTime] = useState(0);
    const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

    // Monitor when this item is primarily in view
    const entry = useIntersectionObserver(containerRef, {
        threshold: 0.6, // Start playing when 60% of the video is in view
    });

    const isVisible = !!entry?.isIntersecting;

    useEffect(() => {
        // If it's visible, and it's the active index in the parent list, we should play
        if (isVisible && isActive && videoRef.current) {
            videoRef.current.play().then(() => setIsPlaying(true)).catch((e) => console.error("Autoplay failed:", e));
        } else if (videoRef.current) {
            // Pause if scrolled out of view
            videoRef.current.pause();
            setIsPlaying(false);
        }
    }, [isVisible, isActive]);

    // Handle manual tap to pause/play
    const togglePlayPause = () => {
        if (!videoRef.current) return;
        if (isPlaying) {
            videoRef.current.pause();
            setIsPlaying(false);
        } else {
            videoRef.current.play();
            setIsPlaying(true);
        }
    };

    const handleTimeUpdate = () => {
        if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
        }
    };

    // --- REUSAble COMPONENTS for Mobile & Desktop sharing ---
    const sellerInfo = (
        <div className="flex items-center gap-3 w-full pointer-events-auto">
            <div className="w-10 h-10 rounded-full border border-white/20 bg-ink-70 overflow-hidden relative shrink-0">
                {reel.seller_avatar_url ? (
                    <Image src={reel.seller_avatar_url} alt="Seller Avatar" fill sizes="40px" className="object-cover" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/50 text-sm">Seller</div>
                )}
            </div>
            <div className="flex flex-col flex-1 min-w-0">
                <span className="text-white font-semibold text-[15px] truncate drop-shadow-md">{reel.seller_name || '@seller'}</span>
                <span className="text-white/70 text-sm truncate drop-shadow-md">Fashion & Wear</span>
            </div>

            <button className="ml-auto px-4 py-1.5 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-[11px] font-bold tracking-wider uppercase text-white backdrop-blur-md transition-colors active:scale-95 shadow-md">
                Follow
            </button>
        </div>
    );

    const captionContent = (
        <div
            className="pointer-events-auto cursor-pointer flex flex-col items-start w-full"
            onClick={(e) => { e.stopPropagation(); setIsDescriptionExpanded(!isDescriptionExpanded); }}
        >
            <p className={cn(
                "text-white text-[15px] leading-relaxed font-normal transition-all duration-300 drop-shadow-md",
                !isDescriptionExpanded && "line-clamp-2"
            )}>
                {reel.caption}
            </p>
            {!isDescriptionExpanded && reel.caption && reel.caption.length > 50 && (
                <span className="text-white/80 drop-shadow-md text-[13px] font-semibold mt-0.5 hover:text-white transition-colors">more</span>
            )}
        </div>
    );

    const productCallout = reel.tags.length > 0 && (
        <div
            onClick={(e) => { e.stopPropagation(); onProductClick(reel.tags[0].product_id); }}
            className="inline-flex items-center gap-2 mt-2 py-3 px-4 bg-black/60 md:bg-white/10 border border-white/20 backdrop-blur-md rounded-xl w-max shadow-xl cursor-pointer hover:bg-black/80 md:hover:bg-white/20 transition-colors pointer-events-auto"
        >
            <div className="w-7 h-7 rounded-md bg-white flex items-center justify-center shrink-0">
                <ShoppingBag className="w-4 h-4 text-black" />
            </div>
            <div className="flex flex-col pr-4">
                <span className="text-white font-medium text-xs leading-none mb-1 shadow-black">View {reel.tags.length} Products</span>
                <span className="text-white/80 text-[10px] leading-none uppercase tracking-wide">In this video</span>
            </div>
        </div>
    );

    const actionButtons = (
        <>
            <div className="flex flex-col items-center gap-1 group">
                <button className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white md:hover:bg-white/20 active:scale-90 transition-all shadow-lg">
                    <Heart className="w-6 h-6 md:w-7 md:h-7 drop-shadow-md" />
                </button>
                <span className="text-white font-semibold text-xs shadow-black drop-shadow-md">{reel.likes || '1.2K'}</span>
            </div>

            <div className="flex flex-col items-center gap-1 group">
                <button className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white md:hover:bg-white/20 active:scale-90 transition-all shadow-lg">
                    <MessageCircle className="w-6 h-6 md:w-7 md:h-7 drop-shadow-md" />
                </button>
                <span className="text-white font-semibold text-xs shadow-black drop-shadow-md">124</span>
            </div>

            <div className="flex flex-col items-center gap-1 group">
                <button className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white md:hover:bg-white/20 active:scale-90 transition-all shadow-lg">
                    <Share2 className="w-6 h-6 md:w-7 md:h-7 drop-shadow-md" />
                </button>
                <span className="text-white font-semibold text-xs shadow-black drop-shadow-md">{reel.shares || 'Share'}</span>
            </div>

            <div className="flex flex-col items-center gap-1 group">
                <button className="w-11 h-11 md:w-12 md:h-12 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white md:hover:bg-white/20 active:scale-90 transition-all shadow-lg">
                    <MoreVertical className="w-6 h-6 md:w-7 md:h-7 drop-shadow-md" />
                </button>
            </div>
        </>
    );

    return (
        <div
            ref={containerRef}
            className={cn(
                "relative bg-ink-100 flex flex-col justify-center items-center shrink-0 w-full h-[100dvh] snap-start",
                "md:bg-transparent md:flex-row md:justify-center md:items-end md:gap-4 md:pb-[7.5vh] lg:gap-8"
            )}
        >
            {/* --- DESKTOP LEFT INFO COLUMN --- */}
            <div className="hidden md:flex flex-1 justify-end items-end h-[85vh] max-h-[850px] pointer-events-none">
                <div className="w-[320px] lg:w-[360px] pointer-events-auto bg-black/40 border border-white/10 p-6 rounded-[32px] backdrop-blur-3xl shadow-2xl flex flex-col gap-4">
                    {sellerInfo}
                    <div className="w-full h-px bg-white/10 my-1" />
                    {captionContent}
                    {productCallout}
                </div>
            </div>

            {/* --- CORE VIDEO PLAYER --- */}
            <div className={cn(
                "relative flex-shrink-0 w-full h-[100dvh] overflow-hidden",
                "md:h-[85vh] md:w-[calc(85vh*9/16)] md:max-h-[850px] md:max-w-[480px] md:rounded-[32px] md:shadow-[0_0_40px_rgba(0,0,0,0.5)] md:border md:border-white/10 md:transition-all md:duration-500"
            )}>
                <video
                    ref={videoRef}
                    onClick={togglePlayPause}
                    src={reel.video_url}
                    className="absolute inset-0 w-full h-full object-cover z-0 cursor-pointer"
                    loop
                    playsInline
                    muted={isMuted}
                    onTimeUpdate={handleTimeUpdate}
                />

                {/* Top and Bottom Gradients (Only relevant on mobile) */}
                <div className="absolute top-0 left-0 right-0 h-[30%] bg-gradient-to-b from-[#0A0A0B]/70 to-transparent z-0 pointer-events-none md:hidden" />
                <div className="absolute bottom-0 left-0 right-0 h-[65%] bg-gradient-to-t from-[#0A0A0B]/95 via-[#0A0A0B]/60 to-transparent z-0 pointer-events-none md:hidden" />

                {/* Product Tags (Pulsing Overlays) */}
                <div className="absolute inset-0 z-10 pointer-events-none">
                    {reel.tags.map((tag, idx) => {
                        const isTagActive = currentTime >= tag.timestampStart && currentTime <= tag.timestampEnd;
                        return (
                            <div key={idx} className="pointer-events-auto">
                                <ProductTag
                                    tag={tag}
                                    isActive={isTagActive}
                                    onClick={onProductClick}
                                />
                            </div>
                        );
                    })}
                </div>

                {/* Mute Toggle overlaid top right */}
                <button
                    onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }}
                    className="absolute top-32 right-4 md:top-6 md:right-6 z-20 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-lg pointer-events-auto"
                >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>

                {/* MOBILE ONLY Bottom Info */}
                <div className="md:hidden absolute bottom-0 left-0 right-0 p-4 pb-[110px] z-10 flex flex-col gap-3 pointer-events-none pr-16 text-shadow-md">
                    {sellerInfo}
                    {captionContent}
                    {productCallout}
                </div>

                {/* MOBILE ONLY Right Actions */}
                <div className="md:hidden absolute right-4 bottom-36 z-10 flex flex-col gap-6 items-center pointer-events-auto">
                    {actionButtons}
                </div>
            </div>

            {/* --- DESKTOP RIGHT ACTIONS COLUMN --- */}
            <div className="hidden md:flex flex-1 justify-start items-end h-[85vh] max-h-[850px] pointer-events-none">
                <div className="flex flex-col w-[64px] shrink-0 items-center justify-end gap-6 pointer-events-auto">
                    <div className="flex flex-col gap-5 bg-black/40 border border-white/10 py-5 rounded-full backdrop-blur-3xl shadow-2xl items-center mb-2 w-full">
                        {actionButtons}
                    </div>

                    {/* Desktop Up/Down Navigation */}
                    <div className="flex flex-col gap-3">
                        <button
                            onClick={onPrev}
                            className="w-14 h-14 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white hover:bg-white/20 active:scale-90 transition-all shadow-xl"
                        >
                            <ChevronUp className="w-8 h-8" />
                        </button>
                        <button
                            onClick={onNext}
                            className="w-14 h-14 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white hover:bg-white/20 active:scale-90 transition-all shadow-xl"
                        >
                            <ChevronDown className="w-8 h-8" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
