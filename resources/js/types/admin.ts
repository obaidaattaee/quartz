export type AdminMetrics = {
    total_leads: number;
    new_leads: number;
    blog_posts: number;
    published_posts: number;
    portfolio_items: number;
    testimonials: number;
};

export type RecentLead = {
    id: number;
    name: string;
    email: string;
    service: string;
    status: string;
    created_at: string;
};

export type MediaItem = {
    id: number;
    filename: string;
    path: string;
    mime_type: string;
    size: number;
    width: number | null;
    height: number | null;
    url: string;
    thumbnail_sm_url: string | null;
    thumbnail_md_url: string | null;
    created_at: string;
};

export type BlogPost = {
    id: number;
    title_en: string;
    title_ar: string;
    slug: string;
    excerpt_en: string | null;
    excerpt_ar: string | null;
    content_en: string;
    content_ar: string;
    featured_image_id: number | null;
    featured_image?: MediaItem | null;
    author_id: number;
    status: 'draft' | 'published';
    published_at: string | null;
    created_at: string;
    updated_at: string;
};

export type PortfolioItem = {
    id: number;
    title_en: string;
    title_ar: string;
    slug: string;
    description_en: string;
    description_ar: string;
    content_en: string | null;
    content_ar: string | null;
    service_category: string;
    featured_image_id: number | null;
    featured_image?: MediaItem | null;
    client_name: string | null;
    results_metrics: { label: string; value: string }[] | null;
    status: 'draft' | 'published';
    sort_order: number;
    created_at: string;
    updated_at: string;
};

export type Testimonial = {
    id: number;
    quote_en: string;
    quote_ar: string;
    author_name_en: string;
    author_name_ar: string;
    author_title_en: string | null;
    author_title_ar: string | null;
    company_en: string | null;
    company_ar: string | null;
    photo_id: number | null;
    photo?: MediaItem | null;
    is_visible: boolean;
    sort_order: number;
    created_at: string;
    updated_at: string;
};

export type ServicePageData = {
    id: number;
    slug: string;
    title_en: string;
    title_ar: string;
    subtitle_en: string | null;
    subtitle_ar: string | null;
    problem_en: string;
    problem_ar: string;
    approach_en: string;
    approach_ar: string;
    process_steps_en: { title: string; description: string }[];
    process_steps_ar: { title: string; description: string }[];
    deliverables_en: string[];
    deliverables_ar: string[];
    cta_text_en: string | null;
    cta_text_ar: string | null;
    created_at: string;
    updated_at: string;
};

export type TeamMemberData = {
    id: number;
    name_en: string;
    name_ar: string;
    role_en: string;
    role_ar: string;
    bio_en: string | null;
    bio_ar: string | null;
    photo_id: number | null;
    photo?: MediaItem | null;
    sort_order: number;
    created_at: string;
    updated_at: string;
};

export type SiteSettings = {
    [key: string]: unknown;
    site_name?: string;
    logo_media_id?: number;
    favicon_media_id?: number;
    primary_color?: string;
    secondary_color?: string;
    contact_phone?: string;
    contact_email?: string;
    contact_whatsapp?: string;
    contact_address?: string;
    social_linkedin?: string;
    social_twitter?: string;
    social_github?: string;
    social_instagram?: string;
};

export type NavGroup = {
    label: string;
    items: import('@/types/navigation').NavItem[];
};
