import { Head, Link } from '@inertiajs/react';
import { Edit, Layers, ListChecks } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import type { ServicePageData } from '@/types';

type Props = {
    services: ServicePageData[];
};

export default function ServicesIndex({ services }: Props) {
    return (
        <>
            <Head title="Service Pages" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold">
                            Service Pages
                        </h2>
                        <p className="text-muted-foreground text-sm">
                            Edit content for each service page. These
                            are fixed pages and cannot be created or
                            deleted.
                        </p>
                    </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {services.map((service) => (
                        <Card
                            key={service.id}
                            className="border-sidebar-border/70 dark:border-sidebar-border"
                        >
                            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                <div>
                                    <CardTitle className="text-base">
                                        {service.title_en}
                                    </CardTitle>
                                    <p className="text-muted-foreground mt-1 text-sm">
                                        /{service.slug}
                                    </p>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    asChild
                                >
                                    <Link
                                        href={`/admin/services/${service.id}/edit`}
                                    >
                                        <Edit className="mr-1 h-4 w-4" />
                                        Edit
                                    </Link>
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="flex gap-4 text-sm">
                                    <div className="text-muted-foreground flex items-center gap-1">
                                        <Layers className="h-3.5 w-3.5" />
                                        {service.process_steps_en
                                            ?.length ?? 0}{' '}
                                        steps
                                    </div>
                                    <div className="text-muted-foreground flex items-center gap-1">
                                        <ListChecks className="h-3.5 w-3.5" />
                                        {service.deliverables_en
                                            ?.length ?? 0}{' '}
                                        deliverables
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </>
    );
}

ServicesIndex.layout = {
    breadcrumbs: [
        { title: 'Admin', href: '/admin' },
        { title: 'Services', href: '/admin/services' },
    ],
};
