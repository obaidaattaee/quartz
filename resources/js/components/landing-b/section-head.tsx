import type { ReactNode } from 'react';

import { B, monoStyle } from './tokens';

type Props = {
    num: string;
    kicker: string;
    title: ReactNode;
    sub: ReactNode;
};

export default function SectionHead({ num, kicker, title, sub }: Props) {
    return (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 64,
                alignItems: 'end',
                marginBottom: 56,
                borderTop: `1px solid ${B.line}`,
                paddingTop: 32,
            }}
        >
            <div>
                <div style={monoStyle}>
                    {num}&nbsp;&nbsp;&nbsp;{kicker}
                </div>
                <h2
                    style={{
                        fontFamily: B.serif,
                        fontSize: 64,
                        lineHeight: 1.02,
                        fontWeight: 400,
                        letterSpacing: '-0.025em',
                        margin: '16px 0 0',
                        textWrap: 'balance' as React.CSSProperties['textWrap'],
                    }}
                >
                    {title}
                </h2>
            </div>
            <p
                style={{
                    fontSize: 17,
                    color: B.dim,
                    lineHeight: 1.55,
                    margin: 0,
                    textWrap: 'pretty' as React.CSSProperties['textWrap'],
                }}
            >
                {sub}
            </p>
        </div>
    );
}
