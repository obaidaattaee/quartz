import LandingItemForm from '@/pages/admin/landing/_shared/landing-item-form';
import { landingBreadcrumbs } from '@/pages/admin/landing/_shared/sections';
import type { LandingItem } from '@/pages/admin/landing/_shared/sections';

type Props = {
    item: LandingItem;
};

export default function LandingServicesEdit({ item }: Props) {
    return <LandingItemForm sectionKey="services" item={item} />;
}

LandingServicesEdit.layout = {
    breadcrumbs: landingBreadcrumbs('services', { title: 'Edit', href: '#' }),
};
