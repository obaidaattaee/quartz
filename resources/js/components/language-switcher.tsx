import { Link } from '@inertiajs/react';

import { useLocale } from '@/hooks/use-locale';
import { cn } from '@/lib/utils';

type Props = {
    className?: string;
};

export default function LanguageSwitcher({ className }: Props) {
    const { locale, t, switchLocaleUrl } = useLocale();

    return (
        <Link
            href={switchLocaleUrl}
            className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                className,
            )}
            aria-label={
                locale === 'en'
                    ? 'Switch to Arabic'
                    : 'Switch to English'
            }
        >
            {t('language.switch')}
        </Link>
    );
}
