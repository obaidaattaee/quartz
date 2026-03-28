import type { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';

import ScrollReveal from '@/components/scroll-reveal';
import { fadeInUp } from '@/lib/animations';
import type { ProcessStep } from '@/types/service';

type Props = {
    steps: ProcessStep[];
    icons: LucideIcon[];
};

export default function ProcessSteps({ steps, icons }: Props) {
    return (
        <ScrollReveal
            variant="stagger"
            as="div"
            className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
            {steps.map((step, index) => {
                const Icon = icons[index];

                return (
                    <motion.div
                        key={index}
                        variants={fadeInUp}
                        className="relative flex flex-col items-center rounded-lg bg-background p-6 text-center shadow-sm"
                    >
                        {/* Connecting line on desktop */}
                        {index < steps.length - 1 && (
                            <div className="absolute top-10 hidden w-full translate-x-1/2 border-t-2 border-dashed border-primary/20 ltr:left-1/2 rtl:right-1/2 rtl:-translate-x-1/2 lg:block" />
                        )}

                        {/* Step number badge */}
                        <div className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                            {index + 1}
                        </div>

                        {/* Icon */}
                        {Icon && (
                            <Icon className="mt-3 size-8 text-primary" />
                        )}

                        {/* Title */}
                        <h3 className="mt-3 text-lg font-semibold">
                            {step.title}
                        </h3>

                        {/* Description */}
                        <p className="mt-2 text-sm text-muted-foreground">
                            {step.description}
                        </p>
                    </motion.div>
                );
            })}
        </ScrollReveal>
    );
}
