import LandingItemForm from '@/pages/admin/landing/_shared/landing-item-form';
import type { PortfolioOption } from '@/pages/admin/landing/_shared/landing-item-form';
import { landingBreadcrumbs } from '@/pages/admin/landing/_shared/sections';

export default function LandingCaseStudiesCreate({
    portfolioOptions,
}: {
    portfolioOptions: PortfolioOption[];
}) {
    return (
        <LandingItemForm
            sectionKey="case-studies"
            portfolioOptions={portfolioOptions}
        />
    );
}

LandingCaseStudiesCreate.layout = {
    breadcrumbs: landingBreadcrumbs('case-studies', {
        title: 'Add',
        href: '/admin/landing/case-studies/create',
    }),
};
