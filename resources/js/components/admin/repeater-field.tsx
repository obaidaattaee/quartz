import { ChevronDown, ChevronUp, Plus, X } from 'lucide-react';
import type { ReactNode } from 'react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

type Errors = Partial<Record<string, string>>;

export type RepeaterColumn<T> = {
    key: keyof T & string;
    label: string;
    multiline?: boolean;
    rows?: number;
    placeholder?: string;
    /** Render the field at half width next to another half-width field. */
    half?: boolean;
};

function move<T>(items: T[], index: number, direction: -1 | 1): T[] {
    const next = [...items];
    const target = index + direction;
    [next[index], next[target]] = [next[target], next[index]];

    return next;
}

type RowControlsProps = {
    index: number;
    count: number;
    canRemove: boolean;
    itemLabel: string;
    onMove: (direction: -1 | 1) => void;
    onRemove: () => void;
};

function RowControls({
    index,
    count,
    canRemove,
    itemLabel,
    onMove,
    onRemove,
}: RowControlsProps) {
    const name = `${itemLabel} ${index + 1}`;

    return (
        <div className="flex shrink-0 items-center gap-0.5">
            <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                disabled={index === 0}
                onClick={() => onMove(-1)}
                aria-label={`Move ${name} up`}
            >
                <ChevronUp className="h-4 w-4" />
            </Button>
            <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                disabled={index === count - 1}
                onClick={() => onMove(1)}
                aria-label={`Move ${name} down`}
            >
                <ChevronDown className="h-4 w-4" />
            </Button>
            {canRemove && (
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={onRemove}
                    aria-label={`Remove ${name}`}
                >
                    <X className="h-4 w-4" />
                </Button>
            )}
        </div>
    );
}

type AddButtonProps = {
    label: string;
    count: number;
    maxItems?: number;
    onAdd: () => void;
};

function AddButton({ label, count, maxItems, onAdd }: AddButtonProps) {
    const full = maxItems !== undefined && count >= maxItems;

    return (
        <div className="flex items-center gap-3">
            <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={full}
                onClick={onAdd}
            >
                <Plus className="me-1 h-4 w-4" />
                {label}
            </Button>
            {maxItems !== undefined && (
                <span dir="ltr" className="text-xs text-muted-foreground">
                    {count} of {maxItems} max
                </span>
            )}
        </div>
    );
}

type RepeaterFieldProps<T extends Record<string, string>> = {
    /** Base for input ids and error keys, e.g. "faqs_en". */
    name: string;
    items: T[];
    onChange: (items: T[]) => void;
    columns: RepeaterColumn<T>[];
    blank: T;
    errors: Errors;
    itemLabel: string;
    addLabel: string;
    minItems?: number;
    maxItems?: number;
    dir?: 'ltr' | 'rtl';
    /** Extra note shown next to a row's heading, e.g. a "shown first" badge. */
    rowNote?: (index: number) => ReactNode;
    emptyText?: string;
};

/**
 * A list of small records (steps, FAQs, options) edited as stacked cards,
 * with add, remove and move up/down controls.
 */
export default function RepeaterField<T extends Record<string, string>>({
    name,
    items,
    onChange,
    columns,
    blank,
    errors,
    itemLabel,
    addLabel,
    minItems = 0,
    maxItems,
    dir,
    rowNote,
    emptyText,
}: RepeaterFieldProps<T>) {
    function update(index: number, key: keyof T, value: string) {
        const next = [...items];
        next[index] = { ...next[index], [key]: value };
        onChange(next);
    }

    function remove(index: number) {
        onChange(items.filter((_, i) => i !== index));
    }

    return (
        <div className="space-y-4">
            {items.length === 0 && emptyText && (
                <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
                    {emptyText}
                </p>
            )}
            {items.map((item, index) => (
                <div key={index} className="rounded-lg border p-4">
                    <div className="mb-2 flex items-center justify-between gap-2">
                        <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            {itemLabel} {index + 1}
                            {rowNote?.(index)}
                        </span>
                        <RowControls
                            index={index}
                            count={items.length}
                            canRemove={items.length > minItems}
                            itemLabel={itemLabel}
                            onMove={(direction) =>
                                onChange(move(items, index, direction))
                            }
                            onRemove={() => remove(index)}
                        />
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                        {columns.map((column) => {
                            const id = `${name}-${index}-${column.key}`;
                            const errorKey = `${name}.${index}.${column.key}`;

                            return (
                                <div
                                    key={column.key}
                                    className={
                                        column.half
                                            ? 'space-y-1'
                                            : 'space-y-1 sm:col-span-2'
                                    }
                                >
                                    <Label htmlFor={id}>{column.label}</Label>
                                    {column.multiline ? (
                                        <Textarea
                                            id={id}
                                            dir={dir}
                                            value={item[column.key] ?? ''}
                                            placeholder={column.placeholder}
                                            rows={column.rows ?? 2}
                                            onChange={(e) =>
                                                update(
                                                    index,
                                                    column.key,
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    ) : (
                                        <Input
                                            id={id}
                                            dir={dir}
                                            value={item[column.key] ?? ''}
                                            placeholder={column.placeholder}
                                            onChange={(e) =>
                                                update(
                                                    index,
                                                    column.key,
                                                    e.target.value,
                                                )
                                            }
                                        />
                                    )}
                                    <InputError message={errors[errorKey]} />
                                </div>
                            );
                        })}
                    </div>
                </div>
            ))}
            <InputError message={errors[name]} />
            <AddButton
                label={addLabel}
                count={items.length}
                maxItems={maxItems}
                onAdd={() => onChange([...items, { ...blank }])}
            />
        </div>
    );
}

type StringListFieldProps = {
    name: string;
    items: string[];
    onChange: (items: string[]) => void;
    errors: Errors;
    itemLabel: string;
    addLabel: string;
    minItems?: number;
    maxItems?: number;
    dir?: 'ltr' | 'rtl';
};

/**
 * A list of single-line strings (deliverables) with the same add, remove
 * and move up/down controls as RepeaterField.
 */
export function StringListField({
    name,
    items,
    onChange,
    errors,
    itemLabel,
    addLabel,
    minItems = 0,
    maxItems,
    dir,
}: StringListFieldProps) {
    return (
        <div className="space-y-3">
            {items.map((item, index) => (
                <div key={index} className="space-y-1">
                    <div className="flex items-center gap-2">
                        <Input
                            id={`${name}-${index}`}
                            dir={dir}
                            value={item}
                            aria-label={`${itemLabel} ${index + 1}`}
                            placeholder={`${itemLabel} ${index + 1}`}
                            className="flex-1"
                            onChange={(e) => {
                                const next = [...items];
                                next[index] = e.target.value;
                                onChange(next);
                            }}
                        />
                        <RowControls
                            index={index}
                            count={items.length}
                            canRemove={items.length > minItems}
                            itemLabel={itemLabel}
                            onMove={(direction) =>
                                onChange(move(items, index, direction))
                            }
                            onRemove={() =>
                                onChange(items.filter((_, i) => i !== index))
                            }
                        />
                    </div>
                    <InputError message={errors[`${name}.${index}`]} />
                </div>
            ))}
            <InputError message={errors[name]} />
            <AddButton
                label={addLabel}
                count={items.length}
                maxItems={maxItems}
                onAdd={() => onChange([...items, ''])}
            />
        </div>
    );
}
