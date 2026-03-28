import { Head, useForm } from '@inertiajs/react';

import ColorPickerField from '@/components/admin/color-picker-field';
import ImagePickerField from '@/components/admin/image-picker-field';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { MediaItem, SiteSettings } from '@/types';

type Props = {
    settings: SiteSettings;
    logo: MediaItem | null;
};

export default function SettingsIndex({ settings, logo }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        site_name: (settings.site_name as string) ?? '',
        logo_media_id: (settings.logo_media_id as number) ?? null,
        primary_color:
            (settings.primary_color as string) ?? '#14B8A6',
        secondary_color:
            (settings.secondary_color as string) ?? '#0F172A',
        contact_phone: (settings.contact_phone as string) ?? '',
        contact_email: (settings.contact_email as string) ?? '',
        contact_whatsapp:
            (settings.contact_whatsapp as string) ?? '',
        contact_address:
            (settings.contact_address as string) ?? '',
        social_linkedin:
            (settings.social_linkedin as string) ?? '',
        social_twitter: (settings.social_twitter as string) ?? '',
        social_github: (settings.social_github as string) ?? '',
        social_instagram:
            (settings.social_instagram as string) ?? '',
    });

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        put('/admin/settings');
    }

    return (
        <>
            <Head title="Site Settings" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4">
                <div>
                    <h2 className="text-lg font-semibold">
                        Site Settings
                    </h2>
                    <p className="text-muted-foreground text-sm">
                        Manage branding, contact information, and
                        social links.
                    </p>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-6"
                >
                    {/* Branding */}
                    <Card className="border-sidebar-border/70 dark:border-sidebar-border">
                        <CardHeader>
                            <CardTitle>Branding</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="site_name">
                                    Site Name
                                </Label>
                                <Input
                                    id="site_name"
                                    value={data.site_name}
                                    onChange={(e) =>
                                        setData(
                                            'site_name',
                                            e.target.value,
                                        )
                                    }
                                />
                                <InputError
                                    message={errors.site_name}
                                />
                            </div>
                            <ImagePickerField
                                label="Logo"
                                value={logo}
                                onChange={(media) =>
                                    setData(
                                        'logo_media_id',
                                        media?.id ?? null,
                                    )
                                }
                            />
                            <InputError
                                message={errors.logo_media_id}
                            />
                        </CardContent>
                    </Card>

                    {/* Brand Colors */}
                    <Card className="border-sidebar-border/70 dark:border-sidebar-border">
                        <CardHeader>
                            <CardTitle>Brand Colors</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <ColorPickerField
                                label="Primary Color"
                                value={data.primary_color}
                                onChange={(color) =>
                                    setData('primary_color', color)
                                }
                            />
                            <InputError
                                message={errors.primary_color}
                            />
                            <ColorPickerField
                                label="Secondary Color"
                                value={data.secondary_color}
                                onChange={(color) =>
                                    setData(
                                        'secondary_color',
                                        color,
                                    )
                                }
                            />
                            <InputError
                                message={errors.secondary_color}
                            />
                        </CardContent>
                    </Card>

                    {/* Contact Information */}
                    <Card className="border-sidebar-border/70 dark:border-sidebar-border">
                        <CardHeader>
                            <CardTitle>
                                Contact Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="contact_phone">
                                    Phone
                                </Label>
                                <Input
                                    id="contact_phone"
                                    value={data.contact_phone}
                                    onChange={(e) =>
                                        setData(
                                            'contact_phone',
                                            e.target.value,
                                        )
                                    }
                                />
                                <InputError
                                    message={errors.contact_phone}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="contact_email">
                                    Email
                                </Label>
                                <Input
                                    id="contact_email"
                                    type="email"
                                    value={data.contact_email}
                                    onChange={(e) =>
                                        setData(
                                            'contact_email',
                                            e.target.value,
                                        )
                                    }
                                />
                                <InputError
                                    message={errors.contact_email}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="contact_whatsapp">
                                    WhatsApp
                                </Label>
                                <Input
                                    id="contact_whatsapp"
                                    value={data.contact_whatsapp}
                                    onChange={(e) =>
                                        setData(
                                            'contact_whatsapp',
                                            e.target.value,
                                        )
                                    }
                                />
                                <InputError
                                    message={
                                        errors.contact_whatsapp
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="contact_address">
                                    Address
                                </Label>
                                <Textarea
                                    id="contact_address"
                                    value={data.contact_address}
                                    onChange={(e) =>
                                        setData(
                                            'contact_address',
                                            e.target.value,
                                        )
                                    }
                                    rows={3}
                                />
                                <InputError
                                    message={
                                        errors.contact_address
                                    }
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Social Links */}
                    <Card className="border-sidebar-border/70 dark:border-sidebar-border">
                        <CardHeader>
                            <CardTitle>Social Links</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="social_linkedin">
                                    LinkedIn
                                </Label>
                                <Input
                                    id="social_linkedin"
                                    type="url"
                                    value={data.social_linkedin}
                                    onChange={(e) =>
                                        setData(
                                            'social_linkedin',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="https://linkedin.com/company/..."
                                />
                                <InputError
                                    message={
                                        errors.social_linkedin
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="social_twitter">
                                    Twitter / X
                                </Label>
                                <Input
                                    id="social_twitter"
                                    type="url"
                                    value={data.social_twitter}
                                    onChange={(e) =>
                                        setData(
                                            'social_twitter',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="https://x.com/..."
                                />
                                <InputError
                                    message={errors.social_twitter}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="social_github">
                                    GitHub
                                </Label>
                                <Input
                                    id="social_github"
                                    type="url"
                                    value={data.social_github}
                                    onChange={(e) =>
                                        setData(
                                            'social_github',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="https://github.com/..."
                                />
                                <InputError
                                    message={errors.social_github}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="social_instagram">
                                    Instagram
                                </Label>
                                <Input
                                    id="social_instagram"
                                    type="url"
                                    value={data.social_instagram}
                                    onChange={(e) =>
                                        setData(
                                            'social_instagram',
                                            e.target.value,
                                        )
                                    }
                                    placeholder="https://instagram.com/..."
                                />
                                <InputError
                                    message={
                                        errors.social_instagram
                                    }
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            disabled={processing}
                        >
                            {processing
                                ? 'Saving...'
                                : 'Save Settings'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

SettingsIndex.layout = {
    breadcrumbs: [
        { title: 'Admin', href: '/admin' },
        { title: 'Site Settings', href: '/admin/settings' },
    ],
};
