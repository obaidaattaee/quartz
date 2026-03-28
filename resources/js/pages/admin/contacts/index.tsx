import { Head, Link, router } from '@inertiajs/react';
import { Eye, Mail, MailCheck, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';

import AdminPagination from '@/components/admin/admin-pagination';
import type { PaginationLink } from '@/components/admin/admin-pagination';
import DataTable from '@/components/admin/data-table';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

type ContactLead = {
    id: number;
    name: string;
    email: string;
    phone: string;
    service: string;
    message: string;
    status: string;
    created_at: string;
};

type PaginatedData<T> = {
    data: T[];
    links: PaginationLink[];
    current_page: number;
    last_page: number;
};

type Props = {
    leads: PaginatedData<ContactLead>;
    filters: { search?: string; status?: string };
    counts: {
        new: number;
        read: number;
        handled: number;
        total: number;
    };
};

type StatusCardProps = {
    title: string;
    count: number;
    icon: LucideIcon;
    colorClass: string;
    statusFilter: string | undefined;
    activeStatus: string | undefined;
};

function statusBadgeVariant(
    status: string,
): 'default' | 'secondary' | 'outline' {
    switch (status) {
        case 'new':
            return 'default';
        case 'read':
            return 'secondary';
        case 'handled':
            return 'outline';
        default:
            return 'secondary';
    }
}

function statusColor(status: string): string {
    switch (status) {
        case 'new':
            return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
        case 'read':
            return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
        case 'handled':
            return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
        default:
            return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
}

function StatusCard({
    title,
    count,
    icon: Icon,
    colorClass,
    statusFilter,
    activeStatus,
}: StatusCardProps) {
    const isActive = activeStatus === statusFilter;

    return (
        <button
            type="button"
            onClick={() => {
                router.get(
                    '/admin/contacts',
                    {
                        status: isActive ? undefined : statusFilter,
                    },
                    { preserveState: true, preserveScroll: true },
                );
            }}
            className="w-full text-left"
        >
            <Card
                className={cn(
                    'border-sidebar-border/70 cursor-pointer transition-all dark:border-sidebar-border',
                    isActive && 'ring-primary ring-2',
                )}
            >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        {title}
                    </CardTitle>
                    <Icon
                        className={cn('h-4 w-4', colorClass)}
                    />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{count}</div>
                </CardContent>
            </Card>
        </button>
    );
}

export default function ContactsIndex({ leads, filters, counts }: Props) {
    const columns = [
        {
            key: 'name',
            label: 'Name',
            render: (item: ContactLead) => (
                <Link
                    href={`/admin/contacts/${item.id}`}
                    className="text-primary hover:underline"
                >
                    {item.name}
                </Link>
            ),
        },
        {
            key: 'email',
            label: 'Email',
        },
        {
            key: 'service',
            label: 'Service',
            render: (item: ContactLead) => (
                <Badge variant="secondary" className="capitalize">
                    {item.service}
                </Badge>
            ),
        },
        {
            key: 'status',
            label: 'Status',
            render: (item: ContactLead) => (
                <span
                    className={cn(
                        'inline-flex rounded-full px-2 py-0.5 text-xs font-medium',
                        statusColor(item.status),
                    )}
                >
                    {item.status}
                </span>
            ),
        },
        {
            key: 'created_at',
            label: 'Date',
            render: (item: ContactLead) =>
                new Date(item.created_at).toLocaleDateString(),
        },
    ];

    return (
        <>
            <Head title="Contact Leads" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold tracking-tight">
                        Contact Leads
                    </h1>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <StatusCard
                        title="Total"
                        count={counts.total}
                        icon={Users}
                        colorClass="text-muted-foreground"
                        statusFilter={undefined}
                        activeStatus={filters.status}
                    />
                    <StatusCard
                        title="New"
                        count={counts.new}
                        icon={Mail}
                        colorClass="text-amber-500"
                        statusFilter="new"
                        activeStatus={filters.status}
                    />
                    <StatusCard
                        title="Read"
                        count={counts.read}
                        icon={Eye}
                        colorClass="text-blue-500"
                        statusFilter="read"
                        activeStatus={filters.status}
                    />
                    <StatusCard
                        title="Handled"
                        count={counts.handled}
                        icon={MailCheck}
                        colorClass="text-green-500"
                        statusFilter="handled"
                        activeStatus={filters.status}
                    />
                </div>

                <DataTable<ContactLead>
                    columns={columns}
                    data={leads.data}
                    searchValue={filters.search}
                    searchUrl="/admin/contacts"
                    searchPlaceholder="Search by name or email..."
                    emptyMessage="No contact leads found."
                />

                <AdminPagination links={leads.links} />
            </div>
        </>
    );
}

ContactsIndex.layout = {
    breadcrumbs: [
        { title: 'Admin', href: '/admin' },
        { title: 'Contact Leads', href: '/admin/contacts' },
    ],
};
