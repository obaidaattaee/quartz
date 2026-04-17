import { Award } from 'lucide-react';

import ScrollReveal from '@/components/scroll-reveal';
import { useLocale } from '@/hooks/use-locale';

const CERTIFICATIONS = [
    { name: 'ISO 27001', labelKey: 'about.certifications.iso' },
    { name: 'AWS Partner', labelKey: 'about.certifications.aws' },
    { name: 'Microsoft Partner', labelKey: 'about.certifications.microsoft' },
    { name: 'Google Cloud', labelKey: 'about.certifications.google' },
    { name: 'ISTQB', labelKey: 'about.certifications.istqb' },
    { name: 'CEH', labelKey: 'about.certifications.ceh' },
];

export default function AwardsRow() {
    const { t } = useLocale();

    return (
        <section className="py-16 md:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <ScrollReveal>
                    <p className="text-muted-foreground mb-8 text-center text-xs font-semibold uppercase tracking-[0.16em]">
                        {t('landing.awards.title')}
                    </p>
                </ScrollReveal>
                <ScrollReveal
                    variant="stagger"
                    as="div"
                    className="grid grid-cols-2 items-center justify-items-center gap-6 md:grid-cols-3 lg:grid-cols-6"
                >
                    {CERTIFICATIONS.map((cert) => (
                        <div
                            key={cert.name}
                            className="text-muted-foreground flex items-center gap-2 text-sm font-medium opacity-70 grayscale transition-all hover:opacity-100 hover:grayscale-0"
                        >
                            <Award className="size-5" />
                            <span>{t(cert.labelKey)}</span>
                        </div>
                    ))}
                </ScrollReveal>
            </div>
        </section>
    );
}
