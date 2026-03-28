import { Head, Link, useForm } from '@inertiajs/react';
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
import type { BlogPost, MediaItem } from '@/types';

type Props = {
    post: BlogPost;
};

export default function BlogEdit({ post }: Props) {
    const [selectedImage, setSelectedImage] = useState<MediaItem | null>(
        post.featured_image ?? null,
    );

    const { data, setData, put, processing, errors } = useForm({
        title_en: post.title_en,
        title_ar: post.title_ar,
        slug: post.slug,
        excerpt_en: post.excerpt_en ?? '',
        excerpt_ar: post.excerpt_ar ?? '',
        content_en: post.content_en,
        content_ar: post.content_ar,
        featured_image_id: post.featured_image_id,
        status: post.status,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(`/admin/blog/${post.id}`);
    };

    return (
        <>
            <Head title="Edit Blog Post" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold tracking-tight">
                        Edit Blog Post
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

                    <div className="flex items-center gap-3">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Updating...' : 'Update Post'}
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

BlogEdit.layout = {
    breadcrumbs: [
        { title: 'Admin', href: '/admin' },
        { title: 'Blog Posts', href: '/admin/blog' },
        { title: 'Edit', href: '#' },
    ],
};
