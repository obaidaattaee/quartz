import { Search } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { MediaItem } from '@/types';

import MediaUploadZone from './media-upload-zone';

type PaginatedMedia = {
    data: MediaItem[];
    current_page: number;
    last_page: number;
    next_page_url: string | null;
};

type Props = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSelect: (media: MediaItem) => void;
};

function formatFileSize(bytes: number): string {
    if (bytes >= 1024 * 1024) {
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }

    return `${Math.round(bytes / 1024)} KB`;
}

export default function MediaLibraryModal({
    open,
    onOpenChange,
    onSelect,
}: Props) {
    const [media, setMedia] = useState<MediaItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState('');
    const [nextPageUrl, setNextPageUrl] = useState<string | null>(null);
    const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
        null,
    );

    const fetchMedia = useCallback(
        async (searchTerm: string, url?: string) => {
            setLoading(true);

            try {
                const fetchUrl =
                    url ||
                    `/admin/media${searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : ''}`;
                const response = await fetch(fetchUrl, {
                    headers: { Accept: 'application/json' },
                });
                const data: PaginatedMedia = await response.json();

                if (url) {
                    // Loading more — append
                    setMedia((prev) => [...prev, ...data.data]);
                } else {
                    // Fresh search — replace
                    setMedia(data.data);
                }

                setNextPageUrl(data.next_page_url);
            } catch {
                // Silently fail — user can retry
            } finally {
                setLoading(false);
            }
        },
        [],
    );

    useEffect(() => {
        if (open) {
            fetchMedia('');
            setSearch('');
        } else {
            setMedia([]);
            setNextPageUrl(null);
        }
    }, [open, fetchMedia]);

    const handleSearchChange = useCallback(
        (value: string) => {
            setSearch(value);

            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }

            searchTimeoutRef.current = setTimeout(() => {
                fetchMedia(value);
            }, 300);
        },
        [fetchMedia],
    );

    const handleUploadComplete = useCallback(
        (newMedia: MediaItem) => {
            setMedia((prev) => [newMedia, ...prev]);
        },
        [],
    );

    const handleSelect = useCallback(
        (item: MediaItem) => {
            onSelect(item);
            onOpenChange(false);
        },
        [onSelect, onOpenChange],
    );

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[85vh] sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>Media Library</DialogTitle>
                </DialogHeader>

                <div className="space-y-4 overflow-y-auto">
                    <MediaUploadZone
                        onUploadComplete={handleUploadComplete}
                        multiple
                    />

                    <div className="relative">
                        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                        <Input
                            placeholder="Search by filename..."
                            value={search}
                            onChange={(e) =>
                                handleSearchChange(e.target.value)
                            }
                            className="pl-9"
                        />
                    </div>

                    {loading && media.length === 0 ? (
                        <div className="text-muted-foreground flex items-center justify-center py-12 text-sm">
                            Loading media...
                        </div>
                    ) : media.length === 0 ? (
                        <div className="text-muted-foreground flex items-center justify-center py-12 text-sm">
                            No images found. Upload one above.
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                            {media.map((item) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    onClick={() => handleSelect(item)}
                                    className={cn(
                                        'group relative overflow-hidden rounded-lg border transition-all',
                                        'hover:ring-primary hover:ring-2',
                                    )}
                                >
                                    <div className="aspect-square">
                                        <img
                                            src={
                                                item.thumbnail_md_url ||
                                                item.url
                                            }
                                            alt={item.filename}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="bg-background/90 absolute inset-x-0 bottom-0 p-1.5 backdrop-blur-sm">
                                        <p className="truncate text-xs font-medium">
                                            {item.filename}
                                        </p>
                                        <p className="text-muted-foreground text-xs">
                                            {formatFileSize(item.size)}
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {nextPageUrl && (
                        <div className="flex justify-center pt-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => fetchMedia(search, nextPageUrl)}
                                disabled={loading}
                            >
                                {loading ? 'Loading...' : 'Load More'}
                            </Button>
                        </div>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}

export { formatFileSize };
