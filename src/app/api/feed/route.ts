import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const { data, error } = await supabase
            .from('reels')
            .select(`
                id,
                video_url,
                caption,
                likes_count,
                shares_count,
                created_at,
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
            `)
            .order('created_at', { ascending: false });

        if (error || !data || data.length === 0) {
            console.log("[Feed API] No data found in DB.");
            return NextResponse.json({ reels: [] });
        }

        const mappedReels = data.map(r => {
            const seller = Array.isArray(r.seller) ? r.seller[0] : r.seller;

            // Map tags from snake_case to camelCase as expected by TaskInfo interface
            const mappedTags = (r.tags || []).map((t: any) => ({
                product_id: t.product_id,
                timestampStart: parseFloat(t.timestamp_start),
                timestampEnd: parseFloat(t.timestamp_end),
                positionX: parseFloat(t.position_x),
                positionY: parseFloat(t.position_y)
            }));

            return {
                id: r.id,
                seller_id: seller?.id,
                seller_name: seller?.username || 'Official Seller',
                seller_avatar_url: seller?.avatar_url || 'https://via.placeholder.com/150',
                video_url: r.video_url,
                caption: r.caption,
                likes: r.likes_count || 0,
                shares: r.shares_count || 0,
                tags: mappedTags
            };
        });

        return NextResponse.json({ reels: mappedReels });
    } catch (err: any) {
        console.error("[Feed API] Fatal error:", err);
        return NextResponse.json({ reels: [] });
    }
}


