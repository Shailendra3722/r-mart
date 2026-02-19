"use client";

import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export function Loading() {
    return (
        <div className="flex h-[50vh] w-full items-center justify-center">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
                <Loader2 className="h-10 w-10 text-emerald-600" />
            </motion.div>
        </div>
    );
}
