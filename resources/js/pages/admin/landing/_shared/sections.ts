// Field definitions for the homepage ("landing") content editors. Each
// section maps to one landing_* table read by HomeController; the shared
// list and form components render from these definitions.

export type LandingSectionKey =
    | 'services'
    | 'process-steps'
    | 'case-studies'
    | 'faqs';

export type LandingField = {
    name: string;
    label: string;
    kind: 'input' | 'textarea' | 'tags' | 'portfolio';
    // Bilingual fields are stored as `${name}_en` / `${name}_ar`.
    bilingual: boolean;
    help?: string;
    placeholder?: string;
    optional?: boolean;
};

export type LandingItem = {
    id: number;
    sort_order: number;
    is_visible?: boolean;
    [key: string]: unknown;
};

export type LandingSection = {
    key: LandingSectionKey;
    title: string;
    singular: string;
    description: string;
    homepageSection: string;
    hasVisibility: boolean;
    warning?: string;
    fields: LandingField[];
    // Fields shown as the title / subtitle of each row in the list.
    summary: { title: string; subtitle: string; prefix?: string };
};

export const LANDING_SECTIONS: Record<LandingSectionKey, LandingSection> = {
    services: {
        key: 'services',
        title: 'Services',
        singular: 'Service',
        description:
            'The numbered service rows in the “What we do” section. Shown in this order.',
        homepageSection: 'What we do',
        hasVisibility: false,
        fields: [
            { name: 'title', label: 'Title', kind: 'input', bilingual: true },
            {
                name: 'body',
                label: 'Description',
                kind: 'textarea',
                bilingual: true,
                help: 'One or two short sentences.',
            },
            {
                name: 'tags',
                label: 'Tags',
                kind: 'tags',
                bilingual: true,
                optional: true,
                placeholder: 'Web, Mobile, APIs',
                help: 'Separate tags with commas. Up to 8.',
            },
        ],
        summary: { title: 'title_en', subtitle: 'body_en' },
    },
    'process-steps': {
        key: 'process-steps',
        title: 'Process steps',
        singular: 'Process step',
        description:
            'The stages in the “How we work” section, from first workshop to ongoing support.',
        homepageSection: 'How we work',
        hasVisibility: false,
        fields: [
            {
                name: 'n',
                label: 'Step number',
                kind: 'input',
                bilingual: false,
                placeholder: '06',
                help: 'Shown as “Stage 06”. Same in both languages.',
            },
            { name: 'title', label: 'Title', kind: 'input', bilingual: true },
            {
                name: 'body',
                label: 'Description',
                kind: 'textarea',
                bilingual: true,
            },
            {
                name: 'duration',
                label: 'Typical duration',
                kind: 'input',
                bilingual: true,
                placeholder: '1–2 wks',
            },
            {
                name: 'deliverable',
                label: 'Deliverable',
                kind: 'input',
                bilingual: true,
                placeholder: 'Findings doc',
            },
        ],
        summary: { title: 'title_en', subtitle: 'body_en', prefix: 'n' },
    },
    'case-studies': {
        key: 'case-studies',
        title: 'Case studies',
        singular: 'Case study',
        description:
            'Client results in the “Selected work” section. Hidden case studies stay saved but are not shown.',
        homepageSection: 'Selected work',
        hasVisibility: true,
        warning:
            'Only publish real, verifiable results. These are public claims about real clients.',
        fields: [
            {
                name: 'client',
                label: 'Client',
                kind: 'input',
                bilingual: true,
                placeholder: 'Client name, e.g. a retailer with 40 stores',
            },
            {
                name: 'tag',
                label: 'Industry tag',
                kind: 'input',
                bilingual: true,
                placeholder: 'RETAIL',
                help: 'Short label shown above the headline.',
            },
            {
                name: 'headline',
                label: 'Headline',
                kind: 'textarea',
                bilingual: true,
                help: 'One sentence describing what was delivered.',
            },
            {
                name: 'metric',
                label: 'Result figure',
                kind: 'input',
                bilingual: false,
                placeholder: '+18%',
                help: 'The large number, e.g. “+18%” or “4×”. Same in both languages.',
            },
            {
                name: 'metric_label',
                label: 'Result label',
                kind: 'input',
                bilingual: true,
                placeholder: 'avg. basket size',
                help: 'What the figure measures.',
            },
            {
                name: 'portfolio_slug',
                label: 'Linked portfolio project',
                kind: 'portfolio',
                bilingual: false,
                optional: true,
                help: 'Optional. When set, the row links to that portfolio page.',
            },
        ],
        summary: {
            title: 'headline_en',
            subtitle: 'client_en',
            prefix: 'metric',
        },
    },
    faqs: {
        key: 'faqs',
        title: 'FAQs',
        singular: 'FAQ',
        description:
            'Questions and answers in the homepage FAQ section. Hidden FAQs stay saved but are not shown.',
        homepageSection: 'FAQ',
        hasVisibility: true,
        fields: [
            {
                name: 'question',
                label: 'Question',
                kind: 'input',
                bilingual: true,
            },
            {
                name: 'answer',
                label: 'Answer',
                kind: 'textarea',
                bilingual: true,
            },
        ],
        summary: { title: 'question_en', subtitle: 'answer_en' },
    },
};

export const LANDING_SECTION_ORDER: LandingSectionKey[] = [
    'services',
    'process-steps',
    'case-studies',
    'faqs',
];

export function landingBreadcrumbs(
    key: LandingSectionKey,
    leaf?: { title: string; href: string },
) {
    const section = LANDING_SECTIONS[key];

    return [
        { title: 'Admin', href: '/admin' },
        { title: 'Homepage', href: '/admin/landing' },
        { title: section.title, href: `/admin/landing/${key}` },
        ...(leaf ? [leaf] : []),
    ];
}
