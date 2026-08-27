'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Bold, Italic, List, ListOrdered, Heading2, Heading3 } from 'lucide-react';
import { useEffect } from 'react';

interface Props {
  html: string;
  onChange: (html: string, text: string) => void;
}

export default function RichTextEditor({ html, onChange }: Props) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        // Keep the toolbar to bold/italic/lists/headings only, per the
        // "no HTML source view, nothing technical" requirement.
        codeBlock: false,
        code: false,
        blockquote: false,
        horizontalRule: false,
        strike: false,
        heading: { levels: [2, 3] },
      }),
    ],
    content: html,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML(), editor.getText());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none min-h-[160px] px-3 py-2.5 focus:outline-none',
      },
    },
  });

  useEffect(() => {
    if (editor && html !== editor.getHTML()) {
      editor.commands.setContent(html, { emitUpdate: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  if (!editor) return null;

  const buttons = [
    { icon: Bold, action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive('bold') },
    { icon: Italic, action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive('italic') },
    {
      icon: Heading2,
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      active: editor.isActive('heading', { level: 2 }),
    },
    {
      icon: Heading3,
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      active: editor.isActive('heading', { level: 3 }),
    },
    {
      icon: List,
      action: () => editor.chain().focus().toggleBulletList().run(),
      active: editor.isActive('bulletList'),
    },
    {
      icon: ListOrdered,
      action: () => editor.chain().focus().toggleOrderedList().run(),
      active: editor.isActive('orderedList'),
    },
  ];

  return (
    <div className="rounded-xl border border-charcoal-border overflow-hidden">
      <div className="flex items-center gap-1 px-2 py-1.5 border-b border-charcoal-border bg-cream-100">
        {buttons.map((b, i) => (
          <button
            key={i}
            type="button"
            onClick={b.action}
            className={`w-9 h-9 rounded-lg flex items-center justify-center ${
              b.active ? 'bg-brand text-white' : 'text-charcoal-light hover:bg-white'
            }`}
          >
            <b.icon className="w-4 h-4" />
          </button>
        ))}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
