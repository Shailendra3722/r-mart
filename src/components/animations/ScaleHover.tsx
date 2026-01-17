"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

type ScaleHoverProps = {
    children: ReactNode;
    className?: string;
    scale?: number;
};

export default function ScaleHover({
    children,
    className = "",
    scale = 1.05
}: ScaleHoverProps) {
    return (
        <motion.div
            whileHover={{ scale: scale }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
