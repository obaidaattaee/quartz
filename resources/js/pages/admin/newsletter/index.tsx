import { Head, router } from '@inertiajs/react';
import { Mail, Trash2, Users } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';

import AdminPagination from '@/components/admin/admin-pagination';
import type { PaginationLink } from '@/components/admin/admin-pagination';
import DataTable from '@/components/admin/data-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

type Subscriber = {
    id: number;
    email: string;
    locale: string;
    subscribed_at: string;
};

type PaginatedData<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: PaginationLink[];
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
    const [search, setSearch] = useState(filters.search ?? '');
    const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

    const handleSearch = useCallback(
        (value: string) => {
            setSearch(value);

            if (debounceRef.current) {
                clearTimeout(debounceRef.current);
            }

            debounceRef.current = setTimeout(() => {
                router.get(
                    '/admin/newsletter',
                    { search: value || undefined },
                    { preserveState: true, replace: true },
                );
            }, 300);
        },
        [],
    );

    const handleDelete = (id: number) => {
        if (confirm('Remove this subscriber?')) {
            router.delete(`/admin/newsletter/${id}`);
        }
    };

    return (
        <>
            <Head title="Newsletter Subscribers" />

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold tracking-tight">
                        Newsletter Subscribers
                    </h1>
                </div>

                {/* Stats card */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Subscribers
                        </CardTitle>
                        <Users className="text-muted-foreground h-4 w-4" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {totalCount}
                        </div>
                    </CardContent>
                </Card>

                {/* Search */}
                <div>
                    <input
                        type="text"
                        placeholder="Search by email..."
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full max-w-sm rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
                    />
                </div>

                {/* Table */}
                <DataTable
                    columns={[
                        {
                            key: 'email',
                            label: 'Email',
                            render: (subscriber: Subscriber) => (
                                <div className="flex items-center gap-2">
                                    <Mail className="text-muted-foreground h-4 w-4" />
                                    <span className="font-medium">
                                        {subscriber.email}
                                    </span>
                                </div>
                            ),
                        },
                        {
                            key: 'locale',
                            label: 'Language',
                            render: (subscriber: Subscriber) => (
                                <Badge variant="outline">
                                    {subscriber.locale === 'ar'
                                        ? 'Arabic'
                                        : 'English'}
                                </Badge>
                            ),
                        },
                        {
                            key: 'subscribed_at',
                            label: 'Subscribed',
                            render: (subscriber: Subscriber) =>
                                subscriber.subscribed_at
                                    ? new Date(
                                          subscriber.subscribed_at,
                                      ).toLocaleDateString('en-US', {
                                          year: 'numeric',
                                          month: 'short',
                                          day: 'numeric',
                                      })
                                    : '—',
                        },
                        {
                            key: 'actions',
                            label: '',
                            render: (subscriber: Subscriber) => (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                        handleDelete(subscriber.id)
                                    }
                                    className="text-destructive hover:text-destructive"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            ),
                        },
                    ]}
                    data={subscribers.data}
                    emptyMessage="No subscribers yet."
                />

                {subscribers.last_page > 1 && (
                    <AdminPagination links={subscribers.links} />
                )}
            </div>
        </>
    );
}

NewsletterIndex.layout = (page: React.ReactNode) => {
    const AppLayout = require('@/layouts/app-layout').default;

    return (
        <AppLayout
            breadcrumbs={[
                {
                    title: 'Newsletter',
                    href: '/admin/newsletter',
                },
            ]}
        >
            {page}
        </AppLayout>
    );
};
