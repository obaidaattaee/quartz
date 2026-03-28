import { motion } from 'motion/react';

import {
    Card,
    CardContent,
    CardHeader,
} from '@/components/ui/card';
import { useLocale } from '@/hooks/use-locale';
import { fadeInUp } from '@/lib/animations';

type TeamMember = {
    id: number;
    name_en: string;
    name_ar: string;
    role_en: string;
    role_ar: string;
    bio_en: string;
    bio_ar: string;
    photo?: {
        id: number;
        url: string;
    } | null;
};

type Props = {
    member: TeamMember;
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

export default function TeamCard({ member }: Props) {
    const { locale } = useLocale();

    const name =
        locale === 'ar' ? member.name_ar : member.name_en;
    const role =
        locale === 'ar' ? member.role_ar : member.role_en;
    const bio =
        locale === 'ar' ? member.bio_ar : member.bio_en;
    const initials = getInitials(name);

    return (
        <motion.div variants={fadeInUp}>
            <Card className="group transition-all duration-300 hover:shadow-lg">
                <CardHeader className="items-center pb-0">
                    {member.photo?.url ? (
                        <img
                            src={member.photo.url}
                            alt={name}
                            className="h-20 w-20 rounded-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                    ) : (
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-xl font-bold text-primary transition-transform duration-300 group-hover:scale-105">
                            {initials}
                        </div>
                    )}
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
