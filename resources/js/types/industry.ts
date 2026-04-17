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
