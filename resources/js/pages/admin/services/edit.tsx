import { Head, router, useForm } from '@inertiajs/react';
import { Plus, X } from 'lucide-react';

import BilingualTabs from '@/components/admin/bilingual-tabs';
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
import type { ServicePageData } from '@/types';

type Props = {
    service: ServicePageData;
};

type ProcessStep = {
    title: string;
    description: string;
};

export default function ServiceEdit({ service }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        title_en: service.title_en ?? '',
        title_ar: service.title_ar ?? '',
        subtitle_en: service.subtitle_en ?? '',
        subtitle_ar: service.subtitle_ar ?? '',
        problem_en: service.problem_en ?? '',
        problem_ar: service.problem_ar ?? '',
        approach_en: service.approach_en ?? '',
        approach_ar: service.approach_ar ?? '',
        process_steps_en: (service.process_steps_en ?? [
            { title: '', description: '' },
        ]) as ProcessStep[],
        process_steps_ar: (service.process_steps_ar ?? [
            { title: '', description: '' },
        ]) as ProcessStep[],
        deliverables_en: (service.deliverables_en ?? ['']) as string[],
        deliverables_ar: (service.deliverables_ar ?? ['']) as string[],
        cta_text_en: service.cta_text_en ?? '',
        cta_text_ar: service.cta_text_ar ?? '',
    });

    function addStep(locale: 'en' | 'ar') {
        const key =
            locale === 'en' ? 'process_steps_en' : 'process_steps_ar';

        setData(key, [...data[key], { title: '', description: '' }]);
    }

    function removeStep(locale: 'en' | 'ar', index: number) {
        const key =
            locale === 'en' ? 'process_steps_en' : 'process_steps_ar';
        const steps = [...data[key]];
        steps.splice(index, 1);
        setData(key, steps);
    }

    function updateStep(
        locale: 'en' | 'ar',
        index: number,
        field: keyof ProcessStep,
        value: string,
    ) {
        const key =
            locale === 'en' ? 'process_steps_en' : 'process_steps_ar';
        const steps = [...data[key]];
        steps[index] = { ...steps[index], [field]: value };
        setData(key, steps);
    }

    function addDeliverable(locale: 'en' | 'ar') {
        const key =
            locale === 'en' ? 'deliverables_en' : 'deliverables_ar';

        setData(key, [...data[key], '']);
    }

    function removeDeliverable(locale: 'en' | 'ar', index: number) {
        const key =
            locale === 'en' ? 'deliverables_en' : 'deliverables_ar';
        const items = [...data[key]];
        items.splice(index, 1);
        setData(key, items);
    }

    function updateDeliverable(
        locale: 'en' | 'ar',
        index: number,
        value: string,
    ) {
        const key =
            locale === 'en' ? 'deliverables_en' : 'deliverables_ar';
        const items = [...data[key]];
        items[index] = value;
        setData(key, items);
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        put(`/admin/services/${service.id}`);
    }

    return (
        <>
            <Head title={`Edit: ${service.title_en}`} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Info */}
                    <Card className="border-sidebar-border/70 dark:border-sidebar-border">
                        <CardHeader>
                            <CardTitle>Basic Info</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <BilingualTabs errors={errors}>
                                {(locale) => (
                                    <div className="space-y-4 pt-4">
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor={`title_${locale}`}
                                            >
                                                Title
                                            </Label>
                                            <Input
                                                id={`title_${locale}`}
                                                value={
                                                    locale === 'en'
                                                        ? data.title_en
                                                        : data.title_ar
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        locale === 'en'
                                                            ? 'title_en'
                                                            : 'title_ar',
                                                        e.target.value,
                                                    )
                                                }
                                            />
                                            <InputError
                                                message={
                                                    errors[
                                                        `title_${locale}`
                                                    ]
                                                }
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor={`subtitle_${locale}`}
                                            >
                                                Subtitle
                                            </Label>
                                            <Textarea
                                                id={`subtitle_${locale}`}
                                                value={
                                                    locale === 'en'
                                                        ? data.subtitle_en
                                                        : data.subtitle_ar
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        locale === 'en'
                                                            ? 'subtitle_en'
                                                            : 'subtitle_ar',
                                                        e.target.value,
                                                    )
                                                }
                                                rows={2}
                                            />
                                            <InputError
                                                message={
                                                    errors[
                                                        `subtitle_${locale}`
                                                    ]
                                                }
                                            />
                                        </div>
                                    </div>
                                )}
                            </BilingualTabs>
                        </CardContent>
                    </Card>

                    {/* Problem / Approach */}
                    <Card className="border-sidebar-border/70 dark:border-sidebar-border">
                        <CardHeader>
                            <CardTitle>Problem & Approach</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <BilingualTabs errors={errors}>
                                {(locale) => (
                                    <div className="space-y-4 pt-4">
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor={`problem_${locale}`}
                                            >
                                                Problem
                                            </Label>
                                            <Textarea
                                                id={`problem_${locale}`}
                                                value={
                                                    locale === 'en'
                                                        ? data.problem_en
                                                        : data.problem_ar
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        locale === 'en'
                                                            ? 'problem_en'
                                                            : 'problem_ar',
                                                        e.target.value,
                                                    )
                                                }
                                                rows={4}
                                            />
                                            <InputError
                                                message={
                                                    errors[
                                                        `problem_${locale}`
                                                    ]
                                                }
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label
                                                htmlFor={`approach_${locale}`}
                                            >
                                                Approach
                                            </Label>
                                            <Textarea
                                                id={`approach_${locale}`}
                                                value={
                                                    locale === 'en'
                                                        ? data.approach_en
                                                        : data.approach_ar
                                                }
                                                onChange={(e) =>
                                                    setData(
                                                        locale === 'en'
                                                            ? 'approach_en'
                                                            : 'approach_ar',
                                                        e.target.value,
                                                    )
                                                }
                                                rows={4}
                                            />
                                            <InputError
                                                message={
                                                    errors[
                                                        `approach_${locale}`
                                                    ]
                                                }
                                            />
                                        </div>
                                    </div>
                                )}
                            </BilingualTabs>
                        </CardContent>
                    </Card>

                    {/* Process Steps */}
                    <Card className="border-sidebar-border/70 dark:border-sidebar-border">
                        <CardHeader>
                            <CardTitle>Process Steps</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <BilingualTabs errors={errors}>
                                {(locale) => {
                                    const steps =
                                        locale === 'en'
                                            ? data.process_steps_en
                                            : data.process_steps_ar;
                                    const stepsKey =
                                        locale === 'en'
                                            ? 'process_steps_en'
                                            : 'process_steps_ar';

                                    return (
                                        <div className="space-y-4 pt-4">
                                            {steps.map(
                                                (step, index) => (
                                                    <div
                                                        key={index}
                                                        className="relative rounded-lg border p-4"
                                                    >
                                                        <div className="mb-2 flex items-center justify-between">
                                                            <span className="text-muted-foreground text-sm font-medium">
                                                                Step{' '}
                                                                {index +
                                                                    1}
                                                            </span>
                                                            {steps.length >
                                                                1 && (
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="sm"
                                                                    onClick={() =>
                                                                        removeStep(
                                                                            locale,
                                                                            index,
                                                                        )
                                                                    }
                                                                >
                                                                    <X className="h-4 w-4" />
                                                                </Button>
                                                            )}
                                                        </div>
                                                        <div className="space-y-3">
                                                            <div className="space-y-1">
                                                                <Label>
                                                                    Title
                                                                </Label>
                                                                <Input
                                                                    value={
                                                                        step.title
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        updateStep(
                                                                            locale,
                                                                            index,
                                                                            'title',
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        )
                                                                    }
                                                                />
                                                                <InputError
                                                                    message={
                                                                        errors[
                                                                            `${stepsKey}.${index}.title`
                                                                        ]
                                                                    }
                                                                />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <Label>
                                                                    Description
                                                                </Label>
                                                                <Textarea
                                                                    value={
                                                                        step.description
                                                                    }
                                                                    onChange={(
                                                                        e,
                                                                    ) =>
                                                                        updateStep(
                                                                            locale,
                                                                            index,
                                                                            'description',
                                                                            e
                                                                                .target
                                                                                .value,
                                                                        )
                                                                    }
                                                                    rows={
                                                                        2
                                                                    }
                                                                />
                                                                <InputError
                                                                    message={
                                                                        errors[
                                                                            `${stepsKey}.${index}.description`
                                                                        ]
                                                                    }
                                                                />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ),
                                            )}
                                            <InputError
                                                message={
                                                    errors[stepsKey]
                                                }
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    addStep(locale)
                                                }
                                            >
                                                <Plus className="mr-1 h-4 w-4" />
                                                Add Step
                                            </Button>
                                        </div>
                                    );
                                }}
                            </BilingualTabs>
                        </CardContent>
                    </Card>

                    {/* Deliverables */}
                    <Card className="border-sidebar-border/70 dark:border-sidebar-border">
                        <CardHeader>
                            <CardTitle>Deliverables</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <BilingualTabs errors={errors}>
                                {(locale) => {
                                    const items =
                                        locale === 'en'
                                            ? data.deliverables_en
                                            : data.deliverables_ar;
                                    const itemsKey =
                                        locale === 'en'
                                            ? 'deliverables_en'
                                            : 'deliverables_ar';

                                    return (
                                        <div className="space-y-3 pt-4">
                                            {items.map(
                                                (item, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <Input
                                                            value={item}
                                                            onChange={(
                                                                e,
                                                            ) =>
                                                                updateDeliverable(
                                                                    locale,
                                                                    index,
                                                                    e
                                                                        .target
                                                                        .value,
                                                                )
                                                            }
                                                            placeholder={`Deliverable ${index + 1}`}
                                                            className="flex-1"
                                                        />
                                                        {items.length >
                                                            1 && (
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() =>
                                                                    removeDeliverable(
                                                                        locale,
                                                                        index,
                                                                    )
                                                                }
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </Button>
                                                        )}
                                                        <InputError
                                                            message={
                                                                errors[
                                                                    `${itemsKey}.${index}`
                                                                ]
                                                            }
                                                        />
                                                    </div>
                                                ),
                                            )}
                                            <InputError
                                                message={
                                                    errors[itemsKey]
                                                }
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() =>
                                                    addDeliverable(
                                                        locale,
                                                    )
                                                }
                                            >
                                                <Plus className="mr-1 h-4 w-4" />
                                                Add Deliverable
                                            </Button>
                                        </div>
                                    );
                                }}
                            </BilingualTabs>
                        </CardContent>
                    </Card>

                    {/* CTA */}
                    <Card className="border-sidebar-border/70 dark:border-sidebar-border">
                        <CardHeader>
                            <CardTitle>Call to Action</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <BilingualTabs errors={errors}>
                                {(locale) => (
                                    <div className="space-y-2 pt-4">
                                        <Label
                                            htmlFor={`cta_text_${locale}`}
                                        >
                                            CTA Text
                                        </Label>
                                        <Textarea
                                            id={`cta_text_${locale}`}
                                            value={
                                                locale === 'en'
                                                    ? data.cta_text_en
                                                    : data.cta_text_ar
                                            }
                                            onChange={(e) =>
                                                setData(
                                                    locale === 'en'
                                                        ? 'cta_text_en'
                                                        : 'cta_text_ar',
                                                    e.target.value,
                                                )
                                            }
                                            rows={3}
                                        />
                                        <InputError
                                            message={
                                                errors[
                                                    `cta_text_${locale}`
                                                ]
                                            }
                                        />
                                    </div>
                                )}
                            </BilingualTabs>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={processing}>
                            {processing
                                ? 'Saving...'
                                : 'Save Changes'}
                        </Button>
                    </div>
                </form>
            </div>
        </>
    );
}

ServiceEdit.layout = {
    breadcrumbs: [
        { title: 'Admin', href: '/admin' },
        { title: 'Services', href: '/admin/services' },
        { title: 'Edit', href: '#' },
    ],
};
