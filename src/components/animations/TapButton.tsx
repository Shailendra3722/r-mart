"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

type TapButtonProps = {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
    disabled?: boolean;
    type?: "button" | "submit" | "reset";
};

export default function TapButton({
    children,
    className = "",
    onClick,
    disabled = false,
    type = "button"
}: TapButtonProps) {
    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            className={className}
            onClick={onClick}
            disabled={disabled}
            type={type}
        >
            {children}
        </motion.button>
    );
}
