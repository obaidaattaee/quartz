import ScrollReveal from '@/components/scroll-reveal';
import { useLocale } from '@/hooks/use-locale';

const CLIENT_LOGOS = [
    { name: 'TechCorp', src: '/images/clients/techcorp.svg' },
    { name: 'GlobalTrade', src: '/images/clients/globaltrade.svg' },
    { name: 'FinSecure', src: '/images/clients/finsecure.svg' },
    { name: 'DataFlow', src: '/images/clients/dataflow.svg' },
    { name: 'CloudNine', src: '/images/clients/cloudnine.svg' },
    { name: 'SecureNet', src: '/images/clients/securenet.svg' },
];

type Props = {
    showHeading?: boolean;
    wrap?: boolean;
};

export default function ClientLogos({ showHeading = true, wrap = true }: Props) {
    const { t } = useLocale();

    const inner = (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {showHeading && (
                <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                    {t('clients.title')}
                </h2>
            )}
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
                {CLIENT_LOGOS.map((logo) => (
                    <div
                        key={logo.name}
                        className="grayscale opacity-60 transition-all duration-300 hover:grayscale-0 hover:opacity-100"
                    >
                        <img
                            src={logo.src}
                            alt={logo.name}
                            className="h-10 w-auto dark:brightness-0 dark:invert"
                        />
                    </div>
                ))}
            </div>
        </div>
    );

    if (!wrap) {
        return inner;
    }

    return (
        <ScrollReveal as="section" className="py-16 md:py-24">
            {inner}
        </ScrollReveal>
    );
}
