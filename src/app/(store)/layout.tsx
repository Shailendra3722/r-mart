import { Navbar } from "@/components/store/Navbar";

export default function StoreLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <footer className="border-t bg-slate-50 py-12">
                <div className="container mx-auto px-4 text-center text-sm text-slate-500">
                    <p>© 2024 R Mart India Private Limited. All rights reserved.</p>
                    <div className="mt-4">
                        <a href="/admin/login" className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
                            Admin
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
