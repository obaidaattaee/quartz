import { Head, useForm } from '@inertiajs/react';
import { ExternalLink } from 'lucide-react';
import type { ReactNode } from 'react';

import BilingualTabs from '@/components/admin/bilingual-tabs';
import RepeaterField, {
    StringListField,
} from '@/components/admin/repeater-field';
import type { RepeaterColumn } from '@/components/admin/repeater-field';
import TagInput from '@/components/admin/tag-input';
import InputError from '@/components/input-error';
import { Badge } from '@/components/ui/badge';
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
import { Textarea } from '@/components/ui/textarea';
import type { ServicePageData } from '@/types';
import type {
    ServiceEngagement,
    ServiceFaq,
    ServicePain,
} from '@/types/service';

type Props = {
    service: ServicePageData;
};

type Locale = 'en' | 'ar';

type StepRow = {
    title: string;
    duration: string;
    description: string;
};

type TextKey =
    | 'title'
    | 'tagline'
    | 'subtitle'
    | 'audience'
    | 'cta_text'
    | 'problem'
    | 'approach';

const STEP_COLUMNS: RepeaterColumn<StepRow>[] = [
    { key: 'title', label: 'Title', half: true },
    {
        key: 'duration',
        label: 'Duration (optional)',
        half: true,
        placeholder: 'e.g. 1–2 weeks',
    },
    { key: 'description', label: 'Description', multiline: true },
];

const PAIN_COLUMNS: RepeaterColumn<ServicePain>[] = [
    {
        key: 'problem',
        label: 'What the client is dealing with',
        multiline: true,
    },
    { key: 'solution', label: 'What changes', multiline: true },
];

const ENGAGEMENT_COLUMNS: RepeaterColumn<ServiceEngagement>[] = [
    { key: 'title', label: 'Title', half: true },
    {
        key: 'duration',
        label: 'Duration',
        half: true,
        placeholder: 'e.g. 2 weeks, fixed price',
    },
    { key: 'description', label: 'Description', multiline: true },
    { key: 'best_for', label: 'Best for' },
];

const FAQ_COLUMNS: RepeaterColumn<ServiceFaq>[] = [
    { key: 'question', label: 'Question' },
    { key: 'answer', label: 'Answer', multiline: true, rows: 3 },
];

function toSteps(steps: ServicePageData['process_steps_en'] | null): StepRow[] {
    const rows = (steps ?? []).map((s) => ({
        title: s.title ?? '',
        duration: s.duration ?? '',
        description: s.description ?? '',
    }));

    return rows.length > 0
        ? rows
        : [{ title: '', duration: '', description: '' }];
}

function dirFor(locale: Locale): 'ltr' | 'rtl' {
    return locale === 'ar' ? 'rtl' : 'ltr';
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

export default function ServiceEdit({ service }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        title_en: service.title_en ?? '',
        title_ar: service.title_ar ?? '',
        tagline_en: service.tagline_en ?? '',
        tagline_ar: service.tagline_ar ?? '',
        subtitle_en: service.subtitle_en ?? '',
        subtitle_ar: service.subtitle_ar ?? '',
        audience_en: service.audience_en ?? '',
        audience_ar: service.audience_ar ?? '',
        cta_text_en: service.cta_text_en ?? '',
        cta_text_ar: service.cta_text_ar ?? '',
        problem_en: service.problem_en ?? '',
        problem_ar: service.problem_ar ?? '',
        pains_en: (service.pains_en ?? []) as ServicePain[],
        pains_ar: (service.pains_ar ?? []) as ServicePain[],
        deliverables_en: (service.deliverables_en?.length
            ? service.deliverables_en
            : ['']) as string[],
        deliverables_ar: (service.deliverables_ar?.length
            ? service.deliverables_ar
            : ['']) as string[],
        approach_en: service.approach_en ?? '',
        approach_ar: service.approach_ar ?? '',
        process_steps_en: toSteps(service.process_steps_en),
        process_steps_ar: toSteps(service.process_steps_ar),
        engagements_en: (service.engagements_en ?? []) as ServiceEngagement[],
        engagements_ar: (service.engagements_ar ?? []) as ServiceEngagement[],
        tools: (service.tools ?? []) as string[],
        faqs_en: (service.faqs_en ?? []) as ServiceFaq[],
        faqs_ar: (service.faqs_ar ?? []) as ServiceFaq[],
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

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        put(`/admin/services/${service.id}`);
    }

    return (
        <>
            <Head title={`Edit: ${service.title_en}`} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-0.5">
                        <h1 className="text-xl font-semibold tracking-tight">
                            {service.title_en}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Content for /services/{service.slug}, in page order.
                            Changes go live when you save.
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
                                    href={`/${locale}/services/${service.slug}`}
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
                        description="The top of the page: the headline, the intro paragraph, who it's for and the main button."
                    >
                        <BilingualTabs
                            errors={formErrors as Record<string, string>}
                        >
                            {(locale) => (
                                <div className="space-y-4 pt-4">
                                    {textField(
                                        'title',
                                        locale,
                                        'Service name',
                                        {
                                            help: 'Shown above the headline, in menus, on the services list and as the browser tab title.',
                                        },
                                    )}
                                    {textField(
                                        'tagline',
                                        locale,
                                        'Headline (tagline)',
                                        {
                                            help: 'The big promise at the top of the page. Leave empty to use the service name.',
                                        },
                                    )}
                                    {textField(
                                        'subtitle',
                                        locale,
                                        'Intro paragraph',
                                        {
                                            multiline: true,
                                            rows: 2,
                                            help: 'Shown under the headline and used as the search-engine description.',
                                        },
                                    )}
                                    {textField(
                                        'audience',
                                        locale,
                                        "Who it's for",
                                        {
                                            multiline: true,
                                            help: 'Shown in the hero under the "Who it\'s for" label.',
                                        },
                                    )}
                                    {textField(
                                        'cta_text',
                                        locale,
                                        'Button text (optional)',
                                        {
                                            help: 'Label of the main hero button. Leave empty for "Book a Call".',
                                        },
                                    )}
                                </div>
                            )}
                        </BilingualTabs>
                    </Section>

                    <Section
                        title="Problems"
                        description={
                            'The "Problems we solve" section: an intro, then each problem paired with what changes. 3–4 pairs work best (max 6). The section is hidden when there are no pairs.'
                        }
                    >
                        <BilingualTabs
                            errors={formErrors as Record<string, string>}
                        >
                            {(locale) => {
                                const key = `pains_${locale}` as const;

                                return (
                                    <div className="space-y-4 pt-4">
                                        {textField('problem', locale, 'Intro', {
                                            multiline: true,
                                        })}
                                        <RepeaterField
                                            name={key}
                                            items={data[key]}
                                            onChange={(items) =>
                                                setData(key, items)
                                            }
                                            columns={PAIN_COLUMNS}
                                            blank={{
                                                problem: '',
                                                solution: '',
                                            }}
                                            errors={formErrors}
                                            itemLabel="Problem"
                                            addLabel="Add Problem"
                                            maxItems={6}
                                            dir={dirFor(locale)}
                                            emptyText="No problems yet."
                                        />
                                    </div>
                                );
                            }}
                        </BilingualTabs>
                    </Section>

                    <Section
                        title="Deliverables"
                        description={
                            'The "What you get" grid: one short line per deliverable.'
                        }
                    >
                        <BilingualTabs
                            errors={formErrors as Record<string, string>}
                        >
                            {(locale) => {
                                const key = `deliverables_${locale}` as const;

                                return (
                                    <div className="pt-4">
                                        <StringListField
                                            name={key}
                                            items={data[key]}
                                            onChange={(items) =>
                                                setData(key, items)
                                            }
                                            errors={formErrors}
                                            itemLabel="Deliverable"
                                            addLabel="Add Deliverable"
                                            minItems={1}
                                            dir={dirFor(locale)}
                                        />
                                    </div>
                                );
                            }}
                        </BilingualTabs>
                    </Section>

                    <Section
                        title="Process"
                        description={
                            'The "How we work" section: an intro, then the steps in order. The duration shows as a small label above each step.'
                        }
                    >
                        <BilingualTabs
                            errors={formErrors as Record<string, string>}
                        >
                            {(locale) => {
                                const key = `process_steps_${locale}` as const;

                                return (
                                    <div className="space-y-4 pt-4">
                                        {textField(
                                            'approach',
                                            locale,
                                            'Intro',
                                            {
                                                multiline: true,
                                            },
                                        )}
                                        <RepeaterField
                                            name={key}
                                            items={data[key]}
                                            onChange={(items) =>
                                                setData(key, items)
                                            }
                                            columns={STEP_COLUMNS}
                                            blank={{
                                                title: '',
                                                duration: '',
                                                description: '',
                                            }}
                                            errors={formErrors}
                                            itemLabel="Step"
                                            addLabel="Add Step"
                                            minItems={1}
                                            dir={dirFor(locale)}
                                        />
                                    </div>
                                );
                            }}
                        </BilingualTabs>
                    </Section>

                    <Section
                        title="Where to start"
                        description={
                            'The "Where to start" cards. The first option is highlighted as "Usual first step", and its title and duration also appear in the hero ("Usually starts with…"). 3 options work best (max 4).'
                        }
                    >
                        <BilingualTabs
                            errors={formErrors as Record<string, string>}
                        >
                            {(locale) => {
                                const key = `engagements_${locale}` as const;

                                return (
                                    <div className="pt-4">
                                        <RepeaterField
                                            name={key}
                                            items={data[key]}
                                            onChange={(items) =>
                                                setData(key, items)
                                            }
                                            columns={ENGAGEMENT_COLUMNS}
                                            blank={{
                                                title: '',
                                                duration: '',
                                                description: '',
                                                best_for: '',
                                            }}
                                            errors={formErrors}
                                            itemLabel="Option"
                                            addLabel="Add Option"
                                            maxItems={4}
                                            dir={dirFor(locale)}
                                            rowNote={(index) =>
                                                index === 0 ? (
                                                    <Badge variant="brand">
                                                        Usual first step
                                                    </Badge>
                                                ) : null
                                            }
                                            emptyText="No options yet. The section and the hero's “Usually starts with” line are hidden."
                                        />
                                    </div>
                                );
                            }}
                        </BilingualTabs>
                    </Section>

                    <Section
                        title="Tools"
                        description={
                            'The "Tools we use" list. Shared by both languages. Type a tool and press Enter (max 20).'
                        }
                    >
                        <div className="space-y-2">
                            <Label htmlFor="tools">Tools</Label>
                            <TagInput
                                id="tools"
                                name="tools"
                                values={data.tools}
                                onChange={(values) => setData('tools', values)}
                                errors={formErrors}
                                maxItems={20}
                                maxLength={40}
                                placeholder="e.g. Laravel"
                            />
                        </div>
                    </Section>

                    <Section
                        title="FAQ"
                        description={
                            'The "Questions about …" section near the bottom of the page. 4–5 questions work best (max 10).'
                        }
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
                                            onChange={(items) =>
                                                setData(key, items)
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

ServiceEdit.layout = {
    breadcrumbs: [
        { title: 'Admin', href: '/admin' },
        { title: 'Services', href: '/admin/services' },
        { title: 'Edit', href: '#' },
    ],
};
