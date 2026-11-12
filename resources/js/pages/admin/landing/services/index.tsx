import LandingItemList from '@/pages/admin/landing/_shared/landing-item-list';
import { landingBreadcrumbs } from '@/pages/admin/landing/_shared/sections';
import type { LandingItem } from '@/pages/admin/landing/_shared/sections';

type Props = {
    items: LandingItem[];
};

export default function LandingServicesIndex({ items }: Props) {
    return <LandingItemList sectionKey="services" items={items} />;
}

LandingServicesIndex.layout = {
    breadcrumbs: landingBreadcrumbs('services'),
};
