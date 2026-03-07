export interface Product {
    id: string;
    seller_id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    image_url: string;
    seller_name?: string;
    seller_avatar_url?: string;
}

export interface ProductTagInfo {
    product_id: string;
    timestampStart: number; // Video time when tag should appear
    timestampEnd: number; // Video time when tag should disappear
    positionX: number; // Percentage X coordinate (0-100)
    positionY: number; // Percentage Y coordinate (0-100)
}

export interface Reel {
    id: string;
    seller_id: string;
    video_url: string;
    caption: string;
    tags: ProductTagInfo[];
    seller_name?: string;
    seller_avatar_url?: string;
    likes?: number;
    shares?: number;
}
