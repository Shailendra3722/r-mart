import { Bell, Search } from "lucide-react";

export function Header() {
    return (
        <header className="flex h-16 items-center justify-between border-b bg-white px-6">
            <div className="flex items-center">
                <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                        <Search className="h-4 w-4 text-slate-400" />
                    </span>
                    <input
                        type="text"
                        placeholder="Search..."
                        className="block w-full rounded-md border-0 py-1.5 pl-10 pr-3 text-slate-900 ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-primary sm:text-sm sm:leading-6"
                    />
                </div>
            </div>
            <div className="flex items-center gap-4">
                <button className="relative p-1 text-slate-400 hover:text-slate-500">
                    <Bell className="h-6 w-6" />
                    <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
                </button>
            </div>
        </header>
    );
}
