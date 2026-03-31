import { Clock } from 'lucide-react';

import { useLocale } from '@/hooks/use-locale';
import { cn } from '@/lib/utils';

type Props = {
    minutes: number;
    className?: string;
};

export default function ReadingTime({ minutes, className }: Props) {
    const { t } = useLocale();
    const normalizedMinutes = Math.max(1, Math.floor(minutes));

    const label = t('blog.readingTime', {
        minutes: String(normalizedMinutes),
    });

    return (
        <span
            className={cn(
                'text-muted-foreground flex items-center gap-1 text-sm',
                className,
            )}
        >
            <Clock className="h-3.5 w-3.5" />
            {label}
        </span>
    );
}
