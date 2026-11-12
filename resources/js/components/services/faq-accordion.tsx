import { useId, useState } from 'react';

import { cn } from '@/lib/utils';
import type { ServiceFaq } from '@/types/service';

type Props = {
    faqs: ServiceFaq[];
};

// Disclosure list: each question is a button inside an h3 that toggles its
// answer. Closed answers are visibility:hidden, so they leave the
// accessibility tree and the tab order.
export default function FaqAccordion({ faqs }: Props) {
    const baseId = useId();
    const [open, setOpen] = useState<number>(0);

    return (
        <div className="sv-faq">
            {faqs.map((faq, i) => {
                const isOpen = open === i;
                const buttonId = `${baseId}-q-${i}`;
                const panelId = `${baseId}-a-${i}`;

                return (
                    <div key={`${i}-${faq.question}`} className="sv-faq-item">
                        <h3>
                            <button
                                type="button"
                                id={buttonId}
                                className="sv-faq-btn"
                                aria-expanded={isOpen}
                                aria-controls={panelId}
                                onClick={() => setOpen(isOpen ? -1 : i)}
                            >
                                <span>{faq.question}</span>
                                <span
                                    className="sv-faq-icon"
                                    aria-hidden="true"
                                />
                            </button>
                        </h3>
                        <div
                            id={panelId}
                            role="region"
                            aria-labelledby={buttonId}
                            className={cn('sv-faq-panel', isOpen && 'is-open')}
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
