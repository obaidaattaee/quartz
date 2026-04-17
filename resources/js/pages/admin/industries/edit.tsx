import { Head, useForm } from '@inertiajs/react';
import { ArrowLeft, Plus, Save, Trash2 } from 'lucide-react';
import type { FormEvent } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import type { IndustryDetail, IndustryItem } from '@/types/industry';

type Props = {
    industry: IndustryDetail;
};

type FormData = {
    title_en: string;
    title_ar: string;
    hero_blurb_en: string;
    hero_blurb_ar: string;
    challenges_en: IndustryItem[];
    challenges_ar: IndustryItem[];
    solutions_en: IndustryItem[];
    solutions_ar: IndustryItem[];
    compliance_note_en: string;
    compliance_note_ar: string;
    cover_image: string;
    sort_order: number;
    is_visible: boolean;
};

export default function IndustryEdit({ industry }: Props) {
    const { data, setData, put, processing, errors } = useForm<FormData>({
        title_en: industry.title_en,
        title_ar: industry.title_ar,
        hero_blurb_en: industry.hero_blurb_en,
        hero_blurb_ar: industry.hero_blurb_ar,
        challenges_en: industry.challenges_en ?? [],
        challenges_ar: industry.challenges_ar ?? [],
        solutions_en: industry.solutions_en ?? [],
        solutions_ar: industry.solutions_ar ?? [],
        compliance_note_en: industry.compliance_note_en ?? '',
        compliance_note_ar: industry.compliance_note_ar ?? '',
        cover_image: industry.cover_image ?? '',
        sort_order: industry.sort_order,
        is_visible: industry.is_visible,
    });

    const submit = (e: FormEvent) => {
        e.preventDefault();
        put(`/admin/industries/${industry.id}`);
    };

    return (
        <>
            <Head title={`Edit ${industry.title_en}`} />
            <form
                onSubmit={submit}
                className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4"
            >
                <div className="flex items-center justify-between">
                    <div>
                        <Button
                            asChild
                            variant="ghost"
                            size="sm"
                            className="mb-2"
                        >
                            <a href="/admin/industries">
                                <ArrowLeft className="mr-1 h-4 w-4" />
                                All industries
                            </a>
                        </Button>
                        <h2 className="text-lg font-semibold">
                            Edit: {industry.title_en}
                        </h2>
                        <p className="text-muted-foreground text-sm">
                            /industries/{industry.slug}
                        </p>
                    </div>
                    <Button type="submit" disabled={processing}>
                        <Save className="mr-1 h-4 w-4" />
                        Save changes
                    </Button>
                </div>

                <div className="grid gap-6 lg:grid-cols-2">
                    <LocaleCard
                        locale="en"
                        title="English"
                        data={data}
                        setData={setData}
                        errors={errors}
                    />
                    <LocaleCard
                        locale="ar"
                        title="العربية"
                        data={data}
                        setData={setData}
                        errors={errors}
                    />
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 sm:grid-cols-3">
                        <div>
                            <Label htmlFor="sort_order">Sort order</Label>
                            <Input
                                id="sort_order"
                                type="number"
                                value={data.sort_order}
                                onChange={(e) =>
                                    setData(
                                        'sort_order',
                                        Number(e.target.value),
                                    )
                                }
                            />
                        </div>
                        <div>
                            <Label htmlFor="cover_image">
                                Cover image URL
                            </Label>
                            <Input
                                id="cover_image"
                                value={data.cover_image}
                                onChange={(e) =>
                                    setData('cover_image', e.target.value)
                                }
                                placeholder="/storage/industries/retail.jpg"
                            />
                        </div>
                        <div className="flex items-end gap-3">
                            <Switch
                                id="is_visible"
                                checked={data.is_visible}
                                onCheckedChange={(v) =>
                                    setData('is_visible', v)
                                }
                            />
                            <Label htmlFor="is_visible">Visible publicly</Label>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </>
    );
}

type LocaleCardProps = {
    locale: 'en' | 'ar';
    title: string;
    data: FormData;
    setData: <K extends keyof FormData>(key: K, value: FormData[K]) => void;
    errors: Partial<Record<string, string>>;
};

function LocaleCard({ locale, title, data, setData, errors }: LocaleCardProps) {
    const titleKey = `title_${locale}` as const;
    const blurbKey = `hero_blurb_${locale}` as const;
    const challengesKey = `challenges_${locale}` as const;
    const solutionsKey = `solutions_${locale}` as const;
    const complianceKey = `compliance_note_${locale}` as const;

    return (
        <Card dir={locale === 'ar' ? 'rtl' : 'ltr'}>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                <div>
                    <Label htmlFor={titleKey}>Title</Label>
                    <Input
                        id={titleKey}
                        value={data[titleKey]}
                        onChange={(e) => setData(titleKey, e.target.value)}
                    />
                    {errors[titleKey] && (
                        <p className="text-destructive mt-1 text-xs">
                            {errors[titleKey]}
                        </p>
                    )}
                </div>

                <div>
                    <Label htmlFor={blurbKey}>Hero blurb</Label>
                    <Textarea
                        id={blurbKey}
                        rows={3}
                        value={data[blurbKey]}
                        onChange={(e) => setData(blurbKey, e.target.value)}
                    />
                </div>

                <ItemListEditor
                    label="Challenges"
                    items={data[challengesKey]}
                    onChange={(items) => setData(challengesKey, items)}
                />

                <ItemListEditor
                    label="Solutions"
                    items={data[solutionsKey]}
                    onChange={(items) => setData(solutionsKey, items)}
                />

                <div>
                    <Label htmlFor={complianceKey}>Compliance note</Label>
                    <Textarea
                        id={complianceKey}
                        rows={3}
                        value={data[complianceKey]}
                        onChange={(e) =>
                            setData(complianceKey, e.target.value)
                        }
                    />
                </div>
            </CardContent>
        </Card>
    );
}

type ItemListEditorProps = {
    label: string;
    items: IndustryItem[];
    onChange: (items: IndustryItem[]) => void;
};

function ItemListEditor({ label, items, onChange }: ItemListEditorProps) {
    const update = (i: number, field: keyof IndustryItem, value: string) => {
        const next = items.map((item, idx) =>
            idx === i ? { ...item, [field]: value } : item,
        );

        onChange(next);
    };

    const add = () => {
        onChange([...items, { title: '', description: '' }]);
    };

    const remove = (i: number) => {
        onChange(items.filter((_, idx) => idx !== i));
    };

    return (
        <div className="border-border rounded-md border p-3">
            <div className="mb-2 flex items-center justify-between">
                <Label>{label}</Label>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={add}
                >
                    <Plus className="mr-1 h-4 w-4" />
                    Add
                </Button>
            </div>

            <div className="flex flex-col gap-3">
                {items.map((item, i) => (
                    <div
                        key={i}
                        className="bg-muted/30 flex flex-col gap-2 rounded-md p-2"
                    >
                        <div className="flex items-center gap-2">
                            <Input
                                value={item.title}
                                onChange={(e) =>
                                    update(i, 'title', e.target.value)
                                }
                                placeholder="Title"
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => remove(i)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                        <Textarea
                            value={item.description}
                            onChange={(e) =>
                                update(i, 'description', e.target.value)
                            }
                            placeholder="Description"
                            rows={2}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

IndustryEdit.layout = {
    breadcrumbs: [
        { title: 'Admin', href: '/admin' },
        { title: 'Industries', href: '/admin/industries' },
        { title: 'Edit', href: '#' },
    ],
};
