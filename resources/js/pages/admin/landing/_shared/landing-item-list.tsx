import { Head, Link, router } from '@inertiajs/react';
import {
    AlertTriangle,
    ExternalLink,
    Eye,
    EyeOff,
    Pencil,
    Plus,
    Trash2,
} from 'lucide-react';
import { useCallback, useState } from 'react';

import SortableList from '@/components/admin/sortable-list';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
import { LANDING_SECTIONS } from '@/pages/admin/landing/_shared/sections';
import type {
    LandingItem,
    LandingSectionKey,
} from '@/pages/admin/landing/_shared/sections';

type Props = {
    sectionKey: LandingSectionKey;
    items: LandingItem[];
};

function text(item: LandingItem, key: string): string {
    const value = item[key];

    return typeof value === 'string' ? value : '';
}

function truncate(value: string, max: number): string {
    return value.length > max ? `${value.substring(0, max)}…` : value;
}

export default function LandingItemList({ sectionKey, items }: Props) {
    const section = LANDING_SECTIONS[sectionKey];
    const base = `/admin/landing/${sectionKey}`;
    const [deleteTarget, setDeleteTarget] = useState<LandingItem | null>(null);

    const handleReorder = useCallback(
        (id: number, direction: 'up' | 'down') => {
            router.post(
                `${base}/${id}/reorder`,
                { direction },
                { preserveScroll: true },
            );
        },
        [base],
    );

    const handleVisibilityToggle = useCallback(
        (item: LandingItem) => {
            router.patch(
                `${base}/${item.id}/visibility`,
                {},
                { preserveScroll: true },
            );
        },
        [base],
    );

    const handleDelete = useCallback(() => {
        if (!deleteTarget) {
            return;
        }

        router.delete(`${base}/${deleteTarget.id}`, {
            preserveScroll: true,
            onFinish: () => setDeleteTarget(null),
        });
    }, [base, deleteTarget]);

    const visibleCount = items.filter((i) => i.is_visible).length;

    return (
        <>
            <Head title={`Homepage ${section.title}`} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            {section.title}
                        </h1>
                        <p className="max-w-2xl text-sm text-muted-foreground">
                            {section.description} Use the arrows to change the
                            order.
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                            {section.hasVisibility
                                ? `${visibleCount} of ${items.length} visible on the homepage`
                                : `${items.length} shown on the homepage`}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" asChild>
                            <a href="/en" target="_blank" rel="noreferrer">
                                <ExternalLink className="mr-1 h-4 w-4" />
                                View homepage
                            </a>
                        </Button>
                        <Button asChild>
                            <Link href={`${base}/create`}>
                                <Plus className="mr-1 h-4 w-4" />
                                Add {section.singular}
                            </Link>
                        </Button>
                    </div>
                </div>

                {section.warning && (
                    <Alert className="max-w-3xl">
                        <AlertTriangle />
                        <AlertDescription>{section.warning}</AlertDescription>
                    </Alert>
                )}

                <SortableList
                    items={items}
                    onReorder={handleReorder}
                    renderItem={(item) => {
                        const title = text(item, section.summary.title);
                        const prefix = section.summary.prefix
                            ? text(item, section.summary.prefix)
                            : '';

                        return (
                            <div
                                className="flex items-center justify-between gap-4"
                                data-test="landing-item-row"
                            >
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium">
                                        {prefix && (
                                            <span className="mr-2 font-mono text-muted-foreground">
                                                {prefix}
                                            </span>
                                        )}
                                        {title}
                                    </p>
                                    <p className="mt-1 truncate text-xs text-muted-foreground">
                                        {truncate(
                                            text(
                                                item,
                                                section.summary.subtitle,
                                            ),
                                            140,
                                        )}
                                    </p>
                                    {section.hasVisibility && (
                                        <Badge
                                            variant={
                                                item.is_visible
                                                    ? 'default'
                                                    : 'secondary'
                                            }
                                            className="mt-1 text-[10px]"
                                        >
                                            {item.is_visible
                                                ? 'Visible'
                                                : 'Hidden'}
                                        </Badge>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    {section.hasVisibility && (
                                        <div className="flex items-center gap-1.5">
                                            {item.is_visible ? (
                                                <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                                            ) : (
                                                <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
                                            )}
                                            <Switch
                                                checked={Boolean(
                                                    item.is_visible,
                                                )}
                                                onCheckedChange={() =>
                                                    handleVisibilityToggle(item)
                                                }
                                                size="sm"
                                                aria-label={
                                                    item.is_visible
                                                        ? `Hide “${title}” from the homepage`
                                                        : `Show “${title}” on the homepage`
                                                }
                                            />
                                        </div>
                                    )}
                                    <Button variant="ghost" size="sm" asChild>
                                        <Link
                                            href={`${base}/${item.id}/edit`}
                                            aria-label={`Edit “${title}”`}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Link>
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => setDeleteTarget(item)}
                                        aria-label={`Delete “${title}”`}
                                    >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                            </div>
                        );
                    }}
                />
            </div>

            <Dialog
                open={!!deleteTarget}
                onOpenChange={(open) => !open && setDeleteTarget(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete {section.singular}</DialogTitle>
                        <DialogDescription>
                            Delete &ldquo;
                            {deleteTarget
                                ? truncate(
                                      text(deleteTarget, section.summary.title),
                                      80,
                                  )
                                : ''}
                            &rdquo; in both languages? It will be removed from
                            the homepage. This cannot be undone.
                            {section.hasVisibility &&
                                ' To take it off the homepage but keep it, hide it instead.'}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button variant="destructive" onClick={handleDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
