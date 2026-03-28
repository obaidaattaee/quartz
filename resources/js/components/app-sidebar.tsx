import { Link, usePage } from '@inertiajs/react';
import {
    Briefcase,
    FileText,
    FolderOpen,
    Image,
    LayoutDashboard,
    Mail,
    MessageSquare,
    Newspaper,
    Settings,
    Shield,
    Users,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import type { NavItem } from '@/types';

const dashboardItem: NavItem[] = [
    {
        title: 'Dashboard',
        href: '/admin',
        icon: LayoutDashboard,
    },
];

const contentNavItems: NavItem[] = [
    { title: 'Blog Posts', href: '/admin/blog', icon: FileText },
    { title: 'Portfolio', href: '/admin/portfolio', icon: FolderOpen },
];

const websiteNavItems: NavItem[] = [
    { title: 'Services', href: '/admin/services', icon: Briefcase },
    {
        title: 'Testimonials',
        href: '/admin/testimonials',
        icon: MessageSquare,
    },
    { title: 'Team Members', href: '/admin/team', icon: Users },
];

const communicationNavItems: NavItem[] = [
    { title: 'Contact Leads', href: '/admin/contacts', icon: Mail },
    { title: 'Newsletter', href: '/admin/newsletter', icon: Newspaper },
];

const systemNavItems: NavItem[] = [
    { title: 'Site Settings', href: '/admin/settings', icon: Settings },
    { title: 'Media Library', href: '/admin/media', icon: Image },
    { title: 'Users & Roles', href: '/admin/users', icon: Shield },
];

export function AppSidebar() {
    const { auth } = usePage<{
        auth: { user: { role?: string } };
    }>().props;
    const isAdmin = auth.user?.role === 'admin';

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/admin" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={dashboardItem} label="Admin" />
                <NavMain items={contentNavItems} label="Content" />
                {isAdmin && (
                    <NavMain
                        items={websiteNavItems}
                        label="Website"
                    />
                )}
                {isAdmin && (
                    <NavMain
                        items={communicationNavItems}
                        label="Communication"
                    />
                )}
                {isAdmin && (
                    <NavMain
                        items={systemNavItems}
                        label="System"
                    />
                )}
            </SidebarContent>

            <SidebarFooter>
                <NavFooter
                    items={[]}
                    className="mt-auto"
                />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
