import { Clock } from 'lucide-react';

import { useLocale } from '@/hooks/use-locale';
import { cn } from '@/lib/utils';

type Props = {
    minutes: number;
    className?: string;
};

export default function ReadingTime({ minutes, className }: Props) {
    const { locale, t } = useLocale();
    const normalizedMinutes = Math.max(1, Math.floor(minutes));

    // Arabic needs real plural forms (دقيقة واحدة / دقيقتان / 3 دقائق /
    // 11 دقيقة), so pick the CLDR plural category and fall back to the
    // generic key when a locale has no form for it.
    const category = new Intl.PluralRules(locale).select(normalizedMinutes);
    const pluralKey = `blog.readingTime.${category}`;
    const replacements = { minutes: String(normalizedMinutes) };
    const pluralLabel = t(pluralKey, replacements);
    const label =
        pluralLabel === pluralKey
            ? t('blog.readingTime', replacements)
            : pluralLabel;

    return (
        <span
            className={cn(
                'flex items-center gap-1 text-sm text-muted-foreground',
                className,
            )}
        >
            <Clock className="h-3.5 w-3.5" />
            {label}
        </span>
    );
}
