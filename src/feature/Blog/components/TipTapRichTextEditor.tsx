import 'katex/dist/katex.min.css';
import { useCallback } from 'react';
import { toast } from 'react-toastify';
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
import { useUser } from '../../../hooks/useUser';
import { MediaType } from '../../../models/datamodels';
import '../../../styles/shadcn.scss';
import { convertBase64ToBlob, debounce } from '../../../utils';
import { uploadArticleImage, uploadArticleVideo } from '../../../utils/media';
import '../styles/editor.scss';
import { t } from 'i18next';
// Type for editor content (assuming HTML string output)
type EditorContent = string;

function TipTapRichTextEditor({
  initialContent = '',
  handleContentChange,
  handleHtmlContentChange,
  handleMediaUpload,
  editorRef,
  disabled = false,
  hideToolbar = false,
  hideBubble = false,
  className = '',
}: {
  userId?: string;
  initialContent: EditorContent;
  handleContentChange?: (content: EditorContent) => void;
  handleHtmlContentChange?: (content: EditorContent) => void;
  handleMediaUpload?: (url: string, type: MediaType) => void;
  editorRef: React.RefObject<{ editor: Editor | null }>; // Update to match the correct type
  disabled?: boolean;
  hideToolbar?: boolean;
  hideBubble?: boolean;
  className?: string;
}) {
  const { authUser } = useUser();
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
      upload: async (file: File): Promise<string> => {
        if (!authUser?.id) {
          toast.error(t('You must be logged in to upload images'));
          return Promise.reject(new Error('User ID is required'));
        }
        try {
          const url = await uploadArticleImage(authUser?.id, file);
          handleMediaUpload?.(url, MediaType.Image);
          return Promise.resolve(url);
        } catch (error) {
          toast.error(t('Failed to upload image'));
          return Promise.reject(error);
        }
      },
    }),
    Video.configure({
      upload: async (file: File): Promise<string> => {
        if (!authUser?.id) {
          toast.error(t('You must be logged in to upload videos'));
          return Promise.reject(new Error('User ID is required'));
        }
        try {
          const url = await uploadArticleVideo(authUser?.id, file);
          handleMediaUpload?.(url, MediaType.Video);
          return Promise.resolve(url);
        } catch (error) {
          toast.error(t('Failed to upload video'));
          return Promise.reject(error);
        }
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
      upload: async (): Promise<{ src: string; alt: string }[]> => {
        toast.error(t('We do not support uploading documents yet!'));
        throw new Error('Not implemented');
        // if (!authUser?.id) {
        //   toast.error('You must be logged in to upload documents');
        //   return Promise.reject(new Error('User ID is required'));
        // }
        // const f = files.map((file) => ({
        //   src: URL.createObjectURL(file),
        //   alt: file.name,
        // }));
        // return Promise.resolve(f);
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
      handleContentChange?.(editorRef.current?.editor?.getText() ?? '');
      handleHtmlContentChange?.(editorRef.current?.editor?.getHTML() ?? '');
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
