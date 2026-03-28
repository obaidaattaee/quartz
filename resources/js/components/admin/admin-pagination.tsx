import { Link } from '@inertiajs/react';

import { Button } from '@/components/ui/button';

type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};

type Props = {
    links: PaginationLink[];
};

function stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '');
}

export default function AdminPagination({ links }: Props) {
    // Don't render if only prev/next with no pages
    if (links.length <= 3) {
        return null;
    }

    return (
        <div className="mt-4 flex items-center justify-center gap-1">
            {links.map((link, index) => (
                <Button
                    key={index}
                    variant={link.active ? 'default' : 'outline'}
                    size="sm"
                    disabled={!link.url}
                    asChild={!!link.url}
                >
                    {link.url ? (
                        <Link
                            href={link.url}
                            preserveState
                            preserveScroll
                        >
                            {stripHtml(link.label)}
                        </Link>
                    ) : (
                        <span>{stripHtml(link.label)}</span>
                    )}
                </Button>
            ))}
        </div>
    );
}

export type { PaginationLink };
