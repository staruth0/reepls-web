import { useCallback } from 'react';
import { toast } from 'react-toastify';
import RichTextEditor, {
  BaseKit,
  Bold,
  CodeBlock,
  Editor,
  Heading,
  History,
  Image,
  Italic,
  locale,
  Video,
  Underline,
  Strike,
  Highlight,
  BulletList,
  OrderedList,
  TaskList,
  Link,
  Blockquote,
  HorizontalRule,
  Table,
} from 'reactjs-tiptap-editor';
import 'reactjs-tiptap-editor/style.css';
import useTheme from '../../../hooks/useTheme';
import { useUser } from '../../../hooks/useUser';
import { MediaType } from '../../../models/datamodels';
import '../../../styles/shadcn.scss';
import { debounce } from '../../../utils';
import { uploadArticleImage, uploadArticleVideo } from '../../../utils/media';
import '../styles/editor.scss';

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
      bubble: {
        // Ensure headings are available in the bubble menu
        exclude: [],
      },
    }),
    History,
    Heading.configure({ 
      spacer: true,
      levels: [1, 2, 3], // Only H1, H2, H3 as required
    }),
    Bold,
    Italic,
    Underline,
    Strike,
    Highlight,
    CodeBlock.configure({ 
      defaultTheme: 'dracula',
      spacer: true 
    }),
    BulletList,
    OrderedList,
    TaskList,
    Link.configure({
      openOnClick: false,
    }),
    Table.configure({
      HTMLAttributes: {
        class: 'my-4 border-collapse border border-neutral-600',
      },
    }),
    Blockquote,
    HorizontalRule,
    Image.configure({
      upload: async (file: File): Promise<string> => {
        if (!authUser?.id) {
          toast.error('You must be logged in to upload images');
          return Promise.reject(new Error('User ID is required'));
        }
        try {
          const url = await uploadArticleImage(authUser?.id, file);
          handleMediaUpload?.(url, MediaType.Image);
          return Promise.resolve(url);
        } catch (error) {
          toast.error('Failed to upload image');
          return Promise.reject(error);
        }
      },
    }),
    Video.configure({
      upload: async (file: File): Promise<string> => {
        if (!authUser?.id) {
          toast.error('You must be logged in to upload videos');
          return Promise.reject(new Error('User ID is required'));
        }
        try {
          const url = await uploadArticleVideo(authUser?.id, file);
          handleMediaUpload?.(url, MediaType.Video);
          return Promise.resolve(url);
        } catch (error) {
          toast.error('Failed to upload video');
          return Promise.reject(error);
        }
      },
    }),
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
        maxWidth: 800,
      }}>
      <style>{`
        .ProseMirror {
          font-family: Georgia, serif !important;
          font-size: 20px !important;
          line-height: 1.6 !important;
        }
        .ProseMirror p {
          font-family: Georgia, serif !important;
          font-size: 20px !important;
          line-height: 1.6 !important;
        }
        .ProseMirror h1 {
          font-family: Georgia, serif !important;
          font-size: 32px !important;
          font-weight: 700 !important;
          line-height: 1.2 !important;
        }
        .ProseMirror h2 {
          font-family: Georgia, serif !important;
          font-size: 28px !important;
          font-weight: 600 !important;
          line-height: 1.3 !important;
        }
        .ProseMirror h3 {
          font-family: Georgia, serif !important;
          font-size: 24px !important;
          font-weight: 600 !important;
          line-height: 1.4 !important;
        }
        .ProseMirror pre {
          background-color: #f6f8fa !important;
          border-radius: 6px !important;
          padding: 16px !important;
          margin: 16px 0 !important;
          overflow-x: auto !important;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace !important;
          font-size: 14px !important;
          line-height: 1.45 !important;
        }
        .ProseMirror code {
          background-color: #f6f8fa !important;
          padding: 2px 4px !important;
          border-radius: 3px !important;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace !important;
          font-size: 14px !important;
        }
      `}</style>
      <RichTextEditor
        ref={editorRef}
        output="html"
        content={initialContent}
        onChangeContent={onValueChange}
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
