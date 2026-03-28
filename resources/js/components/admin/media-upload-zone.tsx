import { Upload } from 'lucide-react';
import { useCallback, useRef, useState } from 'react';

import { cn } from '@/lib/utils';
import type { MediaItem } from '@/types';

type Props = {
    onUploadComplete: (media: MediaItem) => void;
    multiple?: boolean;
    className?: string;
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export default function MediaUploadZone({
    onUploadComplete,
    multiple = false,
    className,
}: Props) {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const uploadFile = useCallback(
        async (file: File) => {
            if (file.size > MAX_FILE_SIZE) {
                setError('Image must be under 10MB.');

                return;
            }

            setIsUploading(true);
            setError(null);

            try {
                const formData = new FormData();
                formData.append('file', file);

                const csrfToken = document
                    .querySelector('meta[name="csrf-token"]')
                    ?.getAttribute('content');

                const response = await fetch('/admin/media/upload', {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'X-CSRF-TOKEN': csrfToken || '',
                    },
                    body: formData,
                });

                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(
                        data.message || 'Upload failed. Please try again.',
                    );
                }

                const media: MediaItem = await response.json();
                onUploadComplete(media);
            } catch (err) {
                setError(
                    err instanceof Error
                        ? err.message
                        : 'Upload failed. Please try again.',
                );
            } finally {
                setIsUploading(false);
            }
        },
        [onUploadComplete],
    );

    const handleFiles = useCallback(
        (files: FileList | null) => {
            if (!files) {
                return;
            }

            const fileArray = Array.from(files);
            const filesToUpload = multiple ? fileArray : [fileArray[0]];

            filesToUpload.forEach((file) => {
                uploadFile(file);
            });
        },
        [multiple, uploadFile],
    );

    const handleDragOver = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(true);
        },
        [],
    );

    const handleDragLeave = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);
        },
        [],
    );

    const handleDrop = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragging(false);
            handleFiles(e.dataTransfer.files);
        },
        [handleFiles],
    );

    const handleClick = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            handleFiles(e.target.files);
            // Reset input so the same file can be re-selected
            e.target.value = '';
        },
        [handleFiles],
    );

    return (
        <div className={cn('space-y-2', className)}>
            <div
                role="button"
                tabIndex={0}
                onClick={handleClick}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        handleClick();
                    }
                }}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={cn(
                    'flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 transition-colors',
                    isDragging
                        ? 'border-primary bg-primary/5'
                        : 'border-muted-foreground/25 hover:border-primary/50',
                    isUploading && 'pointer-events-none opacity-50',
                )}
            >
                <Upload className="text-muted-foreground mb-2 h-8 w-8" />
                {isUploading ? (
                    <p className="text-muted-foreground text-sm">
                        Uploading...
                    </p>
                ) : (
                    <p className="text-muted-foreground text-sm">
                        Drag and drop images here, or click to browse
                    </p>
                )}
            </div>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                multiple={multiple}
                onChange={handleInputChange}
                className="hidden"
            />
            {error && <p className="text-destructive text-sm">{error}</p>}
        </div>
    );
}
