import React, { useEffect, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Minus,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Unlink,
  Image as ImageIcon,
  Undo,
  Redo,
  Eraser,
} from "lucide-react";

const BlogEditor = ({ value = "", onChange, placeholder = "Write your blog post content here..." }) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3, 4],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
        HTMLAttributes: {
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
        alignments: ["left", "center", "right"],
      }),
      Placeholder.configure({
        placeholder,
      }),
    ],
    content: value || "<p></p>",
    onUpdate: ({ editor }) => {
      if (onChange) {
        onChange(editor.getHTML());
      }
    },
    editorProps: {
      attributes: {
        class: "prose-medical focus:outline-none min-h-[220px] max-h-[450px] overflow-y-auto px-4 py-3.5 text-slate-800 text-sm leading-relaxed",
      },
    },
  });

  // Keep editor content in sync when value changes externally (e.g., when opening edit modal or resetting)
  useEffect(() => {
    if (editor) {
      const currentHtml = editor.getHTML();
      const nextValue = value || "<p></p>";
      if (nextValue !== currentHtml && (value !== "" || currentHtml !== "<p></p>")) {
        editor.commands.setContent(nextValue, false);
      }
    }
  }, [editor, value]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL", previousUrl || "https://");

    // cancelled
    if (url === null) return;

    // empty
    if (url.trim() === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    // update link
    editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
  }, [editor]);

  const addImage = useCallback(() => {
    if (!editor) return;
    const url = window.prompt("Enter image URL (https://...):");
    if (url && url.trim() !== "") {
      editor.chain().focus().setImage({ src: url.trim() }).run();
    }
  }, [editor]);

  if (!editor) {
    return null;
  }

  const ToolbarButton = ({ onClick, active = false, disabled = false, title, children }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`p-1.5 rounded-lg text-xs transition-colors flex items-center justify-center cursor-pointer ${
        active
          ? "bg-blue-600 text-white shadow-xs font-semibold"
          : "text-slate-600 hover:bg-slate-200/80 hover:text-slate-900"
      } ${disabled ? "opacity-30 cursor-not-allowed hover:bg-transparent" : ""}`}
    >
      {children}
    </button>
  );

  return (
    <div className="w-full border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/15 transition-all">
      {/* ── TipTap Toolbar ── */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-50 border-b border-slate-200 text-slate-700 select-none">
        {/* Undo / Redo */}
        <div className="flex items-center gap-0.5 pr-1.5 border-r border-slate-200">
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
            title="Undo (Ctrl+Z)"
          >
            <Undo size={15} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
            title="Redo (Ctrl+Y)"
          >
            <Redo size={15} />
          </ToolbarButton>
        </div>

        {/* Headings */}
        <div className="flex items-center gap-0.5 px-1.5 border-r border-slate-200">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            active={editor.isActive("heading", { level: 2 })}
            title="Section Heading (H2)"
          >
            <Heading2 size={15} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            active={editor.isActive("heading", { level: 3 })}
            title="Subsection Heading (H3)"
          >
            <Heading3 size={15} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
            active={editor.isActive("heading", { level: 4 })}
            title="Small Subheading (H4)"
          >
            <span className="font-bold text-xs px-0.5">H4</span>
          </ToolbarButton>
        </div>

        {/* Basic Text Formatting */}
        <div className="flex items-center gap-0.5 px-1.5 border-r border-slate-200">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            active={editor.isActive("bold")}
            title="Bold (Ctrl+B)"
          >
            <Bold size={15} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            active={editor.isActive("italic")}
            title="Italic (Ctrl+I)"
          >
            <Italic size={15} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            active={editor.isActive("underline")}
            title="Underline (Ctrl+U)"
          >
            <UnderlineIcon size={15} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            active={editor.isActive("strike")}
            title="Strikethrough"
          >
            <Strikethrough size={15} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            active={editor.isActive("code")}
            title="Inline Code"
          >
            <Code size={15} />
          </ToolbarButton>
        </div>

        {/* Lists & Quotes */}
        <div className="flex items-center gap-0.5 px-1.5 border-r border-slate-200">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            active={editor.isActive("bulletList")}
            title="Bullet List"
          >
            <List size={15} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            active={editor.isActive("orderedList")}
            title="Numbered List"
          >
            <ListOrdered size={15} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            active={editor.isActive("blockquote")}
            title="Blockquote (Quote / Highlight)"
          >
            <Quote size={15} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            title="Horizontal Divider"
          >
            <Minus size={15} />
          </ToolbarButton>
        </div>

        {/* Alignment */}
        <div className="flex items-center gap-0.5 px-1.5 border-r border-slate-200">
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            active={editor.isActive({ textAlign: "left" })}
            title="Align Left"
          >
            <AlignLeft size={15} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            active={editor.isActive({ textAlign: "center" })}
            title="Align Center"
          >
            <AlignCenter size={15} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            active={editor.isActive({ textAlign: "right" })}
            title="Align Right"
          >
            <AlignRight size={15} />
          </ToolbarButton>
        </div>

        {/* Link & Image */}
        <div className="flex items-center gap-0.5 px-1.5 border-r border-slate-200">
          <ToolbarButton
            onClick={setLink}
            active={editor.isActive("link")}
            title="Insert / Edit Link"
          >
            <LinkIcon size={15} />
          </ToolbarButton>
          {editor.isActive("link") && (
            <ToolbarButton
              onClick={() => editor.chain().focus().unsetLink().run()}
              title="Remove Link"
            >
              <Unlink size={15} />
            </ToolbarButton>
          )}
          <ToolbarButton onClick={addImage} title="Insert Image via URL">
            <ImageIcon size={15} />
          </ToolbarButton>
        </div>

        {/* Clear formatting */}
        <div className="flex items-center gap-0.5 pl-1.5">
          <ToolbarButton
            onClick={() => editor.chain().focus().clearNodes().unsetAllMarks().run()}
            title="Clear Formatting"
          >
            <Eraser size={15} />
          </ToolbarButton>
        </div>
      </div>

      {/* ── TipTap Content Editor ── */}
      <EditorContent editor={editor} className="tiptap bg-slate-50/30" />
    </div>
  );
};

export default BlogEditor;
