import { Head, Link, router } from '@inertiajs/react';
import { Eye, EyeOff, Pencil, Plus, Trash2 } from 'lucide-react';
import { useCallback, useState } from 'react';

import SortableList from '@/components/admin/sortable-list';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import type { Testimonial } from '@/types';

type Props = {
    testimonials: Testimonial[];
};

export default function TestimonialsIndex({ testimonials }: Props) {
    const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(
        null,
    );

    const handleReorder = useCallback(
        (id: number, direction: 'up' | 'down') => {
            router.post(
                `/admin/testimonials/${id}/reorder`,
                { direction },
                { preserveScroll: true },
            );
        },
        [],
    );

    const handleVisibilityToggle = useCallback(
        (item: Testimonial) => {
            router.put(
                `/admin/testimonials/${item.id}`,
                {
                    quote_en: item.quote_en,
                    quote_ar: item.quote_ar,
                    author_name_en: item.author_name_en,
                    author_name_ar: item.author_name_ar,
                    author_title_en: item.author_title_en,
                    author_title_ar: item.author_title_ar,
                    company_en: item.company_en,
                    company_ar: item.company_ar,
                    photo_id: item.photo_id,
                    is_visible: !item.is_visible,
                },
                { preserveScroll: true },
            );
        },
        [],
    );

    const handleDelete = useCallback(() => {
        if (!deleteTarget) {
            return;
        }

        router.delete(`/admin/testimonials/${deleteTarget.id}`, {
            preserveScroll: true,
            onFinish: () => setDeleteTarget(null),
        });
    }, [deleteTarget]);

    return (
        <>
            <Head title="Testimonials" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold tracking-tight">
                        Testimonials
                    </h1>
                    <Button asChild>
                        <Link href="/admin/testimonials/create">
                            <Plus className="mr-1 h-4 w-4" />
                            Add Testimonial
                        </Link>
                    </Button>
                </div>

                <SortableList
                    items={testimonials}
                    onReorder={handleReorder}
                    renderItem={(item) => (
                        <div className="flex items-center justify-between gap-4">
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium">
                                    &ldquo;
                                    {item.quote_en.length > 100
                                        ? item.quote_en.substring(0, 100) +
                                          '...'
                                        : item.quote_en}
                                    &rdquo;
                                </p>
                                <div className="mt-1 flex items-center gap-2">
                                    <span className="text-muted-foreground text-xs">
                                        {item.author_name_en}
                                    </span>
                                    {item.company_en && (
                                        <span className="text-muted-foreground text-xs">
                                            at {item.company_en}
                                        </span>
                                    )}
                                    <Badge
                                        variant={
                                            item.is_visible
                                                ? 'default'
                                                : 'secondary'
                                        }
                                        className="text-[10px]"
                                    >
                                        {item.is_visible
                                            ? 'Visible'
                                            : 'Hidden'}
                                    </Badge>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1.5">
                                    {item.is_visible ? (
                                        <Eye className="text-muted-foreground h-3.5 w-3.5" />
                                    ) : (
                                        <EyeOff className="text-muted-foreground h-3.5 w-3.5" />
                                    )}
                                    <Switch
                                        checked={item.is_visible}
                                        onCheckedChange={() =>
                                            handleVisibilityToggle(item)
                                        }
                                        size="sm"
                                    />
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    asChild
                                >
                                    <Link
                                        href={`/admin/testimonials/${item.id}/edit`}
                                    >
                                        <Pencil className="h-4 w-4" />
                                    </Link>
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setDeleteTarget(item)}
                                >
                                    <Trash2 className="text-destructive h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    )}
                />
            </div>

            <Dialog
                open={!!deleteTarget}
                onOpenChange={(open) => !open && setDeleteTarget(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Testimonial</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete the testimonial
                            from &ldquo;{deleteTarget?.author_name_en}
                            &rdquo;? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                        >
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

TestimonialsIndex.layout = {
    breadcrumbs: [
        { title: 'Admin', href: '/admin' },
        { title: 'Testimonials', href: '/admin/testimonials' },
    ],
};
