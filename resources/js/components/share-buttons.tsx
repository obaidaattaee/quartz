import { Linkedin, MessageCircle, Twitter } from 'lucide-react';

import { useLocale } from '@/hooks/use-locale';
import { getShareUrls } from '@/lib/seo';

type Props = {
    url: string;
    title: string;
};

export default function ShareButtons({ url, title }: Props) {
    const { t } = useLocale();
    const shareUrls = getShareUrls(url, title);

    const buttons = [
        {
            href: shareUrls.linkedin,
            icon: Linkedin,
            label: t('blog.share.linkedin'),
        },
        {
            href: shareUrls.twitter,
            icon: Twitter,
            label: t('blog.share.twitter'),
        },
        {
            href: shareUrls.whatsapp,
            icon: MessageCircle,
            label: t('blog.share.whatsapp'),
        },
    ];

    return (
        <div className="flex items-center gap-2">
            {buttons.map(({ href, icon: Icon, label }) => (
                <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="bg-muted hover:bg-primary hover:text-primary-foreground inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors"
                >
                    <Icon className="h-4 w-4" />
                </a>
            ))}
        </div>
    );
}
