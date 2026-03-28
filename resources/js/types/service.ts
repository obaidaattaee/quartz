export type ProcessStep = {
    title: string;
    description: string;
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
