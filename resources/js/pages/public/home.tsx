import { Head } from '@inertiajs/react';

import PublicLayout from '@/layouts/public-layout';
import { useLocale } from '@/hooks/use-locale';

export default function Home() {
    const { t } = useLocale();

    return (
        <>
            <Head title={t('nav.home')} />
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-foreground">
                        Quart
                    </h1>
                    <p className="text-muted-foreground mt-4 text-lg">
                        {t('footer.tagline')}
                    </p>
                </div>
            </div>
        </>
    );
}

Home.layout = (page: React.ReactNode) => (
    <PublicLayout>{page}</PublicLayout>
);
