import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Product } from '@/models';

export async function GET(request: Request) {
    try {
        await dbConnect();

        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const search = searchParams.get('search');

        let query: any = {};

        if (category && category !== 'All') {
            query.category = category;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } }
            ];
        }

        const products = await Product.find(query).sort({ createdAt: -1 });

        return NextResponse.json(products);
    } catch (error) {
        console.error("Database Error:", error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();

        // Basic validation
        if (!body.name || !body.price) {
            return NextResponse.json({ error: 'Name and price are required' }, { status: 400 });
        }

        const newProduct = await Product.create(body);
        return NextResponse.json(newProduct, { status: 201 });
    } catch (error) {
        console.error("Database Error:", error);
        return NextResponse.json({ error: `Failed to create product: ${(error as Error).message}` }, { status: 500 });
    }
}
