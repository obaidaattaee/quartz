type Fields = {
    name: string;
    email: string;
    service: string;
    message: string;
    phone?: string;
};
type Translate = (key: string) => string;

export function contactErrors(
    data: Fields,
    t: Translate,
): Partial<Record<keyof Fields, string>> {
    const errors: Partial<Record<keyof Fields, string>> = {};

    if (!data.name.trim()) {
        errors.name = t('contact.validation.name');
    } else if ([...data.name].length > 255) {
        errors.name = t('contact.validation.nameMax');
    }

    if (!data.email.trim()) {
        errors.email = t('contact.validation.emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim())) {
        errors.email = t('contact.validation.email');
    } else if (data.email.length > 255) {
        errors.email = t('contact.validation.emailMax');
    }

    if (data.phone && [...data.phone].length > 50) {
        errors.phone = t('contact.validation.phoneMax');
    }

    if (
        ![
            'development',
            'qa',
            'automation',
            'cybersecurity',
            'general',
        ].includes(data.service)
    ) {
        errors.service = t('contact.validation.service');
    }

    if ([...data.message.trim()].length < 10) {
        errors.message = t('contact.validation.message');
    } else if ([...data.message].length > 5000) {
        errors.message = t('contact.validation.messageMax');
    }

    return errors;
}

export function focusContactError(
    form: HTMLFormElement | null,
    errors: Record<string, string | undefined>,
) {
    const first = ['name', 'email', 'phone', 'service', 'message'].find(
        (field) => errors[field],
    );

    if (first) {
        form?.querySelector<HTMLElement>(
            `[name="${first}"]:not([type="hidden"]), #${first}`,
        )?.focus();
    }
}
