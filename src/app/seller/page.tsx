'use client';

import { SellerDashboard } from '@/components/seller/SellerDashboard';
import { Sidebar } from '@/components/common/Sidebar';
import { MobileNav } from '@/components/common/MobileNav';
import { useRouter } from 'next/navigation';

export default function SellerPage() {
    const router = useRouter();

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
