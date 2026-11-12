export type ProcessStep = {
    title: string;
    description: string;
    duration?: string;
};

export type ServicePain = {
    problem: string;
    solution: string;
};

export type ServiceEngagement = {
    title: string;
    duration: string;
    description: string;
    best_for: string;
};

export type ServiceFaq = {
    question: string;
    answer: string;
};

export type ServiceSlug =
    | 'development'
    | 'automation'
    | 'web-development'
    | 'mobile-apps'
    | 'qa'
    | 'cybersecurity';

/** One service, already localised by ServiceController::localized(). */
export type ServiceDetail = {
    slug: ServiceSlug;
    title: string;
    tagline: string;
    subtitle: string | null;
    audience: string | null;
    problem: string | null;
    pains: ServicePain[];
    approach: string | null;
    steps: ProcessStep[];
    deliverables: string[];
    engagements: ServiceEngagement[];
    tools: string[];
    faqs: ServiceFaq[];
    cta: string | null;
};

export type RelatedService = {
    slug: ServiceSlug;
    title: string;
    subtitle: string | null;
};

export type ServicePageData = {
    id: number;
    slug: string;
    title_en: string;
    title_ar: string;
    subtitle_en: string;
    subtitle_ar: string;
    problem_en: string;
    problem_ar: string;
    approach_en: string;
    approach_ar: string;
    process_steps_en: ProcessStep[];
    process_steps_ar: ProcessStep[];
    deliverables_en: string[];
    deliverables_ar: string[];
    cta_text_en: string;
    cta_text_ar: string;
};
