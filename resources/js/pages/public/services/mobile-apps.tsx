import type { ReactNode } from 'react';

import ServiceDetail, {
    ServiceDetailLayout,
} from '@/components/services/service-detail';

// Copy lives in the service_pages row; see ServiceController::localized().
export default function MobileApps() {
    return <ServiceDetail />;
}

MobileApps.layout = (page: ReactNode) => (
    <ServiceDetailLayout>{page}</ServiceDetailLayout>
);
