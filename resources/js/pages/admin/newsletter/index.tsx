import { Head, router } from '@inertiajs/react';
import { Mail, Trash2 } from 'lucide-react';
import { useState } from 'react';

import AdminPagination from '@/components/admin/admin-pagination';
import type { PaginationLink } from '@/components/admin/admin-pagination';
import DataTable from '@/components/admin/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

type Subscriber = {
    id: number;
    email: string;
    locale: string;
    subscribed_at: string;
};

type PaginatedData<T> = {
    data: T[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
};

type Props = {
    subscribers: PaginatedData<Subscriber>;
    filters: { search?: string };
    totalCount: number;
};

export default function NewsletterIndex({
    subscribers,
    filters,
    totalCount,
}: Props) {
    const [deleteTarget, setDeleteTarget] = useState<Subscriber | null>(null);
    const [deleting, setDeleting] = useState(false);

    const handleDelete = () => {
        if (!deleteTarget) {
            return;
        }

        setDeleting(true);
        router.delete(`/admin/newsletter/${deleteTarget.id}`, {
            preserveScroll: true,
            onFinish: () => {
                setDeleting(false);
                setDeleteTarget(null);
            },
        });
    };

    const columns = [
        {
            key: 'email',
            label: 'Email',
            render: (item: Subscriber) => (
                <div className="flex items-center gap-2">
                    <Mail className="text-muted-foreground h-4 w-4" />
                    <span className="font-medium">{item.email}</span>
                </div>
            ),
        },
        {
            key: 'locale',
            label: 'Language',
            render: (item: Subscriber) => (
                <Badge variant="outline">
                    {item.locale === 'ar' ? 'Arabic' : 'English'}
                </Badge>
            ),
        },
        {
            key: 'subscribed_at',
            label: 'Subscribed',
            render: (item: Subscriber) =>
                item.subscribed_at
                    ? new Date(item.subscribed_at).toLocaleDateString()
                    : '—',
        },
    ];

    return (
        <>
            <Head title="Newsletter Subscribers" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold tracking-tight">
                        Newsletter Subscribers
                    </h1>
                    <Badge variant="outline" className="text-sm">
                        {totalCount} total
                    </Badge>
                </div>

                <DataTable
                    columns={columns}
                    data={subscribers.data}
                    searchValue={filters.search}
                    searchUrl="/admin/newsletter"
                    searchPlaceholder="Search by email..."
                    emptyMessage="No subscribers yet."
                    actions={(item: Subscriber) => (
                        <div className="flex items-center justify-end gap-1">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setDeleteTarget(item)}
                            >
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        </div>
                    )}
                />

                <AdminPagination links={subscribers.links} />
            </div>

            <Dialog
                open={!!deleteTarget}
                onOpenChange={(open) => {
                    if (!open) {
                        setDeleteTarget(null);
                    }
                }}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Remove Subscriber</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to remove &quot;
                            {deleteTarget?.email}&quot; from the newsletter?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteTarget(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={deleting}
                        >
                            {deleting ? 'Removing...' : 'Remove'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

NewsletterIndex.layout = {
    breadcrumbs: [
        { title: 'Admin', href: '/admin' },
        { title: 'Newsletter', href: '/admin/newsletter' },
    ],
};
