import { router } from '@inertiajs/react';
import { Search } from 'lucide-react';
import type { ReactNode } from 'react';
import { useCallback, useRef, useState } from 'react';

import { Input } from '@/components/ui/input';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

type Column<T> = {
    key: string;
    label: string;
    render?: (item: T) => ReactNode;
    className?: string;
};

type Props<T> = {
    columns: Column<T>[];
    data: T[];
    searchValue?: string;
    onSearchChange?: (value: string) => void;
    searchPlaceholder?: string;
    actions?: (item: T) => ReactNode;
    emptyMessage?: string;
    searchUrl?: string;
};

export default function DataTable<T extends { id: number | string }>({
    columns,
    data,
    searchValue,
    onSearchChange,
    searchPlaceholder = 'Search...',
    actions,
    emptyMessage = 'No items found.',
    searchUrl,
}: Props<T>) {
    const [localSearch, setLocalSearch] = useState(searchValue || '');
    const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
        null,
    );

    const handleSearchChange = useCallback(
        (value: string) => {
            setLocalSearch(value);

            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }

            searchTimeoutRef.current = setTimeout(() => {
                if (onSearchChange) {
                    onSearchChange(value);
                } else if (searchUrl) {
                    router.get(
                        searchUrl,
                        { search: value || undefined },
                        { preserveState: true, preserveScroll: true },
                    );
                }
            }, 300);
        },
        [onSearchChange, searchUrl],
    );

    const totalColumns = columns.length + (actions ? 1 : 0);

    return (
        <div className="space-y-4">
            {(onSearchChange || searchUrl) && (
                <div className="relative max-w-sm">
                    <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
                    <Input
                        placeholder={searchPlaceholder}
                        value={localSearch}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className="pl-9"
                    />
                </div>
            )}

            <Table>
                <TableHeader>
                    <TableRow>
                        {columns.map((column) => (
                            <TableHead
                                key={column.key}
                                className={column.className}
                            >
                                {column.label}
                            </TableHead>
                        ))}
                        {actions && (
                            <TableHead className="text-right">
                                Actions
                            </TableHead>
                        )}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={totalColumns}
                                className="text-muted-foreground h-24 text-center"
                            >
                                {emptyMessage}
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((item) => (
                            <TableRow key={item.id}>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.key}
                                        className={column.className}
                                    >
                                        {column.render
                                            ? column.render(item)
                                            : (
                                                  item as Record<
                                                      string,
                                                      unknown
                                                  >
                                              )[column.key]?.toString() ?? ''}
                                    </TableCell>
                                ))}
                                {actions && (
                                    <TableCell className="text-right">
                                        {actions(item)}
                                    </TableCell>
                                )}
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
