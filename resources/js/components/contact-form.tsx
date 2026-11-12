import { useForm, usePage } from '@inertiajs/react';
import { useEffect, useRef } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useContactDraft } from '@/hooks/use-contact-draft';
import { useLocale } from '@/hooks/use-locale';
import { serviceFromUrl } from '@/lib/contact-service';
import { contactErrors, focusContactError } from '@/lib/contact-validation';

function RequiredMark({ label }: { label: string }) {
    return (
        <>
            <span aria-hidden="true" className="text-destructive">
                *
            </span>
            <span className="sr-only">({label})</span>
        </>
    );
}

export default function ContactForm() {
    const { locale, t } = useLocale();

    // ?service=qa (or a sub-service such as web-development) preselects
    // the matching option; unknown values are ignored.
    // The contact page resolves it server-side (preselectedService);
    // elsewhere the form falls back to reading the URL.
    const { url, props } = usePage<{
        preselectedService?: string | null;
        topic?: string | null;
        from?: string | null;
    }>();
    const initialService =
        props.preselectedService ?? serviceFromUrl(url) ?? '';

    const topic = props.topic ?? '';
    const from = props.from ?? '';
    const context = [topic, from, initialService].filter(Boolean).join('|');
    const fromTitle =
        from === 'web-development'
            ? t('nav.services.web')
            : from === 'mobile-apps'
              ? t('nav.services.mobile')
              : '';
    const topicLine = topic ? t('contact.topic', { topic }) : '';
    const firstLine = [
        fromTitle ? t('contact.from', { service: fromTitle }) : '',
        topicLine,
    ]
        .filter(Boolean)
        .join('\n');
    const formRef = useRef<HTMLFormElement>(null);
    const successRef = useRef<HTMLHeadingElement>(null);
    const form = useForm({
        name: '',
        email: '',
        phone: '',
        company: '',
        service: initialService as string,
        message: firstLine ? `${firstLine}\n\n` : '',
        _honeypot: '',
    });

    const { data, setData, post, processing, errors, reset, wasSuccessful } =
        form;
    const clearDraft = useContactDraft(
        'quartz-contact-draft',
        data,
        setData,
        context,
    );
    useEffect(() => {
        if (wasSuccessful) {
            successRef.current?.focus();
        }
    }, [wasSuccessful]);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        form.clearErrors();
        const validation = contactErrors(data, t);

        if (Object.keys(validation).length) {
            form.setError(validation);
            focusContactError(formRef.current, validation);

            return;
        }

        post(`/${locale}/contact`, {
            onSuccess: () => {
                clearDraft();
                reset();
            },
            onError: (serverErrors) =>
                focusContactError(formRef.current, serverErrors),
            preserveScroll: true,
        });
    }

    if (wasSuccessful) {
        return (
            <div
                role="status"
                className="rounded-lg border border-green-200 bg-green-50 p-4 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200"
            >
                <h2 ref={successRef} tabIndex={-1}>
                    {t('contact.form.success')}
                </h2>
            </div>
        );
    }

    return (
        <form
            ref={formRef}
            noValidate
            onSubmit={handleSubmit}
            className="space-y-6"
        >
            {(topic || fromTitle) && (
                <p className="rounded-md border p-3 text-sm">
                    {[fromTitle, topicLine].filter(Boolean).join(' · ')}
                </p>
            )}
            {/* Name + Email row */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="name">
                        {t('contact.form.name')}
                        <RequiredMark label={t('contact.form.required')} />
                    </Label>
                    <Input
                        id="name"
                        name="name"
                        aria-invalid={!!errors.name}
                        aria-describedby={
                            errors.name ? 'name-error' : undefined
                        }
                        required
                        placeholder={t('contact.form.namePlaceholder')}
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                    />
                    {errors.name && (
                        <p
                            id="name-error"
                            role="alert"
                            className="mt-1 text-sm text-destructive"
                        >
                            {errors.name}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">
                        {t('contact.form.email')}
                        <RequiredMark label={t('contact.form.required')} />
                    </Label>
                    <Input
                        id="email"
                        name="email"
                        aria-invalid={!!errors.email}
                        aria-describedby={
                            errors.email ? 'email-error' : undefined
                        }
                        type="email"
                        required
                        placeholder={t('contact.form.emailPlaceholder')}
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    {errors.email && (
                        <p
                            id="email-error"
                            role="alert"
                            className="mt-1 text-sm text-destructive"
                        >
                            {errors.email}
                        </p>
                    )}
                </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
                <Label htmlFor="phone">
                    {t('contact.form.phone')}{' '}
                    <span className="text-xs text-muted-foreground">
                        ({t('contact.form.phoneOptional')})
                    </span>
                </Label>
                <Input
                    id="phone"
                    name="phone"
                    aria-invalid={!!errors.phone}
                    aria-describedby={errors.phone ? 'phone-error' : undefined}
                    placeholder={t('contact.form.phonePlaceholder')}
                    value={data.phone}
                    onChange={(e) => setData('phone', e.target.value)}
                />
                {errors.phone && (
                    <p
                        id="phone-error"
                        role="alert"
                        className="mt-1 text-sm text-destructive"
                    >
                        {errors.phone}
                    </p>
                )}
            </div>

            {/* Service dropdown */}
            <div className="space-y-2">
                <Label htmlFor="service">
                    {t('contact.form.service')}
                    <RequiredMark label={t('contact.form.required')} />
                </Label>
                <Select
                    name="service"
                    required
                    value={data.service}
                    onValueChange={(v) => setData('service', v)}
                >
                    <SelectTrigger
                        id="service"
                        aria-describedby={
                            errors.service ? 'service-error' : undefined
                        }
                        className="w-full"
                        aria-required="true"
                        aria-invalid={errors.service ? true : undefined}
                    >
                        <SelectValue
                            placeholder={t('contact.form.servicePlaceholder')}
                        />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="development">
                            {t('nav.services.dev')}
                        </SelectItem>
                        <SelectItem value="automation">
                            {t('nav.services.automation')}
                        </SelectItem>
                        <SelectItem value="qa">
                            {t('nav.services.qa')}
                        </SelectItem>
                        <SelectItem value="cybersecurity">
                            {t('nav.services.cybersecurity')}
                        </SelectItem>
                        <SelectItem value="general">
                            {t('contact.form.serviceGeneral')}
                        </SelectItem>
                    </SelectContent>
                </Select>
                {errors.service && (
                    <p
                        id="service-error"
                        role="alert"
                        className="mt-1 text-sm text-destructive"
                    >
                        {errors.service}
                    </p>
                )}
            </div>

            {/* Message */}
            <div className="space-y-2">
                <Label htmlFor="message">
                    {t('contact.form.message')}
                    <RequiredMark label={t('contact.form.required')} />
                </Label>
                <textarea
                    id="message"
                    name="message"
                    aria-invalid={!!errors.message}
                    aria-describedby={`message-hint ${errors.message ? 'message-error' : ''}`}
                    required
                    rows={5}
                    minLength={10}
                    maxLength={5000}
                    placeholder={t('contact.form.messagePlaceholder')}
                    value={data.message}
                    onChange={(e) => setData('message', e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                />
                <p id="message-hint" className="text-sm text-muted-foreground">
                    {t('contact.validation.message')}
                </p>
                {errors.message && (
                    <p
                        id="message-error"
                        role="alert"
                        className="mt-1 text-sm text-destructive"
                    >
                        {errors.message}
                    </p>
                )}
            </div>

            {/* Honeypot -- hidden from real users (D-08) */}
            <input
                type="text"
                name="_honeypot"
                value={data._honeypot}
                onChange={(e) => setData('_honeypot', e.target.value)}
                aria-hidden="true"
                tabIndex={-1}
                className="sr-only"
                autoComplete="off"
            />

            <Button type="submit" disabled={processing}>
                {processing
                    ? t('contact.form.sending')
                    : t('contact.form.submit')}
            </Button>
            <p className="text-sm text-muted-foreground">
                {t('contact.nextSteps')}
            </p>
        </form>
    );
}
