'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './AuthContext';

interface CartContextType {
    cartCount: number;
    refreshCart: () => Promise<void>;
    addToCart: (productId: string, size?: string) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();
    const [cartCount, setCartCount] = useState(0);

    const refreshCart = useCallback(async () => {
        // Since we don't have a strict user check for simple cart count and use cart_items table
        // We'll just count all items in the table for the demo, or filter by user if possible
        try {
            const { count, error } = await supabase
                .from('cart_items')
                .select('*', { count: 'exact', head: true });

            if (!error) {
                setCartCount(count || 0);
            }
        } catch (err) {
            console.error("Error refreshing cart count:", err);
        }
    }, []);

    useEffect(() => {
        refreshCart();

        // Subscription for real-time updates
        const channel = supabase
            .channel('cart_updates')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'cart_items' }, () => {
                refreshCart();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [refreshCart]);

    const addToCart = async (productId: string, size: string = 'M') => {
        try {
            const { error } = await supabase
                .from('cart_items')
                .insert({
                    product_id: productId,
                    size,
                    quantity: 1
                });

            if (error) throw error;
            // Count will update via subscription
        } catch (err) {
            throw err;
        }
    };

    return (
        <CartContext.Provider value={{ cartCount, refreshCart, addToCart }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
