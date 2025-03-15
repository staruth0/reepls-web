import 'katex/dist/katex.min.css';
import { useCallback } from 'react';
import RichTextEditor, {
  Attachment,
  BaseKit,
  Blockquote,
  Bold,
  BulletList,
  Clear,
  Code,
  CodeBlock,
  Color,
  ColumnActionButton,
  Editor,
  Emoji,
  Excalidraw,
  ExportPdf,
  ExportWord,
  FontFamily,
  FontSize,
  FormatPainter,
  Heading,
  Highlight,
  History,
  HorizontalRule,
  Iframe,
  Image,
  ImageGif,
  ImportWord,
  Indent,
  Italic,
  Katex,
  LineHeight,
  Link, // Import the Editor type
  locale,
  Mention,
  Mermaid,
  MoreMark,
  OrderedList,
  SearchAndReplace,
  SlashCommand,
  Strike,
  Table,
  TableOfContents,
  TaskList,
  TextAlign,
  TextDirection,
  Twitter,
  Underline,
  Video,
} from 'reactjs-tiptap-editor';
import 'reactjs-tiptap-editor/style.css';
import useTheme from '../../../hooks/useTheme';
import '../../../styles/shadcn.scss';
import { convertBase64ToBlob, debounce } from '../../../utils';
import '../styles/editor.scss';

// Type for editor content (assuming HTML string output)
type EditorContent = string;

function TipTapRichTextEditor({
  initialContent = '',
  handleContentChange,
  handleHtmlContentChange,
  editorRef,
  disabled = false,
  hideToolbar = false,
  hideBubble = false,
  className = '',
}: {
  initialContent: EditorContent;
  handleContentChange: (content: EditorContent) => void;
  handleHtmlContentChange: (content: EditorContent) => void;
  editorRef: React.RefObject<{ editor: Editor | null }>; // Update to match the correct type
  disabled?: boolean;
  hideToolbar?: boolean;
  hideBubble?: boolean;
  className?: string;
}) {
  const extensions = [
    BaseKit.configure({
      placeholder: {
        showOnlyCurrent: true,
      },
      characterCount: false,
    }),
    History,
    SearchAndReplace,
    TableOfContents,
    FormatPainter.configure({ spacer: true }),
    Clear,
    FontFamily,
    Heading.configure({ spacer: true }),
    FontSize,
    Bold,
    Italic,
    Underline,
    Strike,
    MoreMark,
    Katex,
    Emoji,
    Color.configure({ spacer: true }),
    Highlight,
    BulletList,
    OrderedList,
    TextAlign.configure({ types: ['heading', 'paragraph'], spacer: true }),
    Indent,
    LineHeight,
    TaskList.configure({
      spacer: true,
      taskItem: {
        nested: true,
      },
    }),
    Link,
    Image.configure({
      upload: (file: File): Promise<string> => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(URL.createObjectURL(file));
            alert('image uploaded');
          }, 500);
        });
      },
    }),
    Video.configure({
      upload: (file: File): Promise<string> => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(URL.createObjectURL(file));
            alert('video uploaded');
          }, 500);
        });
      },
    }),
    ImageGif.configure({
      GIPHY_API_KEY: import.meta.env.VITE_GIPHY_API_KEY as string,
    }),
    Blockquote,
    SlashCommand,
    HorizontalRule,
    Code.configure({
      toolbar: false,
    }),
    CodeBlock.configure({ defaultTheme: 'dracula' }),
    ColumnActionButton,
    Table,
    Iframe,
    ExportPdf.configure({ spacer: true }),
    ImportWord.configure({
      upload: (files: File[]): Promise<{ src: string; alt: string }[]> => {
        const f = files.map((file) => ({
          src: URL.createObjectURL(file),
          alt: file.name,
        }));
        return Promise.resolve(f);
      },
    }),
    ExportWord,
    Excalidraw,
    TextDirection,
    Mention,
    Attachment.configure({
      upload: (file: File): Promise<string> => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        return new Promise((resolve) => {
          setTimeout(() => {
            const blob = convertBase64ToBlob(reader.result as string);
            resolve(URL.createObjectURL(blob));
          }, 300);
        });
      },
    }),
    Mermaid.configure({
      upload: (file: File): Promise<string> => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        return new Promise((resolve) => {
          setTimeout(() => {
            const blob = convertBase64ToBlob(reader.result as string);
            resolve(URL.createObjectURL(blob));
          }, 300);
        });
      },
    }),
    Twitter,
  ];

  const { theme } = useTheme();

  const onValueChange = useCallback(
    // @ts-ignore
    debounce((value: EditorContent) => {
      // handleContentChange(value);
      handleContentChange(editorRef.current?.editor?.getText() ?? '');
      handleHtmlContentChange(editorRef.current?.editor?.getHTML() ?? '');
    }, 1000),
    []
  );

  locale.setLang('en');

  return (
    <div
      className={`${className}`}
      style={{
        maxWidth: 1024,
      }}>
      <RichTextEditor
        ref={editorRef}
        output="html"
        content={initialContent}
        onChangeContent={onValueChange}
        // onChangeContent={handleContentChange}
        extensions={extensions}
        dark={theme === 'dark'}
        hideToolbar={hideToolbar}
        hideBubble={hideBubble}
        disabled={disabled}
        resetCSS
      />
    </div>
  );
}

export default TipTapRichTextEditor;
