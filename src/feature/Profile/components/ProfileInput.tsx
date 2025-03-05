import React from "react";

interface ProfileInputProps {
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

const ProfileInput: React.FC<ProfileInputProps> = ({
  label,
  value,
  onChange,
  placeholder,
}) => {
  return (
    <div className="bg-neutral-700 rounded-[5px] px-2 py-1 flex flex-col gap-1 mt-3">
      <label className="text-neutral-400 text-[15px]">{label}</label>
      <input
        type="text"
        className="w-full border-none bg-transparent text-neutral-100 text-[16px] outline-none "
        value={value}
        onChange={onChange}
        placeholder={placeholder}
       
      />
    </div>
  );
};

export default ProfileInput;
