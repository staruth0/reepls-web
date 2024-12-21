import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import React, { useEffect, useRef, useState } from 'react';

const Editor: React.FC = () => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [editor, setEditor] = useState<EditorJS | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!editorRef.current) return;
    console.log(editor);

    const editorInstance = new EditorJS({
      holder: editorRef.current, // Attach to the ref instead of ID
      tools: {
        header: Header,
        list: List,
      },
      placeholder: 'Start writing your content here...',
    });

    editorInstance.isReady
      .then(() => {
        setEditor(editorInstance);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error initializing EditorJS:', error);
        setIsLoading(false);
      });

    return () => {
      editorInstance.isReady
        .then(() => {
          editorInstance.destroy();
        })
        .catch((error) => {
          console.error('Error during cleanup:', error);
        });
    };
  }, []);

  return <>{isLoading ? <div>Loading editor...</div> : <div ref={editorRef} id="editorjs"></div>}</>;
};

export default Editor;
