export function t(
    translations: Record<string, string>,
    key: string,
    replacements?: Record<string, string>,
): string {
    let value = translations[key] ?? key;

    if (replacements) {
        Object.entries(replacements).forEach(([k, v]) => {
            value = value.replace(new RegExp(`:${k}`, 'g'), v);
        });
    }

    return value;
}

// Placeholder account names that must never be shown as a byline.
const GENERIC_AUTHOR_NAMES = new Set(['admin', 'administrator', 'user']);

/**
 * Public byline for a blog author: generic account names such as "Admin"
 * fall back to the team name.
 */
export function authorDisplayName(
    translate: (key: string) => string,
    name: string | null | undefined,
): string {
    const trimmed = name?.trim() ?? '';

    if (trimmed === '' || GENERIC_AUTHOR_NAMES.has(trimmed.toLowerCase())) {
        return translate('blog.authorFallback');
    }

    return trimmed;
}
