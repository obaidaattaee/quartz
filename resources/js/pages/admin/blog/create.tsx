import { Head, Link, useForm } from '@inertiajs/react';
import { ChevronDown, X } from 'lucide-react';
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
import type { AdminCategory, MediaItem } from '@/types';

function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_]+/g, '-')
        .replace(/-+/g, '-');
}

type Props = {
    allCategories: AdminCategory[];
};

export default function BlogCreate({ allCategories }: Props) {
    const [selectedImage, setSelectedImage] = useState<MediaItem | null>(null);
    const [selectedOgImage, setSelectedOgImage] =
        useState<MediaItem | null>(null);
    const [tagInput, setTagInput] = useState('');
    const [seoExpanded, setSeoExpanded] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        title_en: '',
        title_ar: '',
        slug: '',
        excerpt_en: '',
        excerpt_ar: '',
        content_en: '',
        content_ar: '',
        featured_image_id: null as number | null,
        status: 'draft',
        category_ids: [] as number[],
        tags: [] as string[],
        meta_title_en: '',
        meta_title_ar: '',
        meta_description_en: '',
        meta_description_ar: '',
        og_image_id: null as number | null,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/blog');
    };

    const toggleCategory = (id: number) => {
        const ids = data.category_ids.includes(id)
            ? data.category_ids.filter((cid) => cid !== id)
            : [...data.category_ids, id];
        setData('category_ids', ids);
    };

    const addTag = () => {
        const trimmed = tagInput.trim();

        if (
            trimmed &&
            !data.tags.includes(trimmed)
        ) {
            setData('tags', [...data.tags, trimmed]);
            setTagInput('');
        }
    };

    const removeTag = (tag: string) => {
        setData(
            'tags',
            data.tags.filter((t) => t !== tag),
        );
    };

    const handleTagKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag();
        }
    };

    return (
        <>
            <Head title="Create Blog Post" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold tracking-tight">
                        Create Blog Post
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
                                placeholder="auto-generated-from-title"
                            />
                            <InputError message={errors.slug} />
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
                                            onBlur={() => {
                                                if (!data.slug) {
                                                    setData(
                                                        'slug',
                                                        slugify(data.title_en),
                                                    );
                                                }
                                            }}
                                            placeholder="Enter title in English"
                                        />
                                        <InputError
                                            message={errors.title_en}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="excerpt_en">
                                            Excerpt (English)
                                        </Label>
                                        <Textarea
                                            id="excerpt_en"
                                            value={data.excerpt_en}
                                            onChange={(e) =>
                                                setData(
                                                    'excerpt_en',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Short description (max 500 chars)"
                                            rows={3}
                                        />
                                        <InputError
                                            message={errors.excerpt_en}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Content (English)</Label>
                                        <TiptapEditor
                                            content={data.content_en}
                                            onChange={(html) =>
                                                setData('content_en', html)
                                            }
                                            direction="ltr"
                                            placeholder="Write your blog post content..."
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
                                        <Label htmlFor="excerpt_ar">
                                            Excerpt (Arabic)
                                        </Label>
                                        <Textarea
                                            id="excerpt_ar"
                                            value={data.excerpt_ar}
                                            onChange={(e) =>
                                                setData(
                                                    'excerpt_ar',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Short description in Arabic"
                                            rows={3}
                                            dir="rtl"
                                        />
                                        <InputError
                                            message={errors.excerpt_ar}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label>Content (Arabic)</Label>
                                        <TiptapEditor
                                            content={data.content_ar}
                                            onChange={(html) =>
                                                setData('content_ar', html)
                                            }
                                            direction="rtl"
                                            placeholder="Write your blog post content in Arabic..."
                                        />
                                        <InputError
                                            message={errors.content_ar}
                                        />
                                    </div>
                                </div>
                            )
                        }
                    </BilingualTabs>

                    {allCategories.length > 0 && (
                        <div className="space-y-3">
                            <Label>Categories</Label>
                            <div className="flex flex-wrap gap-3">
                                {allCategories.map((cat) => (
                                    <label
                                        key={cat.id}
                                        className="flex cursor-pointer items-center gap-2"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={data.category_ids.includes(
                                                cat.id,
                                            )}
                                            onChange={() =>
                                                toggleCategory(cat.id)
                                            }
                                            className="rounded border-gray-300"
                                        />
                                        <span className="text-sm">
                                            {cat.name_en}
                                        </span>
                                    </label>
                                ))}
                            </div>
                            <InputError message={errors.category_ids} />
                        </div>
                    )}

                    <div className="space-y-3">
                        <Label>Tags</Label>
                        <div className="flex items-center gap-2">
                            <Input
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleTagKeyDown}
                                onBlur={addTag}
                                placeholder="Type a tag and press Enter"
                                className="flex-1"
                            />
                        </div>
                        {data.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {data.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="bg-secondary text-secondary-foreground inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm"
                                    >
                                        {tag}
                                        <button
                                            type="button"
                                            onClick={() => removeTag(tag)}
                                            className="hover:text-destructive"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                        <InputError message={errors.tags} />
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
                                            placeholder="Leave empty to use post title"
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
                                            placeholder="Leave empty to use post title"
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
                                            placeholder="Leave empty to use excerpt"
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
                                            placeholder="Leave empty to use excerpt"
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
                            {processing ? 'Creating...' : 'Create Post'}
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href="/admin/blog">Cancel</Link>
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

BlogCreate.layout = {
    breadcrumbs: [
        { title: 'Admin', href: '/admin' },
        { title: 'Blog Posts', href: '/admin/blog' },
        { title: 'Create', href: '/admin/blog/create' },
    ],
};
