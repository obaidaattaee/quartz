export type IndustryItem = {
    title: string;
    description: string;
};

export type IndustrySummary = {
    id: number;
    slug: string;
    title_en: string;
    title_ar: string;
    hero_blurb_en: string;
    hero_blurb_ar: string;
    cover_image: string | null;
};

export type IndustryDetail = IndustrySummary & {
    challenges_en: IndustryItem[];
    challenges_ar: IndustryItem[];
    solutions_en: IndustryItem[];
    solutions_ar: IndustryItem[];
    compliance_note_en: string | null;
    compliance_note_ar: string | null;
    sort_order: number;
    is_visible: boolean;
};

export type IndustrySlug =
    | 'retail-pos'
    | 'healthcare'
    | 'financial-services'
    | 'government'
    | 'education';

export type IndustryServiceSlug =
    | 'development'
    | 'automation'
    | 'web-development'
    | 'mobile-apps'
    | 'qa'
    | 'cybersecurity';

export type IndustrySolution = {
    title: string;
    description: string;
    service: IndustryServiceSlug | null;
    service_title: string | null;
};

export type IndustryCompliance = {
    name: string;
    description: string;
};

export type IndustryFaq = {
    question: string;
    answer: string;
};

/** One industry, already localised by IndustryController::localized(). */
export type IndustryPage = {
    slug: string;
    title: string;
    tagline: string;
    lead: string;
    summary: string | null;
    audience: string | null;
    primary_service: IndustryServiceSlug | null;
    realities: IndustryItem[];
    solutions: IndustrySolution[];
    compliance_note: string | null;
    compliance: IndustryCompliance[];
    examples: IndustryItem[];
    faqs: IndustryFaq[];
    cta: string | null;
};

export type IndustryLink = {
    slug: string;
    title: string;
    summary: string | null;
};

export type IndustryIndexItem = IndustryLink & {
    solutions: IndustrySolution[];
    compliance: string[];
};

export type IndustryDiscipline = {
    slug: IndustryServiceSlug;
    title: string | null;
    services: IndustryServiceSlug[];
};

/** Raw row as the admin edit form receives it. */
export type IndustryAdminRow = IndustryDetail & {
    tagline_en: string | null;
    tagline_ar: string | null;
    summary_en: string | null;
    summary_ar: string | null;
    audience_en: string | null;
    audience_ar: string | null;
    primary_service: string | null;
    compliance_items_en: IndustryCompliance[] | null;
    compliance_items_ar: IndustryCompliance[] | null;
    examples_en: IndustryItem[] | null;
    examples_ar: IndustryItem[] | null;
    faqs_en: IndustryFaq[] | null;
    faqs_ar: IndustryFaq[] | null;
    cta_text_en: string | null;
    cta_text_ar: string | null;
};
