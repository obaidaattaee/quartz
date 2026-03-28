import { Head } from '@inertiajs/react';

type Props = { data: Record<string, unknown> };

export default function JsonLd({ data }: Props) {
    return (
        <Head>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(data),
                }}
            />
        </Head>
    );
}
