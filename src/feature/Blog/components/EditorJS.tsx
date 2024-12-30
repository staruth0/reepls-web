import EditorJS, { OutputData } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import React, { useEffect, useRef, useState } from 'react';

const Editor: React.FC = () => {
  const editorRef = useRef<EditorJS | null>(null);
  const [editorData, setEditorData] = useState<OutputData | null>(null);

  useEffect(() => {
    if (!editorRef.current) {
      editorRef.current = new EditorJS({
        holder: 'editorjs',
        tools: {
          header: Header,
          list: List,
        },
        placeholder: 'Start typing here......',
        onChange: async () => {
          const data = await editorRef.current?.save();
          setEditorData(data || null);
        },
      });
    }
    return () => {
      if (editorRef.current) {
        editorRef.current = null;
      }
    };
  }, []);

  return <div id="editorjs"></div>;
};

export default Editor;
