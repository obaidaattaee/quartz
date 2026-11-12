import { Head, Link } from '@inertiajs/react';
import { Edit, ExternalLink, Eye, EyeOff } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import type { IndustryAdminRow } from '@/types/industry';

type Props = {
    industries: IndustryAdminRow[];
};

function count(list: unknown[] | null | undefined): number {
    return Array.isArray(list) ? list.length : 0;
}

export default function IndustriesIndex({ industries }: Props) {
    return (
        <>
            <Head title="Industries" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4">
                <div className="space-y-0.5">
                    <h1 className="text-xl font-semibold tracking-tight">
                        Industries
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        The five sector pages under /industries, in display
                        order. You can edit their content and hide a page, but
                        not add or delete sectors.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {industries.map((ind) => (
                        <Card
                            key={ind.id}
                            className="border-sidebar-border/70 dark:border-sidebar-border"
                        >
                            <CardHeader className="flex flex-row items-start justify-between gap-3 space-y-0">
                                <div className="min-w-0 space-y-1">
                                    <CardTitle className="text-base">
                                        {ind.title_en}
                                    </CardTitle>
                                    <CardDescription dir="rtl" lang="ar">
                                        {ind.title_ar}
                                    </CardDescription>
                                    <p className="text-xs text-muted-foreground">
                                        /industries/{ind.slug}
                                    </p>
                                </div>
                                <div className="flex shrink-0 gap-2">
                                    <Button variant="ghost" size="sm" asChild>
                                        <a
                                            href={`/en/industries/${ind.slug}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            <ExternalLink className="h-4 w-4" />
                                            <span className="sr-only">
                                                View page (opens in a new tab)
                                            </span>
                                        </a>
                                    </Button>
                                    <Button variant="outline" size="sm" asChild>
                                        <Link
                                            href={`/admin/industries/${ind.id}/edit`}
                                        >
                                            <Edit className="me-1 h-4 w-4" />
                                            Edit
                                        </Link>
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                                    <span>
                                        {count(ind.challenges_en)} realities
                                    </span>
                                    <span>
                                        {count(ind.solutions_en)} solutions
                                    </span>
                                    <span>
                                        {count(ind.compliance_items_en)} rules
                                    </span>
                                    <span>{count(ind.faqs_en)} FAQs</span>
                                    {ind.is_visible ? (
                                        <Badge variant="outline">
                                            <Eye className="me-1 h-3.5 w-3.5" />
                                            Visible
                                        </Badge>
                                    ) : (
                                        <Badge variant="secondary">
                                            <EyeOff className="me-1 h-3.5 w-3.5" />
                                            Hidden
                                        </Badge>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </>
    );
}

IndustriesIndex.layout = {
    breadcrumbs: [
        { title: 'Admin', href: '/admin' },
        { title: 'Industries', href: '/admin/industries' },
    ],
};
