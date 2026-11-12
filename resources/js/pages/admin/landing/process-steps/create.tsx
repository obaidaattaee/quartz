import LandingItemForm from '@/pages/admin/landing/_shared/landing-item-form';
import { landingBreadcrumbs } from '@/pages/admin/landing/_shared/sections';

export default function LandingProcessStepsCreate() {
    return <LandingItemForm sectionKey="process-steps" />;
}

LandingProcessStepsCreate.layout = {
    breadcrumbs: landingBreadcrumbs('process-steps', {
        title: 'Add',
        href: '/admin/landing/process-steps/create',
    }),
};
