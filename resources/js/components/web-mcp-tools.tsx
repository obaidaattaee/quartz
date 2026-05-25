import { router } from '@inertiajs/react';
import { useEffect } from 'react';

import { useLocale } from '@/hooks/use-locale';

type WebMCPTool = {
    name: string;
    description: string;
    inputSchema: Record<string, unknown>;
    execute: (input: Record<string, unknown>) => Promise<{ result?: unknown; error?: string }>;
};

type ModelContext = {
    provideContext: (input: { tools: WebMCPTool[] }) => void;
};

/**
 * Registers a minimal set of WebMCP tools (webmachinelearning.github.io/webmcp)
 * so AI agents browsing this site can discover and invoke its primary verbs:
 * navigate to key sections, open the contact form pre-filled, and subscribe
 * an email to the newsletter. No-op on browsers that don't expose
 * `navigator.modelContext` yet (i.e. every browser today as of writing).
 */
export default function WebMcpTools() {
    const { locale } = useLocale();

    useEffect(() => {
        if (typeof navigator === 'undefined') return;

        const nav = navigator as Navigator & {
            modelContext?: ModelContext;
        };

        if (!nav.modelContext?.provideContext) return;

        const tools: WebMCPTool[] = [
            {
                name: 'navigate',
                description:
                    "Navigate to a top-level area of the Quartz Solutions site. " +
                    "Valid sections: 'services', 'portfolio', 'industries', 'blog', 'about', 'contact'.",
                inputSchema: {
                    type: 'object',
                    required: ['section'],
                    properties: {
                        section: {
                            type: 'string',
                            enum: [
                                'services',
                                'portfolio',
                                'industries',
                                'blog',
                                'about',
                                'contact',
                            ],
                        },
                    },
                },
                execute: async (input) => {
                    const section = String(input.section ?? '');
                    const map: Record<string, string> = {
                        services: `/${locale}/services/development`,
                        portfolio: `/${locale}/portfolio`,
                        industries: `/${locale}/industries`,
                        blog: `/${locale}/blog`,
                        about: `/${locale}/about`,
                        contact: `/${locale}/contact`,
                    };
                    const target = map[section];

                    if (!target) {
                        return { error: `Unknown section: ${section}` };
                    }

                    router.visit(target);

                    return { result: { navigated: target } };
                },
            },
            {
                name: 'open_contact',
                description:
                    "Open the Quartz contact form, optionally pre-filling fields. " +
                    "Submitting still requires a human confirmation.",
                inputSchema: {
                    type: 'object',
                    properties: {
                        name: { type: 'string', maxLength: 120 },
                        company: { type: 'string', maxLength: 120 },
                        email: { type: 'string', format: 'email' },
                        scope: {
                            type: 'string',
                            enum: [
                                'Software build',
                                'Automation',
                                'QA',
                                'Cybersecurity',
                                'Discovery / advisory',
                            ],
                        },
                        msg: { type: 'string', maxLength: 2000 },
                    },
                },
                execute: async (input) => {
                    const qs = new URLSearchParams(
                        Object.fromEntries(
                            Object.entries(input).filter(
                                ([, v]) => v != null && v !== '',
                            ) as [string, string][],
                        ),
                    ).toString();
                    const target =
                        `/${locale}/contact` + (qs ? `?${qs}` : '');

                    router.visit(target);

                    return { result: { opened: target } };
                },
            },
            {
                name: 'subscribe_newsletter',
                description:
                    'Subscribe an email address to the Quartz monthly engineering newsletter.',
                inputSchema: {
                    type: 'object',
                    required: ['email'],
                    properties: {
                        email: { type: 'string', format: 'email' },
                    },
                },
                execute: async (input) => {
                    const email = String(input.email ?? '');

                    if (!email) {
                        return { error: 'email is required' };
                    }

                    try {
                        const res = await fetch(
                            `/${locale}/newsletter/subscribe`,
                            {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                    Accept: 'application/json',
                                },
                                body: JSON.stringify({ email }),
                            },
                        );

                        if (!res.ok) {
                            return {
                                error: `subscribe failed: HTTP ${res.status}`,
                            };
                        }

                        return { result: { subscribed: email } };
                    } catch (e) {
                        return {
                            error:
                                e instanceof Error
                                    ? e.message
                                    : 'network error',
                        };
                    }
                },
            },
        ];

        nav.modelContext.provideContext({ tools });
    }, [locale]);

    return null;
}
