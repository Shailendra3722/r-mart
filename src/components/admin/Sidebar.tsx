import Link from "next/link";
import { LayoutDashboard, ShoppingBag, ShoppingCart, Users, BarChart, Settings } from "lucide-react";

const navigation = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: ShoppingBag },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { name: "Customers", href: "/admin/customers", icon: Users },
    { name: "Reports", href: "/admin/reports", icon: BarChart },
    { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function Sidebar() {
    return (
        <div className="flex h-full w-64 flex-col border-r bg-white text-slate-900">
            <div className="flex h-16 items-center border-b px-6">
                <h1 className="text-xl font-bold text-primary">R Mart Admin</h1>
            </div>
            <nav className="flex-1 space-y-1 px-3 py-4">
                {navigation.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className="group flex items-center rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-primary"
                    >
                        <item.icon className="mr-3 h-5 w-5 flex-shrink-0 text-slate-500 group-hover:text-primary" />
                        {item.name}
                    </Link>
                ))}
            </nav>
            <div className="border-t p-4">
                <Link href="/admin/settings" className="flex items-center hover:opacity-80 transition cursor-pointer">
                    <div className="ml-3">
                        <p className="text-sm font-medium text-slate-700">Admin User</p>
                        <p className="text-xs text-primary">View Profile</p>
                    </div>
                </Link>
            </div>
        </div>
    );
}
