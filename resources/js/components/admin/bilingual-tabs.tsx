import type { ReactNode } from 'react';

import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs';

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
    const hasEnErrors =
        errors && Object.keys(errors).some((k) => k.endsWith('_en'));
    const hasArErrors =
        errors && Object.keys(errors).some((k) => k.endsWith('_ar'));

    return (
        <Tabs defaultValue={defaultLocale}>
            <TabsList>
                <TabsTrigger value="en">
                    English
                    {hasEnErrors && (
                        <span className="bg-destructive ml-1.5 h-2 w-2 rounded-full" />
                    )}
                </TabsTrigger>
                <TabsTrigger value="ar">
                    Arabic
                    {hasArErrors && (
                        <span className="bg-destructive ml-1.5 h-2 w-2 rounded-full" />
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
