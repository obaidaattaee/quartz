import { Link } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { useLocale } from '@/hooks/use-locale';
import { fadeInUp } from '@/lib/animations';

type Props = {
    icon: LucideIcon;
    titleKey: string;
    briefKey: string;
    href: string;
};

export default function ServiceCard({
    icon: Icon,
    titleKey,
    briefKey,
    href,
}: Props) {
    const { isRTL, t } = useLocale();
    const Arrow = isRTL ? ArrowLeft : ArrowRight;

    return (
        <motion.div variants={fadeInUp}>
            <Link href={href} className="block h-full">
                <Card className="h-full">
                    <CardHeader>
                        <Icon className="size-10 text-primary" />
                        <CardTitle className="mt-2">
                            {t(titleKey)}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            {t(briefKey)}
                        </p>
                    </CardContent>
                    <CardFooter>
                        <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                            {t('services.learnMore')}
                            <Arrow className="size-4" />
                        </span>
                    </CardFooter>
                </Card>
            </Link>
        </motion.div>
    );
}
