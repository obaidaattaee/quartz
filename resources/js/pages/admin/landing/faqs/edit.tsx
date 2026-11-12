import LandingItemForm from '@/pages/admin/landing/_shared/landing-item-form';
import { landingBreadcrumbs } from '@/pages/admin/landing/_shared/sections';
import type { LandingItem } from '@/pages/admin/landing/_shared/sections';

type Props = {
    item: LandingItem;
};

export default function LandingFaqsEdit({ item }: Props) {
    return <LandingItemForm sectionKey="faqs" item={item} />;
}

LandingFaqsEdit.layout = {
    breadcrumbs: landingBreadcrumbs('faqs', { title: 'Edit', href: '#' }),
};
