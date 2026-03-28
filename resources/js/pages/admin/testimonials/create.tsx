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
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import type { MediaItem } from '@/types';

type Props = {
    nextSortOrder: number;
};

export default function TestimonialCreate({ nextSortOrder }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        quote_en: '',
        quote_ar: '',
        author_name_en: '',
        author_name_ar: '',
        author_title_en: '',
        author_title_ar: '',
        company_en: '',
        company_ar: '',
        photo_id: null as number | null,
        photo: null as MediaItem | null,
        is_visible: true,
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post('/admin/testimonials');
    }

    return (
        <>
            <Head title="Create Testimonial" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold tracking-tight">
                        Create Testimonial
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Quote & Author</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <BilingualTabs errors={errors}>
                                {(locale) => (
                                    <div className="space-y-4 pt-4">
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor={`quote_${locale}`}
                                            >
                                                Quote (
                                                {locale === 'en'
                                                    ? 'English'
                                                    : 'Arabic'}
                                                )
                                            </Label>
                                            <Textarea
                                                id={`quote_${locale}`}
                                                value={
                                                    locale === 'en'
                                                        ? data.quote_en
                                                        : data.quote_ar
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        locale === 'en'
                                                            ? 'quote_en'
                                                            : 'quote_ar',
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
                                                        `quote_${locale}` as keyof typeof errors
                                                    ]
                                                }
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor={`author_name_${locale}`}
                                            >
                                                Author Name
                                            </Label>
                                            <Input
                                                id={`author_name_${locale}`}
                                                value={
                                                    locale === 'en'
                                                        ? data.author_name_en
                                                        : data.author_name_ar
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        locale === 'en'
                                                            ? 'author_name_en'
                                                            : 'author_name_ar',
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
                                                        `author_name_${locale}` as keyof typeof errors
                                                    ]
                                                }
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor={`author_title_${locale}`}
                                            >
                                                Author Title (optional)
                                            </Label>
                                            <Input
                                                id={`author_title_${locale}`}
                                                value={
                                                    locale === 'en'
                                                        ? data.author_title_en ||
                                                          ''
                                                        : data.author_title_ar ||
                                                          ''
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        locale === 'en'
                                                            ? 'author_title_en'
                                                            : 'author_title_ar',
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
                                                        `author_title_${locale}` as keyof typeof errors
                                                    ]
                                                }
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor={`company_${locale}`}
                                            >
                                                Company (optional)
                                            </Label>
                                            <Input
                                                id={`company_${locale}`}
                                                value={
                                                    locale === 'en'
                                                        ? data.company_en || ''
                                                        : data.company_ar || ''
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        locale === 'en'
                                                            ? 'company_en'
                                                            : 'company_ar',
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
                                                        `company_${locale}` as keyof typeof errors
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
                            <CardTitle>Photo & Visibility</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <ImagePickerField
                                value={data.photo}
                                onChange={(media) => {
                                    setData((prev) => ({
                                        ...prev,
                                        photo_id: media?.id ?? null,
                                        photo: media,
                                    }));
                                }}
                                label="Author Photo"
                            />

                            <div className="flex items-center gap-3">
                                <Switch
                                    id="is_visible"
                                    checked={data.is_visible}
                                    onCheckedChange={(checked) =>
                                        setData('is_visible', checked)
                                    }
                                />
                                <Label htmlFor="is_visible">
                                    Visible on website
                                </Label>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex items-center gap-3">
                        <Button type="submit" disabled={processing}>
                            Create Testimonial
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/admin/testimonials">Cancel</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

TestimonialCreate.layout = {
    breadcrumbs: [
        { title: 'Admin', href: '/admin' },
        { title: 'Testimonials', href: '/admin/testimonials' },
        { title: 'Create', href: '/admin/testimonials/create' },
    ],
};
