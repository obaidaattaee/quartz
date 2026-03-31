import { Head, router, useForm } from '@inertiajs/react';
import { Check, Pencil, Plus, Trash2, X } from 'lucide-react';
import { useCallback, useState } from 'react';

import InputError from '@/components/input-error';
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
import { Input } from '@/components/ui/input';
import type { AdminCategory } from '@/types';

function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/-+/g, '-');
}

type Props = {
    categories: AdminCategory[];
};

export default function CategoryIndex({ categories }: Props) {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<AdminCategory | null>(
        null,
    );

    const createForm = useForm({
        name_en: '',
        name_ar: '',
        slug: '',
        sort_order: 0,
    });

    const editForm = useForm({
        name_en: '',
        name_ar: '',
        slug: '',
        sort_order: 0,
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        createForm.post('/admin/categories', {
            preserveScroll: true,
            onSuccess: () => {
                createForm.reset();
                setShowCreateForm(false);
            },
        });
    };

    const startEditing = (category: AdminCategory) => {
        setEditingId(category.id);
        editForm.setData({
            name_en: category.name_en,
            name_ar: category.name_ar,
            slug: category.slug,
            sort_order: category.sort_order,
        });
    };

    const cancelEditing = () => {
        setEditingId(null);
        editForm.clearErrors();
    };

    const handleUpdate = (e: React.FormEvent, id: number) => {
        e.preventDefault();
        editForm.put(`/admin/categories/${id}`, {
            preserveScroll: true,
            onSuccess: () => setEditingId(null),
        });
    };

    const handleDelete = useCallback(() => {
        if (!deleteTarget) {
            return;
        }

        router.delete(`/admin/categories/${deleteTarget.id}`, {
            preserveScroll: true,
            onFinish: () => setDeleteTarget(null),
        });
    }, [deleteTarget]);

    return (
        <>
            <Head title="Categories" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold tracking-tight">
                        Categories
                    </h1>
                    <Button
                        onClick={() => setShowCreateForm(!showCreateForm)}
                    >
                        <Plus className="mr-1 h-4 w-4" />
                        Add Category
                    </Button>
                </div>

                {showCreateForm && (
                    <form
                        onSubmit={handleCreate}
                        className="bg-card rounded-lg border p-4"
                    >
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                            <div className="space-y-1">
                                <Input
                                    value={createForm.data.name_en}
                                    onChange={(e) =>
                                        createForm.setData(
                                            'name_en',
                                            e.target.value,
                                        )
                                    }
                                    onBlur={() => {
                                        if (!createForm.data.slug) {
                                            createForm.setData(
                                                'slug',
                                                slugify(
                                                    createForm.data.name_en,
                                                ),
                                            );
                                        }
                                    }}
                                    placeholder="Name (English)"
                                />
                                <InputError
                                    message={createForm.errors.name_en}
                                />
                            </div>
                            <div className="space-y-1">
                                <Input
                                    value={createForm.data.name_ar}
                                    onChange={(e) =>
                                        createForm.setData(
                                            'name_ar',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Name (Arabic)"
                                    dir="rtl"
                                />
                                <InputError
                                    message={createForm.errors.name_ar}
                                />
                            </div>
                            <div className="space-y-1">
                                <Input
                                    value={createForm.data.slug}
                                    onChange={(e) =>
                                        createForm.setData(
                                            'slug',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="slug"
                                />
                                <InputError
                                    message={createForm.errors.slug}
                                />
                            </div>
                            <div className="space-y-1">
                                <Input
                                    type="number"
                                    min="0"
                                    value={createForm.data.sort_order}
                                    onChange={(e) =>
                                        createForm.setData(
                                            'sort_order',
                                            parseInt(e.target.value) || 0,
                                        )
                                    }
                                    placeholder="Sort Order"
                                />
                                <InputError
                                    message={createForm.errors.sort_order}
                                />
                            </div>
                            <div className="flex items-start gap-2">
                                <Button
                                    type="submit"
                                    size="sm"
                                    disabled={createForm.processing}
                                >
                                    <Check className="mr-1 h-4 w-4" />
                                    Create
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        setShowCreateForm(false);
                                        createForm.reset();
                                    }}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </form>
                )}

                <div className="rounded-lg border">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b">
                                <th className="px-4 py-3 text-left text-sm font-medium">
                                    Name (EN)
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium">
                                    Name (AR)
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium">
                                    Slug
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium">
                                    Order
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium">
                                    Posts
                                </th>
                                <th className="px-4 py-3 text-right text-sm font-medium">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.length === 0 && (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="text-muted-foreground px-4 py-8 text-center text-sm"
                                    >
                                        No categories yet. Click &quot;Add
                                        Category&quot; to create one.
                                    </td>
                                </tr>
                            )}

                            {categories.map((category) =>
                                editingId === category.id ? (
                                    <tr
                                        key={category.id}
                                        className="border-b"
                                    >
                                        <td className="px-4 py-2">
                                            <Input
                                                value={editForm.data.name_en}
                                                onChange={(e) =>
                                                    editForm.setData(
                                                        'name_en',
                                                        e.target.value,
                                                    )
                                                }
                                                className="h-8"
                                            />
                                            <InputError
                                                message={
                                                    editForm.errors.name_en
                                                }
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <Input
                                                value={editForm.data.name_ar}
                                                onChange={(e) =>
                                                    editForm.setData(
                                                        'name_ar',
                                                        e.target.value,
                                                    )
                                                }
                                                className="h-8"
                                                dir="rtl"
                                            />
                                            <InputError
                                                message={
                                                    editForm.errors.name_ar
                                                }
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <Input
                                                value={editForm.data.slug}
                                                onChange={(e) =>
                                                    editForm.setData(
                                                        'slug',
                                                        e.target.value,
                                                    )
                                                }
                                                className="h-8"
                                            />
                                            <InputError
                                                message={editForm.errors.slug}
                                            />
                                        </td>
                                        <td className="px-4 py-2">
                                            <Input
                                                type="number"
                                                min="0"
                                                value={
                                                    editForm.data.sort_order
                                                }
                                                onChange={(e) =>
                                                    editForm.setData(
                                                        'sort_order',
                                                        parseInt(
                                                            e.target.value,
                                                        ) || 0,
                                                    )
                                                }
                                                className="h-8 w-20"
                                            />
                                            <InputError
                                                message={
                                                    editForm.errors.sort_order
                                                }
                                            />
                                        </td>
                                        <td className="text-muted-foreground px-4 py-2 text-sm">
                                            {category.posts_count ?? 0}
                                        </td>
                                        <td className="px-4 py-2 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    disabled={
                                                        editForm.processing
                                                    }
                                                    onClick={(e) =>
                                                        handleUpdate(
                                                            e,
                                                            category.id,
                                                        )
                                                    }
                                                >
                                                    <Check className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={cancelEditing}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    <tr
                                        key={category.id}
                                        className="border-b last:border-0"
                                    >
                                        <td className="px-4 py-3 text-sm">
                                            {category.name_en}
                                        </td>
                                        <td
                                            className="px-4 py-3 text-sm"
                                            dir="rtl"
                                        >
                                            {category.name_ar}
                                        </td>
                                        <td className="text-muted-foreground px-4 py-3 text-sm">
                                            {category.slug}
                                        </td>
                                        <td className="text-muted-foreground px-4 py-3 text-sm">
                                            {category.sort_order}
                                        </td>
                                        <td className="text-muted-foreground px-4 py-3 text-sm">
                                            {category.posts_count ?? 0}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        startEditing(category)
                                                    }
                                                >
                                                    <Pencil className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() =>
                                                        setDeleteTarget(
                                                            category,
                                                        )
                                                    }
                                                >
                                                    <Trash2 className="text-destructive h-4 w-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ),
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Dialog
                open={!!deleteTarget}
                onOpenChange={(open) => !open && setDeleteTarget(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Category</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete &quot;
                            {deleteTarget?.name_en}&quot;? Posts assigned to
                            this category will be unlinked but not deleted.
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

CategoryIndex.layout = {
    breadcrumbs: [
        { title: 'Admin', href: '/admin' },
        { title: 'Categories', href: '/admin/categories' },
    ],
};
