import React, { useEffect, useState, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";

const Editor: React.FC = () => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [editor, setEditor] = useState<EditorJS | null>(null);

  useEffect(() => {
    if (!editorRef.current) return;
    console.log(editor)

    const editorInstance = new EditorJS({
      holder: editorRef.current, // Attach to the ref instead of ID
      tools: {
        header: Header,
        list: List,
      },
      placeholder: "Start writing your content here...",
    });

    editorInstance.isReady
      .then(() => {
        setEditor(editorInstance);
      })
      .catch((error) => {
        console.error("Error initializing EditorJS:", error);
      });

    return () => {
      editorInstance.isReady
        .then(() => {
          editorInstance.destroy();
        })
        .catch((error) => {
          console.error("Error during cleanup:", error);
        });
    };
  }, []);

  return (
    <>
      <div
        ref={editorRef}           
              id="editorjs"
          ></div>
          
    </>
  );
};

export default Editor;
