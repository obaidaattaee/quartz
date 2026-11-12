import { Head, Link, router } from '@inertiajs/react';
import { Eye, EyeOff, Pencil, Plus, Trash2, User } from 'lucide-react';
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
import type { TeamMemberData } from '@/types';

type Props = {
    members: TeamMemberData[];
};

export default function TeamIndex({ members }: Props) {
    const [deleteTarget, setDeleteTarget] = useState<TeamMemberData | null>(
        null,
    );

    const handleReorder = useCallback(
        (id: number, direction: 'up' | 'down') => {
            router.post(
                `/admin/team/${id}/reorder`,
                { direction },
                { preserveScroll: true },
            );
        },
        [],
    );

    const handleVisibilityToggle = useCallback((item: TeamMemberData) => {
        router.put(
            `/admin/team/${item.id}`,
            {
                name_en: item.name_en,
                name_ar: item.name_ar,
                role_en: item.role_en,
                role_ar: item.role_ar,
                bio_en: item.bio_en,
                bio_ar: item.bio_ar,
                photo_id: item.photo_id,
                is_visible: !item.is_visible,
            },
            { preserveScroll: true },
        );
    }, []);

    const handleDelete = useCallback(() => {
        if (!deleteTarget) {
            return;
        }

        router.delete(`/admin/team/${deleteTarget.id}`, {
            preserveScroll: true,
            onFinish: () => setDeleteTarget(null),
        });
    }, [deleteTarget]);

    return (
        <>
            <Head title="Team Members" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold tracking-tight">
                        Team Members
                    </h1>
                    <Button asChild>
                        <Link href="/admin/team/create">
                            <Plus className="mr-1 h-4 w-4" />
                            Add Member
                        </Link>
                    </Button>
                </div>

                <SortableList
                    items={members}
                    onReorder={handleReorder}
                    renderItem={(item) => (
                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                {item.photo ? (
                                    <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full">
                                        <img
                                            src={
                                                item.photo.thumbnail_sm_url ||
                                                item.photo.url
                                            }
                                            alt={item.name_en}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-muted">
                                        <User className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                )}
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="truncate text-sm font-medium">
                                            {item.name_en}
                                        </p>
                                        {!item.is_visible && (
                                            <Badge
                                                variant="secondary"
                                                className="text-[10px]"
                                            >
                                                Hidden
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="truncate text-xs text-muted-foreground">
                                        {item.role_en}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1.5">
                                    {item.is_visible ? (
                                        <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                                    ) : (
                                        <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
                                    )}
                                    <Switch
                                        checked={item.is_visible}
                                        onCheckedChange={() =>
                                            handleVisibilityToggle(item)
                                        }
                                        size="sm"
                                        aria-label={
                                            item.is_visible
                                                ? `Hide ${item.name_en} on website`
                                                : `Show ${item.name_en} on website`
                                        }
                                    />
                                </div>
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href={`/admin/team/${item.id}/edit`}>
                                        <Pencil className="h-4 w-4" />
                                    </Link>
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setDeleteTarget(item)}
                                >
                                    <Trash2 className="h-4 w-4 text-destructive" />
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
                        <DialogTitle>Delete Team Member</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete &ldquo;
                            {deleteTarget?.name_en}&rdquo;? This action cannot
                            be undone.
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

TeamIndex.layout = {
    breadcrumbs: [
        { title: 'Admin', href: '/admin' },
        { title: 'Team Members', href: '/admin/team' },
    ],
};
