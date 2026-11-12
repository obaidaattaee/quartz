import LandingItemList from '@/pages/admin/landing/_shared/landing-item-list';
import { landingBreadcrumbs } from '@/pages/admin/landing/_shared/sections';
import type { LandingItem } from '@/pages/admin/landing/_shared/sections';

type Props = {
    items: LandingItem[];
};

export default function LandingFaqsIndex({ items }: Props) {
    return <LandingItemList sectionKey="faqs" items={items} />;
}

LandingFaqsIndex.layout = {
    breadcrumbs: landingBreadcrumbs('faqs'),
};
