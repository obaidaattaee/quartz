import LandingItemForm from '@/pages/admin/landing/_shared/landing-item-form';
import { landingBreadcrumbs } from '@/pages/admin/landing/_shared/sections';
import type { LandingItem } from '@/pages/admin/landing/_shared/sections';

type Props = {
    item: LandingItem;
};

export default function LandingProcessStepsEdit({ item }: Props) {
    return <LandingItemForm sectionKey="process-steps" item={item} />;
}

LandingProcessStepsEdit.layout = {
    breadcrumbs: landingBreadcrumbs('process-steps', {
        title: 'Edit',
        href: '#',
    }),
};
