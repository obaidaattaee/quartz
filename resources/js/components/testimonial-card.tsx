import { Quote } from 'lucide-react';
import { motion } from 'motion/react';

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from '@/components/ui/card';
import { useLocale } from '@/hooks/use-locale';
import { fadeInUp } from '@/lib/animations';

type Props = {
    index: number;
};

export default function TestimonialCard({ index }: Props) {
    const { t } = useLocale();

    const name = t(`testimonials.${index}.name`);
    const initials = name
        .split(' ')
        .map((word) => word[0])
        .join('')
        .slice(0, 2);

    return (
        <motion.div variants={fadeInUp} className="h-full">
            <Card className="flex h-full flex-col">
                <CardHeader>
                    <Quote className="size-8 text-primary/20" />
                </CardHeader>
                <CardContent className="flex-1">
                    <p className="text-lg italic text-foreground">
                        {t(`testimonials.${index}.quote`)}
                    </p>
                </CardContent>
                <CardFooter>
                    <div className="flex items-center gap-3">
                        <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                            {initials}
                        </div>
                        <div>
                            <p className="font-semibold text-foreground">
                                {name}
                            </p>
                            <p className="text-sm text-muted-foreground">
                                {t(`testimonials.${index}.role`)},{' '}
                                {t(`testimonials.${index}.company`)}
                            </p>
                        </div>
                    </div>
                </CardFooter>
            </Card>
        </motion.div>
    );
}
