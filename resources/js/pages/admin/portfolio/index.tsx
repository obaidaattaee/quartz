import { Head, Link, router } from '@inertiajs/react';
import { Pencil, Plus, Trash2 } from 'lucide-react';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { PortfolioItem } from '@/types';

type PaginatedData<T> = {
    data: T[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
};

type Props = {
    items: PaginatedData<PortfolioItem>;
    filters: { search?: string; category?: string };
};

const CATEGORIES: Record<string, string> = {
    development: 'Development',
    automation: 'Automation',
    qa: 'QA',
    cybersecurity: 'Cybersecurity',
};

export default function PortfolioIndex({ items, filters }: Props) {
    const [deleteTarget, setDeleteTarget] = useState<PortfolioItem | null>(
        null,
    );
    const [deleting, setDeleting] = useState(false);

    const handleDelete = () => {
        if (!deleteTarget) {
            return;
        }

        setDeleting(true);
        router.delete(`/admin/portfolio/${deleteTarget.id}`, {
            preserveScroll: true,
            onFinish: () => {
                setDeleting(false);
                setDeleteTarget(null);
            },
        });
    };

    const columns = [
        {
            key: 'title_en',
            label: 'Title',
            render: (item: PortfolioItem) =>
                item.title_en.length > 50
                    ? `${item.title_en.substring(0, 50)}...`
                    : item.title_en,
        },
        {
            key: 'service_category',
            label: 'Category',
            render: (item: PortfolioItem) => (
                <Badge variant="secondary">
                    {CATEGORIES[item.service_category] ??
                        item.service_category}
                </Badge>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            render: (item: PortfolioItem) => (
                <Badge
                    variant={
                        item.status === 'published' ? 'default' : 'outline'
                    }
                >
                    {item.status}
                </Badge>
            ),
        },
        {
            key: 'created_at',
            label: 'Date',
            render: (item: PortfolioItem) =>
                new Date(item.created_at).toLocaleDateString(),
        },
    ];

    return (
        <>
            <Head title="Portfolio" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold tracking-tight">
                        Portfolio
                    </h1>
                    <Button asChild>
                        <Link href="/admin/portfolio/create">
                            <Plus className="mr-2 h-4 w-4" />
                            New Item
                        </Link>
                    </Button>
                </div>

                <div className="flex items-center gap-3">
                    <Select
                        value={filters.category || 'all'}
                        onValueChange={(value) =>
                            router.get(
                                '/admin/portfolio',
                                {
                                    search: filters.search || undefined,
                                    category:
                                        value === 'all' ? undefined : value,
                                },
                                { preserveState: true, replace: true },
                            )
                        }
                    >
                        <SelectTrigger className="w-44">
                            <SelectValue placeholder="All Categories" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">
                                All Categories
                            </SelectItem>
                            <SelectItem value="development">
                                Development
                            </SelectItem>
                            <SelectItem value="automation">
                                Automation
                            </SelectItem>
                            <SelectItem value="qa">QA</SelectItem>
                            <SelectItem value="cybersecurity">
                                Cybersecurity
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <DataTable
                    columns={columns}
                    data={items.data}
                    searchValue={filters.search}
                    searchUrl="/admin/portfolio"
                    searchPlaceholder="Search portfolio items..."
                    emptyMessage="No portfolio items found."
                    actions={(item: PortfolioItem) => (
                        <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="sm" asChild>
                                <Link
                                    href={`/admin/portfolio/${item.id}/edit`}
                                >
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
                    )}
                />

                <AdminPagination links={items.links} />
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
                        <DialogTitle>Delete Portfolio Item</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete &quot;
                            {deleteTarget?.title_en}&quot;? This action cannot
                            be undone.
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
                            {deleting ? 'Deleting...' : 'Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}

PortfolioIndex.layout = {
    breadcrumbs: [
        { title: 'Admin', href: '/admin' },
        { title: 'Portfolio', href: '/admin/portfolio' },
    ],
};
