import { useEffect, useState } from 'react';

export function useRafTime(active = true): number {
    const [t, setT] = useState(0);

    useEffect(() => {
        if (!active) return;

        let raf = 0;
        let start: number | null = null;

        const loop = (ts: number) => {
            if (start == null) start = ts;
            setT((ts - start) / 1000);
            raf = requestAnimationFrame(loop);
        };

        raf = requestAnimationFrame(loop);

        return () => cancelAnimationFrame(raf);
    }, [active]);

    return t;
}
