import { Head, useForm } from '@inertiajs/react';

import ImagePickerField from '@/components/admin/image-picker-field';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
        logo_media_id: (settings.logo_media_id as number | undefined) ?? null,
        contact_phone: (settings.contact_phone as string) ?? '',
        contact_email: (settings.contact_email as string) ?? '',
        contact_whatsapp: (settings.contact_whatsapp as string) ?? '',
        contact_address: (settings.contact_address as string) ?? '',
        social_linkedin: (settings.social_linkedin as string) ?? '',
        social_twitter: (settings.social_twitter as string) ?? '',
        social_github: (settings.social_github as string) ?? '',
        social_instagram: (settings.social_instagram as string) ?? '',
        legal_entity_name: (settings.legal_entity_name as string) ?? '',
        legal_registered_address:
            (settings.legal_registered_address as string) ?? '',
        legal_privacy_email: (settings.legal_privacy_email as string) ?? '',
        legal_contact_email: (settings.legal_contact_email as string) ?? '',
        legal_governing_law: (settings.legal_governing_law as string) ?? '',
        legal_dispute_venue: (settings.legal_dispute_venue as string) ?? '',
        legal_liability_cap: (settings.legal_liability_cap as string) ?? '',
    });

    // Company details inserted into the published privacy policy and terms.
    // Empty fields show a "[… TO BE SPECIFIED]" marker on those pages.
    const legalFields: {
        key:
            | 'legal_entity_name'
            | 'legal_registered_address'
            | 'legal_privacy_email'
            | 'legal_contact_email'
            | 'legal_governing_law'
            | 'legal_dispute_venue'
            | 'legal_liability_cap';
        label: string;
        placeholder: string;
        type?: 'email';
        multiline?: boolean;
    }[] = [
        {
            key: 'legal_entity_name',
            label: 'Legal entity name',
            placeholder: 'Quartz Solutions LLC',
        },
        {
            key: 'legal_registered_address',
            label: 'Registered address',
            placeholder: 'Street, city, postcode, country',
            multiline: true,
        },
        {
            key: 'legal_privacy_email',
            label: 'Privacy contact email',
            placeholder: 'privacy@quartz-solutions.net',
            type: 'email',
        },
        {
            key: 'legal_contact_email',
            label: 'Legal contact email',
            placeholder: 'legal@quartz-solutions.net',
            type: 'email',
        },
        {
            key: 'legal_governing_law',
            label: 'Governing law',
            placeholder: 'e.g. the laws of the State of Delaware, USA',
        },
        {
            key: 'legal_dispute_venue',
            label: 'Dispute venue',
            placeholder: 'e.g. the courts of Wilmington, Delaware',
        },
        {
            key: 'legal_liability_cap',
            label: 'Liability cap',
            placeholder: 'e.g. the fees paid in the 12 months before the claim',
            multiline: true,
        },
    ];

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        put('/admin/settings');
    }

    return (
        <>
            <Head title="Site Settings" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4">
                <div>
                    <h2 className="text-lg font-semibold">Site Settings</h2>
                    <p className="text-sm text-muted-foreground">
                        Manage branding, contact information, social links, and
                        the company details used in the legal pages.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Branding */}
                    <Card className="border-sidebar-border/70 dark:border-sidebar-border">
                        <CardHeader>
                            <CardTitle>Branding</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="site_name">Site Name</Label>
                                <Input
                                    id="site_name"
                                    value={data.site_name}
                                    onChange={(e) =>
                                        setData('site_name', e.target.value)
                                    }
                                />
                                <InputError message={errors.site_name} />
                            </div>
                            <ImagePickerField
                                label="Logo"
                                value={logo}
                                onChange={(media) =>
                                    setData('logo_media_id', media?.id ?? null)
                                }
                            />
                            <InputError message={errors.logo_media_id} />
                        </CardContent>
                    </Card>

                    {/* Contact Information */}
                    <Card className="border-sidebar-border/70 dark:border-sidebar-border">
                        <CardHeader>
                            <CardTitle>Contact Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="contact_phone">Phone</Label>
                                <Input
                                    id="contact_phone"
                                    value={data.contact_phone}
                                    onChange={(e) =>
                                        setData('contact_phone', e.target.value)
                                    }
                                />
                                <InputError message={errors.contact_phone} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="contact_email">Email</Label>
                                <Input
                                    id="contact_email"
                                    type="email"
                                    value={data.contact_email}
                                    onChange={(e) =>
                                        setData('contact_email', e.target.value)
                                    }
                                />
                                <InputError message={errors.contact_email} />
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
                                <InputError message={errors.contact_whatsapp} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="contact_address">Address</Label>
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
                                <InputError message={errors.contact_address} />
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
                                <InputError message={errors.social_linkedin} />
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
                                <InputError message={errors.social_twitter} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="social_github">GitHub</Label>
                                <Input
                                    id="social_github"
                                    type="url"
                                    value={data.social_github}
                                    onChange={(e) =>
                                        setData('social_github', e.target.value)
                                    }
                                    placeholder="https://github.com/..."
                                />
                                <InputError message={errors.social_github} />
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
                                <InputError message={errors.social_instagram} />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Legal & company details */}
                    <Card className="border-sidebar-border/70 dark:border-sidebar-border">
                        <CardHeader>
                            <CardTitle>Legal &amp; company details</CardTitle>
                            <p className="text-sm text-muted-foreground">
                                Used in the published Privacy Policy and Terms
                                of Service. Empty fields appear there as
                                &ldquo;[… TO BE SPECIFIED]&rdquo;, so fill them
                                in before launch.
                            </p>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {legalFields.map((field) => (
                                <div key={field.key} className="space-y-2">
                                    <Label htmlFor={field.key}>
                                        {field.label}
                                    </Label>
                                    {field.multiline ? (
                                        <Textarea
                                            id={field.key}
                                            value={data[field.key]}
                                            onChange={(e) =>
                                                setData(
                                                    field.key,
                                                    e.target.value,
                                                )
                                            }
                                            placeholder={field.placeholder}
                                            rows={2}
                                        />
                                    ) : (
                                        <Input
                                            id={field.key}
                                            type={field.type ?? 'text'}
                                            value={data[field.key]}
                                            onChange={(e) =>
                                                setData(
                                                    field.key,
                                                    e.target.value,
                                                )
                                            }
                                            placeholder={field.placeholder}
                                        />
                                    )}
                                    <InputError message={errors[field.key]} />
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Save Settings'}
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
