import { motion } from 'motion/react';

import ScrollReveal from '@/components/scroll-reveal';
import { useCounter } from '@/hooks/use-counter';
import { fadeInUp } from '@/lib/animations';

type Metric = {
    label: string;
    value: string;
};

type Props = {
    metrics: Metric[] | null;
};

/**
 * Parse a numeric value and suffix from a metric value string.
 * E.g., "95%" -> { number: 95, suffix: "%" }
 *       "200+" -> { number: 200, suffix: "+" }
 *       "1.5x" -> { number: 1, suffix: ".5x" }
 *       "50"   -> { number: 50, suffix: "" }
 */
function parseMetricValue(value: string): {
    number: number;
    suffix: string;
} {
    const match = value.match(/^(\d+)(.*)/);

    if (!match) {
        return { number: 0, suffix: value };
    }

    return {
        number: parseInt(match[1], 10),
        suffix: match[2] || '',
    };
}

function MetricCard({ metric }: { metric: Metric }) {
    const { number, suffix } = parseMetricValue(metric.value);
    const { ref, count } = useCounter(number);

    return (
        <motion.div
            variants={fadeInUp}
            ref={ref}
            className="bg-card rounded-xl p-6 text-center shadow-sm"
        >
            <p className="text-primary text-3xl font-bold">
                {count}
                {suffix}
            </p>
            <p className="text-muted-foreground mt-1 text-sm">
                {metric.label}
            </p>
        </motion.div>
    );
}

export default function ResultsMetrics({ metrics }: Props) {
    if (!metrics || metrics.length === 0) {
        return null;
    }

    return (
        <ScrollReveal variant="stagger">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {metrics.map((metric, index) => (
                    <MetricCard key={index} metric={metric} />
                ))}
            </div>
        </ScrollReveal>
    );
}
