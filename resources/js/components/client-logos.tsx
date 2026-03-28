import ScrollReveal from '@/components/scroll-reveal';
import { useLocale } from '@/hooks/use-locale';

const PLACEHOLDER_LOGOS = [
    'TechCorp',
    'GlobalTrade',
    'FinSecure',
    'DataFlow',
    'CloudNine',
    'SecureNet',
];

export default function ClientLogos() {
    const { t } = useLocale();

    return (
        <ScrollReveal as="section" className="py-16 md:py-24">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                    {t('clients.title')}
                </h2>

                <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
                    {PLACEHOLDER_LOGOS.map((name) => (
                        <div
                            key={name}
                            className="grayscale opacity-60 transition-all duration-300 hover:grayscale-0 hover:opacity-100"
                        >
                            <div className="flex h-12 w-28 items-center justify-center rounded-lg bg-muted text-sm font-medium text-muted-foreground">
                                {name}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </ScrollReveal>
    );
}
