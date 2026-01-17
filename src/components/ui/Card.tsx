import { ReactNode } from 'react';
import ScaleHover from '../animations/ScaleHover';

export function Card({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <ScaleHover className={`rounded-lg bg-white shadow-sm ${className}`}>
            {children}
        </ScaleHover>
    );
}
