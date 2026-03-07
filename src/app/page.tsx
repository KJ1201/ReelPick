'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/reels');
  }, [router]);

  return (
    <div className="w-full h-screen bg-black flex flex-col items-center justify-center gap-6">
      <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin shadow-[0_0_32px_rgba(var(--primary-rgb),0.2)]" />
      <div className="flex flex-col items-center">
        <h1 className="text-4xl font-display font-black tracking-tighter italic text-white mb-2">ReelShop</h1>
        <p className="text-white/40 text-[10px] uppercase font-bold tracking-[0.3em]">Accessing Global Feed...</p>
      </div>
    </div>
  );
}
