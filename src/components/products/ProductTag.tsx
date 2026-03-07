'use client';

import { ProductTagInfo } from '@/types';

interface ProductTagProps {
    tag: ProductTagInfo;
    isActive: boolean;
    onClick: (productId: string) => void;
}

export function ProductTag({ tag, isActive, onClick }: ProductTagProps) {
    // Only render the tag if it's currently active in the video timeline
    if (!isActive) return null;

    return (
        <div
            className="absolute z-10 animate-fade-in"
            style={{
                left: `${tag.positionX}%`,
                top: `${tag.positionY}%`,
                transform: 'translate(-50%, -50%)'
            }}
            onClick={(e) => {
                e.stopPropagation(); // Don't trigger play/pause on video
                onClick(tag.product_id); // This will eventually open the try-on drawer
            }}
        >
            <div className="relative flex items-center justify-center cursor-pointer">
                {/* Outer pulsing ring */}
                <div className="absolute w-10 h-10 rounded-full bg-white/15 backdrop-blur-md border border-white/30 animate-pulse-full" />

                {/* Inner solid dot */}
                <div className="relative w-3 h-3 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" />

                {/* Optional Label (shown on hover or permanently, per design) */}
                <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-black/75 backdrop-blur-xl rounded-full px-2 py-1 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[11px] font-semibold text-white whitespace-nowrap uppercase tracking-wider">
                        View
                    </span>
                </div>
            </div>
        </div>
    );
}
