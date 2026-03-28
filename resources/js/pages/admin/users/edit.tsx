import { Head, useForm } from '@inertiajs/react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { User } from '@/types';

type Props = {
    user: User;
};

export default function UsersEdit({ user }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        password: '',
        password_confirmation: '',
        role: user.role ?? 'editor',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        put(`/admin/users/${user.id}`);
    }

    return (
        <>
            <Head title={`Edit User: ${user.name}`} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4">
                <div>
                    <h2 className="text-lg font-semibold">
                        Edit User
                    </h2>
                    <p className="text-muted-foreground text-sm">
                        Update account details and role for{' '}
                        {user.name}.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="max-w-2xl space-y-6"
                >
                    <Card className="border-sidebar-border/70 dark:border-sidebar-border">
                        <CardHeader>
                            <CardTitle>Account Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData(
                                            'name',
                                            e.target.value,
                                        )
                                    }
                                    autoFocus
                                />
                                <InputError
                                    message={errors.name}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) =>
                                        setData(
                                            'email',
                                            e.target.value,
                                        )
                                    }
                                />
                                <InputError
                                    message={errors.email}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">
                                    Password
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData(
                                            'password',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Leave blank to keep current password"
                                />
                                <InputError
                                    message={errors.password}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password_confirmation">
                                    Confirm Password
                                </Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    value={
                                        data.password_confirmation
                                    }
                                    onChange={(e) =>
                                        setData(
                                            'password_confirmation',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Leave blank to keep current password"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="role">Role</Label>
                                <select
                                    id="role"
                                    value={data.role}
                                    onChange={(e) =>
                                        setData(
                                            'role',
                                            e.target.value,
                                        )
                                    }
                                    className="border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 flex h-9 w-full rounded-md border px-3 py-1 text-base shadow-xs outline-none focus-visible:ring-[3px] md:text-sm"
                                >
                                    <option value="editor">
                                        Editor
                                    </option>
                                    <option value="admin">
                                        Admin
                                    </option>
                                </select>
                                <InputError
                                    message={errors.role}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={processing}
                        >
                            {processing
                                ? 'Saving...'
                                : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

UsersEdit.layout = {
    breadcrumbs: [
        { title: 'Admin', href: '/admin' },
        { title: 'Users & Roles', href: '/admin/users' },
        { title: 'Edit', href: '#' },
    ],
};
