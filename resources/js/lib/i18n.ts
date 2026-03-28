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
