'use client';

import { Storefront } from '@/components/store/Storefront';
import { Sidebar } from '@/components/common/Sidebar';
import { MobileNav } from '@/components/common/MobileNav';
import { useRouter } from 'next/navigation';

export default function StorePage() {
    const router = useRouter();

    return (
        <div className="w-full h-[100dvh] flex bg-black text-white overflow-hidden">
            <Sidebar />
            <main className="flex-1 relative h-full bg-ink-100 flex flex-col">
                <Storefront onProductClick={(id) => router.push(`/product/${id}`)} />
                <MobileNav />
            </main>
        </div>
    );
}
