import { OutputData } from '@editorjs/editorjs';
import React, { useState } from 'react';
import crossIcon from '../../../assets/icons/clearIcon.svg';
import '../styles/inputPost.scss';
import RichTextEditor from './RichTextEditor';

interface InputPostProps {
  title: string;
  inputType: string;
  placeholder: string;
  className: string;
}

const InputPost: React.FC<InputPostProps> = ({ title, inputType, placeholder, className }) => {
  const [data, setData] = useState<OutputData | undefined>();
  const onChange = (data: OutputData) => {
    setData(data);
  };
  return (
    <div className="input__container">
      <div>
        <p>{title}</p>
        <img src={crossIcon} alt="crossIcon" />
      </div>
      {inputType === 'textarea' ? (
        <RichTextEditor data={data} onChange={onChange} editorblock={'editorjs-container'} />
      ) : (
        <input type={inputType} placeholder={placeholder} className={className} />
      )}
    </div>
  );
};

export default InputPost;
