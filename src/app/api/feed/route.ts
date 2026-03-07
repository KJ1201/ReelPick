import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
    try {
        // Fetch reels with nested seller profile and product tags
        const { data, error } = await supabase
            .from('reels')
            .select(`
                id,
                video_url,
                caption,
                likes_count,
                shares_count,
                seller:profiles!reels_seller_id_fkey(
                    id,
                    username,
                    avatar_url
                ),
                tags:reel_tags(
                    product_id,
                    timestamp_start,
                    timestamp_end,
                    position_x,
                    position_y
                )
            `);

        if (error) {
            console.error("[Feed API] Database error:", error);
            // Fallback to empty if DB query fails during hackathon
            return NextResponse.json({ reels: [] });
        }

        // Map database structure to the expected Frontend 'Reel' type
        const mappedReels = (data || []).map(r => ({
            id: r.id,
            seller_id: r.seller?.id,
            seller_name: r.seller?.username || 'Official Seller',
            seller_avatar_url: r.seller?.avatar_url || 'https://via.placeholder.com/150',
            video_url: r.video_url,
            caption: r.caption,
            likes: r.likes_count || 0,
            shares: r.shares_count || 0,
            tags: r.tags || []
        }));

        return NextResponse.json({ reels: mappedReels });
    } catch (err: any) {
        console.error("[Feed API] Fatal error:", err);
        return NextResponse.json({ reels: [] }, { status: 500 });
    }
}
