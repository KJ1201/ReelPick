'use client';

import { useState } from 'react';
import { ShoppingBag, ChevronLeft, CreditCard, Trash2, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { MOCK_PRODUCTS } from '@/data/mockProducts';

interface CartItem {
    id: string;
    name: string;
    price: number;
    qty: number;
    image: string;
}

interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    items?: CartItem[];
}

export function CartDrawer({ isOpen, onClose, items = [] }: CartDrawerProps) {
    const [cartState, setCartState] = useState<'REVIEW' | 'PROCESSING' | 'SUCCESS'>('REVIEW');

    // For the MVP, we use mock items if none passed
    const cartItems = items.length > 0 ? items : [
        {
            id: MOCK_PRODUCTS[0].id,
            name: MOCK_PRODUCTS[0].name,
            price: MOCK_PRODUCTS[0].price,
            qty: 1,
            image: MOCK_PRODUCTS[0].image
        }
    ];

    const totalAmount = cartItems.reduce((acc, i) => acc + (i.price * i.qty), 0);

    const handleClose = () => {
        onClose();
        setTimeout(() => {
            setCartState('REVIEW');
        }, 400);
    };

    const handleCheckout = async () => {
        setCartState('PROCESSING');

        // Simulate Razorpay processing via our backend endpoint
        try {
            const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ items: cartItems, totalAmount })
            });

            await res.json();

            // We simulate Razorpay payment success window since getting real UI requires
            // adding the raw window.Razorpay script to layout which can be finicky in MVP
            setTimeout(() => {
                setCartState('SUCCESS');
            }, 3000);

        } catch (e) {
            console.error(e);
            setCartState('REVIEW');
        }
    };

    return (
        <>
            <div
                className={cn(
                    "fixed inset-0 bg-black/60 backdrop-blur-[2px] z-[300] transition-opacity duration-300",
                    isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
                onClick={cartState === 'PROCESSING' ? undefined : handleClose}
            />

            <div
                className={cn(
                    "fixed bottom-0 bg-ink-80 border-t border-white/10 rounded-t-3xl z-[310] flex flex-col pt-3 shadow-[0_-8px_48px_rgba(0,0,0,0.80)] transition-transform duration-400 ease-[cubic-bezier(0.25,1.0,0.5,1)]",
                    "h-[85dvh]",
                    "left-0 right-0 w-full",
                    "md:left-1/2 md:right-auto md:w-[400px] md:-translate-x-1/2 md:border-x",
                    isOpen ? "translate-y-0" : "translate-y-[100%]"
                )}
            >
                <div className="w-10 h-1 rounded-full bg-white/20 mx-auto mb-4" />

                {cartState === 'REVIEW' && (
                    <div className="flex flex-col h-full px-4 pb-safe-bottom">
                        <div className="flex items-center justify-between mb-6 px-2">
                            <button onClick={handleClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-white/70 hover:text-white">
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <h2 className="text-white font-semibold text-[17px] flex items-center gap-2">
                                <ShoppingBag className="w-5 h-5" /> Your Cart
                            </h2>
                            <div className="w-10 h-10" />
                        </div>

                        <div className="flex-1 overflow-y-auto space-y-4 px-2">
                            {cartItems.map((item) => (
                                <div key={item.id} className="flex gap-4 p-3 bg-white/[0.03] border border-white/5 rounded-2xl items-center">
                                    <div className="relative w-[70px] h-[90px] rounded-xl overflow-hidden shrink-0">
                                        <Image src={item.image} alt={item.name} fill sizes="(max-width: 768px) 30vw, 20vw" className="object-cover" />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-center">
                                        <h3 className="text-white font-medium text-[15px] leading-snug line-clamp-1">{item.name}</h3>
                                        <span className="text-white/60 text-xs mt-1">Qty: {item.qty}</span>
                                        <span className="text-white font-bold text-lg mt-2">₹{item.price}</span>
                                    </div>
                                    <button className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 text-white/40 hover:text-white/80 transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="mt-auto py-6 mt-4 border-t border-white/10 px-2 space-y-4">
                            <div className="flex items-center justify-between">
                                <span className="text-white/70">Subtotal</span>
                                <span className="text-white font-medium">₹{totalAmount}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-white/70">Shipping</span>
                                <span className="text-green-400 font-medium tracking-wide">FREE</span>
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t border-white/5">
                                <span className="text-white font-semibold text-lg">Total</span>
                                <span className="text-white font-bold text-xl">₹{totalAmount}</span>
                            </div>

                            <button
                                onClick={handleCheckout}
                                className="w-full mt-4 h-14 rounded-full bg-gradient-to-br from-primary to-purple-500 text-white font-semibold flex items-center justify-center gap-2 shadow-[0_4px_16px_rgba(124,58,237,0.35)] active:scale-95 transition-transform text-[16px]"
                            >
                                <CreditCard className="w-5 h-5" /> Configure Payment
                            </button>
                        </div>
                    </div>
                )}

                {cartState === 'PROCESSING' && (
                    <div className="flex-1 flex flex-col items-center justify-center animate-fade-in">
                        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-6" />
                        <h3 className="text-white font-semibold text-lg mb-2">Connecting to Razorpay</h3>
                        <p className="text-white/50 text-sm">Testing sandbox payment routing...</p>
                    </div>
                )}

                {cartState === 'SUCCESS' && (
                    <div className="flex-1 flex flex-col items-center justify-center animate-fade-in px-6 text-center">
                        <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
                            <CheckCircle2 className="w-10 h-10 text-green-400" />
                        </div>
                        <h3 className="text-white font-bold text-2xl mb-3">Order Placed!</h3>
                        <p className="text-white/70 text-[15px] mb-8 leading-relaxed max-w-[85%]">
                            Your demo transaction was incredibly successful. A mock WhatsApp notification has been triggered.
                        </p>
                        <button
                            onClick={handleClose}
                            className="w-full h-12 rounded-full border border-white/20 bg-white/10 text-white font-semibold backdrop-blur-md active:scale-95 transition-transform flex items-center justify-center"
                        >
                            Go back to Feed
                        </button>
                    </div>
                )}

            </div>
        </>
    );
}
