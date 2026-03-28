import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useEffect, useRef } from 'react';

import { cn } from '@/lib/utils';

import TiptapToolbar from './tiptap-toolbar';

type Props = {
    content: string;
    onChange: (html: string) => void;
    direction?: 'ltr' | 'rtl';
    placeholder?: string;
    className?: string;
};

export default function TiptapEditor({
    content,
    onChange,
    direction,
    placeholder,
    className,
}: Props) {
    const isExternalUpdate = useRef(false);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: { levels: [2, 3, 4] },
            }),
            Image.configure({
                HTMLAttributes: { class: 'max-w-full h-auto rounded-lg' },
                allowBase64: false,
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: { class: 'text-primary underline' },
            }),
        ],
        content,
        immediatelyRender: false,
        onUpdate: ({ editor: updatedEditor }) => {
            if (!isExternalUpdate.current) {
                onChange(updatedEditor.getHTML());
            }
        },
    });

    // Handle external content changes without causing infinite loops
    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            isExternalUpdate.current = true;
            editor.commands.setContent(content, { emitUpdate: false });
            isExternalUpdate.current = false;
        }
    }, [content, editor]);

    return (
        <div className={cn('rounded-md border', className)}>
            <TiptapToolbar editor={editor} />
            <EditorContent
                editor={editor}
                className="prose dark:prose-invert max-w-none min-h-[200px] p-4 focus:outline-none"
                dir={direction}
            />
            {placeholder && !content && (
                <div className="text-muted-foreground pointer-events-none absolute px-4 text-sm">
                    {placeholder}
                </div>
            )}
        </div>
    );
}
