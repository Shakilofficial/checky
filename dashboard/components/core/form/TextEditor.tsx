/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Color from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import { Table } from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import TaskItem from "@tiptap/extension-task-item";
import TaskList from "@tiptap/extension-task-list";
import TextAlign from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import Typography from "@tiptap/extension-typography";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React, { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlignCenter,
  AlignJustify,
  AlignLeft,
  AlignRight,
  Bold,
  ChevronDown,
  Code,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  Image as ImageIcon,
  Italic,
  Link as LinkIcon,
  List,
  ListCheck,
  ListOrdered,
  Minus,
  Plus,
  Quote,
  Redo,
  Strikethrough,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
  Table2,
  Trash2,
  Type,
  Underline as UnderlineIcon,
  Undo,
} from "lucide-react";

import { cn } from "@/lib/utils";

interface TextEditorProps {
  value?: string;
  onChange?: (html: string) => void;
  editable?: boolean;
  placeholder?: string;
  className?: string;
  showToolbar?: boolean;
  inline?: boolean;
  imageUpload?: (file: File) => Promise<string>;
}

export default function TextEditor({
  value = "",
  onChange,
  editable = true,
  placeholder = "Start writing...",
  className,
  showToolbar = true,
  inline = false,
  imageUpload,
}: TextEditorProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const editor = useEditor(
    {
      immediatelyRender: false,
      extensions: [
        StarterKit.configure({
          heading: { levels: [1, 2, 3, 4, 5, 6] },
          bulletList: {
            keepAttributes: true,
            keepMarks: true,
          },
          orderedList: {
            keepAttributes: true,
            keepMarks: true,
          }
        }),
        Underline,
        Highlight,
        TextStyle,
        Color,
        Typography,
        Subscript,
        Superscript,
        TaskList,
        TaskItem.configure({
          nested: true,
        }),
        Link.configure({ openOnClick: true, autolink: true }),
        Image,
        TextAlign.configure({ types: ["heading", "paragraph"] }),
        Table.configure({ resizable: true }),
        TableRow,
        TableHeader,
        TableCell,
        Placeholder.configure({
          placeholder,
          showOnlyWhenEditable: true,
        }),
      ],
      editable,
      content: value || "",
      onUpdate: ({ editor }) => onChange?.(editor.getHTML()),
      editorProps: {
        attributes: {
          class: cn(
            "prose prose-sm sm:prose-base dark:prose-invert max-w-full focus:outline-none min-h-[200px] relative",
            "bg-transparent",
            "rounded-md",
            "overflow-auto",
          ),
        },
      },
    },
    [mounted],
  );

  useEffect(() => {
    if (!editor) return;
    if (editor.getHTML() !== value) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  if (!mounted || !editor) {
    return (
      <div className={cn("text-sm text-muted-foreground")}>
        Loading editor...
      </div>
    );
  }

  return (
    <div className={cn("space-y-2 border rounded-xl p-1 bg-background", className)}>
      {showToolbar && !inline && (
        <Toolbar editor={editor} imageUpload={imageUpload} />
      )}

      <div className="min-h-[200px] px-4 py-2">
        <EditorContent
          editor={editor}
          className={cn(
            "prose max-w-full dark:prose-invert focus:outline-none",
            inline && "p-0 prose-sm max-h-10 overflow-hidden",
          )}
        />
      </div>
    </div>
  );
}

/* ---------------------------------- */
/* Toolbar */
function Toolbar({
  editor,
  imageUpload,
}: {
  editor: Editor;
  imageUpload?: (file: File) => Promise<string>;
}) {
  if (!editor) return null;

  const isActive = (name: string, attrs?: Record<string, unknown>) =>
    editor.isActive(name, attrs as never);

  const headingOptions = [
    { label: "Heading 1", level: 1, icon: <Heading1 className="w-4 h-4" /> },
    { label: "Heading 2", level: 2, icon: <Heading2 className="w-4 h-4" /> },
    { label: "Heading 3", level: 3, icon: <Heading3 className="w-4 h-4" /> },
    { label: "Heading 4", level: 4, icon: <Heading4 className="w-4 h-4" /> },
    { label: "Heading 5", level: 5, icon: <Heading5 className="w-4 h-4" /> },
    { label: "Heading 6", level: 6, icon: <Heading6 className="w-4 h-4" /> },
  ];

  return (
    <div className="flex flex-wrap gap-1 border-b pb-1 px-1 sticky top-0 bg-background z-10 transition-all">
      {/* Undo/Redo */}
      <div className="flex gap-0.5 mr-2">
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          active={false}
          disabled={!editor.can().undo()}
        >
          <Undo />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          active={false}
          disabled={!editor.can().redo()}
        >
          <Redo />
        </ToolbarButton>
      </div>

      <div className="h-6 w-px bg-border my-auto mx-1" />

      {/* Headings */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 gap-1 px-2">
            <Type className="w-4 h-4" />
            <span className="text-xs">
              {headingOptions.find(h => isActive("heading", { level: h.level }))?.label || "Normal Text"}
            </span>
            <ChevronDown className="w-3 h-3 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => editor.chain().focus().setParagraph().run()}>
            Normal Text
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          {headingOptions.map((h) => (
            <DropdownMenuItem
              key={h.level}
              onClick={() => editor.chain().focus().toggleHeading({ level: h.level as any }).run()}
              className={cn(isActive("heading", { level: h.level }) && "bg-accent")}
            >
              {h.icon}
              <span className="ml-2">{h.label}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="h-6 w-px bg-border my-auto mx-1" />

      {/* Basic Marks */}
      <div className="flex gap-0.5">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={isActive("bold")}
        >
          <Bold />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={isActive("italic")}
        >
          <Italic />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={isActive("underline")}
        >
          <UnderlineIcon />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={isActive("strike")}
        >
          <Strikethrough />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          active={isActive("code")}
        >
          <Code />
        </ToolbarButton>
      </div>

      <div className="h-6 w-px bg-border my-auto mx-1" />

      {/* Alignment */}
      <div className="flex gap-0.5">
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          active={isActive("textAlign", { align: "left" })}
        >
          <AlignLeft />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          active={isActive("textAlign", { align: "center" })}
        >
          <AlignCenter />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          active={isActive("textAlign", { align: "right" })}
        >
          <AlignRight />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          active={isActive("textAlign", { align: "justify" })}
        >
          <AlignJustify />
        </ToolbarButton>
      </div>

      <div className="h-6 w-px bg-border my-auto mx-1" />

      {/* Lists */}
      <div className="flex gap-0.5">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={isActive("bulletList")}
        >
          <List />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={isActive("orderedList")}
        >
          <ListOrdered />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleTaskList().run()}
          active={isActive("taskList")}
        >
          <ListCheck />
        </ToolbarButton>
      </div>

      <div className="h-6 w-px bg-border my-auto mx-1" />

      {/* Insertions */}
      <div className="flex gap-0.5">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={isActive("blockquote")}
        >
          <Quote />
        </ToolbarButton>

        {/* Link */}
        <ToolbarButton
          onClick={() => {
            const url = window.prompt("Enter link URL");
            if (url) editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
          }}
          active={isActive("link")}
        >
          <LinkIcon />
        </ToolbarButton>

        {/* Image */}
        <ToolbarButton
          onClick={async () => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";
            input.onchange = async () => {
              const file = input.files?.[0];
              if (!file) return;
              const url = imageUpload ? await imageUpload(file) : URL.createObjectURL(file);
              editor.chain().focus().setImage({ src: url }).run();
            };
            input.click();
          }}
          active={false}
        >
          <ImageIcon />
        </ToolbarButton>

        {/* Table Management */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className={cn("h-8 w-8 p-0", isActive("table") && "bg-accent")}>
              <Table2 className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>
              <Plus className="mr-2 h-4 w-4" /> Insert Table
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => editor.chain().focus().addColumnBefore().run()} disabled={!isActive("table")}>
              <Plus className="mr-2 h-4 w-4" /> Add Column Before
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().addColumnAfter().run()} disabled={!isActive("table")}>
              <Plus className="mr-2 h-4 w-4" /> Add Column After
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().deleteColumn().run()} disabled={!isActive("table")}>
              <Minus className="mr-2 h-4 w-4" /> Delete Column
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => editor.chain().focus().addRowBefore().run()} disabled={!isActive("table")}>
              <Plus className="mr-2 h-4 w-4" /> Add Row Before
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().addRowAfter().run()} disabled={!isActive("table")}>
              <Plus className="mr-2 h-4 w-4" /> Add Row After
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => editor.chain().focus().deleteRow().run()} disabled={!isActive("table")}>
              <Minus className="mr-2 h-4 w-4" /> Delete Row
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => editor.chain().focus().deleteTable().run()}
              disabled={!isActive("table")}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" /> Delete Table
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="h-6 w-px bg-border my-auto mx-1" />

      {/* Scripts */}
      <div className="flex gap-0.5">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleSubscript().run()}
          active={isActive("subscript")}
        >
          <SubscriptIcon className="w-4 h-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleSuperscript().run()}
          active={isActive("superscript")}
        >
          <SuperscriptIcon className="w-4 h-4" />
        </ToolbarButton>
      </div>

      <div className="flex-1" />

      {/* Clear Formatting */}
      <ToolbarButton onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()} active={false}>
        <Type />
      </ToolbarButton>
    </div>
  );
}

function ToolbarButton({
  children,
  onClick,
  active = false,
  disabled = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <Button
      type="button"
      size="sm"
      variant="ghost"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      className={cn(
        "h-8 w-8 p-0",
        active && "bg-accent text-accent-foreground",
      )}
    >
      {React.isValidElement(children)
        ? React.cloneElement(children as React.ReactElement<any>, {
            className: cn(
              "w-4 h-4",
              (children as React.ReactElement<any>).props.className,
            ),
          })
        : children}
    </Button>
  );
}
