import { Head } from '@inertiajs/react';
import {
    Eye,
    FileText,
    FolderOpen,
    Mail,
    MessageSquare,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import type { AdminMetrics, RecentLead } from '@/types';

type MetricCardProps = {
    title: string;
    value: number;
    subtitle?: string;
    icon: LucideIcon;
};

function MetricCard({ title, value, subtitle, icon: Icon }: MetricCardProps) {
    return (
        <Card className="border-sidebar-border/70 dark:border-sidebar-border">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    {title}
                </CardTitle>
                <Icon className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {subtitle && (
                    <p className="text-muted-foreground text-xs">
                        {subtitle}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}

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

type Props = {
    metrics: AdminMetrics;
    recent_leads: RecentLead[];
};

export default function Dashboard({ metrics, recent_leads }: Props) {
    return (
        <>
            <Head title="Admin Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto p-4">
                <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-5">
                    <MetricCard
                        title="Total Leads"
                        value={metrics.total_leads}
                        icon={Mail}
                    />
                    <MetricCard
                        title="New Leads"
                        value={metrics.new_leads}
                        icon={Eye}
                    />
                    <MetricCard
                        title="Blog Posts"
                        value={metrics.blog_posts}
                        subtitle={`${metrics.published_posts} published`}
                        icon={FileText}
                    />
                    <MetricCard
                        title="Portfolio Items"
                        value={metrics.portfolio_items}
                        icon={FolderOpen}
                    />
                    <MetricCard
                        title="Testimonials"
                        value={metrics.testimonials}
                        icon={MessageSquare}
                    />
                </div>

                <Card className="border-sidebar-border/70 dark:border-sidebar-border">
                    <CardHeader>
                        <CardTitle>Recent Leads</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {recent_leads.length === 0 ? (
                            <p className="text-muted-foreground text-sm">
                                No contact leads yet.
                            </p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-muted-foreground border-b text-left">
                                            <th className="pb-2 pr-4 font-medium">
                                                Name
                                            </th>
                                            <th className="pb-2 pr-4 font-medium">
                                                Email
                                            </th>
                                            <th className="pb-2 pr-4 font-medium">
                                                Service
                                            </th>
                                            <th className="pb-2 pr-4 font-medium">
                                                Status
                                            </th>
                                            <th className="pb-2 font-medium">
                                                Date
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {recent_leads.map((lead) => (
                                            <tr
                                                key={lead.id}
                                                className="border-b last:border-0"
                                            >
                                                <td className="py-3 pr-4">
                                                    {lead.name}
                                                </td>
                                                <td className="py-3 pr-4">
                                                    {lead.email}
                                                </td>
                                                <td className="py-3 pr-4 capitalize">
                                                    {lead.service}
                                                </td>
                                                <td className="py-3 pr-4">
                                                    <span
                                                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${statusColor(lead.status)}`}
                                                    >
                                                        {lead.status}
                                                    </span>
                                                </td>
                                                <td className="py-3">
                                                    {new Date(
                                                        lead.created_at,
                                                    ).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        { title: 'Admin', href: '/admin' },
        { title: 'Dashboard', href: '/admin' },
    ],
};
