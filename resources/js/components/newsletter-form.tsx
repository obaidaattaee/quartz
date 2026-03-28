import { useForm } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLocale } from '@/hooks/use-locale';

export default function NewsletterForm() {
    const { locale, t } = useLocale();

    const { data, setData, post, processing, errors, wasSuccessful } =
        useForm({ email: '' });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        post(`/${locale}/newsletter`, {
            preserveScroll: true,
            onSuccess: () => setData('email', ''),
        });
    }

    if (wasSuccessful) {
        return (
            <p className="text-sm text-green-600 dark:text-green-400">
                {t('newsletter.success')}
            </p>
        );
    }

    return (
        <div>
            <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                    type="email"
                    required
                    placeholder={t('footer.newsletterPlaceholder')}
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    className="h-9 text-sm"
                />
                <Button type="submit" size="sm" disabled={processing}>
                    {t('footer.subscribe')}
                </Button>
            </form>
            {errors.email && (
                <p className="text-destructive mt-1 text-xs">
                    {errors.email.includes('unique') ||
                    errors.email.includes('already')
                        ? t('newsletter.error.duplicate')
                        : errors.email}
                </p>
            )}
        </div>
    );
}
