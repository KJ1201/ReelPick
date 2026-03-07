import { NextRequest, NextResponse } from 'next/server';
import { Client } from "@gradio/client";
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini for the styling advice
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
    try {
        const formData = await req.formData();
        const userImage = formData.get('user_image') as Blob | null;
        const garmentImageUrl = formData.get('garment_image_url') as string | null;
        const garmentDescription = (formData.get('garment_description') as string) || 'Fashion garment';
        const productId = formData.get('product_id') as string || 'p_001';

        if (!userImage || !garmentImageUrl) {
            return NextResponse.json({ error: 'Missing images for try-on' }, { status: 400 });
        }

        console.log(`[VTON] Starting Hugging Face pipeline for product: ${productId} (${garmentDescription})`);

        // --- STEP 1: PARALLEL GEMINI ADVICE ---
        const geminiPromise = (async () => {
            try {
                const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
                const imageBuffer = await userImage.arrayBuffer();
                const base64Image = Buffer.from(imageBuffer).toString('base64');

                const prompt = `Analyze this person's posture and lighting for a virtual try-on of "${garmentDescription}". Give ONE short positive styling tip (max 10 words). Return ONLY JSON: { "style_tip": "string" }`;
                const result = await model.generateContent([
                    prompt,
                    { inlineData: { data: base64Image, mimeType: userImage.type || 'image/jpeg' } }
                ]);
                const text = result.response.text();
                const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
                return JSON.parse(cleaned).style_tip;
            } catch (e) {
                console.error("[VTON] Gemini Tip Error:", e);
                return "You're going to look amazing in this!";
            }
        })();

        // --- STEP 2: HUGGING FACE INFERENCE ---
        try {
            // IDM-VTON is the industry standard for realistic virtual try-on
            const hfApp = await Client.connect("yisol/IDM-VTON", {
                token: process.env.HUGGINGFACE_API_KEY as `hf_${string}`
            });

            // Prepare Blobs
            const userImageBuffer = await userImage.arrayBuffer();
            const userImageBlob = new Blob([userImageBuffer], { type: userImage.type });

            const garmRes = await fetch(garmentImageUrl);
            const garmBlob = await garmRes.blob();

            // Perform Inference
            // API Signature for yisol/IDM-VTON:
            // [ImageEditor, GarmentImage, Description, IsChecked, IsCheckedCrop, Steps, Seed]
            const result = await hfApp.predict("/tryon", [
                { "background": userImageBlob, "layers": [], "composite": null },
                garmBlob,
                garmentDescription,
                true, // is_checked
                true, // is_checked_crop
                30,   // steps
                42    // seed
            ]);

            const styleTip = await geminiPromise;

            if (result.data && Array.isArray(result.data) && result.data[0]) {
                const outputImage = result.data[0] as any;
                const finalImageUrl = typeof outputImage === 'string' ? outputImage : outputImage.url;

                console.log("[VTON] Result Success:", finalImageUrl);

                return NextResponse.json({
                    success: true,
                    try_on_url: finalImageUrl,
                    confidence_score: 95,
                    style_tip: styleTip
                });
            } else {
                throw new Error("Invalid results from API");
            }

        } catch (hfError: any) {
            console.error("[VTON] HF Backend Error:", hfError.message || hfError);

            // Queue Handling & Quota management
            if (hfError.message?.toLowerCase().includes("queue") ||
                hfError.message?.toLowerCase().includes("rate limit") ||
                hfError.status === 504 || hfError.status === 503 || hfError.status === 502) {
                return NextResponse.json({
                    error: "HuggingFace servers are heavily loaded. Please wait a few moments and try again."
                }, { status: 503 });
            }

            return NextResponse.json({ error: "AI Generation failed. Please try a different photo." }, { status: 500 });
        }

    } catch (error: any) {
        console.error("[VTON] Fatal Route Error:", error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
