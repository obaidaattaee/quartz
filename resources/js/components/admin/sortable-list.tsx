import { ChevronDown, ChevronUp } from 'lucide-react';
import type { ReactNode } from 'react';

import { Button } from '@/components/ui/button';

type Props<T extends { id: number; sort_order: number }> = {
    items: T[];
    onReorder: (id: number, direction: 'up' | 'down') => void;
    renderItem: (item: T) => ReactNode;
};

export default function SortableList<
    T extends { id: number; sort_order: number },
>({ items, onReorder, renderItem }: Props<T>) {
    return (
        <div className="space-y-2">
            {items.map((item, index) => (
                <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-lg border p-3"
                >
                    <div className="flex flex-col gap-0.5">
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            disabled={index === 0}
                            onClick={() => onReorder(item.id, 'up')}
                            className="h-6 w-6 p-0"
                        >
                            <ChevronUp className="h-4 w-4" />
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            disabled={index === items.length - 1}
                            onClick={() => onReorder(item.id, 'down')}
                            className="h-6 w-6 p-0"
                        >
                            <ChevronDown className="h-4 w-4" />
                        </Button>
                    </div>
                    <div className="min-w-0 flex-1">{renderItem(item)}</div>
                </div>
            ))}
            {items.length === 0 && (
                <p className="text-muted-foreground py-8 text-center text-sm">
                    No items to display.
                </p>
            )}
        </div>
    );
}
