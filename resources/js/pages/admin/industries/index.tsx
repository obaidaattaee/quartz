import { Head, Link } from '@inertiajs/react';
import { Edit, Eye, EyeOff, FileText } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import type { IndustryDetail } from '@/types/industry';

type Props = {
    industries: IndustryDetail[];
};

export default function IndustriesIndex({ industries }: Props) {
    return (
        <>
            <Head title="Industries" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4">
                <div>
                    <h2 className="text-lg font-semibold">Industries</h2>
                    <p className="text-muted-foreground text-sm">
                        Edit the five industry pages. These are fixed rows —
                        you can toggle visibility or edit content but not
                        create new ones.
                    </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                    {industries.map((ind) => (
                        <Card
                            key={ind.id}
                            className="border-sidebar-border/70 dark:border-sidebar-border"
                        >
                            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                <div>
                                    <CardTitle className="text-base">
                                        {ind.title_en}
                                    </CardTitle>
                                    <p className="text-muted-foreground mt-1 text-sm">
                                        /industries/{ind.slug}
                                    </p>
                                </div>
                                <Button variant="outline" size="sm" asChild>
                                    <Link
                                        href={`/admin/industries/${ind.id}/edit`}
                                    >
                                        <Edit className="mr-1 h-4 w-4" />
                                        Edit
                                    </Link>
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <div className="text-muted-foreground flex gap-4 text-sm">
                                    <span className="flex items-center gap-1">
                                        <FileText className="h-3.5 w-3.5" />
                                        {ind.challenges_en?.length ?? 0}{' '}
                                        challenges
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <FileText className="h-3.5 w-3.5" />
                                        {ind.solutions_en?.length ?? 0}{' '}
                                        solutions
                                    </span>
                                    <span className="flex items-center gap-1">
                                        {ind.is_visible ? (
                                            <Eye className="h-3.5 w-3.5" />
                                        ) : (
                                            <EyeOff className="h-3.5 w-3.5" />
                                        )}
                                        {ind.is_visible
                                            ? 'Visible'
                                            : 'Hidden'}
                                    </span>
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
