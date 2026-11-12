import { useId, useState } from 'react';

import { cn } from '@/lib/utils';
import type { IndustryFaq } from '@/types/industry';

type Props = {
    faqs: IndustryFaq[];
};

// Copy of components/services/faq-accordion with in- classes.
// Disclosure list: each question is a button inside an h3 that toggles its
// answer. Closed answers are visibility:hidden, so they leave the
// accessibility tree and the tab order.
export default function FaqAccordion({ faqs }: Props) {
    const baseId = useId();
    const [open, setOpen] = useState<number>(0);

    return (
        <div className="in-faq">
            {faqs.map((faq, i) => {
                const isOpen = open === i;
                const buttonId = `${baseId}-q-${i}`;
                const panelId = `${baseId}-a-${i}`;

                return (
                    <div key={`${i}-${faq.question}`} className="in-faq-item">
                        <h3>
                            <button
                                type="button"
                                id={buttonId}
                                className="in-faq-btn"
                                aria-expanded={isOpen}
                                aria-controls={panelId}
                                onClick={() => setOpen(isOpen ? -1 : i)}
                            >
                                <span>{faq.question}</span>
                                <span
                                    className="in-faq-icon"
                                    aria-hidden="true"
                                />
                            </button>
                        </h3>
                        <div
                            id={panelId}
                            role="region"
                            aria-labelledby={buttonId}
                            className={cn('in-faq-panel', isOpen && 'is-open')}
                        >
                            <div>
                                <p>{faq.answer}</p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
