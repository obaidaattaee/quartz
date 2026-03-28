import { Head, Link, router, usePage } from '@inertiajs/react';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

import AdminPagination from '@/components/admin/admin-pagination';
import type { PaginationLink } from '@/components/admin/admin-pagination';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import type { Auth, User } from '@/types';

type PaginatedUsers = {
    data: User[];
    links: PaginationLink[];
};

type Props = {
    users: PaginatedUsers;
};

export default function UsersIndex({ users }: Props) {
    const { auth } = usePage<{ auth: Auth }>().props;
    const [deleting, setDeleting] = useState<number | null>(null);

    function handleDelete(user: User) {
        if (
            !confirm(
                `Are you sure you want to delete "${user.name}"?`,
            )
        ) {
            return;
        }

        setDeleting(user.id);
        router.delete(`/admin/users/${user.id}`, {
            onFinish: () => setDeleting(null),
        });
    }

    return (
        <>
            <Head title="Users & Roles" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold">
                            Users & Roles
                        </h2>
                        <p className="text-muted-foreground text-sm">
                            Manage user accounts and role assignments.
                        </p>
                    </div>
                    <Button asChild>
                        <Link href="/admin/users/create">
                            <Plus className="mr-1 h-4 w-4" />
                            Add User
                        </Link>
                    </Button>
                </div>

                <Card className="border-sidebar-border/70 dark:border-sidebar-border">
                    <CardContent className="p-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-muted-foreground border-b text-left">
                                        <th className="px-4 py-3 font-medium">
                                            Name
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Email
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Role
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Created
                                        </th>
                                        <th className="px-4 py-3 font-medium">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.data.map((user) => (
                                        <tr
                                            key={user.id}
                                            className="border-b last:border-0"
                                        >
                                            <td className="px-4 py-3 font-medium">
                                                {user.name}
                                            </td>
                                            <td className="px-4 py-3">
                                                {user.email}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                                                        user.role ===
                                                        'admin'
                                                            ? 'bg-primary/10 text-primary'
                                                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                                    }`}
                                                >
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                {new Date(
                                                    user.created_at,
                                                ).toLocaleDateString()}
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        asChild
                                                    >
                                                        <Link
                                                            href={`/admin/users/${user.id}/edit`}
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                    {user.id !==
                                                        auth.user
                                                            .id && (
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() =>
                                                                handleDelete(
                                                                    user,
                                                                )
                                                            }
                                                            disabled={
                                                                deleting ===
                                                                user.id
                                                            }
                                                        >
                                                            <Trash2 className="h-4 w-4 text-red-500" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>

                <AdminPagination links={users.links} />
            </div>
        </>
    );
}

UsersIndex.layout = {
    breadcrumbs: [
        { title: 'Admin', href: '/admin' },
        { title: 'Users & Roles', href: '/admin/users' },
    ],
};
