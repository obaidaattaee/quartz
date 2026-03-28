import { HexColorPicker } from 'react-colorful';
import { useCallback, useState } from 'react';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

type Props = {
    value: string;
    onChange: (color: string) => void;
    label: string;
};

const HEX_REGEX = /^#[0-9A-Fa-f]{6}$/;

export default function ColorPickerField({
    value,
    onChange,
    label,
}: Props) {
    const [inputValue, setInputValue] = useState(value);

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const newValue = e.target.value;
            setInputValue(newValue);

            if (HEX_REGEX.test(newValue)) {
                onChange(newValue);
            }
        },
        [onChange],
    );

    const handlePickerChange = useCallback(
        (color: string) => {
            setInputValue(color);
            onChange(color);
        },
        [onChange],
    );

    return (
        <div className="space-y-2">
            <Label>{label}</Label>
            <div className="flex items-center gap-3">
                <Popover>
                    <PopoverTrigger asChild>
                        <button
                            type="button"
                            className="h-10 w-10 shrink-0 rounded-md border shadow-sm"
                            style={{ backgroundColor: value }}
                            aria-label={`Pick ${label} color`}
                        />
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-3">
                        <HexColorPicker
                            color={value}
                            onChange={handlePickerChange}
                        />
                    </PopoverContent>
                </Popover>
                <Input
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder="#000000"
                    className="w-32"
                />
            </div>
        </div>
    );
}
