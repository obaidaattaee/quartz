import { useForm, usePage } from '@inertiajs/react';

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
import { useLocale } from '@/hooks/use-locale';
import { serviceFromUrl } from '@/lib/contact-service';

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
    const { url, props } = usePage<{ preselectedService?: string | null }>();
    const initialService =
        props.preselectedService ?? serviceFromUrl(url) ?? '';

    const { data, setData, post, processing, errors, reset, wasSuccessful } =
        useForm({
            name: '',
            email: '',
            phone: '',
            service: initialService as string,
            message: '',
            _honeypot: '',
        });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(`/${locale}/contact`, {
            onSuccess: () => reset(),
            preserveScroll: true,
        });
    }

    if (wasSuccessful) {
        return (
            <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200">
                {t('contact.form.success')}
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
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
                        required
                        placeholder={t('contact.form.namePlaceholder')}
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                    />
                    {errors.name && (
                        <p className="mt-1 text-sm text-destructive">
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
                        type="email"
                        required
                        placeholder={t('contact.form.emailPlaceholder')}
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    {errors.email && (
                        <p className="mt-1 text-sm text-destructive">
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
                    placeholder={t('contact.form.phonePlaceholder')}
                    value={data.phone}
                    onChange={(e) => setData('phone', e.target.value)}
                />
                {errors.phone && (
                    <p className="mt-1 text-sm text-destructive">
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
                    <p className="mt-1 text-sm text-destructive">
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
                    required
                    rows={5}
                    placeholder={t('contact.form.messagePlaceholder')}
                    value={data.message}
                    onChange={(e) => setData('message', e.target.value)}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring"
                />
                {errors.message && (
                    <p className="mt-1 text-sm text-destructive">
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
        </form>
    );
}
