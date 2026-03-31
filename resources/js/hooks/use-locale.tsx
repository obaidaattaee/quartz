import { useEffect } from 'react';
import { usePage } from '@inertiajs/react';

import { t as translate } from '@/lib/i18n';
import type { Direction, Locale } from '@/types';

type UseLocaleReturn = {
    readonly locale: Locale;
    readonly direction: Direction;
    readonly isRTL: boolean;
    readonly t: (key: string, replacements?: Record<string, string>) => string;
    readonly switchLocaleUrl: string;
};

export function useLocale(): UseLocaleReturn {
    const { url, props } = usePage();
    const locale = (props.locale as Locale) ?? 'en';
    const direction = (props.direction as Direction) ?? 'ltr';
    const translations =
        (props.translations as Record<string, string>) ?? {};

    // Sync <html> dir and lang on Inertia client-side navigation
    useEffect(() => {
        document.documentElement.dir = direction;
        document.documentElement.lang = locale;
        document.body.className = document.body.className
            .replace(/font-(arabic|sans)/g, '')
            .trim()
            + ' ' + (locale === 'ar' ? 'font-arabic' : 'font-sans');
    }, [locale, direction]);

    const targetLocale = locale === 'en' ? 'ar' : 'en';
    const switchLocaleUrl = url.replace(
        new RegExp(`^/${locale}(/|$)`),
        `/${targetLocale}$1`,
    );

    return {
        locale,
        direction,
        isRTL: direction === 'rtl',
        t: (key: string, replacements?: Record<string, string>) =>
            translate(translations, key, replacements),
        switchLocaleUrl,
    } as const;
}
