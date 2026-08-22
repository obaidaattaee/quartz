export type LegalSection = {
    id: string;
    heading: string;
    body: string[];
    list: string[];
};

export type LegalPageContent = {
    slug: string;
    title: string;
    summary: string;
    effective_date: string | null;
    version: string;
    sections: LegalSection[];
};

export type LegalPageData = {
    id: number;
    slug: string;
    title_en: string;
    title_ar: string;
    summary_en: string | null;
    summary_ar: string | null;
    effective_date: string | null;
    version: string;
    sections_en: { heading: string; body: string[]; list?: string[] }[];
    sections_ar: { heading: string; body: string[]; list?: string[] }[];
    is_published: boolean;
    created_at: string;
    updated_at: string;
};
