import React from "react";
import crossIcon from "../../../assets/icons/clearIcon.svg";
import "../styles/inputPost.scss";
import Editor from "./EditorJS";

interface InputPostProps {
  title: string;
  inputType: string;
  placeholder: string;
  className:string
}

const InputPost: React.FC<InputPostProps> = ({
  title,
  inputType,
  placeholder,
  className,
}) => {
  return (
    <div className="input__container">
      <div>
        <p>{title}</p>
        <img src={crossIcon} alt="crossIcon" />
      </div>
    { inputType === 'textarea'?<Editor/>:  <input type={inputType} placeholder={placeholder} className={className} /> }
    </div>
  );
};

export default InputPost;
