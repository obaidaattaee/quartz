import { ImageIcon, X } from 'lucide-react';
import { useCallback, useState } from 'react';

import { Button } from '@/components/ui/button';
import type { MediaItem } from '@/types';

import MediaLibraryModal from './media-library-modal';

type Props = {
    value: MediaItem | null;
    onChange: (media: MediaItem | null) => void;
    label?: string;
};

export default function ImagePickerField({ value, onChange, label }: Props) {
    const [modalOpen, setModalOpen] = useState(false);

    const handleSelect = useCallback(
        (media: MediaItem) => {
            onChange(media);
        },
        [onChange],
    );

    const handleRemove = useCallback(() => {
        onChange(null);
    }, [onChange]);

    return (
        <div className="space-y-2">
            {label && (
                <label className="text-sm font-medium leading-none">
                    {label}
                </label>
            )}

            {value ? (
                <div className="flex items-center gap-3 rounded-lg border p-3">
                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                        <img
                            src={value.thumbnail_md_url || value.url}
                            alt={value.filename}
                            className="h-full w-full object-cover"
                        />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium">
                            {value.filename}
                        </p>
                    </div>
                    <div className="flex gap-1">
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setModalOpen(true)}
                        >
                            Change
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleRemove}
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            ) : (
                <Button
                    type="button"
                    variant="outline"
                    onClick={() => setModalOpen(true)}
                    className="w-full justify-start"
                >
                    <ImageIcon className="mr-2 h-4 w-4" />
                    Select Image
                </Button>
            )}

            <MediaLibraryModal
                open={modalOpen}
                onOpenChange={setModalOpen}
                onSelect={handleSelect}
            />
        </div>
    );
}
