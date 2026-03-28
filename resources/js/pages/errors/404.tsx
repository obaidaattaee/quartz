import { Head, Link } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { useLocale } from '@/hooks/use-locale';

export default function NotFound() {
    const { locale, t } = useLocale();

    return (
        <>
            <Head title={t('error.404.title')} />
            <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4">
                <div className="text-center">
                    <p className="text-primary text-sm font-semibold">404</p>
                    <h1 className="mt-2 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                        {t('error.404.title')}
                    </h1>
                    <p className="text-muted-foreground mt-4 text-base">
                        {t('error.404.description')}
                    </p>
                    <div className="mt-8 flex items-center justify-center gap-4">
                        <Button asChild>
                            <Link href={`/${locale}`}>
                                {t('error.404.backHome')}
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
}
