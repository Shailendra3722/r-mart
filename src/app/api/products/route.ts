import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { Product } from '@/models';

export const dynamic = 'force-dynamic';

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

        let products = await Product.find(query).sort({ createdAt: -1 });

        // Auto-seed if database is empty and no specific query filters are applied
        if (products.length === 0 && !search && (!category || category === 'All')) {
            const { initialProducts } = await import('@/lib/data');
            try {
                await Product.insertMany(initialProducts);
                products = await Product.find(query).sort({ createdAt: -1 });
                console.log("Auto-seeded initial realistic products into MongoDB");
            } catch (seedError) {
                console.error("Failed to auto-seed database:", seedError);
                // Return in-memory initialProducts as a fallback
                return NextResponse.json(initialProducts);
            }
        }

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

export async function PUT(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const { id, ...updateData } = body;

        if (!id) {
            return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
        }

        const updatedProduct = await Product.findOneAndUpdate(
            { id },
            { $set: updateData },
            { new: true }
        );

        if (!updatedProduct) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json(updatedProduct);
    } catch (error) {
        console.error("Database Error:", error);
        return NextResponse.json({ error: `Failed to update product: ${(error as Error).message}` }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        await dbConnect();
        const body = await request.json();
        const { id } = body;

        if (!id) {
            return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
        }

        const deletedProduct = await Product.findOneAndDelete({ id });

        if (!deletedProduct) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Product deleted' });
    } catch (error) {
        console.error("Database Error:", error);
        return NextResponse.json({ error: `Failed to delete product: ${(error as Error).message}` }, { status: 500 });
    }
}
