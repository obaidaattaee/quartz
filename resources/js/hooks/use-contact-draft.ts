import { useEffect, useRef } from 'react';

type Draft = {
    name: string;
    email: string;
    phone: string;
    company: string;
    service: string;
    message: string;
};

/** One draft per form, shared across locales; storage can be disabled by the browser. */
export function useContactDraft<T extends Draft>(
    key: string,
    data: T,
    setData: (data: T) => void,
    context = '',
) {
    const restoring = useRef<Draft | null>(null);
    const cleared = useRef(false);
    const initial = useRef(data);

    useEffect(() => {
        try {
            const raw: unknown = JSON.parse(
                sessionStorage.getItem(key) ?? 'null',
            );

            if (raw && typeof raw === 'object' && 'fields' in raw) {
                const saved = raw as {
                    fields: Partial<Draft>;
                    context?: string;
                };
                const fields = { ...initial.current };

                for (const field of [
                    'name',
                    'email',
                    'phone',
                    'company',
                    'service',
                    'message',
                ] as const) {
                    if (typeof saved.fields?.[field] === 'string') {
                        fields[field] = saved.fields[field];
                    }
                }

                if (context && context !== saved.context) {
                    fields.service = initial.current.service;
                    fields.message = [initial.current.message, fields.message]
                        .filter(Boolean)
                        .join('\n\n');
                }

                restoring.current = fields;
                setData(fields);
            }
        } catch {
            /* Private browsing and malformed drafts must not block the form. */
        }
    }, [key, context, setData]);

    useEffect(() => {
        if (cleared.current) {
            return;
        }

        // Do not overwrite the stored draft with the initial server render
        // while useForm is applying the restored fields.
        const pending = restoring.current;

        if (
            pending &&
            (Object.keys(pending) as Array<keyof Draft>).some(
                (field) => pending[field] !== data[field],
            )
        ) {
            return;
        }

        restoring.current = null;
        const { name, email, phone, company, service, message } = data;

        try {
            sessionStorage.setItem(
                key,
                JSON.stringify({
                    fields: { name, email, phone, company, service, message },
                    context,
                }),
            );
        } catch {
            /* Storage is optional. */
        }
    }, [data, key, context]);

    return () => {
        cleared.current = true;

        try {
            sessionStorage.removeItem(key);
        } catch {
            /* Storage is optional. */
        }
    };
}
