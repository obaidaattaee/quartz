import { Head, Link, useForm } from '@inertiajs/react';
import { AlertTriangle } from 'lucide-react';
import type { FormEvent } from 'react';

import BilingualTabs from '@/components/admin/bilingual-tabs';
import InputError from '@/components/input-error';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { LANDING_SECTIONS } from '@/pages/admin/landing/_shared/sections';
import type {
    LandingField,
    LandingItem,
    LandingSectionKey,
} from '@/pages/admin/landing/_shared/sections';

export type PortfolioOption = { slug: string; title: string };

type Props = {
    sectionKey: LandingSectionKey;
    item?: LandingItem;
    portfolioOptions?: PortfolioOption[];
};

type FormValues = Record<string, string | boolean>;

const SELECT_CLASS =
    'border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 flex h-9 w-full rounded-md border px-3 py-1 text-base shadow-xs outline-none focus-visible:ring-[3px] md:text-sm';

function toFormValue(value: unknown): string {
    if (Array.isArray(value)) {
        return value.join(', ');
    }

    return typeof value === 'string' ? value : '';
}

function initialValues(
    fields: LandingField[],
    hasVisibility: boolean,
    item?: LandingItem,
): FormValues {
    const values: FormValues = {};

    for (const field of fields) {
        const keys = field.bilingual
            ? [`${field.name}_en`, `${field.name}_ar`]
            : [field.name];

        for (const key of keys) {
            values[key] = toFormValue(item?.[key]);
        }
    }

    if (hasVisibility) {
        values.is_visible = item?.is_visible ?? true;
    }

    return values;
}

export default function LandingItemForm({
    sectionKey,
    item,
    portfolioOptions = [],
}: Props) {
    const section = LANDING_SECTIONS[sectionKey];
    const isEdit = item !== undefined;
    const bilingualFields = section.fields.filter((f) => f.bilingual);
    const sharedFields = section.fields.filter((f) => !f.bilingual);

    const { data, setData, post, put, processing, errors } =
        useForm<FormValues>(
            initialValues(section.fields, section.hasVisibility, item),
        );
    const fieldErrors = errors as Record<string, string>;

    function handleSubmit(e: FormEvent) {
        e.preventDefault();

        if (isEdit) {
            put(`/admin/landing/${sectionKey}/${item.id}`);
        } else {
            post(`/admin/landing/${sectionKey}`);
        }
    }

    function errorFor(key: string): string | undefined {
        // Array fields (tags) report errors per element, e.g. tags_en.2.
        return (
            fieldErrors[key] ??
            Object.entries(fieldErrors).find(([k]) =>
                k.startsWith(`${key}.`),
            )?.[1]
        );
    }

    function renderControl(field: LandingField, key: string, rtl: boolean) {
        const value = String(data[key] ?? '');
        const dir = rtl ? 'rtl' : 'ltr';

        if (field.kind === 'textarea') {
            return (
                <Textarea
                    id={key}
                    value={value}
                    onChange={(e) => setData(key, e.target.value)}
                    dir={dir}
                    rows={4}
                    placeholder={rtl ? undefined : field.placeholder}
                />
            );
        }

        if (field.kind === 'portfolio') {
            return (
                <select
                    id={key}
                    value={value}
                    onChange={(e) => setData(key, e.target.value)}
                    className={SELECT_CLASS}
                >
                    <option value="">No link</option>
                    {portfolioOptions.map((option) => (
                        <option key={option.slug} value={option.slug}>
                            {option.title}
                        </option>
                    ))}
                </select>
            );
        }

        return (
            <Input
                id={key}
                value={value}
                onChange={(e) => setData(key, e.target.value)}
                dir={dir}
                placeholder={rtl ? undefined : field.placeholder}
            />
        );
    }

    function renderField(field: LandingField, key: string, rtl = false) {
        return (
            <div key={key} className="space-y-2">
                <Label htmlFor={key}>
                    {field.label}
                    {field.optional && ' (optional)'}
                </Label>
                {renderControl(field, key, rtl)}
                {field.help && (
                    <p className="text-xs text-muted-foreground" dir="ltr">
                        {field.help}
                    </p>
                )}
                <InputError message={errorFor(key)} />
            </div>
        );
    }

    const verb = isEdit ? 'Edit' : 'Add';

    return (
        <>
            <Head title={`${verb} ${section.singular}`} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        {verb} {section.singular}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        Appears in the homepage “{section.homepageSection}”
                        section. Fill in both English and Arabic.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
                    {section.warning && (
                        <Alert>
                            <AlertTriangle />
                            <AlertDescription>
                                {section.warning}
                            </AlertDescription>
                        </Alert>
                    )}

                    <Card>
                        <CardHeader>
                            <CardTitle>Content</CardTitle>
                            <CardDescription>
                                Switch tabs to edit each language.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <BilingualTabs errors={fieldErrors}>
                                {(locale) => (
                                    <div className="space-y-4 pt-4">
                                        {bilingualFields.map((field) =>
                                            renderField(
                                                field,
                                                `${field.name}_${locale}`,
                                                locale === 'ar',
                                            ),
                                        )}
                                    </div>
                                )}
                            </BilingualTabs>
                        </CardContent>
                    </Card>

                    {(sharedFields.length > 0 || section.hasVisibility) && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Shared details</CardTitle>
                                <CardDescription>
                                    Used for both languages.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {sharedFields.map((field) =>
                                    renderField(field, field.name),
                                )}

                                {section.hasVisibility && (
                                    <div className="flex items-center gap-3">
                                        <Switch
                                            id="is_visible"
                                            checked={Boolean(data.is_visible)}
                                            onCheckedChange={(checked) =>
                                                setData('is_visible', checked)
                                            }
                                        />
                                        <Label htmlFor="is_visible">
                                            Visible on website
                                        </Label>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    <div className="flex items-center gap-3">
                        <Button
                            type="submit"
                            disabled={processing}
                            data-test="landing-item-submit"
                        >
                            {isEdit
                                ? 'Save changes'
                                : `Add ${section.singular}`}
                        </Button>
                        <Button variant="outline" asChild>
                            <Link href={`/admin/landing/${sectionKey}`}>
                                Cancel
                            </Link>
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}
