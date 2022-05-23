import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useRef } from "react";
import {
  ArrowClockwise,
  ArrowCounterclockwise,
  CodeSlash,
  CodeSquare,
  FileBreak,
  ListOl,
  ListUl,
  Paragraph,
  Quote,
  Rulers,
  TypeBold,
  TypeH1,
  TypeH2,
  TypeH3,
  TypeItalic,
  TypeStrikethrough
} from "react-bootstrap-icons";

const MenuButton = ({ children, className, ...rest }) => {
  return (
    <button
      className={`${
        className || ""
      } mx-1 border p-1 h-fit rounded-lg hover:bg-gray-50 border-gray-100 transition-colors`}
      {...rest}
    >
      {children}
    </button>
  );
};

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex items-center flex-wrap mb-3">
      <MenuButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={editor.isActive("bold") ? "is-active" : ""}
      >
        <TypeBold />
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={editor.isActive("italic") ? "is-active" : ""}
      >
        <TypeItalic />
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().toggleStrike().run()}
        className={editor.isActive("strike") ? "is-active" : ""}
      >
        <TypeStrikethrough />
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().setParagraph().run()}
        className={editor.isActive("paragraph") ? "is-active" : ""}
      >
        <Paragraph />
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive("heading", { level: 1 }) ? "is-active" : ""}
      >
        <TypeH1 />
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive("heading", { level: 2 }) ? "is-active" : ""}
      >
        <TypeH2 />
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={editor.isActive("heading", { level: 3 }) ? "is-active" : ""}
      >
        <TypeH3 />
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive("bulletList") ? "is-active" : ""}
      >
        <ListUl />
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={editor.isActive("orderedList") ? "is-active" : ""}
      >
        <ListOl />
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={editor.isActive("code") ? "is-active" : ""}
      >
        <CodeSlash />
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        className={editor.isActive("codeBlock") ? "is-active" : ""}
      >
        <CodeSquare />
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={editor.isActive("blockquote") ? "is-active" : ""}
      >
        <Quote />
      </MenuButton>
      <MenuButton
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        <Rulers />
      </MenuButton>
      <MenuButton onClick={() => editor.chain().focus().setHardBreak().run()}>
        <FileBreak />
      </MenuButton>
      <MenuButton onClick={() => editor.chain().focus().undo().run()}>
        <ArrowCounterclockwise />
      </MenuButton>
      <MenuButton onClick={() => editor.chain().focus().redo().run()}>
        <ArrowClockwise />
      </MenuButton>
    </div>
  );
};

const TextEditor = ({ readOnly, content, setContent, setText }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => {
      if (setContent && !readOnly) setContent(editor.getHTML());
      if (setText && !readOnly) setText(editor.getText());
    }
  });

  // Disable if readOnly
  const textEditorRef = useRef(null);
  const div = textEditorRef.current?.editorContentRef.current.children;
  useEffect(() => {
    if (!div?.length) return;
    div[0].setAttribute("contenteditable", !readOnly);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readOnly, div?.length]);

  return (
    <div
      className={`${
        !readOnly ? "border border-gray-100 p-3" : ""
      } rounded text-editor`}
    >
      {!readOnly && <MenuBar editor={editor} />}
      <EditorContent
        readOnly={!!readOnly}
        editor={editor}
        contentEditable={!readOnly}
        ref={textEditorRef}
      />
    </div>
  );
};

export default TextEditor;
