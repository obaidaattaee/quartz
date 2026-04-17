import type { MediaItem } from '@/types/admin';

export type Category = {
    id: number;
    name_en: string;
    name_ar: string;
    slug: string;
    sort_order: number;
};

export type Tag = {
    id: number;
    name_en: string;
    name_ar: string;
    slug: string;
};

export type Author = {
    id: number;
    name: string;
    bio_en: string | null;
    bio_ar: string | null;
    avatar_media_id: number | null;
    avatar?: MediaItem | null;
    social_links: {
        linkedin?: string;
        twitter?: string;
        github?: string;
        website?: string;
    } | null;
};

export type BlogPostSummary = {
    id: number;
    title_en: string;
    title_ar: string;
    slug: string;
    excerpt_en: string | null;
    excerpt_ar: string | null;
    content_en: string;
    content_ar: string;
    featured_image?: MediaItem | null;
    author: Author;
    categories: Category[];
    tags: Tag[];
    published_at: string;
    created_at: string;
    reading_time_en: number;
    reading_time_ar: number;
};

export type BlogPostDetail = BlogPostSummary & {
    meta_title_en: string | null;
    meta_title_ar: string | null;
    meta_description_en: string | null;
    meta_description_ar: string | null;
    og_image?: MediaItem | null;
};

export type PortfolioItemSummary = {
    id: number;
    title_en: string;
    title_ar: string;
    slug: string;
    description_en: string;
    description_ar: string;
    service_category: string;
    featured_image?: MediaItem | null;
    client_name: string | null;
};

export type PortfolioItemDetail = PortfolioItemSummary & {
    content_en: string | null;
    content_ar: string | null;
    outcome_headline_en: string | null;
    outcome_headline_ar: string | null;
    challenge_en: string | null;
    challenge_ar: string | null;
    approach_en: string | null;
    approach_ar: string | null;
    solution_en: string | null;
    solution_ar: string | null;
    results_en: string | null;
    results_ar: string | null;
    timeline: string | null;
    team_size: string | null;
    services_used: string[] | null;
    results_metrics: { label: string; value: string }[] | null;
    before_image?: MediaItem | null;
    after_image?: MediaItem | null;
};

export type SeoData = {
    title: string;
    description?: string | null;
    image?: string | null;
    url: string;
    type?: string;
    canonical?: string;
    hreflang?: Record<string, string>;
};

export type PaginatedResponse<T> = {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
};
