import type { ReactNode } from 'react';

import { B, monoStyle } from './tokens';

type Props = {
    kicker: string;
    title: ReactNode;
    sub: ReactNode;
    id?: string;
};

// Section eyebrows carry no ordinal: sections hide themselves when their
// content is empty, so any numbering would skip.
export default function SectionHead({ kicker, title, sub, id }: Props) {
    return (
        <div className="q-sec-head">
            <div>
                <div style={monoStyle}>{kicker}</div>
                <h2
                    id={id}
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
