"use client";
import React, { useState, useEffect } from 'react';

const AnimatedStats = ({ end, duration = 2000, suffix = '' } : any) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTimestamp : any = null;
        const step = (timestamp : any) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            setCount(Math.floor(progress * end));
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }, [end, duration]);

    return <span>{count.toLocaleString()}{suffix}</span>;
};

export default AnimatedStats;