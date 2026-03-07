import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini client
const apiKey = process.env.GEMINI_API_KEY!;
const genAI = new GoogleGenerativeAI(apiKey);

export async function POST(req: Request) {
    try {
        const { productDescr, productCategory } = await req.json();

        if (!productDescr) {
            return NextResponse.json({ error: 'Product description is required' }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

        const prompt = `
            You are an expert Instagram and TikTok social media manager for a trendy fashion/e-commerce brand.
            Your job is to write a highly engaging, viral caption for a short-form video (Reel/TikTok) showcasing a product.
            
            Product Information:
            - Description: ${productDescr}
            - Category: ${productCategory || 'General Merchandise'}
            
            Constraints:
            - Keep the caption under 250 characters (excluding hashtags).
            - Use 2-3 engaging emojis that match the vibe.
            - Include exactly 4 highly targeted, trending hashtags at the end.
            - Do not include any greeting or conversational filler like "Here is the caption". Output ONLY the caption and hashtags.
            - Create a strong hook in the first sentence.
        `;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        return NextResponse.json({ caption: text.trim() });
    } catch (error: any) {
        console.error('Error generating caption with Gemini:', error);
        return NextResponse.json(
            { error: 'Failed to generate caption. ' + error?.message },
            { status: 500 }
        );
    }
}
