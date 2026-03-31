import { Head, Link, useForm } from '@inertiajs/react';
import { ChevronDown, Plus, X } from 'lucide-react';
import { useState } from 'react';

import BilingualTabs from '@/components/admin/bilingual-tabs';
import ImagePickerField from '@/components/admin/image-picker-field';
import TiptapEditor from '@/components/admin/tiptap-editor';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { MediaItem, PortfolioItem } from '@/types';

type Props = {
    item: PortfolioItem;
};

export default function PortfolioEdit({ item }: Props) {
    const [selectedImage, setSelectedImage] = useState<MediaItem | null>(
        item.featured_image ?? null,
    );
    const [beforeImage, setBeforeImage] = useState<MediaItem | null>(
        item.before_image ?? null,
    );
    const [afterImage, setAfterImage] = useState<MediaItem | null>(
        item.after_image ?? null,
    );
    const [selectedOgImage, setSelectedOgImage] =
        useState<MediaItem | null>(item.og_image ?? null);
    const [seoExpanded, setSeoExpanded] = useState(false);

    const { data, setData, put, processing, errors } = useForm({
        title_en: item.title_en,
        title_ar: item.title_ar,
        slug: item.slug,
        description_en: item.description_en,
        description_ar: item.description_ar,
        content_en: item.content_en ?? '',
        content_ar: item.content_ar ?? '',
        service_category: item.service_category,
        featured_image_id: item.featured_image_id,
        client_name: item.client_name ?? '',
        results_metrics: item.results_metrics ?? ([] as { label: string; value: string }[]),
        status: item.status,
        before_image_id: item.before_image_id,
        after_image_id: item.after_image_id,
        meta_title_en: item.meta_title_en ?? '',
        meta_title_ar: item.meta_title_ar ?? '',
        meta_description_en: item.meta_description_en ?? '',
        meta_description_ar: item.meta_description_ar ?? '',
        og_image_id: item.og_image_id,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/portfolio/${item.id}`);
    };

    const addMetric = () => {
        setData('results_metrics', [
            ...data.results_metrics,
            { label: '', value: '' },
        ]);
    };

    const removeMetric = (index: number) => {
        setData(
            'results_metrics',
            data.results_metrics.filter((_, i) => i !== index),
        );
    };

    const updateMetric = (
        index: number,
        field: 'label' | 'value',
        value: string,
    ) => {
        const updated = [...data.results_metrics];
        updated[index] = { ...updated[index], [field]: value };
        setData('results_metrics', updated);
    };

    return (
        <>
            <Head title="Edit Portfolio Item" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold tracking-tight">
                        Edit Portfolio Item
                    </h1>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="mx-auto w-full max-w-4xl space-y-6"
                >
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="slug">Slug</Label>
                            <Input
                                id="slug"
                                value={data.slug}
                                onChange={(e) =>
                                    setData('slug', e.target.value)
                                }
                            />
                            <InputError message={errors.slug} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="service_category">
                                Service Category
                            </Label>
                            <Select
                                value={data.service_category}
                                onValueChange={(value) =>
                                    setData('service_category', value)
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
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
                            <InputError message={errors.service_category} />
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="client_name">
                                Client Name (optional)
                            </Label>
                            <Input
                                id="client_name"
                                value={data.client_name}
                                onChange={(e) =>
                                    setData('client_name', e.target.value)
                                }
                                placeholder="Client or company name"
                            />
                            <InputError message={errors.client_name} />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select
                                value={data.status}
                                onValueChange={(value) =>
                                    setData('status', value)
                                }
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="draft">
                                        Draft
                                    </SelectItem>
                                    <SelectItem value="published">
                                        Published
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <InputError message={errors.status} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <ImagePickerField
                            label="Featured Image"
                            value={selectedImage}
                            onChange={(media) => {
                                setSelectedImage(media);
                                setData(
                                    'featured_image_id',
                                    media?.id ?? null,
                                );
                            }}
                        />
                        <InputError message={errors.featured_image_id} />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <ImagePickerField
                                label="Before Image"
                                value={beforeImage}
                                onChange={(media) => {
                                    setBeforeImage(media);
                                    setData(
                                        'before_image_id',
                                        media?.id ?? null,
                                    );
                                }}
                            />
                            <InputError message={errors.before_image_id} />
                        </div>
                        <div className="space-y-2">
                            <ImagePickerField
                                label="After Image"
                                value={afterImage}
                                onChange={(media) => {
                                    setAfterImage(media);
                                    setData(
                                        'after_image_id',
                                        media?.id ?? null,
                                    );
                                }}
                            />
                            <InputError message={errors.after_image_id} />
                        </div>
                    </div>

                    <BilingualTabs errors={errors}>
                        {(locale) =>
                            locale === 'en' ? (
                                <div className="space-y-4 pt-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title_en">
                                            Title (English)
                                        </Label>
                                        <Input
                                            id="title_en"
                                            value={data.title_en}
                                            onChange={(e) =>
                                                setData(
                                                    'title_en',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Enter title in English"
                                        />
                                        <InputError
                                            message={errors.title_en}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description_en">
                                            Description (English)
                                        </Label>
                                        <Textarea
                                            id="description_en"
                                            value={data.description_en}
                                            onChange={(e) =>
                                                setData(
                                                    'description_en',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Short description of the project"
                                            rows={3}
                                        />
                                        <InputError
                                            message={errors.description_en}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>
                                            Content (English) - optional
                                        </Label>
                                        <TiptapEditor
                                            content={data.content_en}
                                            onChange={(html) =>
                                                setData('content_en', html)
                                            }
                                            direction="ltr"
                                            placeholder="Detailed case study content..."
                                        />
                                        <InputError
                                            message={errors.content_en}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-4 pt-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="title_ar">
                                            Title (Arabic)
                                        </Label>
                                        <Input
                                            id="title_ar"
                                            value={data.title_ar}
                                            onChange={(e) =>
                                                setData(
                                                    'title_ar',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Enter title in Arabic"
                                            dir="rtl"
                                        />
                                        <InputError
                                            message={errors.title_ar}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description_ar">
                                            Description (Arabic)
                                        </Label>
                                        <Textarea
                                            id="description_ar"
                                            value={data.description_ar}
                                            onChange={(e) =>
                                                setData(
                                                    'description_ar',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Short description in Arabic"
                                            rows={3}
                                            dir="rtl"
                                        />
                                        <InputError
                                            message={errors.description_ar}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>
                                            Content (Arabic) - optional
                                        </Label>
                                        <TiptapEditor
                                            content={data.content_ar}
                                            onChange={(html) =>
                                                setData('content_ar', html)
                                            }
                                            direction="rtl"
                                            placeholder="Detailed case study content in Arabic..."
                                        />
                                        <InputError
                                            message={errors.content_ar}
                                        />
                                    </div>
                                </div>
                            )
                        }
                    </BilingualTabs>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label>Results Metrics</Label>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={addMetric}
                            >
                                <Plus className="mr-1 h-4 w-4" />
                                Add Metric
                            </Button>
                        </div>

                        {data.results_metrics.length === 0 && (
                            <p className="text-muted-foreground text-sm">
                                No metrics added yet. Click &quot;Add
                                Metric&quot; to add results like &quot;Revenue
                                Increase: 45%&quot;.
                            </p>
                        )}

                        {data.results_metrics.map((metric, index) => (
                            <div
                                key={index}
                                className="flex items-start gap-2"
                            >
                                <div className="flex-1 space-y-1">
                                    <Input
                                        value={metric.label}
                                        onChange={(e) =>
                                            updateMetric(
                                                index,
                                                'label',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Label (e.g., Revenue Increase)"
                                    />
                                    <InputError
                                        message={
                                            errors[
                                                `results_metrics.${index}.label` as keyof typeof errors
                                            ]
                                        }
                                    />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <Input
                                        value={metric.value}
                                        onChange={(e) =>
                                            updateMetric(
                                                index,
                                                'value',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="Value (e.g., 45%)"
                                    />
                                    <InputError
                                        message={
                                            errors[
                                                `results_metrics.${index}.value` as keyof typeof errors
                                            ]
                                        }
                                    />
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeMetric(index)}
                                    className="mt-0.5 shrink-0"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ))}
                        <InputError message={errors.results_metrics} />
                    </div>

                    <div className="rounded-lg border">
                        <button
                            type="button"
                            onClick={() => setSeoExpanded(!seoExpanded)}
                            className="flex w-full items-center justify-between px-4 py-3 text-left"
                        >
                            <span className="text-sm font-medium">
                                SEO Settings
                            </span>
                            <ChevronDown
                                className={`text-muted-foreground h-4 w-4 transition-transform ${
                                    seoExpanded ? 'rotate-180' : ''
                                }`}
                            />
                        </button>

                        {seoExpanded && (
                            <div className="space-y-4 border-t px-4 py-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="meta_title_en">
                                            Meta Title (English)
                                        </Label>
                                        <Input
                                            id="meta_title_en"
                                            value={data.meta_title_en}
                                            onChange={(e) =>
                                                setData(
                                                    'meta_title_en',
                                                    e.target.value,
                                                )
                                            }
                                            maxLength={70}
                                            placeholder="Leave empty to use item title"
                                        />
                                        <div className="flex items-center justify-between">
                                            <InputError
                                                message={
                                                    errors.meta_title_en
                                                }
                                            />
                                            <span className="text-muted-foreground text-xs">
                                                {data.meta_title_en.length}
                                                /70
                                            </span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="meta_title_ar">
                                            Meta Title (Arabic)
                                        </Label>
                                        <Input
                                            id="meta_title_ar"
                                            value={data.meta_title_ar}
                                            onChange={(e) =>
                                                setData(
                                                    'meta_title_ar',
                                                    e.target.value,
                                                )
                                            }
                                            maxLength={70}
                                            placeholder="Leave empty to use item title"
                                            dir="rtl"
                                        />
                                        <div className="flex items-center justify-between">
                                            <InputError
                                                message={
                                                    errors.meta_title_ar
                                                }
                                            />
                                            <span className="text-muted-foreground text-xs">
                                                {data.meta_title_ar.length}
                                                /70
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="meta_description_en">
                                            Meta Description (English)
                                        </Label>
                                        <Textarea
                                            id="meta_description_en"
                                            value={data.meta_description_en}
                                            onChange={(e) =>
                                                setData(
                                                    'meta_description_en',
                                                    e.target.value,
                                                )
                                            }
                                            maxLength={160}
                                            placeholder="Leave empty to use description"
                                            rows={3}
                                        />
                                        <div className="flex items-center justify-between">
                                            <InputError
                                                message={
                                                    errors.meta_description_en
                                                }
                                            />
                                            <span className="text-muted-foreground text-xs">
                                                {
                                                    data.meta_description_en
                                                        .length
                                                }
                                                /160
                                            </span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="meta_description_ar">
                                            Meta Description (Arabic)
                                        </Label>
                                        <Textarea
                                            id="meta_description_ar"
                                            value={data.meta_description_ar}
                                            onChange={(e) =>
                                                setData(
                                                    'meta_description_ar',
                                                    e.target.value,
                                                )
                                            }
                                            maxLength={160}
                                            placeholder="Leave empty to use description"
                                            rows={3}
                                            dir="rtl"
                                        />
                                        <div className="flex items-center justify-between">
                                            <InputError
                                                message={
                                                    errors.meta_description_ar
                                                }
                                            />
                                            <span className="text-muted-foreground text-xs">
                                                {
                                                    data.meta_description_ar
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
                                        value={selectedOgImage}
                                        onChange={(media) => {
                                            setSelectedOgImage(media);
                                            setData(
                                                'og_image_id',
                                                media?.id ?? null,
                                            );
                                        }}
                                    />
                                    <InputError
                                        message={errors.og_image_id}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center gap-3">
                        <Button type="submit" disabled={processing}>
                            {processing
                                ? 'Updating...'
                                : 'Update Portfolio Item'}
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/admin/portfolio">Cancel</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

PortfolioEdit.layout = {
    breadcrumbs: [
        { title: 'Admin', href: '/admin' },
        { title: 'Portfolio', href: '/admin/portfolio' },
        { title: 'Edit', href: '#' },
    ],
};
