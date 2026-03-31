/**
 * Calculate estimated reading time for content.
 *
 * Uses 200 wpm for English and 180 wpm for Arabic
 * (Arabic has longer word structures on average).
 */
export function calculateReadingTime(
    htmlContent: string,
    locale: 'en' | 'ar',
): number {
    const text = htmlContent.replace(/<[^>]*>/g, '');
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    const wordsPerMinute = locale === 'ar' ? 180 : 200;

    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

/**
 * Generate share URLs for social platforms.
 */
export function getShareUrls(
    url: string,
    title: string,
): {
    linkedin: string;
    twitter: string;
    whatsapp: string;
} {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);

    return {
        linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
        whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    };
}
