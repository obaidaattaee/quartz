import LandingItemForm from '@/pages/admin/landing/_shared/landing-item-form';
import type { PortfolioOption } from '@/pages/admin/landing/_shared/landing-item-form';
import { landingBreadcrumbs } from '@/pages/admin/landing/_shared/sections';
import type { LandingItem } from '@/pages/admin/landing/_shared/sections';

type Props = {
    item: LandingItem;
    portfolioOptions: PortfolioOption[];
};

export default function LandingCaseStudiesEdit({
    item,
    portfolioOptions,
}: Props) {
    return (
        <LandingItemForm
            sectionKey="case-studies"
            item={item}
            portfolioOptions={portfolioOptions}
        />
    );
}

LandingCaseStudiesEdit.layout = {
    breadcrumbs: landingBreadcrumbs('case-studies', {
        title: 'Edit',
        href: '#',
    }),
};
