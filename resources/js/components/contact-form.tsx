import { useForm } from '@inertiajs/react';

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

export default function ContactForm() {
    const { locale, t } = useLocale();

    const initialService =
        new URLSearchParams(window.location.search).get('service') ?? '';

    const { data, setData, post, processing, errors, reset, wasSuccessful } =
        useForm({
            name: '',
            email: '',
            phone: '',
            service: initialService || '',
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
                    <Label htmlFor="name">{t('contact.form.name')}</Label>
                    <Input
                        id="name"
                        name="name"
                        required
                        placeholder={t('contact.form.namePlaceholder')}
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                    />
                    {errors.name && (
                        <p className="text-destructive mt-1 text-sm">
                            {errors.name}
                        </p>
                    )}
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">{t('contact.form.email')}</Label>
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
                        <p className="text-destructive mt-1 text-sm">
                            {errors.email}
                        </p>
                    )}
                </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
                <Label htmlFor="phone">
                    {t('contact.form.phone')}{' '}
                    <span className="text-muted-foreground text-xs">
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
                    <p className="text-destructive mt-1 text-sm">
                        {errors.phone}
                    </p>
                )}
            </div>

            {/* Service dropdown */}
            <div className="space-y-2">
                <Label htmlFor="service">{t('contact.form.service')}</Label>
                <Select
                    value={data.service}
                    onValueChange={(v) => setData('service', v)}
                >
                    <SelectTrigger className="w-full">
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
                    <p className="text-destructive mt-1 text-sm">
                        {errors.service}
                    </p>
                )}
            </div>

            {/* Message */}
            <div className="space-y-2">
                <Label htmlFor="message">{t('contact.form.message')}</Label>
                <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    placeholder={t('contact.form.messagePlaceholder')}
                    value={data.message}
                    onChange={(e) => setData('message', e.target.value)}
                    className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring w-full rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-2"
                />
                {errors.message && (
                    <p className="text-destructive mt-1 text-sm">
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
