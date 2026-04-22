import { useEffect, useRef, useState } from 'react';

export function useInView<T extends Element = HTMLDivElement>(
    options: IntersectionObserverInit = { threshold: 0.15 },
): [React.RefObject<T | null>, boolean] {
    const ref = useRef<T | null>(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const el = ref.current;

        if (!el) return;

        const io = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) setInView(true);
        }, options);

        io.observe(el);

        return () => io.disconnect();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return [ref, inView];
}
