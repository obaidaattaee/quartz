import { useCallback, useEffect, useRef, useState } from 'react';

import { useInView } from 'motion/react';

import { useReducedMotion } from '@/hooks/use-reduced-motion';

export function useCounter(
    target: number,
    duration: number = 2000,
): { ref: React.RefObject<HTMLDivElement | null>; count: number } {
    const ref = useRef<HTMLDivElement | null>(null);
    const isInView = useInView(ref, { once: true, amount: 0.5 });
    const shouldReduceMotion = useReducedMotion();
    const [count, setCount] = useState(0);
    const hasAnimated = useRef(false);

    const animate = useCallback(() => {
        if (hasAnimated.current) {
            return;
        }

        hasAnimated.current = true;

        if (shouldReduceMotion) {
            setCount(target);

            return;
        }

        const startTime = performance.now();

        const step = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease-out quad: 1 - (1 - t)^2
            const eased = 1 - (1 - progress) * (1 - progress);
            const currentValue = Math.round(eased * target);

            setCount(currentValue);

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                setCount(target);
            }
        };

        requestAnimationFrame(step);
    }, [target, duration, shouldReduceMotion]);

    useEffect(() => {
        if (isInView) {
            animate();
        }
    }, [isInView, animate]);

    return { ref, count };
}
