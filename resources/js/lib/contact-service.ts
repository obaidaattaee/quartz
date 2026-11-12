export type ContactService =
    | 'development'
    | 'automation'
    | 'qa'
    | 'cybersecurity'
    | 'general';

// Values the contact request accepts (App\Http\Requests\ContactRequest).
const SERVICES: ContactService[] = [
    'development',
    'automation',
    'qa',
    'cybersecurity',
    'general',
];

// Service pages without their own contact option map to their parent.
const ALIASES: Record<string, ContactService> = {
    'web-development': 'development',
    'mobile-apps': 'development',
};

/**
 * Read ?service= from an Inertia page URL (path + query) and return the
 * contact option to preselect, or null when it is missing or unknown.
 */
export function serviceFromUrl(url: string): ContactService | null {
    const query = url.includes('?') ? url.slice(url.indexOf('?') + 1) : '';
    const value = new URLSearchParams(query.split('#')[0])
        .get('service')
        ?.trim()
        .toLowerCase();

    if (!value) {
        return null;
    }

    if (ALIASES[value]) {
        return ALIASES[value];
    }

    return (SERVICES as string[]).includes(value)
        ? (value as ContactService)
        : null;
}
