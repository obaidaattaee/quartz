import type { MediaItem } from '@/types/admin';

type Props = {
    beforeImage: MediaItem | null | undefined;
    afterImage: MediaItem | null | undefined;
    locale: string;
};

export default function BeforeAfterImages({
    beforeImage,
    afterImage,
    locale,
}: Props) {
    if (!beforeImage && !afterImage) {
        return null;
    }

    const beforeLabel = locale === 'ar' ? '\u0642\u0628\u0644' : 'Before';
    const afterLabel = locale === 'ar' ? '\u0628\u0639\u062F' : 'After';

    return (
        <div className="flex flex-col gap-4 md:flex-row md:gap-6">
            {beforeImage && (
                <div className="flex-1">
                    <p className="text-muted-foreground mb-2 text-sm font-medium">
                        {beforeLabel}
                    </p>
                    <img
                        src={beforeImage.url}
                        alt={beforeLabel}
                        className="aspect-video w-full rounded-lg object-cover"
                    />
                </div>
            )}
            {afterImage && (
                <div className="flex-1">
                    <p className="text-muted-foreground mb-2 text-sm font-medium">
                        {afterLabel}
                    </p>
                    <img
                        src={afterImage.url}
                        alt={afterLabel}
                        className="aspect-video w-full rounded-lg object-cover"
                    />
                </div>
            )}
        </div>
    );
}
