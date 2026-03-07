import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { items, totalAmount } = body;

        // Validate request
        if (!items || !totalAmount) {
            return NextResponse.json({ error: 'Invalid order details' }, { status: 400 });
        }

        // Initialize Razorpay
        // For MVP sandbox, replacing secrets if not present in env
        // Ideally we would enforce env vars using validation
        const rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_mockkeyid123',
            key_secret: process.env.RAZORPAY_KEY_SECRET || 'rzp_test_mocksecret456',
        });

        // Options for order
        const options = {
            amount: Math.round(totalAmount * 100), // convert to paise
            currency: "INR",
            receipt: `receipt_order_${Date.now()}`,
        };

        // Create a mock order if keys are truly empty to not break MVP flow when no keys set
        if (!process.env.RAZORPAY_KEY_ID) {
            console.warn("Using mock Razorpay generation for hackathon presentation because no keys were found.");
            return NextResponse.json({
                order: {
                    id: `order_${Date.now()}_mock`,
                    amount: options.amount,
                    currency: options.currency
                }
            });
        }

        const order = await rzp.orders.create(options);
        return NextResponse.json({ order });

    } catch (error) {
        console.error("Order creation failed:", error);
        return NextResponse.json({ error: 'Internal Server Error during checkout' }, { status: 500 });
    }
}
