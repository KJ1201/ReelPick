'use client';

import { useState, useRef } from 'react';
import { Video, Upload, CheckCircle2, Ghost, ChevronLeft, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { cn } from '@/lib/utils';

// Mock seller for demo purposes
const DEMO_SELLER_ID = '00000000-0000-0000-0000-000000000001';

interface SellerStudioProps {
    productId: string;
    productName: string;
    onBack?: () => void;
    onSuccess?: () => void;
}

export function SellerStudio({ productId, productName, onBack, onSuccess }: SellerStudioProps) {
    const [isPublishing, setIsPublishing] = useState(false);
    const [publishStatus, setPublishStatus] = useState<'IDLE' | 'UPLOADING' | 'SUCCESS' | 'ERROR'>('IDLE');

    // Form State
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [videoPreview, setVideoPreview] = useState<string | null>(null);
    const [caption, setCaption] = useState('');

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setVideoFile(file);
            const url = URL.createObjectURL(file);
            setVideoPreview(url);
        }
    };

    const handlePublish = async () => {
        if (!videoFile || !productId) return;

        setIsPublishing(true);
        setPublishStatus('UPLOADING');

        try {
            // 1. Upload Video to Supabase Storage
            const fileExt = videoFile.name.split('.').pop();
            const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`;
            const filePath = `reels/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('reels')
                .upload(filePath, videoFile);

            if (uploadError) throw uploadError;

            // Get Public URL
            const { data: { publicUrl } } = supabase.storage
                .from('reels')
                .getPublicUrl(filePath);

            // 2. Create Reel Entry
            const reel_id = `reel_${Math.random().toString(36).substring(2, 8)}`;
            const { error: reelError } = await supabase
                .from('reels')
                .insert({
                    id: reel_id,
                    video_url: publicUrl,
                    caption: caption || `Checkout our new ${productName}!`,
                    seller_id: DEMO_SELLER_ID,
                    likes_count: 0,
                    shares_count: 0
                });

            if (reelError) throw reelError;

            // 3. Create Tag Link
            const { error: tagError } = await supabase
                .from('reel_tags')
                .insert({
                    reel_id: reel_id,
                    product_id: productId,
                    timestamp_start: 0,
                    timestamp_end: 15,
                    position_x: 50,
                    position_y: 50
                });

            if (tagError) throw tagError;

            setPublishStatus('SUCCESS');
            if (onSuccess) {
                setTimeout(onSuccess, 2000);
            }

        } catch (error: any) {
            console.error("Publishing error:", error);
            setPublishStatus('ERROR');
            window.alert(`Error: ${error.message}`);
        } finally {
            setIsPublishing(false);
        }
    };

    return (
        <div className="flex flex-col h-full animate-fade-in">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                {onBack && (
                    <button
                        onClick={onBack}
                        className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                )}
                <div>
                    <h2 className="text-2xl font-bold">Create Reel</h2>
                    <p className="text-white/40 text-sm">Tagging: <span className="text-primary font-semibold">{productName}</span></p>
                </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Video Picker */}
                <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Video Content</label>
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="video/*"
                        className="hidden"
                    />

                    {!videoPreview ? (
                        <div
                            onClick={() => fileInputRef.current?.click()}
                            className="aspect-[9/16] w-full max-w-[280px] mx-auto rounded-3xl border-2 border-dashed border-white/20 flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-white/5 transition-all group"
                        >
                            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Upload className="w-8 h-8 text-white/50" />
                            </div>
                            <div className="text-center px-6">
                                <p className="font-semibold text-sm">Upload Reel</p>
                                <p className="text-[10px] text-white/30 mt-1">MP4/MOV • 9:16 recommended</p>
                            </div>
                        </div>
                    ) : (
                        <div className="aspect-[9/16] w-full max-w-[280px] mx-auto rounded-3xl overflow-hidden border border-white/10 relative group bg-black shadow-2xl">
                            <video src={videoPreview} className="w-full h-full object-cover" autoPlay loop muted />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="px-4 py-2 rounded-full bg-white text-black text-xs font-bold shadow-xl active:scale-95 transition-transform"
                                >
                                    Change Video
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Caption & Publish */}
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 ml-1">Viral Caption</label>
                        <textarea
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            placeholder={`e.g. You need to see this ${productName} in action! 🔥 #newdrop #fashion`}
                            className="w-full h-32 bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 resize-none placeholder:text-white/20"
                        />
                    </div>

                    <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                            <Tag className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-primary uppercase tracking-tight">Auto-Tag Enabled</p>
                            <p className="text-[11px] text-white/50 mt-0.5">This reel will automatically be linked to your product "{productName}".</p>
                        </div>
                    </div>

                    <button
                        onClick={handlePublish}
                        disabled={!videoFile || isPublishing}
                        className={cn(
                            "w-full h-14 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all active:scale-95",
                            isPublishing ? "bg-white/10 text-white/40 cursor-not-allowed" : "bg-gradient-to-r from-primary to-purple-500 text-white shadow-lg shadow-primary/20 hover:opacity-90"
                        )}
                    >
                        {isPublishing ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Publishing to Feed...</span>
                            </>
                        ) : (
                            <>
                                <Video className="w-5 h-5" />
                                <span>Go Live</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Success Overlay */}
            {publishStatus === 'SUCCESS' && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md animate-fade-in">
                    <div className="text-center">
                        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle2 className="w-10 h-10 text-green-400" />
                        </div>
                        <h2 className="text-3xl font-bold mb-2">Reel Published!</h2>
                        <p className="text-white/40">Your content is now being boosted in the shopper feed.</p>
                    </div>
                </div>
            )}
        </div>
    );
}

function Tag({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z" /><circle cx="7.5" cy="7.5" r=".5" fill="currentColor" />
        </svg>
    );
}
