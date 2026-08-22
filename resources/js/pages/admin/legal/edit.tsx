import { Head, useForm } from '@inertiajs/react';
import { ChevronDown, ChevronUp, Plus, X } from 'lucide-react';

import BilingualTabs from '@/components/admin/bilingual-tabs';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { LegalPageData } from '@/types';

type Section = {
    heading: string;
    body: string[];
    list: string[];
};

type Props = {
    page: LegalPageData;
    tokens: Record<string, string>;
};

/**
 * Sections arrive without a `list` key when a section has no bullet list, so
 * normalise both arrays up front and let the editor treat them uniformly.
 */
function normalise(
    sections: { heading: string; body: string[]; list?: string[] }[] | null,
): Section[] {
    if (!sections || sections.length === 0) {
        return [{ heading: '', body: [''], list: [] }];
    }

    return sections.map((section) => ({
        heading: section.heading ?? '',
        body: section.body ?? [''],
        list: section.list ?? [],
    }));
}

export default function LegalEdit({ page, tokens }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        title_en: page.title_en ?? '',
        title_ar: page.title_ar ?? '',
        summary_en: page.summary_en ?? '',
        summary_ar: page.summary_ar ?? '',
        effective_date: page.effective_date ?? '',
        version: page.version ?? '1.0',
        is_published: page.is_published ?? true,
        sections_en: normalise(page.sections_en),
        sections_ar: normalise(page.sections_ar),
    });

    function key(locale: 'en' | 'ar') {
        return locale === 'en'
            ? ('sections_en' as const)
            : ('sections_ar' as const);
    }

    /** Apply a change to one locale's sections without mutating state in place. */
    function mutate(
        locale: 'en' | 'ar',
        update: (sections: Section[]) => Section[],
    ) {
        setData(key(locale), update([...data[key(locale)]]));
    }

    function updateSection(
        locale: 'en' | 'ar',
        index: number,
        patch: Partial<Section>,
    ) {
        mutate(locale, (sections) => {
            sections[index] = { ...sections[index], ...patch };

            return sections;
        });
    }

    function moveSection(locale: 'en' | 'ar', index: number, delta: number) {
        const target = index + delta;

        if (target < 0 || target >= data[key(locale)].length) {
            return;
        }

        mutate(locale, (sections) => {
            [sections[index], sections[target]] = [
                sections[target],
                sections[index],
            ];

            return sections;
        });
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        put(`/admin/legal/${page.id}`);
    }

    return (
        <>
            <Head title={`Edit: ${page.title_en}`} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Card className="border-sidebar-border/70 dark:border-sidebar-border">
                        <CardHeader>
                            <CardTitle className="text-base">
                                Document Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 sm:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="effective_date">
                                        Effective date
                                    </Label>
                                    <Input
                                        id="effective_date"
                                        type="date"
                                        value={data.effective_date}
                                        onChange={(e) =>
                                            setData(
                                                'effective_date',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <InputError
                                        message={errors.effective_date}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="version">Version</Label>
                                    <Input
                                        id="version"
                                        value={data.version}
                                        onChange={(e) =>
                                            setData('version', e.target.value)
                                        }
                                    />
                                    <InputError message={errors.version} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="is_published">Status</Label>
                                    <select
                                        id="is_published"
                                        className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm"
                                        value={data.is_published ? '1' : '0'}
                                        onChange={(e) =>
                                            setData(
                                                'is_published',
                                                e.target.value === '1',
                                            )
                                        }
                                    >
                                        <option value="1">Published</option>
                                        <option value="0">
                                            Unpublished (returns 404)
                                        </option>
                                    </select>
                                    <InputError message={errors.is_published} />
                                </div>
                            </div>

                            <div className="rounded-md bg-muted/40 p-3">
                                <p className="text-sm font-medium">
                                    Available placeholders
                                </p>
                                <p className="mt-1 text-xs text-muted-foreground">
                                    Type these into any heading, paragraph, or
                                    list item. They are replaced with the
                                    current Site Settings values when the page
                                    is rendered.
                                </p>
                                <ul className="mt-2 grid gap-1 text-xs sm:grid-cols-2">
                                    {Object.entries(tokens).map(
                                        ([token, value]) => (
                                            <li key={token}>
                                                <code className="rounded bg-accent/20 px-1 text-accent-foreground">
                                                    {`{{${token}}}`}
                                                </code>{' '}
                                                <span className="text-muted-foreground">
                                                    {value || '(empty)'}
                                                </span>
                                            </li>
                                        ),
                                    )}
                                </ul>
                            </div>
                        </CardContent>
                    </Card>

                    <BilingualTabs errors={errors}>
                        {(locale) => (
                            <div className="mt-4 space-y-6">
                                <Card className="border-sidebar-border/70 dark:border-sidebar-border">
                                    <CardHeader>
                                        <CardTitle className="text-base">
                                            Title & Summary
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor={`title_${locale}`}>
                                                Title
                                            </Label>
                                            <Input
                                                id={`title_${locale}`}
                                                value={data[`title_${locale}`]}
                                                onChange={(e) =>
                                                    setData(
                                                        `title_${locale}`,
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <InputError
                                                message={
                                                    errors[`title_${locale}`]
                                                }
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor={`summary_${locale}`}
                                            >
                                                Summary
                                            </Label>
                                            <Textarea
                                                id={`summary_${locale}`}
                                                rows={2}
                                                value={
                                                    data[`summary_${locale}`]
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        `summary_${locale}`,
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <InputError
                                                message={
                                                    errors[`summary_${locale}`]
                                                }
                                            />
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border-sidebar-border/70 dark:border-sidebar-border">
                                    <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                        <CardTitle className="text-base">
                                            Sections
                                        </CardTitle>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() =>
                                                mutate(locale, (sections) => [
                                                    ...sections,
                                                    {
                                                        heading: '',
                                                        body: [''],
                                                        list: [],
                                                    },
                                                ])
                                            }
                                        >
                                            <Plus className="mr-1 h-4 w-4" />
                                            Add section
                                        </Button>
                                    </CardHeader>
                                    <CardContent className="space-y-6">
                                        <InputError
                                            message={
                                                errors[`sections_${locale}`]
                                            }
                                        />

                                        {data[key(locale)].map(
                                            (section, index) => (
                                                <div
                                                    key={index}
                                                    className="rounded-md border border-border p-4"
                                                >
                                                    <div className="flex items-start gap-2">
                                                        <span className="mt-2 text-sm text-muted-foreground tabular-nums">
                                                            {index + 1}.
                                                        </span>
                                                        <Input
                                                            aria-label="Section heading"
                                                            placeholder="Section heading"
                                                            value={
                                                                section.heading
                                                            }
                                                            onChange={(e) =>
                                                                updateSection(
                                                                    locale,
                                                                    index,
                                                                    {
                                                                        heading:
                                                                            e
                                                                                .target
                                                                                .value,
                                                                    },
                                                                )
                                                            }
                                                        />
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            aria-label="Move section up"
                                                            onClick={() =>
                                                                moveSection(
                                                                    locale,
                                                                    index,
                                                                    -1,
                                                                )
                                                            }
                                                        >
                                                            <ChevronUp className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            aria-label="Move section down"
                                                            onClick={() =>
                                                                moveSection(
                                                                    locale,
                                                                    index,
                                                                    1,
                                                                )
                                                            }
                                                        >
                                                            <ChevronDown className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            aria-label="Remove section"
                                                            onClick={() =>
                                                                mutate(
                                                                    locale,
                                                                    (
                                                                        sections,
                                                                    ) => {
                                                                        sections.splice(
                                                                            index,
                                                                            1,
                                                                        );

                                                                        return sections;
                                                                    },
                                                                )
                                                            }
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>

                                                    <div className="mt-4 space-y-2">
                                                        <Label className="text-xs">
                                                            Paragraphs
                                                        </Label>
                                                        {section.body.map(
                                                            (
                                                                paragraph,
                                                                bodyIndex,
                                                            ) => (
                                                                <div
                                                                    key={
                                                                        bodyIndex
                                                                    }
                                                                    className="flex gap-2"
                                                                >
                                                                    <Textarea
                                                                        rows={3}
                                                                        value={
                                                                            paragraph
                                                                        }
                                                                        onChange={(
                                                                            e,
                                                                        ) =>
                                                                            updateSection(
                                                                                locale,
                                                                                index,
                                                                                {
                                                                                    body: section.body.map(
                                                                                        (
                                                                                            p,
                                                                                            i,
                                                                                        ) =>
                                                                                            i ===
                                                                                            bodyIndex
                                                                                                ? e
                                                                                                      .target
                                                                                                      .value
                                                                                                : p,
                                                                                    ),
                                                                                },
                                                                            )
                                                                        }
                                                                    />
                                                                    <Button
                                                                        type="button"
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        aria-label="Remove paragraph"
                                                                        onClick={() =>
                                                                            updateSection(
                                                                                locale,
                                                                                index,
                                                                                {
                                                                                    body: section.body.filter(
                                                                                        (
                                                                                            _,
                                                                                            i,
                                                                                        ) =>
                                                                                            i !==
                                                                                            bodyIndex,
                                                                                    ),
                                                                                },
                                                                            )
                                                                        }
                                                                    >
                                                                        <X className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            ),
                                                        )}
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                updateSection(
                                                                    locale,
                                                                    index,
                                                                    {
                                                                        body: [
                                                                            ...section.body,
                                                                            '',
                                                                        ],
                                                                    },
                                                                )
                                                            }
                                                        >
                                                            <Plus className="mr-1 h-4 w-4" />
                                                            Add paragraph
                                                        </Button>
                                                    </div>

                                                    <div className="mt-4 space-y-2">
                                                        <Label className="text-xs">
                                                            Bullet list
                                                            (optional)
                                                        </Label>
                                                        {section.list.map(
                                                            (
                                                                item,
                                                                listIndex,
                                                            ) => (
                                                                <div
                                                                    key={
                                                                        listIndex
                                                                    }
                                                                    className="flex gap-2"
                                                                >
                                                                    <Input
                                                                        value={
                                                                            item
                                                                        }
                                                                        onChange={(
                                                                            e,
                                                                        ) =>
                                                                            updateSection(
                                                                                locale,
                                                                                index,
                                                                                {
                                                                                    list: section.list.map(
                                                                                        (
                                                                                            l,
                                                                                            i,
                                                                                        ) =>
                                                                                            i ===
                                                                                            listIndex
                                                                                                ? e
                                                                                                      .target
                                                                                                      .value
                                                                                                : l,
                                                                                    ),
                                                                                },
                                                                            )
                                                                        }
                                                                    />
                                                                    <Button
                                                                        type="button"
                                                                        variant="ghost"
                                                                        size="icon"
                                                                        aria-label="Remove list item"
                                                                        onClick={() =>
                                                                            updateSection(
                                                                                locale,
                                                                                index,
                                                                                {
                                                                                    list: section.list.filter(
                                                                                        (
                                                                                            _,
                                                                                            i,
                                                                                        ) =>
                                                                                            i !==
                                                                                            listIndex,
                                                                                    ),
                                                                                },
                                                                            )
                                                                        }
                                                                    >
                                                                        <X className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            ),
                                                        )}
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() =>
                                                                updateSection(
                                                                    locale,
                                                                    index,
                                                                    {
                                                                        list: [
                                                                            ...section.list,
                                                                            '',
                                                                        ],
                                                                    },
                                                                )
                                                            }
                                                        >
                                                            <Plus className="mr-1 h-4 w-4" />
                                                            Add list item
                                                        </Button>
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </BilingualTabs>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

LegalEdit.layout = {
    breadcrumbs: [
        { title: 'Admin', href: '/admin' },
        { title: 'Legal', href: '/admin/legal' },
        { title: 'Edit', href: '#' },
    ],
};
