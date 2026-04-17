import ClientLogos from '@/components/client-logos';
import { useLocale } from '@/hooks/use-locale';

/**
 * Thin trust-bar used under the hero. Mirrors the Zendesk pattern: short
 * uppercase label + grayscale logos, no large heading.
 */
export default function TrustBar() {
    const { t } = useLocale();

    return (
        <section className="border-border/40 border-y bg-background py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <p className="text-muted-foreground mb-6 text-center text-xs font-semibold uppercase tracking-[0.16em]">
                    {t('landing.trustBar.title')}
                </p>
                <ClientLogos showHeading={false} wrap={false} />
            </div>
        </section>
    );
}
