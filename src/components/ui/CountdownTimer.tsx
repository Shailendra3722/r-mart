"use client";

import { useState, useEffect } from "react";

export function CountdownTimer({ targetDate }: { targetDate: Date }) {
    const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; seconds: number }>({
        hours: 0,
        minutes: 0,
        seconds: 0,
    });

    useEffect(() => {
        const calculateTimeLeft = () => {
            const difference = +targetDate - +new Date();

            if (difference > 0) {
                return {
                    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((difference / 1000 / 60) % 60),
                    seconds: Math.floor((difference / 1000) % 60),
                };
            }
            return { hours: 0, minutes: 0, seconds: 0 };
        };

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    const formatTime = (time: number) => time.toString().padStart(2, "0");

    return (
        <div className="flex items-center gap-2 text-lg font-bold text-slate-700">
            <div className="rounded bg-white px-2 py-1 shadow-sm">{formatTime(timeLeft.hours)}h</div> :
            <div className="rounded bg-white px-2 py-1 shadow-sm">{formatTime(timeLeft.minutes)}m</div> :
            <div className="rounded bg-white px-2 py-1 shadow-sm">{formatTime(timeLeft.seconds)}s</div>
        </div>
    );
}
