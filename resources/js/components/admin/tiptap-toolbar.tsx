import type { Editor } from '@tiptap/react';
import {
    Bold,
    Code,
    Heading2,
    Heading3,
    Heading4,
    ImageIcon,
    Italic,
    Link,
    List,
    ListOrdered,
    Minus,
    Quote,
    Strikethrough,
} from 'lucide-react';
import { useCallback, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import type { MediaItem } from '@/types';

import MediaLibraryModal from './media-library-modal';

type Props = {
    editor: Editor | null;
};

type ToolbarButton = {
    icon: React.ElementType;
    label: string;
    action: () => void;
    isActive?: boolean;
};

export default function TiptapToolbar({ editor }: Props) {
    const [mediaModalOpen, setMediaModalOpen] = useState(false);

    const handleMediaSelect = useCallback(
        (media: MediaItem) => {
            editor
                ?.chain()
                .focus()
                .setImage({ src: media.url, alt: media.filename })
                .run();
        },
        [editor],
    );

    const handleLinkClick = useCallback(() => {
        const url = window.prompt('Enter URL');

        if (url) {
            editor?.chain().focus().setLink({ href: url }).run();
        }
    }, [editor]);

    if (!editor) {
        return null;
    }

    const formatButtons: ToolbarButton[] = [
        {
            icon: Bold,
            label: 'Bold',
            action: () => editor.chain().focus().toggleBold().run(),
            isActive: editor.isActive('bold'),
        },
        {
            icon: Italic,
            label: 'Italic',
            action: () => editor.chain().focus().toggleItalic().run(),
            isActive: editor.isActive('italic'),
        },
        {
            icon: Strikethrough,
            label: 'Strikethrough',
            action: () => editor.chain().focus().toggleStrike().run(),
            isActive: editor.isActive('strike'),
        },
    ];

    const headingButtons: ToolbarButton[] = [
        {
            icon: Heading2,
            label: 'Heading 2',
            action: () =>
                editor.chain().focus().toggleHeading({ level: 2 }).run(),
            isActive: editor.isActive('heading', { level: 2 }),
        },
        {
            icon: Heading3,
            label: 'Heading 3',
            action: () =>
                editor.chain().focus().toggleHeading({ level: 3 }).run(),
            isActive: editor.isActive('heading', { level: 3 }),
        },
        {
            icon: Heading4,
            label: 'Heading 4',
            action: () =>
                editor.chain().focus().toggleHeading({ level: 4 }).run(),
            isActive: editor.isActive('heading', { level: 4 }),
        },
    ];

    const listButtons: ToolbarButton[] = [
        {
            icon: List,
            label: 'Bullet List',
            action: () => editor.chain().focus().toggleBulletList().run(),
            isActive: editor.isActive('bulletList'),
        },
        {
            icon: ListOrdered,
            label: 'Ordered List',
            action: () => editor.chain().focus().toggleOrderedList().run(),
            isActive: editor.isActive('orderedList'),
        },
    ];

    const blockButtons: ToolbarButton[] = [
        {
            icon: Quote,
            label: 'Blockquote',
            action: () => editor.chain().focus().toggleBlockquote().run(),
            isActive: editor.isActive('blockquote'),
        },
        {
            icon: Code,
            label: 'Code Block',
            action: () => editor.chain().focus().toggleCodeBlock().run(),
            isActive: editor.isActive('codeBlock'),
        },
        {
            icon: Minus,
            label: 'Horizontal Rule',
            action: () => editor.chain().focus().setHorizontalRule().run(),
        },
    ];

    const renderButtonGroup = (buttons: ToolbarButton[]) =>
        buttons.map((button) => (
            <Button
                key={button.label}
                type="button"
                variant="ghost"
                size="sm"
                onClick={button.action}
                data-active={button.isActive || undefined}
                className="data-[active]:bg-accent h-8 w-8 p-0"
                title={button.label}
            >
                <button.icon className="h-4 w-4" />
            </Button>
        ));

    return (
        <>
            <div className="flex flex-wrap items-center gap-1 border-b px-2 pb-2 pt-2">
                {renderButtonGroup(formatButtons)}
                <Separator orientation="vertical" className="mx-1 h-6" />
                {renderButtonGroup(headingButtons)}
                <Separator orientation="vertical" className="mx-1 h-6" />
                {renderButtonGroup(listButtons)}
                <Separator orientation="vertical" className="mx-1 h-6" />
                {renderButtonGroup(blockButtons)}
                <Separator orientation="vertical" className="mx-1 h-6" />
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleLinkClick}
                    data-active={editor.isActive('link') || undefined}
                    className="data-[active]:bg-accent h-8 w-8 p-0"
                    title="Link"
                >
                    <Link className="h-4 w-4" />
                </Button>
                <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setMediaModalOpen(true)}
                    className="h-8 w-8 p-0"
                    title="Insert Image"
                >
                    <ImageIcon className="h-4 w-4" />
                </Button>
            </div>

            <MediaLibraryModal
                open={mediaModalOpen}
                onOpenChange={setMediaModalOpen}
                onSelect={handleMediaSelect}
            />
        </>
    );
}
