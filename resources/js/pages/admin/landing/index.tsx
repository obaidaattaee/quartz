import { Head, Link } from '@inertiajs/react';
import { ArrowRight, ExternalLink, Info } from 'lucide-react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import {
    LANDING_SECTION_ORDER,
    LANDING_SECTIONS,
} from '@/pages/admin/landing/_shared/sections';
import type { LandingSectionKey } from '@/pages/admin/landing/_shared/sections';

type SectionCount = {
    key: LandingSectionKey;
    total: number;
    visible: number | null;
};

type Props = {
    sections: SectionCount[];
};

export default function LandingOverview({ sections }: Props) {
    const counts = new Map(sections.map((s) => [s.key, s]));

    return (
        <>
            <Head title="Homepage content" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">
                            Homepage content
                        </h1>
                        <p className="max-w-2xl text-sm text-muted-foreground">
                            Edit the lists shown on the public homepage, in
                            English and Arabic. Changes appear on the site as
                            soon as you save.
                        </p>
                    </div>
                    <Button variant="outline" asChild>
                        <a href="/en" target="_blank" rel="noreferrer">
                            <ExternalLink className="mr-1 h-4 w-4" />
                            View homepage
                        </a>
                    </Button>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {LANDING_SECTION_ORDER.map((key) => {
                        const section = LANDING_SECTIONS[key];
                        const count = counts.get(key);
                        const total = count?.total ?? 0;
                        const summary =
                            count?.visible === null ||
                            count?.visible === undefined
                                ? `${total} ${total === 1 ? 'item' : 'items'}`
                                : `${count.visible} of ${total} visible`;

                        return (
                            <Card
                                key={key}
                                className="border-sidebar-border/70 dark:border-sidebar-border"
                            >
                                <CardHeader>
                                    <CardTitle className="text-base">
                                        {section.title}
                                    </CardTitle>
                                    <CardDescription>
                                        {section.description}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="flex items-center justify-between gap-4">
                                    <span className="text-sm text-muted-foreground">
                                        {summary}
                                    </span>
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href={`/admin/landing/${key}`}>
                                            Manage
                                            <ArrowRight className="ml-1 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                <Alert className="max-w-3xl">
                    <Info />
                    <AlertDescription>
                        Testimonials and industries on the homepage are managed
                        from their own pages in the sidebar. The “Technologies
                        we use” logo strip is part of the site design and is
                        changed by a developer.
                    </AlertDescription>
                </Alert>
            </div>
        </>
    );
}

LandingOverview.layout = {
    breadcrumbs: [
        { title: 'Admin', href: '/admin' },
        { title: 'Homepage', href: '/admin/landing' },
    ],
};
