import { Head, Link, useForm } from '@inertiajs/react';

import BilingualTabs from '@/components/admin/bilingual-tabs';
import ImagePickerField from '@/components/admin/image-picker-field';
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
import { Textarea } from '@/components/ui/textarea';
import type { MediaItem } from '@/types';

type Props = {
    nextSortOrder: number;
};

export default function TeamCreate({ nextSortOrder }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        name_en: '',
        name_ar: '',
        role_en: '',
        role_ar: '',
        bio_en: '',
        bio_ar: '',
        photo_id: null as number | null,
        photo: null as MediaItem | null,
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/admin/team');
    }

    return (
        <>
            <Head title="Add Team Member" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold tracking-tight">
                        Add Team Member
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Name & Role</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <BilingualTabs errors={errors}>
                                {(locale) => (
                                    <div className="space-y-4 pt-4">
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor={`name_${locale}`}
                                            >
                                                Name (
                                                {locale === 'en'
                                                    ? 'English'
                                                    : 'Arabic'}
                                                )
                                            </Label>
                                            <Input
                                                id={`name_${locale}`}
                                                value={
                                                    locale === 'en'
                                                        ? data.name_en
                                                        : data.name_ar
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        locale === 'en'
                                                            ? 'name_en'
                                                            : 'name_ar',
                                                        e.target.value,
                                                    )
                                                }
                                                dir={
                                                    locale === 'ar'
                                                        ? 'rtl'
                                                        : 'ltr'
                                                }
                                            />
                                            <InputError
                                                message={
                                                    errors[
                                                        `name_${locale}` as keyof typeof errors
                                                    ]
                                                }
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor={`role_${locale}`}
                                            >
                                                Role (
                                                {locale === 'en'
                                                    ? 'English'
                                                    : 'Arabic'}
                                                )
                                            </Label>
                                            <Input
                                                id={`role_${locale}`}
                                                value={
                                                    locale === 'en'
                                                        ? data.role_en
                                                        : data.role_ar
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        locale === 'en'
                                                            ? 'role_en'
                                                            : 'role_ar',
                                                        e.target.value,
                                                    )
                                                }
                                                dir={
                                                    locale === 'ar'
                                                        ? 'rtl'
                                                        : 'ltr'
                                                }
                                            />
                                            <InputError
                                                message={
                                                    errors[
                                                        `role_${locale}` as keyof typeof errors
                                                    ]
                                                }
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor={`bio_${locale}`}
                                            >
                                                Bio (optional)
                                            </Label>
                                            <Textarea
                                                id={`bio_${locale}`}
                                                value={
                                                    locale === 'en'
                                                        ? data.bio_en
                                                        : data.bio_ar
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        locale === 'en'
                                                            ? 'bio_en'
                                                            : 'bio_ar',
                                                        e.target.value,
                                                    )
                                                }
                                                dir={
                                                    locale === 'ar'
                                                        ? 'rtl'
                                                        : 'ltr'
                                                }
                                                rows={4}
                                            />
                                            <InputError
                                                message={
                                                    errors[
                                                        `bio_${locale}` as keyof typeof errors
                                                    ]
                                                }
                                            />
                                        </div>
                                    </div>
                                )}
                            </BilingualTabs>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Photo</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ImagePickerField
                                value={data.photo}
                                onChange={(media) => {
                                    setData((prev) => ({
                                        ...prev,
                                        photo_id: media?.id ?? null,
                                        photo: media,
                                    }));
                                }}
                                label="Member Photo"
                            />
                        </CardContent>
                    </Card>

                    <div className="flex items-center gap-3">
                        <Button type="submit" disabled={processing}>
                            Add Team Member
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/admin/team">Cancel</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

TeamCreate.layout = {
    breadcrumbs: [
        { title: 'Admin', href: '/admin' },
        { title: 'Team Members', href: '/admin/team' },
        { title: 'Create', href: '/admin/team/create' },
    ],
};
