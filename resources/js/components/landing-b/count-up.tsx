import { useEffect, useState } from 'react';

import { useInView } from '@/hooks/use-in-view';

type Props = {
    to: number;
    duration?: number;
    prefix?: string;
    suffix?: string;
    decimals?: number;
};

export default function CountUp({
    to,
    duration = 1400,
    prefix = '',
    suffix = '',
    decimals = 0,
}: Props) {
    const [ref, inView] = useInView<HTMLSpanElement>();
    const [v, setV] = useState(0);

    useEffect(() => {
        if (!inView) return;

        let raf = 0;
        let start: number | null = null;

        const step = (ts: number) => {
            if (start == null) start = ts;
            const p = Math.min(1, (ts - start) / duration);
            const eased = 1 - Math.pow(1 - p, 3);

            setV(eased * to);

            if (p < 1) raf = requestAnimationFrame(step);
        };

        raf = requestAnimationFrame(step);

        return () => cancelAnimationFrame(raf);
    }, [inView, to, duration]);

    return (
        <span ref={ref}>
            {prefix}
            {v.toFixed(decimals)}
            {suffix}
        </span>
    );
}
