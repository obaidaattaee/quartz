import { Link } from '@inertiajs/react';
import { motion } from 'motion/react';

import { Button } from '@/components/ui/button';
import { useLocale } from '@/hooks/use-locale';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import {
    fadeInUp,
    heroEntrance,
    heroTransition,
    staggerContainer,
} from '@/lib/animations';

const floatingShapes = [
    {
        className:
            'absolute top-20 left-[10%] h-64 w-64 rounded-full bg-primary/5',
        animate: { y: [0, -20, 0], rotate: [0, 10, 0] },
        duration: 8,
    },
    {
        className:
            'absolute top-40 right-[15%] h-48 w-48 rounded-2xl bg-primary/8',
        animate: { y: [0, 15, 0], rotate: [0, -8, 0] },
        duration: 10,
    },
    {
        className:
            'absolute bottom-32 left-[20%] h-36 w-36 rounded-full bg-primary/5',
        animate: { y: [0, 12, 0], rotate: [0, 5, 0] },
        duration: 7,
    },
    {
        className:
            'absolute bottom-48 right-[25%] h-56 w-28 rounded-2xl bg-primary/8',
        animate: { y: [0, -18, 0], rotate: [0, -12, 0] },
        duration: 9,
    },
];

export default function HeroSection() {
    const { locale, t } = useLocale();
    const shouldReduceMotion = useReducedMotion();

    return (
        <section className="relative flex min-h-screen items-center overflow-hidden bg-gradient-to-br from-background via-background to-primary/10 dark:from-background dark:via-background dark:to-primary/20">
            {/* Floating geometric shapes */}
            {!shouldReduceMotion &&
                floatingShapes.map((shape, i) => (
                    <motion.div
                        key={i}
                        className={shape.className}
                        animate={shape.animate}
                        transition={{
                            duration: shape.duration,
                            repeat: Infinity,
                            ease: 'easeInOut',
                        }}
                    />
                ))}

            {/* Content */}
            <motion.div
                className="relative z-10 mx-auto max-w-7xl px-4 pb-20 pt-32 sm:px-6 lg:px-8"
                initial={shouldReduceMotion ? false : 'hidden'}
                animate="visible"
                variants={staggerContainer}
            >
                <motion.h1
                    className="text-4xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl"
                    variants={heroEntrance}
                    transition={heroTransition}
                >
                    {t('hero.title')}
                </motion.h1>

                <motion.p
                    className="mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl"
                    variants={fadeInUp}
                    transition={{ ...heroTransition, delay: 0.2 }}
                >
                    {t('hero.subtitle')}
                </motion.p>

                <motion.div
                    variants={fadeInUp}
                    transition={{ ...heroTransition, delay: 0.4 }}
                    className="mt-10"
                >
                    <Button
                        size="lg"
                        asChild
                        className="shadow-lg shadow-primary/25 hover:shadow-primary/40"
                    >
                        <Link href={`/${locale}/contact`}>
                            {t('hero.cta')}
                        </Link>
                    </Button>
                </motion.div>
            </motion.div>
        </section>
    );
}
