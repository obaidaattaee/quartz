import { motion } from 'motion/react';

import {
    Card,
    CardContent,
    CardHeader,
} from '@/components/ui/card';
import { useLocale } from '@/hooks/use-locale';
import { fadeInUp } from '@/lib/animations';

type Props = {
    index: number;
};

function getInitials(name: string): string {
    const parts = name.split(' ').filter(Boolean);

    if (parts.length === 0) {
        return '';
    }

    if (parts.length === 1) {
        return parts[0][0].toUpperCase();
    }

    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default function TeamCard({ index }: Props) {
    const { t } = useLocale();

    const name = t(`about.team.${index}.name`);
    const role = t(`about.team.${index}.role`);
    const bio = t(`about.team.${index}.bio`);
    const initials = getInitials(name);

    return (
        <motion.div variants={fadeInUp}>
            <Card className="group transition-all duration-300 hover:shadow-lg">
                <CardHeader className="items-center pb-0">
                    {/* Placeholder avatar with initials */}
                    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary transition-transform duration-300 group-hover:scale-105">
                        {initials}
                    </div>
                    <h3 className="mt-3 text-center text-lg font-semibold">
                        {name}
                    </h3>
                    <p className="text-center text-sm text-primary">
                        {role}
                    </p>
                </CardHeader>
                <CardContent>
                    <p className="mt-2 text-center text-sm text-muted-foreground">
                        {bio}
                    </p>
                </CardContent>
            </Card>
        </motion.div>
    );
}
