import { Head, useForm } from '@inertiajs/react';
import { ExternalLink } from 'lucide-react';
import type { ReactNode } from 'react';

import BilingualTabs from '@/components/admin/bilingual-tabs';
import RepeaterField from '@/components/admin/repeater-field';
import type { RepeaterColumn } from '@/components/admin/repeater-field';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import type {
    IndustryAdminRow,
    IndustryCompliance,
    IndustryFaq,
    IndustryItem,
} from '@/types/industry';

type ServiceOption = {
    value: string;
    label: string;
};

type Props = {
    industry: IndustryAdminRow;
    services: ServiceOption[];
};

type Locale = 'en' | 'ar';

type SolutionRow = {
    title: string;
    description: string;
    service: string;
};

type TextKey =
    | 'title'
    | 'tagline'
    | 'hero_blurb'
    | 'summary'
    | 'audience'
    | 'cta_text'
    | 'compliance_note';

const SELECT_CLASS =
    'h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 outline-none';

const REALITY_COLUMNS: RepeaterColumn<IndustryItem>[] = [
    { key: 'title', label: 'Short title' },
    { key: 'description', label: 'One or two sentences', multiline: true },
];

const SOLUTION_COLUMNS: RepeaterColumn<SolutionRow>[] = [
    { key: 'title', label: 'What we build' },
    { key: 'description', label: 'Description', multiline: true },
];

const COMPLIANCE_COLUMNS: RepeaterColumn<IndustryCompliance>[] = [
    {
        key: 'name',
        label: 'Rule or constraint',
        placeholder: 'e.g. ZATCA e-invoicing (Fatoora)',
    },
    {
        key: 'description',
        label: 'What we build or review against',
        multiline: true,
    },
];

const EXAMPLE_COLUMNS: RepeaterColumn<IndustryItem>[] = [
    { key: 'title', label: 'Example system' },
    { key: 'description', label: 'Description', multiline: true },
];

const FAQ_COLUMNS: RepeaterColumn<IndustryFaq>[] = [
    { key: 'question', label: 'Question' },
    { key: 'answer', label: 'Answer', multiline: true, rows: 3 },
];

function dirFor(locale: Locale): 'ltr' | 'rtl' {
    return locale === 'ar' ? 'rtl' : 'ltr';
}

function items<T>(value: T[] | null | undefined): T[] {
    return Array.isArray(value) ? value : [];
}

function toSolutions(
    rows: (IndustryItem & { service?: string | null })[] | null,
): SolutionRow[] {
    return items(rows).map((row) => ({
        title: row.title ?? '',
        description: row.description ?? '',
        service: row.service ?? '',
    }));
}

function Section({
    title,
    description,
    children,
}: {
    title: string;
    description: string;
    children: ReactNode;
}) {
    return (
        <Card className="border-sidebar-border/70 dark:border-sidebar-border">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>{children}</CardContent>
        </Card>
    );
}

export default function IndustryEdit({ industry, services }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        title_en: industry.title_en ?? '',
        title_ar: industry.title_ar ?? '',
        tagline_en: industry.tagline_en ?? '',
        tagline_ar: industry.tagline_ar ?? '',
        hero_blurb_en: industry.hero_blurb_en ?? '',
        hero_blurb_ar: industry.hero_blurb_ar ?? '',
        summary_en: industry.summary_en ?? '',
        summary_ar: industry.summary_ar ?? '',
        audience_en: industry.audience_en ?? '',
        audience_ar: industry.audience_ar ?? '',
        cta_text_en: industry.cta_text_en ?? '',
        cta_text_ar: industry.cta_text_ar ?? '',
        primary_service: industry.primary_service ?? '',
        challenges_en: items(industry.challenges_en) as IndustryItem[],
        challenges_ar: items(industry.challenges_ar) as IndustryItem[],
        solutions_en: toSolutions(industry.solutions_en),
        solutions_ar: toSolutions(industry.solutions_ar),
        compliance_note_en: industry.compliance_note_en ?? '',
        compliance_note_ar: industry.compliance_note_ar ?? '',
        compliance_items_en: items(industry.compliance_items_en),
        compliance_items_ar: items(industry.compliance_items_ar),
        examples_en: items(industry.examples_en),
        examples_ar: items(industry.examples_ar),
        faqs_en: items(industry.faqs_en),
        faqs_ar: items(industry.faqs_ar),
        sort_order: industry.sort_order ?? 0,
        is_visible: industry.is_visible ?? true,
    });

    const formErrors = errors as Partial<Record<string, string>>;

    function textField(
        base: TextKey,
        locale: Locale,
        label: string,
        options: {
            multiline?: boolean;
            rows?: number;
            help?: string;
            placeholder?: string;
        } = {},
    ) {
        const key = `${base}_${locale}` as const;
        const id = key;
        const common = {
            id,
            dir: dirFor(locale),
            value: data[key],
            placeholder: options.placeholder,
            'aria-describedby': options.help ? `${id}-help` : undefined,
        };

        return (
            <div className="space-y-2">
                <Label htmlFor={id}>{label}</Label>
                {options.multiline ? (
                    <Textarea
                        {...common}
                        rows={options.rows ?? 3}
                        onChange={(e) => setData(key, e.target.value)}
                    />
                ) : (
                    <Input
                        {...common}
                        onChange={(e) => setData(key, e.target.value)}
                    />
                )}
                {options.help && (
                    <p
                        id={`${id}-help`}
                        className="text-xs text-muted-foreground"
                    >
                        {options.help}
                    </p>
                )}
                <InputError message={formErrors[key]} />
            </div>
        );
    }

    // The service picker sits in each solution card's header, next to its
    // number, so the shared RepeaterField does not need a select column.
    function servicePicker(locale: Locale, index: number) {
        const key = `solutions_${locale}` as const;
        const row = data[key][index];
        const id = `${key}-${index}-service`;

        if (!row) {
            return null;
        }

        return (
            <span className="flex items-center gap-2 font-normal">
                <label htmlFor={id} className="sr-only">
                    Service for solution {index + 1}
                </label>
                <select
                    id={id}
                    dir="ltr"
                    className="h-8 rounded-md border border-input bg-transparent px-2 text-xs text-foreground"
                    value={row.service}
                    onChange={(e) => {
                        const next = [...data[key]];
                        next[index] = { ...row, service: e.target.value };
                        setData(key, next);
                    }}
                >
                    <option value="">No service link</option>
                    {services.map((s) => (
                        <option key={s.value} value={s.value}>
                            {s.label}
                        </option>
                    ))}
                </select>
                {formErrors[`${key}.${index}.service`] && (
                    <span
                        role="alert"
                        className="text-xs text-red-600 dark:text-red-400"
                    >
                        {formErrors[`${key}.${index}.service`]}
                    </span>
                )}
            </span>
        );
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        put(`/admin/industries/${industry.id}`);
    }

    return (
        <>
            <Head title={`Edit: ${industry.title_en}`} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-0.5">
                        <h1 className="text-xl font-semibold tracking-tight">
                            {industry.title_en}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Content for /industries/{industry.slug}, in page
                            order. Changes go live when you save.
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {(['en', 'ar'] as const).map((locale) => (
                            <Button
                                key={locale}
                                variant="outline"
                                size="sm"
                                asChild
                            >
                                <a
                                    href={`/${locale}/industries/${industry.slug}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    View{' '}
                                    {locale === 'en' ? 'English' : 'Arabic'}{' '}
                                    page
                                    <ExternalLink className="ms-1 h-3.5 w-3.5" />
                                    <span className="sr-only">
                                        (opens in a new tab)
                                    </span>
                                </a>
                            </Button>
                        ))}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <Section
                        title="Hero"
                        description="The top of the page: the sector name, the headline, the intro paragraph, who it's for and the main button. The short summary appears on the industries list."
                    >
                        <BilingualTabs
                            errors={formErrors as Record<string, string>}
                        >
                            {(locale) => (
                                <div className="space-y-4 pt-4">
                                    {textField('title', locale, 'Sector name', {
                                        help: 'Shown above the headline, on the industries list and as the browser tab title.',
                                    })}
                                    {textField(
                                        'tagline',
                                        locale,
                                        'Headline (tagline)',
                                        {
                                            help: 'The big promise at the top of the page. Leave empty to use the sector name.',
                                        },
                                    )}
                                    {textField(
                                        'hero_blurb',
                                        locale,
                                        'Intro paragraph',
                                        { multiline: true, rows: 3 },
                                    )}
                                    {textField(
                                        'summary',
                                        locale,
                                        'Short summary',
                                        {
                                            multiline: true,
                                            rows: 2,
                                            help: 'One sentence for the industries list and the search-engine description (max 300 characters). Falls back to the intro paragraph.',
                                        },
                                    )}
                                    {textField(
                                        'audience',
                                        locale,
                                        "Who it's for",
                                        { multiline: true, rows: 2 },
                                    )}
                                    {textField(
                                        'cta_text',
                                        locale,
                                        'Button text (optional)',
                                        {
                                            help: 'Label of the main button. Leave empty for "Book a call".',
                                        },
                                    )}
                                </div>
                            )}
                        </BilingualTabs>
                        <div className="mt-6 space-y-2 border-t pt-4">
                            <Label htmlFor="primary_service">
                                Main service
                            </Label>
                            <select
                                id="primary_service"
                                className={SELECT_CLASS}
                                value={data.primary_service}
                                aria-describedby="primary_service-help"
                                onChange={(e) =>
                                    setData('primary_service', e.target.value)
                                }
                            >
                                <option value="">None</option>
                                {services.map((s) => (
                                    <option key={s.value} value={s.value}>
                                        {s.label}
                                    </option>
                                ))}
                            </select>
                            <p
                                id="primary_service-help"
                                className="text-xs text-muted-foreground"
                            >
                                Preselected on the contact form when a visitor
                                clicks the page's button. Shared by both
                                languages.
                            </p>
                            <InputError message={formErrors.primary_service} />
                        </div>
                    </Section>

                    <Section
                        title="Reality on the ground"
                        description="The sector's day-to-day problems, in the words clients use. 3–4 work best (max 6). The section is hidden when empty."
                    >
                        <BilingualTabs
                            errors={formErrors as Record<string, string>}
                        >
                            {(locale) => {
                                const key = `challenges_${locale}` as const;

                                return (
                                    <div className="pt-4">
                                        <RepeaterField
                                            name={key}
                                            items={data[key]}
                                            onChange={(rows) =>
                                                setData(key, rows)
                                            }
                                            columns={REALITY_COLUMNS}
                                            blank={{
                                                title: '',
                                                description: '',
                                            }}
                                            errors={formErrors}
                                            itemLabel="Reality"
                                            addLabel="Add Reality"
                                            maxItems={6}
                                            dir={dirFor(locale)}
                                            emptyText="No realities yet. The section is hidden."
                                        />
                                    </div>
                                );
                            }}
                        </BilingualTabs>
                    </Section>

                    <Section
                        title="What we build"
                        description="Solution cards. Pick the service that delivers each one: the card links to that service page, and the industries list groups solutions by service. 4–5 work best (max 6)."
                    >
                        <BilingualTabs
                            errors={formErrors as Record<string, string>}
                        >
                            {(locale) => {
                                const key = `solutions_${locale}` as const;

                                return (
                                    <div className="pt-4">
                                        <RepeaterField
                                            name={key}
                                            items={data[key]}
                                            onChange={(rows) =>
                                                setData(key, rows)
                                            }
                                            columns={SOLUTION_COLUMNS}
                                            blank={{
                                                title: '',
                                                description: '',
                                                service: '',
                                            }}
                                            errors={formErrors}
                                            itemLabel="Solution"
                                            addLabel="Add Solution"
                                            maxItems={6}
                                            dir={dirFor(locale)}
                                            rowNote={(index) =>
                                                servicePicker(locale, index)
                                            }
                                            emptyText="No solutions yet. The section is hidden."
                                        />
                                    </div>
                                );
                            }}
                        </BilingualTabs>
                    </Section>

                    <Section
                        title="Rules and constraints"
                        description="Regulations and constraints we build for or review against (never certifications we hold). A fixed note under the intro says the client's team keeps the compliance sign-off. Max 8."
                    >
                        <BilingualTabs
                            errors={formErrors as Record<string, string>}
                        >
                            {(locale) => {
                                const key =
                                    `compliance_items_${locale}` as const;

                                return (
                                    <div className="space-y-4 pt-4">
                                        {textField(
                                            'compliance_note',
                                            locale,
                                            'Intro',
                                            { multiline: true },
                                        )}
                                        <RepeaterField
                                            name={key}
                                            items={data[key]}
                                            onChange={(rows) =>
                                                setData(key, rows)
                                            }
                                            columns={COMPLIANCE_COLUMNS}
                                            blank={{
                                                name: '',
                                                description: '',
                                            }}
                                            errors={formErrors}
                                            itemLabel="Rule"
                                            addLabel="Add Rule"
                                            maxItems={8}
                                            dir={dirFor(locale)}
                                            emptyText="No rules yet."
                                        />
                                    </div>
                                );
                            }}
                        </BilingualTabs>
                    </Section>

                    <Section
                        title="Example systems"
                        description='Shown with an "Illustrative example" badge. Describe what we could build, never a past client or a result. Max 4; the section is hidden when empty.'
                    >
                        <BilingualTabs
                            errors={formErrors as Record<string, string>}
                        >
                            {(locale) => {
                                const key = `examples_${locale}` as const;

                                return (
                                    <div className="pt-4">
                                        <RepeaterField
                                            name={key}
                                            items={data[key]}
                                            onChange={(rows) =>
                                                setData(key, rows)
                                            }
                                            columns={EXAMPLE_COLUMNS}
                                            blank={{
                                                title: '',
                                                description: '',
                                            }}
                                            errors={formErrors}
                                            itemLabel="Example"
                                            addLabel="Add Example"
                                            maxItems={4}
                                            dir={dirFor(locale)}
                                            emptyText="No examples yet. The section is hidden."
                                        />
                                    </div>
                                );
                            }}
                        </BilingualTabs>
                    </Section>

                    <Section
                        title="FAQ"
                        description='The "Common questions" section near the bottom of the page, also published as FAQ structured data for search engines. 4–5 questions work best (max 10).'
                    >
                        <BilingualTabs
                            errors={formErrors as Record<string, string>}
                        >
                            {(locale) => {
                                const key = `faqs_${locale}` as const;

                                return (
                                    <div className="pt-4">
                                        <RepeaterField
                                            name={key}
                                            items={data[key]}
                                            onChange={(rows) =>
                                                setData(key, rows)
                                            }
                                            columns={FAQ_COLUMNS}
                                            blank={{ question: '', answer: '' }}
                                            errors={formErrors}
                                            itemLabel="Question"
                                            addLabel="Add Question"
                                            maxItems={10}
                                            dir={dirFor(locale)}
                                            emptyText="No questions yet. The section is hidden."
                                        />
                                    </div>
                                );
                            }}
                        </BilingualTabs>
                    </Section>

                    <Section
                        title="Settings"
                        description="Where the sector appears in lists, and whether the page is public."
                    >
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="sort_order">
                                    Display order
                                </Label>
                                <Input
                                    id="sort_order"
                                    type="number"
                                    min={0}
                                    value={data.sort_order}
                                    aria-describedby="sort_order-help"
                                    onChange={(e) =>
                                        setData(
                                            'sort_order',
                                            Number(e.target.value),
                                        )
                                    }
                                />
                                <p
                                    id="sort_order-help"
                                    className="text-xs text-muted-foreground"
                                >
                                    Lower numbers appear first.
                                </p>
                                <InputError message={formErrors.sort_order} />
                            </div>
                            <div className="flex items-center gap-3 sm:pt-6">
                                <Switch
                                    id="is_visible"
                                    checked={data.is_visible}
                                    onCheckedChange={(v) =>
                                        setData('is_visible', v)
                                    }
                                />
                                <Label htmlFor="is_visible">
                                    Visible on the public site
                                </Label>
                            </div>
                        </div>
                    </Section>

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

IndustryEdit.layout = {
    breadcrumbs: [
        { title: 'Admin', href: '/admin' },
        { title: 'Industries', href: '/admin/industries' },
        { title: 'Edit', href: '#' },
    ],
};
