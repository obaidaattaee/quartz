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

type Testimonial = {
    id: number;
    quote_en: string;
    quote_ar: string;
    author_name_en: string;
    author_name_ar: string;
    author_title_en: string;
    author_title_ar: string;
    company_en: string;
    company_ar: string;
};

type Props = {
    testimonial: Testimonial;
};

export default function TestimonialCard({ testimonial }: Props) {
    const { locale } = useLocale();

    const quote =
        locale === 'ar'
            ? testimonial.quote_ar
            : testimonial.quote_en;
    const name =
        locale === 'ar'
            ? testimonial.author_name_ar
            : testimonial.author_name_en;
    const role =
        locale === 'ar'
            ? testimonial.author_title_ar
            : testimonial.author_title_en;
    const company =
        locale === 'ar'
            ? testimonial.company_ar
            : testimonial.company_en;

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
                        {quote}
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
                                {role}, {company}
                            </p>
                        </div>
                    </div>
                </CardFooter>
            </Card>
        </motion.div>
    );
}
