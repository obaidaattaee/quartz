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
import type { BlogPost } from '@/types';

type PaginatedData<T> = {
    data: T[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
};

type Props = {
    posts: PaginatedData<BlogPost>;
    filters: { search?: string; status?: string };
};

export default function BlogIndex({ posts, filters }: Props) {
    const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null);
    const [deleting, setDeleting] = useState(false);

    const handleDelete = () => {
        if (!deleteTarget) {
            return;
        }

        setDeleting(true);
        router.delete(`/admin/blog/${deleteTarget.id}`, {
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
            render: (item: BlogPost) =>
                item.title_en.length > 50
                    ? `${item.title_en.substring(0, 50)}...`
                    : item.title_en,
        },
        {
            key: 'status',
            label: 'Status',
            render: (item: BlogPost) => (
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
            render: (item: BlogPost) =>
                new Date(item.created_at).toLocaleDateString(),
        },
    ];

    return (
        <>
            <Head title="Blog Posts" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold tracking-tight">
                        Blog Posts
                    </h1>
                    <Button asChild>
                        <Link href="/admin/blog/create">
                            <Plus className="mr-2 h-4 w-4" />
                            New Post
                        </Link>
                    </Button>
                </div>

                <div className="flex items-center gap-3">
                    <Select
                        value={filters.status || 'all'}
                        onValueChange={(value) =>
                            router.get(
                                '/admin/blog',
                                {
                                    search: filters.search || undefined,
                                    status:
                                        value === 'all' ? undefined : value,
                                },
                                { preserveState: true, replace: true },
                            )
                        }
                    >
                        <SelectTrigger className="w-40">
                            <SelectValue placeholder="All Statuses" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="draft">Draft</SelectItem>
                            <SelectItem value="published">
                                Published
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <DataTable
                    columns={columns}
                    data={posts.data}
                    searchValue={filters.search}
                    searchUrl="/admin/blog"
                    searchPlaceholder="Search blog posts..."
                    emptyMessage="No blog posts found."
                    actions={(item: BlogPost) => (
                        <div className="flex items-center justify-end gap-1">
                            <Button
                                variant="ghost"
                                size="sm"
                                asChild
                            >
                                <Link href={`/admin/blog/${item.id}/edit`}>
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

                <AdminPagination links={posts.links} />
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
                        <DialogTitle>Delete Blog Post</DialogTitle>
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

BlogIndex.layout = {
    breadcrumbs: [
        { title: 'Admin', href: '/admin' },
        { title: 'Blog Posts', href: '/admin/blog' },
    ],
};
