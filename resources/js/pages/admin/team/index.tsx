import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Plus, Trash2, User } from 'lucide-react';
import { useCallback, useState } from 'react';

import SortableList from '@/components/admin/sortable-list';
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
import type { TeamMemberData } from '@/types';

type Props = {
    members: TeamMemberData[];
};

export default function TeamIndex({ members }: Props) {
    const [deleteTarget, setDeleteTarget] =
        useState<TeamMemberData | null>(null);

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
                                                item.photo
                                                    .thumbnail_sm_url ||
                                                item.photo.url
                                            }
                                            alt={item.name_en}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                ) : (
                                    <div className="bg-muted flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full">
                                        <User className="text-muted-foreground h-5 w-5" />
                                    </div>
                                )}
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-medium">
                                        {item.name_en}
                                    </p>
                                    <p className="text-muted-foreground truncate text-xs">
                                        {item.role_en}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    asChild
                                >
                                    <Link
                                        href={`/admin/team/${item.id}/edit`}
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
                        <DialogTitle>Delete Team Member</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete &ldquo;
                            {deleteTarget?.name_en}&rdquo;? This action
                            cannot be undone.
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

TeamIndex.layout = {
    breadcrumbs: [
        { title: 'Admin', href: '/admin' },
        { title: 'Team Members', href: '/admin/team' },
    ],
};
