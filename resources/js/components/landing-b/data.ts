// Shapes delivered by HomeController to the Direction B sections.
// Components read these via `useLandingData()` which pulls from
// Inertia page props (`landing.*` / `testimonials` / etc.).

import { usePage } from '@inertiajs/react';

export type Service = {
    code: string;
    title: string;
    body: string;
    tags: string[];
};

export type Stat = { k: string; v: string };

export type Product = {
    code: string;
    name: string;
    kind: string;
    pitch: string;
    url: string;
    stats: Stat[];
    demo_kind: 'bo' | 'cyber' | string;
};

export type ProcessStep = {
    n: string;
    title: string;
    body: string;
    duration: string;
    deliverable: string;
};

export type CaseStudy = {
    tag: string;
    client: string;
    headline: string;
    metric: string;
    metric_label: string;
    portfolio_slug: string | null;
};

export type Faq = {
    q: string;
    a: string;
};

export type LandingData = {
    services: Service[];
    products: Product[];
    processSteps: ProcessStep[];
    cases: CaseStudy[];
    faqs: Faq[];
    logos: string[];
};

export function useLandingData(): LandingData {
    const { landing } = usePage<{ landing: LandingData }>().props;

    return (
        landing ?? {
            services: [],
            products: [],
            processSteps: [],
            cases: [],
            faqs: [],
            logos: [],
        }
    );
}
