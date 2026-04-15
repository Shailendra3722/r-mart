export type Product = {
    id: string;
    name: string;
    description?: string; // detailed fabric/quality info
    category: 'Men' | 'Women' | 'Kids';
    price: number;
    discount?: number; // Discount percentage (0-100)
    stock: number;
    status: 'In Stock' | 'Low Stock' | 'Out of Stock';
    image: string; // Main image
    images?: string[]; // Additional images
    sizes?: string[]; // e.g., ['S', 'M', 'L']
    colors?: string[]; // e.g., ['Red', 'Blue']
    avgRating?: number; // Average rating from reviews
    reviewCount?: number; // Total number of reviews
};

export const initialProducts: Product[] = [
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
    },
    {
        id: '6',
        name: 'Men\'s Leather Classic Watch',
        description: 'A sophisticated analog watch with a genuine brown leather strap and a minimalist white dial. Water resistant and perfect for both casual and formal settings.',
        category: 'Men',
        price: 3499,
        discount: 0,
        stock: 25,
        status: 'In Stock',
        image: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        sizes: ['Free Size'],
        colors: ['Brown', 'Black'],
    },
    {
        id: '7',
        name: 'Premium Leather Handbag',
        description: 'Elegant and spacious premium leather handbag. Features multiple compartments and a sturdy shoulder strap for everyday utility and fashion.',
        category: 'Women',
        price: 4599,
        discount: 25,
        stock: 10,
        status: 'Low Stock',
        image: 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        sizes: ['Free Size'],
        colors: ['Tan', 'Black', 'Red'],
    },
    {
        id: '8',
        name: 'Classic White Sneakers',
        description: 'Timeless white sneakers with a durable rubber sole and a comfortable cushioned insole. Perfect for long walks and versatile styling.',
        category: 'Men',
        price: 2999,
        discount: 10,
        stock: 80,
        status: 'In Stock',
        image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        sizes: ['7', '8', '9', '10', '11'],
        colors: ['White'],
    },
    {
        id: '9',
        name: 'Cozy Fleece Hoodie',
        description: 'Ultra-soft fleece-lined hoodie designed for chilly lazy days or active workouts. Features a pouch pocket and adjustable drawstrings.',
        category: 'Men',
        price: 1999,
        discount: 0,
        stock: 150,
        status: 'In Stock',
        image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        colors: ['Grey', 'Navy', 'Black'],
    },
    {
        id: '10',
        name: 'Elegant Pearl Necklace',
        description: 'A stunning faux-pearl necklace with a gold-plated clasp. Adds a touch of timeless elegance to any evening wear or formal attire.',
        category: 'Women',
        price: 999,
        discount: 15,
        stock: 40,
        status: 'In Stock',
        image: 'https://images.unsplash.com/photo-1599643478524-fb66f7ca24ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        sizes: ['Free Size'],
        colors: ['Pearl White'],
    }
];

export type Order = {
    id: string;
    customer: string;
    date: string;
    amount: number;
    status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
    items: number;
};

export const initialOrders: Order[] = [
    { id: 'RM-8842', customer: 'Arjun Singh', date: 'Oct 24, 2023', amount: 2450, status: 'Delivered', items: 3 },
    { id: 'RM-8841', customer: 'Meena Patel', date: 'Oct 24, 2023', amount: 1800, status: 'Pending', items: 2 },
    { id: 'RM-8840', customer: 'Rahul Sharma', date: 'Oct 23, 2023', amount: 4200, status: 'Shipped', items: 5 },
    { id: 'RM-8839', customer: 'Kavita Verma', date: 'Oct 23, 2023', amount: 850, status: 'Cancelled', items: 1 },
];
