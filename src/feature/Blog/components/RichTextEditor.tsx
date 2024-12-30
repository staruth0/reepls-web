import CheckList from '@editorjs/checklist';
import Delimiter from '@editorjs/delimiter';
import EditorJS, { type OutputData } from '@editorjs/editorjs';
import Header from '@editorjs/header';
import Link from '@editorjs/link';
import List from '@editorjs/list';
import Paragraph from '@editorjs/paragraph';

import { memo, useEffect, useRef } from 'react';

export const EDITOR_JS_TOOLS = {
  paragraph: {
    class: Paragraph,
    inlineToolbar: true,
  },
  checkList: CheckList,
  list: List,
  header: Header,
  delimiter: Delimiter,
  link: Link,
};

const Editor = ({
  data,
  onChange,
  editorblock,
}: {
  data: OutputData | undefined;
  onChange: (data: OutputData) => void;
  editorblock: string;
}) => {
  const ref = useRef<EditorJS | null>(null);
  //Initialize editorjs
  useEffect(() => {
    //Initialize editorjs if we don't have a reference
    if (!ref.current) {
      const editor = new EditorJS({
        holder: editorblock,

        tools: {
          paragraph: Paragraph,
          checkList: CheckList,
          list: List,
          header: Header,
          delimiter: Delimiter,
          link: Link,
        },
        data: data,
        async onChange(api, _event) {
          const savedData = await api.saver.save();
          onChange(savedData);
        },
      });
      ref.current = editor;
    }

    //Add a return function to handle cleanup
    return () => {
      if (ref.current && ref.current.destroy) {
        ref.current.destroy();
      }
    };
  }, []);
  return <div id={editorblock} style={{ marginBlock: '20px' }} />;
};

export default memo(Editor);
