import mongoose from "mongoose";

const MONGODB_URI = "mongodb+srv://shailendra8052:Sonu3722@cluster0.kqjxhuj.mongodb.net/rmart?retryWrites=true&w=majority";

const productSchema = new mongoose.Schema({
    id: String,
    name: String,
    description: String,
    category: String,
    price: Number,
    discount: Number,
    stock: Number,
    status: String,
    image: String,
    images: [String],
    sizes: [String],
    colors: [String],
    avgRating: Number,
    reviewCount: Number
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

const initialProducts = [
    {
        id: '1',
        name: 'Premium White Cotton T-Shirt',
        description: 'A classic, high-quality 100% cotton t-shirt for men. Soft, breathable, and designed for ultimate comfort and an excellent fit. The perfect everyday essential.',
        category: 'Men',
        price: 899,
        discount: 10,
        stock: 120,
        status: 'In Stock',
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        images: ['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'],
        sizes: ['S', 'M', 'L', 'XL'],
        colors: ['White', 'Black'],
    },
    {
        id: '2',
        name: 'Classic Blue Denim Jeans',
        description: 'Authentic 5-pocket styling premium blue denim jeans. Durable, comfortable and slightly stretchable for all-day wear. An iconic wardrobe staple.',
        category: 'Men',
        price: 2499,
        discount: 15,
        stock: 45,
        status: 'In Stock',
        image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        sizes: ['30', '32', '34', '36'],
        colors: ['Blue', 'Black'],
    },
    {
        id: '3',
        name: 'Women\'s Floral Summer Dress',
        description: 'Beautiful floral print dress made from lightweight, flowy chiffon. Features a flattering silhouette perfect for summer outings and beach days.',
        category: 'Women',
        price: 1899,
        discount: 5,
        stock: 15,
        status: 'Low Stock',
        image: 'https://images.unsplash.com/photo-1515347619362-7ddbf0f1c304?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        sizes: ['S', 'M', 'L'],
        colors: ['Floral', 'Pink'],
    },
    {
        id: '4',
        name: 'Kids Playful Graphic T-Shirt',
        description: 'Vibrant and fun graphic t-shirt for kids. Made with super soft, hypoallergenic cotton to keep them comfortable all day long.',
        category: 'Kids',
        price: 599,
        stock: 0,
        status: 'Out of Stock',
        image: 'https://images.unsplash.com/photo-1519241978701-447551065166?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        sizes: ['4-5Y', '6-7Y', '8-9Y'],
        colors: ['Yellow', 'Red'],
    },
    {
        id: '5',
        name: 'Slim Fit Black Chino Pants',
        description: 'Versatile slim fit chino pants perfect for casual Fridays or weekend outings. Premium stretch-cotton blend provides superior comfort.',
        category: 'Men',
        price: 1599,
        discount: 20,
        stock: 60,
        status: 'In Stock',
        image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        sizes: ['30', '32', '34', '36'],
        colors: ['Black', 'Khaki'],
    }
];

async function seed() {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to DB');
    await Product.deleteMany({});
    console.log('Cleared existing products');
    await Product.insertMany(initialProducts);
    console.log('Inserted new products successfully!');
    mongoose.disconnect();
}

seed().catch(console.error);
