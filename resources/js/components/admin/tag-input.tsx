import { X } from 'lucide-react';
import { useState } from 'react';
import type { KeyboardEvent } from 'react';

import InputError from '@/components/input-error';
import { Input } from '@/components/ui/input';

type Props = {
    id: string;
    /** Error key prefix, e.g. "tools" (row errors are "tools.0"). */
    name: string;
    values: string[];
    onChange: (values: string[]) => void;
    errors: Partial<Record<string, string>>;
    maxItems?: number;
    maxLength?: number;
    placeholder?: string;
};

/**
 * A list of short labels edited as removable chips. Type a value and press
 * Enter or comma to add it; pasting a comma-separated list adds each part.
 */
export default function TagInput({
    id,
    name,
    values,
    onChange,
    errors,
    maxItems,
    maxLength,
    placeholder,
}: Props) {
    const [draft, setDraft] = useState('');
    const full = maxItems !== undefined && values.length >= maxItems;

    function add(raw: string) {
        const next = [...values];

        for (const part of raw.split(',')) {
            const value = part.trim();
            const exists = next.some(
                (v) => v.toLowerCase() === value.toLowerCase(),
            );

            if (!value || exists) {
                continue;
            }

            if (maxItems !== undefined && next.length >= maxItems) {
                break;
            }

            next.push(value);
        }

        onChange(next);
        setDraft('');
    }

    function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            add(draft);

            return;
        }

        if (e.key === 'Backspace' && draft === '' && values.length > 0) {
            onChange(values.slice(0, -1));
        }
    }

    const rowErrors = values
        .map((value, index) => ({ value, message: errors[`${name}.${index}`] }))
        .filter((e) => e.message);

    return (
        <div className="space-y-2">
            {values.length > 0 && (
                <ul className="flex flex-wrap gap-2">
                    {values.map((value, index) => (
                        <li
                            key={value}
                            className="flex items-center gap-1 rounded-md border bg-muted py-1 ps-2.5 pe-1 text-sm"
                        >
                            {value}
                            <button
                                type="button"
                                className="rounded p-0.5 text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                                onClick={() =>
                                    onChange(
                                        values.filter((_, i) => i !== index),
                                    )
                                }
                                aria-label={`Remove ${value}`}
                            >
                                <X className="h-3.5 w-3.5" />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
            <div className="flex items-center gap-3">
                <Input
                    id={id}
                    value={draft}
                    disabled={full}
                    maxLength={maxLength}
                    placeholder={full ? 'Limit reached' : placeholder}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={onKeyDown}
                    onBlur={() => draft.trim() && add(draft)}
                    onPaste={(e) => {
                        const text = e.clipboardData.getData('text');

                        if (text.includes(',')) {
                            e.preventDefault();
                            add(draft + text);
                        }
                    }}
                    className="flex-1"
                />
                {maxItems !== undefined && (
                    <span
                        dir="ltr"
                        className="shrink-0 text-xs text-muted-foreground"
                    >
                        {values.length} of {maxItems} max
                    </span>
                )}
            </div>
            {rowErrors.map((e) => (
                <InputError
                    key={e.value}
                    message={`${e.value}: ${e.message}`}
                />
            ))}
            <InputError message={errors[name]} />
        </div>
    );
}
