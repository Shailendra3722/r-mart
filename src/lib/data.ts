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
};

export const initialProducts: Product[] = [
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
