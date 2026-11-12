import LandingItemList from '@/pages/admin/landing/_shared/landing-item-list';
import { landingBreadcrumbs } from '@/pages/admin/landing/_shared/sections';
import type { LandingItem } from '@/pages/admin/landing/_shared/sections';

type Props = {
    items: LandingItem[];
};

export default function LandingCaseStudiesIndex({ items }: Props) {
    return <LandingItemList sectionKey="case-studies" items={items} />;
}

LandingCaseStudiesIndex.layout = {
    breadcrumbs: landingBreadcrumbs('case-studies'),
};
