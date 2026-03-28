import { motion } from 'motion/react';
import type { ReactNode } from 'react';

import { useReducedMotion } from '@/hooks/use-reduced-motion';
import {
    fadeInUp,
    staggerContainer,
    defaultTransition,
    heroEntrance,
    heroTransition,
} from '@/lib/animations';
import { cn } from '@/lib/utils';

type Props = {
    children: ReactNode;
    delay?: number;
    className?: string;
    variant?: 'default' | 'hero' | 'stagger';
    as?: 'div' | 'section' | 'article' | 'ul';
};

export default function ScrollReveal({
    children,
    delay = 0,
    className,
    variant = 'default',
    as = 'div',
}: Props) {
    const shouldReduceMotion = useReducedMotion();

    if (variant === 'stagger') {
        const Component = motion.create(as);

        return (
            <Component
                initial={shouldReduceMotion ? false : 'hidden'}
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={staggerContainer}
                className={className}
            >
                {children}
            </Component>
        );
    }

    const isHero = variant === 'hero';
    const variants = isHero ? heroEntrance : fadeInUp;
    const transition = isHero ? heroTransition : defaultTransition;
    const Component = motion.create(as);

    return (
        <Component
            initial={shouldReduceMotion ? false : 'hidden'}
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={variants}
            transition={{ ...transition, delay }}
            className={cn(className)}
        >
            {children}
        </Component>
    );
}
