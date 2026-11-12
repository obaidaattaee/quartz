import LandingItemForm from '@/pages/admin/landing/_shared/landing-item-form';
import { landingBreadcrumbs } from '@/pages/admin/landing/_shared/sections';

export default function LandingServicesCreate() {
    return <LandingItemForm sectionKey="services" />;
}

LandingServicesCreate.layout = {
    breadcrumbs: landingBreadcrumbs('services', {
        title: 'Add',
        href: '/admin/landing/services/create',
    }),
};
