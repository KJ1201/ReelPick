import { Loader2 } from 'lucide-react';

export default function Loading() {
    return (
        <div className="fixed inset-0 bg-[#0A0A0B] flex flex-col items-center justify-center gap-6 z-[1000]">
            <div className="relative">
                <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl animate-pulse" />
                <Loader2 className="w-12 h-12 text-primary animate-spin relative z-10" />
            </div>
            <div className="text-center">
                <h1 className="text-2xl font-display font-black tracking-tight text-white/90">
                    Reel<span className="text-primary">Shop</span>
                </h1>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 mt-2">
                    Synchronizing Feed Assets...
                </p>
            </div>
        </div>
    );
}
