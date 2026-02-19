const mongoose = require('../node_modules/mongoose');

const uri = process.env.MONGODB_URI;

if (!uri) {
    console.error('Error: MONGODB_URI is not defined.');
    process.exit(1);
}

// Define simple schema for seeding
const productSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String, required: true },
    stock: { type: Number, required: true, default: 0 },
    status: { type: String, default: 'In Stock' },
    createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

const initialProducts = [
    {
        id: '1',
        name: 'Classic White T-Shirt',
        description: 'Premium quality 100% cotton t-shirt. Soft, breathable fabric perfect for daily wear.',
        category: 'Men',
        price: 499,
        stock: 120,
        status: 'In Stock',
        image: '/placeholder.png',
    },
    {
        id: '2',
        name: 'Floral Summer Dress',
        description: 'Beautiful floral print dress made from lightweight chiffon. Ideal for summer outings.',
        category: 'Women',
        price: 1299,
        stock: 5,
        status: 'Low Stock',
        image: '/placeholder.png',
    },
    {
        id: '3',
        name: 'Kids Denim Jeans',
        description: 'Durable and comfortable denim jeans for kids. Stretchable fabric for active play.',
        category: 'Kids',
        price: 799,
        stock: 0,
        status: 'Out of Stock',
        image: '/placeholder.png',
    },
    {
        id: '4',
        name: 'Formal Blue Shirt',
        description: 'Crisp cotton blend formal shirt. Wrinkle-resistant fabric suitable for office wear.',
        category: 'Men',
        price: 899,
        stock: 45,
        status: 'In Stock',
        image: '/placeholder.png',
    },
];

async function seed() {
    try {
        await mongoose.connect(uri);
        console.log('Connected to MongoDB.');

        const count = await Product.countDocuments();
        console.log(`Current product count: ${count}`);

        if (count === 0) {
            console.log('Database is empty. Seeding initial products...');
            await Product.insertMany(initialProducts);
            console.log('Seeding complete! Added 4 products.');
        } else {
            console.log('Database already has data. Skipping seed.');
        }

        await mongoose.disconnect();
        console.log('Disconnected.');
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
}

seed();
