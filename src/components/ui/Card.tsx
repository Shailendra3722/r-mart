export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
    return <div className={`rounded-lg bg-white shadow-sm ${className}`}>{children}</div>;
}
