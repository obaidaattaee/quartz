import { Head, useForm } from '@inertiajs/react';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

import ImagePickerField from '@/components/admin/image-picker-field';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { MediaItem, SeoMetadataItem } from '@/types';

type PageKey = {
    key: string;
    label: string;
};

type PageSeoData = {
    meta_title_en: string;
    meta_title_ar: string;
    meta_description_en: string;
    meta_description_ar: string;
    og_image_id: number | null;
};

type Props = {
    seoData: Record<string, SeoMetadataItem>;
    pageKeys: PageKey[];
};

export default function SeoSettings({ seoData, pageKeys }: Props) {
    const [expandedKeys, setExpandedKeys] = useState<Set<string>>(
        new Set(),
    );
    const [ogImages, setOgImages] = useState<
        Record<string, MediaItem | null>
    >(() => {
        const images: Record<string, MediaItem | null> = {};

        for (const pk of pageKeys) {
            images[pk.key] = seoData[pk.key]?.og_image ?? null;
        }

        return images;
    });

    const initialPages: Record<string, PageSeoData> = {};

    for (const pk of pageKeys) {
        const existing = seoData[pk.key];
        initialPages[pk.key] = {
            meta_title_en: existing?.meta_title_en ?? '',
            meta_title_ar: existing?.meta_title_ar ?? '',
            meta_description_en: existing?.meta_description_en ?? '',
            meta_description_ar: existing?.meta_description_ar ?? '',
            og_image_id: existing?.og_image_id ?? null,
        };
    }

    const { data, setData, put, processing, errors } = useForm({
        pages: initialPages,
    });

    const toggleSection = (key: string) => {
        setExpandedKeys((prev) => {
            const next = new Set(prev);

            if (next.has(key)) {
                next.delete(key);
            } else {
                next.add(key);
            }

            return next;
        });
    };

    const updatePageField = (
        pageKey: string,
        field: keyof PageSeoData,
        value: string | number | null,
    ) => {
        setData('pages', {
            ...data.pages,
            [pageKey]: {
                ...data.pages[pageKey],
                [field]: value,
            },
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put('/admin/seo');
    };

    return (
        <>
            <Head title="SEO Settings" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        SEO Settings
                    </h1>
                    <p className="text-muted-foreground mt-1 text-sm">
                        Manage meta titles, descriptions, and OG images for
                        static pages.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="mx-auto w-full max-w-4xl space-y-4"
                >
                    {pageKeys.map((pk) => {
                        const isExpanded = expandedKeys.has(pk.key);
                        const pageData = data.pages[pk.key];

                        return (
                            <div
                                key={pk.key}
                                className="rounded-lg border"
                            >
                                <button
                                    type="button"
                                    onClick={() => toggleSection(pk.key)}
                                    className="flex w-full items-center justify-between px-4 py-3 text-left"
                                >
                                    <span className="text-sm font-medium">
                                        {pk.label}
                                    </span>
                                    <ChevronDown
                                        className={`text-muted-foreground h-4 w-4 transition-transform ${
                                            isExpanded ? 'rotate-180' : ''
                                        }`}
                                    />
                                </button>

                                {isExpanded && (
                                    <div className="space-y-4 border-t px-4 py-4">
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor={`${pk.key}-title-en`}
                                                >
                                                    Meta Title (English)
                                                </Label>
                                                <Input
                                                    id={`${pk.key}-title-en`}
                                                    value={
                                                        pageData.meta_title_en
                                                    }
                                                    onChange={(e) =>
                                                        updatePageField(
                                                            pk.key,
                                                            'meta_title_en',
                                                            e.target.value,
                                                        )
                                                    }
                                                    maxLength={70}
                                                    placeholder="Page title for search engines"
                                                />
                                                <div className="flex items-center justify-between">
                                                    <InputError
                                                        message={
                                                            errors[
                                                                `pages.${pk.key}.meta_title_en` as keyof typeof errors
                                                            ]
                                                        }
                                                    />
                                                    <span
                                                        className={`text-xs ${
                                                            pageData
                                                                .meta_title_en
                                                                .length > 60
                                                                ? 'text-amber-500'
                                                                : 'text-muted-foreground'
                                                        }`}
                                                    >
                                                        {
                                                            pageData
                                                                .meta_title_en
                                                                .length
                                                        }
                                                        /70
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor={`${pk.key}-title-ar`}
                                                >
                                                    Meta Title (Arabic)
                                                </Label>
                                                <Input
                                                    id={`${pk.key}-title-ar`}
                                                    value={
                                                        pageData.meta_title_ar
                                                    }
                                                    onChange={(e) =>
                                                        updatePageField(
                                                            pk.key,
                                                            'meta_title_ar',
                                                            e.target.value,
                                                        )
                                                    }
                                                    maxLength={70}
                                                    placeholder="Page title in Arabic"
                                                    dir="rtl"
                                                />
                                                <div className="flex items-center justify-between">
                                                    <InputError
                                                        message={
                                                            errors[
                                                                `pages.${pk.key}.meta_title_ar` as keyof typeof errors
                                                            ]
                                                        }
                                                    />
                                                    <span
                                                        className={`text-xs ${
                                                            pageData
                                                                .meta_title_ar
                                                                .length > 60
                                                                ? 'text-amber-500'
                                                                : 'text-muted-foreground'
                                                        }`}
                                                    >
                                                        {
                                                            pageData
                                                                .meta_title_ar
                                                                .length
                                                        }
                                                        /70
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor={`${pk.key}-desc-en`}
                                                >
                                                    Meta Description
                                                    (English)
                                                </Label>
                                                <Textarea
                                                    id={`${pk.key}-desc-en`}
                                                    value={
                                                        pageData.meta_description_en
                                                    }
                                                    onChange={(e) =>
                                                        updatePageField(
                                                            pk.key,
                                                            'meta_description_en',
                                                            e.target.value,
                                                        )
                                                    }
                                                    maxLength={160}
                                                    placeholder="Brief description for search results"
                                                    rows={3}
                                                />
                                                <div className="flex items-center justify-between">
                                                    <InputError
                                                        message={
                                                            errors[
                                                                `pages.${pk.key}.meta_description_en` as keyof typeof errors
                                                            ]
                                                        }
                                                    />
                                                    <span
                                                        className={`text-xs ${
                                                            pageData
                                                                .meta_description_en
                                                                .length > 150
                                                                ? 'text-amber-500'
                                                                : 'text-muted-foreground'
                                                        }`}
                                                    >
                                                        {
                                                            pageData
                                                                .meta_description_en
                                                                .length
                                                        }
                                                        /160
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label
                                                    htmlFor={`${pk.key}-desc-ar`}
                                                >
                                                    Meta Description
                                                    (Arabic)
                                                </Label>
                                                <Textarea
                                                    id={`${pk.key}-desc-ar`}
                                                    value={
                                                        pageData.meta_description_ar
                                                    }
                                                    onChange={(e) =>
                                                        updatePageField(
                                                            pk.key,
                                                            'meta_description_ar',
                                                            e.target.value,
                                                        )
                                                    }
                                                    maxLength={160}
                                                    placeholder="Brief description in Arabic"
                                                    rows={3}
                                                    dir="rtl"
                                                />
                                                <div className="flex items-center justify-between">
                                                    <InputError
                                                        message={
                                                            errors[
                                                                `pages.${pk.key}.meta_description_ar` as keyof typeof errors
                                                            ]
                                                        }
                                                    />
                                                    <span
                                                        className={`text-xs ${
                                                            pageData
                                                                .meta_description_ar
                                                                .length > 150
                                                                ? 'text-amber-500'
                                                                : 'text-muted-foreground'
                                                        }`}
                                                    >
                                                        {
                                                            pageData
                                                                .meta_description_ar
                                                                .length
                                                        }
                                                        /160
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <ImagePickerField
                                                label="OG Image"
                                                value={
                                                    ogImages[pk.key] ?? null
                                                }
                                                onChange={(media) => {
                                                    setOgImages((prev) => ({
                                                        ...prev,
                                                        [pk.key]: media,
                                                    }));
                                                    updatePageField(
                                                        pk.key,
                                                        'og_image_id',
                                                        media?.id ?? null,
                                                    );
                                                }}
                                            />
                                            <InputError
                                                message={
                                                    errors[
                                                        `pages.${pk.key}.og_image_id` as keyof typeof errors
                                                    ]
                                                }
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    <div className="pt-2">
                        <Button type="submit" disabled={processing}>
                            {processing
                                ? 'Saving...'
                                : 'Save SEO Settings'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

SeoSettings.layout = {
    breadcrumbs: [
        { title: 'Admin', href: '/admin' },
        { title: 'SEO Settings', href: '/admin/seo' },
    ],
};
