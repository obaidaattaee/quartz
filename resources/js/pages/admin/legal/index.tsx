import { Head, Link } from '@inertiajs/react';
import { Edit, EyeOff, FileText, Layers } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { LegalPageData } from '@/types';

type Props = {
    pages: LegalPageData[];
};

export default function LegalIndex({ pages }: Props) {
    return (
        <>
            <Head title="Legal Pages" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4">
                <div>
                    <h2 className="text-lg font-semibold">Legal Pages</h2>
                    <p className="text-sm text-muted-foreground">
                        The privacy policy and terms of service published at
                        /privacy and /terms. These are fixed pages and cannot be
                        created or deleted. Company details such as the legal
                        entity name and contact addresses come from Site
                        Settings, not from this copy.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {pages.map((page) => (
                        <Card
                            key={page.id}
                            className="border-sidebar-border/70 dark:border-sidebar-border"
                        >
                            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                <div>
                                    <CardTitle className="text-base">
                                        {page.title_en}
                                    </CardTitle>
                                    <p className="mt-1 text-sm text-muted-foreground">
                                        /{page.slug}
                                    </p>
                                </div>
                                <Button variant="outline" size="sm" asChild>
                                    <Link href={`/admin/legal/${page.id}/edit`}>
                                        <Edit className="mr-1 h-4 w-4" />
                                        Edit
                                    </Link>
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <Layers className="h-3.5 w-3.5" />
                                        {page.sections_en?.length ?? 0} sections
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <FileText className="h-3.5 w-3.5" />v
                                        {page.version}
                                        {page.effective_date
                                            ? ` · ${page.effective_date}`
                                            : ''}
                                    </span>
                                    {!page.is_published && (
                                        <span className="flex items-center gap-1 text-destructive">
                                            <EyeOff className="h-3.5 w-3.5" />
                                            Unpublished
                                        </span>
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

LegalIndex.layout = {
    breadcrumbs: [
        { title: 'Admin', href: '/admin' },
        { title: 'Legal', href: '/admin/legal' },
    ],
};
