import { Clock } from 'lucide-react';

type Props = {
    minutes: number;
    locale: string;
};

export default function ReadingTime({ minutes, locale }: Props) {
    const label =
        locale === 'ar'
            ? `${minutes} دقائق للقراءة`
            : `${minutes} min read`;

    return (
        <span className="text-muted-foreground flex items-center gap-1 text-sm">
            <Clock className="h-3.5 w-3.5" />
            {label}
        </span>
    );
}
