import { Head, Link, router } from '@inertiajs/react';
import { ArrowLeft, Mail, Phone } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

type ContactLead = {
    id: number;
    name: string;
    email: string;
    phone: string;
    service: string;
    message: string;
    status: string;
    created_at: string;
};

type Props = {
    lead: ContactLead;
};

function statusColor(status: string): string {
    switch (status) {
        case 'new':
            return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
        case 'read':
            return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
        case 'handled':
            return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
        default:
            return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
    }
}

function handleStatusUpdate(id: number, status: string) {
    router.patch(
        `/admin/contacts/${id}/status`,
        { status },
        { preserveScroll: true },
    );
}

export default function ContactShow({ lead }: Props) {
    return (
        <>
            <Head title={`${lead.name} - Lead Detail`} />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="sm" asChild>
                        <Link href="/admin/contacts">
                            <ArrowLeft className="mr-1 h-4 w-4" />
                            Back to Leads
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-xl">
                                        {lead.name}
                                    </CardTitle>
                                    <span
                                        className={cn(
                                            'inline-flex rounded-full px-2.5 py-1 text-xs font-medium capitalize',
                                            statusColor(lead.status),
                                        )}
                                    >
                                        {lead.status}
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-1">
                                        <p className="text-muted-foreground text-sm font-medium">
                                            Email
                                        </p>
                                        <a
                                            href={`mailto:${lead.email}`}
                                            className="text-primary flex items-center gap-1.5 text-sm hover:underline"
                                        >
                                            <Mail className="h-3.5 w-3.5" />
                                            {lead.email}
                                        </a>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-muted-foreground text-sm font-medium">
                                            Phone
                                        </p>
                                        {lead.phone ? (
                                            <a
                                                href={`tel:${lead.phone}`}
                                                className="text-primary flex items-center gap-1.5 text-sm hover:underline"
                                            >
                                                <Phone className="h-3.5 w-3.5" />
                                                {lead.phone}
                                            </a>
                                        ) : (
                                            <p className="text-muted-foreground text-sm">
                                                Not provided
                                            </p>
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-muted-foreground text-sm font-medium">
                                            Service Interest
                                        </p>
                                        <Badge
                                            variant="secondary"
                                            className="capitalize"
                                        >
                                            {lead.service}
                                        </Badge>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-muted-foreground text-sm font-medium">
                                            Submitted
                                        </p>
                                        <p className="text-sm">
                                            {new Date(
                                                lead.created_at,
                                            ).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit',
                                            })}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-2 pt-2">
                                    <p className="text-muted-foreground text-sm font-medium">
                                        Message
                                    </p>
                                    <div className="bg-muted/50 rounded-lg border p-4">
                                        <p className="whitespace-pre-wrap text-sm leading-relaxed">
                                            {lead.message}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div>
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">
                                    Update Status
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Button
                                    variant={
                                        lead.status === 'new'
                                            ? 'default'
                                            : 'outline'
                                    }
                                    className="w-full justify-start"
                                    onClick={() =>
                                        handleStatusUpdate(lead.id, 'new')
                                    }
                                    disabled={lead.status === 'new'}
                                >
                                    <span
                                        className={cn(
                                            'mr-2 h-2 w-2 rounded-full',
                                            lead.status === 'new'
                                                ? 'bg-white'
                                                : 'bg-amber-500',
                                        )}
                                    />
                                    Mark New
                                </Button>
                                <Button
                                    variant={
                                        lead.status === 'read'
                                            ? 'default'
                                            : 'outline'
                                    }
                                    className="w-full justify-start"
                                    onClick={() =>
                                        handleStatusUpdate(lead.id, 'read')
                                    }
                                    disabled={lead.status === 'read'}
                                >
                                    <span
                                        className={cn(
                                            'mr-2 h-2 w-2 rounded-full',
                                            lead.status === 'read'
                                                ? 'bg-white'
                                                : 'bg-blue-500',
                                        )}
                                    />
                                    Mark Read
                                </Button>
                                <Button
                                    variant={
                                        lead.status === 'handled'
                                            ? 'default'
                                            : 'outline'
                                    }
                                    className="w-full justify-start"
                                    onClick={() =>
                                        handleStatusUpdate(lead.id, 'handled')
                                    }
                                    disabled={lead.status === 'handled'}
                                >
                                    <span
                                        className={cn(
                                            'mr-2 h-2 w-2 rounded-full',
                                            lead.status === 'handled'
                                                ? 'bg-white'
                                                : 'bg-green-500',
                                        )}
                                    />
                                    Mark Handled
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}

ContactShow.layout = {
    breadcrumbs: [
        { title: 'Admin', href: '/admin' },
        { title: 'Contact Leads', href: '/admin/contacts' },
        { title: 'Detail', href: '#' },
    ],
};
