import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(request: Request) {
    try {
        // Check if OpenAI API key is configured
        if (!process.env.OPENAI_API_KEY) {
            return NextResponse.json(
                { error: 'OpenAI API key is not configured. Please add OPENAI_API_KEY to your .env.local file.' },
                { status: 500 }
            );
        }

        // Initialize OpenAI client
        const openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        // Parse request body
        const body = await request.json();
        const { productName } = body;

        // Validate input
        if (!productName || productName.trim() === '') {
            return NextResponse.json(
                { error: 'Product name is required' },
                { status: 400 }
            );
        }

        // Generate description using OpenAI
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are a professional e-commerce product description writer. Create concise, engaging, and SEO-friendly product descriptions for clothing items. Each description should be 100-150 words and include details about fabric quality, fit, style, and care instructions. Use a professional yet friendly tone."
                },
                {
                    role: "user",
                    content: `Write a product description for: ${productName}`
                }
            ],
            temperature: 0.7,
            max_tokens: 200,
        });

        const description = completion.choices[0]?.message?.content?.trim();

        if (!description) {
            return NextResponse.json(
                { error: 'Failed to generate description' },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            description: description
        });

    } catch (error: any) {
        console.error('OpenAI API Error:', error);

        // Handle specific OpenAI errors
        if (error?.status === 401) {
            return NextResponse.json(
                { error: 'Invalid OpenAI API key. Please check your API key in .env.local' },
                { status: 500 }
            );
        }

        if (error?.status === 429) {
            return NextResponse.json(
                { error: 'OpenAI API rate limit exceeded. Please try again later.' },
                { status: 429 }
            );
        }

        if (error?.code === 'ENOTFOUND' || error?.code === 'ETIMEDOUT') {
            return NextResponse.json(
                { error: 'Network error. Please check your internet connection.' },
                { status: 503 }
            );
        }

        return NextResponse.json(
            { error: `Failed to generate description: ${error?.message || 'Unknown error'}` },
            { status: 500 }
        );
    }
}
