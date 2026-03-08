import { cn } from "@/lib/utils";

export function Skeleton({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn("animate-pulse rounded-md bg-white/5", className)}
            {...props}
        />
    );
}

export function ProductCardSkeleton() {
    return (
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden flex flex-col h-full">
            <Skeleton className="w-full aspect-[4/5] rounded-none" />
            <div className="p-4 space-y-3">
                <Skeleton className="h-3 w-1/3" />
                <Skeleton className="h-4 w-full" />
                <div className="flex justify-between items-center pt-2">
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-4 w-4 rounded-full" />
                </div>
            </div>
        </div>
    );
}

export function ProductDetailsSkeleton() {
    return (
        <div className="max-w-7xl mx-auto w-full p-6 md:p-12 space-y-12 animate-fade-in">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
                <Skeleton className="aspect-[3/4] w-full rounded-[40px]" />
                <div className="space-y-8 py-4">
                    <Skeleton className="h-4 w-32 rounded-full" />
                    <Skeleton className="h-16 md:h-24 w-full rounded-2xl" />
                    <Skeleton className="h-12 w-48 rounded-xl" />
                    <div className="space-y-4 pt-10">
                        <Skeleton className="h-4 w-24" />
                        <div className="flex gap-3">
                            {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="w-16 h-14 rounded-2xl" />)}
                        </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4 pt-6">
                        <Skeleton className="h-20 rounded-[24px]" />
                        <Skeleton className="h-20 rounded-[24px]" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export function InventoryItemSkeleton() {
    return (
        <div className="p-5 rounded-3xl bg-white/5 border border-white/5 flex gap-6">
            <Skeleton className="w-20 h-20 rounded-2xl shrink-0" />
            <div className="flex-1 space-y-3">
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-3 w-1/4" />
            </div>
            <div className="flex gap-2">
                <Skeleton className="h-10 w-24 rounded-full" />
                <Skeleton className="h-10 w-24 rounded-full" />
            </div>
        </div>
    );
}

export function CartItemSkeleton() {
    return (
        <div className="p-8 rounded-[40px] bg-white/5 border border-white/5 flex gap-8">
            <Skeleton className="w-32 h-40 rounded-3xl shrink-0" />
            <div className="flex-1 space-y-4 h-full flex flex-col justify-center">
                <Skeleton className="h-8 w-1/2" />
                <div className="flex gap-2">
                    <Skeleton className="h-5 w-16 rounded-full" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                </div>
                <Skeleton className="h-10 w-32" />
            </div>
        </div>
    );
}

export function ReelSkeleton() {
    return (
        <div className="w-full h-full relative bg-[#0A0A0B] overflow-hidden flex flex-col items-center">
            {/* Right Side Actions Skeleton */}
            <div className="absolute right-6 bottom-32 flex flex-col gap-6 items-center">
                {[1, 2, 3, 4].map(i => (
                    <div key={i} className="flex flex-col items-center gap-2">
                        <Skeleton className="w-14 h-14 rounded-full border border-white/5 active:scale-95 transition-transform" />
                        <Skeleton className="w-8 h-2 rounded-full opacity-20" />
                    </div>
                ))}
            </div>

            {/* Bottom Info Area Skeleton */}
            <div className="absolute left-6 bottom-8 right-24 space-y-4 max-w-md w-full">
                <div className="flex items-center gap-4">
                    <Skeleton className="w-12 h-12 rounded-full border border-white/10" />
                    <div className="space-y-2">
                        <Skeleton className="w-32 h-4 rounded-full" />
                        <Skeleton className="w-20 h-2.5 rounded-full opacity-30" />
                    </div>
                </div>

                <div className="space-y-3 pt-2">
                    <Skeleton className="w-full h-4 rounded-full opacity-60" />
                    <Skeleton className="w-2/3 h-4 rounded-full opacity-40" />
                </div>

                {/* Tag Skeleton */}
                <div className="pt-4">
                    <Skeleton className="w-40 h-14 rounded-full border border-white/10 bg-white/5 shadow-2xl" />
                </div>
            </div>

            {/* Progress Bar Container */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-white/5">
                <Skeleton className="w-1/3 h-full bg-primary/40 rounded-none shadow-[0_0_20px_rgba(var(--primary-rgb),0.5)]" />
            </div>
        </div>
    );
}

