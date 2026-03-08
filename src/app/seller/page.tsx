'use client';

import { SellerDashboard } from '@/components/seller/SellerDashboard';
import { Sidebar } from '@/components/common/Sidebar';
import { MobileNav } from '@/components/common/MobileNav';
import { useRouter } from 'next/navigation';

import { useAuth } from '@/context/AuthContext';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function SellerPage() {
    const router = useRouter();
    const { user, loading } = useAuth();

    useEffect(() => {
        if (!loading && !user) {
            router.push(`/auth?next=${encodeURIComponent(window.location.pathname)}`);
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return (
            <div className="w-full h-[100dvh] bg-black flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-white/10" />
            </div>
        );
    }

    return (
        <div className="w-full h-[100dvh] flex bg-black text-white overflow-hidden">
            <Sidebar />
            <main className="flex-1 relative h-full bg-ink-100 flex flex-col">
                <SellerDashboard onProductView={(id) => router.push(`/product/${id}`)} />
                <MobileNav />
            </main>
        </div>
    );
}
