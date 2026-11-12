import LandingItemForm from '@/pages/admin/landing/_shared/landing-item-form';
import { landingBreadcrumbs } from '@/pages/admin/landing/_shared/sections';

export default function LandingFaqsCreate() {
    return <LandingItemForm sectionKey="faqs" />;
}

LandingFaqsCreate.layout = {
    breadcrumbs: landingBreadcrumbs('faqs', {
        title: 'Add',
        href: '/admin/landing/faqs/create',
    }),
};
