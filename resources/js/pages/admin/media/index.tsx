import { Head, Link, router } from '@inertiajs/react';
import { Search, Trash2 } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';

import MediaUploadZone from '@/components/admin/media-upload-zone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { MediaItem } from '@/types';

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type PaginatedData<T> = {
    data: T[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
};

type Props = {
    media: PaginatedData<MediaItem>;
    filters: { search?: string };
};

function formatFileSize(bytes: number): string {
    if (bytes >= 1024 * 1024) {
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    }

    return `${Math.round(bytes / 1024)} KB`;
}

function stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '');
}

export default function MediaIndex({ media, filters }: Props) {
    const [search, setSearch] = useState(filters.search || '');
    const [deleting, setDeleting] = useState<number | null>(null);
    const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
        null,
    );

    const handleSearchChange = useCallback((value: string) => {
        setSearch(value);

        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(() => {
            router.get(
                '/admin/media',
                { search: value || undefined },
                { preserveState: true, preserveScroll: true },
            );
        }, 300);
    }, []);

    const handleUploadComplete = useCallback(() => {
        router.reload({ only: ['media'] });
    }, []);

    const handleDelete = useCallback((item: MediaItem) => {
        if (!confirm(`Delete "${item.filename}"? This cannot be undone.`)) {
            return;
        }

        setDeleting(item.id);
        router.delete(`/admin/media/${item.id}`, {
            preserveScroll: true,
            onFinish: () => setDeleting(null),
        });
    }, []);

    return (
        <>
            <Head title="Media Library" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold tracking-tight">
                        Media Library
                    </h1>
                </div>

                <MediaUploadZone
                    onUploadComplete={handleUploadComplete}
                    multiple
                />

                <div className="relative max-w-sm">
                    <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                    <Input
                        placeholder="Search by filename..."
                        value={search}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="pl-9"
                    />
                </div>

                {media.data.length === 0 ? (
                    <div className="text-muted-foreground flex items-center justify-center py-16 text-sm">
                        No images found. Upload one above.
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                        {media.data.map((item) => (
                            <div
                                key={item.id}
                                className="group relative overflow-hidden rounded-lg border transition-all hover:shadow-md"
                            >
                                <div className="aspect-square">
                                    <img
                                        src={
                                            item.thumbnail_md_url || item.url
                                        }
                                        alt={item.filename}
                                        className="h-full w-full object-cover"
                                    />
                                </div>
                                <div className="bg-background/90 absolute inset-x-0 bottom-0 p-2 backdrop-blur-sm">
                                    <p className="truncate text-xs font-medium">
                                        {item.filename}
                                    </p>
                                    <p className="text-muted-foreground text-xs">
                                        {formatFileSize(item.size)}
                                        {item.width && item.height && (
                                            <span className="ml-1">
                                                {item.width}x{item.height}
                                            </span>
                                        )}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleDelete(item)}
                                    disabled={deleting === item.id}
                                    className={cn(
                                        'absolute top-2 right-2 rounded-md bg-destructive/90 p-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100',
                                        deleting === item.id &&
                                            'pointer-events-none opacity-50',
                                    )}
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {media.links.length > 3 && (
                    <div className="mt-4 flex items-center justify-center gap-1">
                        {media.links.map((link, index) => (
                            <Button
                                key={index}
                                variant={link.active ? 'default' : 'outline'}
                                size="sm"
                                disabled={!link.url}
                                asChild={!!link.url}
                            >
                                {link.url ? (
                                    <Link
                                        href={link.url}
                                        preserveState
                                        preserveScroll
                                    >
                                        {stripHtml(link.label)}
                                    </Link>
                                ) : (
                                    <span>{stripHtml(link.label)}</span>
                                )}
                            </Button>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}

MediaIndex.layout = {
    breadcrumbs: [
        { title: 'Admin', href: '/admin' },
        { title: 'Media Library', href: '/admin/media' },
    ],
};
