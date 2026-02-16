import React from "react";
import { getCharacterCountDisplay, getCharacterCountColor } from "../../../utils/validation";

interface ProfileInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  maxLength?: number;
  showCharCount?: boolean;
  isTextarea?: boolean;
}

const ProfileInput: React.FC<ProfileInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
  maxLength,
  showCharCount = false,
  isTextarea = false,
}) => {
  const InputComponent = isTextarea ? 'textarea' : 'input';
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (maxLength && e.target.value.length > maxLength) {
      return; // Prevent typing beyond limit
    }
    onChange(e as React.ChangeEvent<HTMLInputElement>);
  };
  
  return (
    <div className="bg-neutral-700 rounded-[5px] px-2 py-1 flex flex-col gap-1 mt-3">
      <div className="flex justify-between items-center">
        <label className="text-neutral-400 text-[15px]">{label}</label>
        {showCharCount && maxLength && (
          <span className={`text-xs ${getCharacterCountColor(value, maxLength)}`}>
            {getCharacterCountDisplay(value, maxLength)}
          </span>
        )}
      </div>
      <InputComponent
        type={isTextarea ? undefined : "text"}
        className={`w-full border-none bg-transparent text-neutral-100 text-[16px] outline-none ${isTextarea ? 'resize-y min-h-[80px]' : ''}`}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        maxLength={maxLength}
        rows={isTextarea ? 4 : undefined}
      />
    </div>
  );
};

export default ProfileInput;
