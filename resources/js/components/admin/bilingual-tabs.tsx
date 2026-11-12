import type { ReactNode } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

type Props = {
    children: (locale: 'en' | 'ar') => ReactNode;
    errors?: Record<string, string>;
    defaultLocale?: 'en' | 'ar';
};

export default function BilingualTabs({
    children,
    errors,
    defaultLocale = 'en',
}: Props) {
    // Matches "title_en" as well as nested repeater keys like "faqs_en.0.answer".
    const hasEnErrors =
        errors && Object.keys(errors).some((k) => /_en(\.|$)/.test(k));
    const hasArErrors =
        errors && Object.keys(errors).some((k) => /_ar(\.|$)/.test(k));

    return (
        <Tabs defaultValue={defaultLocale}>
            <TabsList>
                <TabsTrigger value="en">
                    English
                    {hasEnErrors && (
                        <span className="ml-1.5 h-2 w-2 rounded-full bg-destructive" />
                    )}
                </TabsTrigger>
                <TabsTrigger value="ar">
                    Arabic
                    {hasArErrors && (
                        <span className="ml-1.5 h-2 w-2 rounded-full bg-destructive" />
                    )}
                </TabsTrigger>
            </TabsList>
            <TabsContent
                value="en"
                forceMount
                className="data-[state=inactive]:hidden"
            >
                {children('en')}
            </TabsContent>
            <TabsContent
                value="ar"
                forceMount
                className="data-[state=inactive]:hidden"
                dir="rtl"
            >
                {children('ar')}
            </TabsContent>
        </Tabs>
    );
}
