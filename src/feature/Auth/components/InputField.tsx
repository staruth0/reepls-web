import React, { useState } from 'react';
import { FaRegEyeSlash } from 'react-icons/fa6';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import 'react-phone-input-2/lib/style.css';
import PhoneInput, { CountryData } from 'react-phone-input-2';
import '../styles/input.scss';

interface InputProps {
  label: string;
  placeholder: string;
  textValue: string;
  handleInputChange?: 
    | ((e: React.ChangeEvent<HTMLInputElement>) => void)
    | ((value: string, data: CountryData , event: React.ChangeEvent<HTMLInputElement>, formattedValue: string) => void);
  handleBlur?: () => void;
  type: string;
  isInputError?: boolean;
  inputErrorMessage?: string;
}

const InputField: React.FC<InputProps> = ({
  label,
  placeholder,
  textValue,
  handleInputChange,
  type,
  isInputError,
  inputErrorMessage,
  handleBlur,
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(type === 'password');

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  if (type === 'text' || type === 'email') {
    return (
      <div className="input__field">
        <input
          type={type}
          placeholder={`e.g ${placeholder}`}
          value={textValue}
          onChange={handleInputChange as (e: React.ChangeEvent<HTMLInputElement>) => void}
          className={isInputError ? 'error' : ''}
          onBlur={handleBlur}
          required
        />
        <label>{label}</label>
        {isInputError && <div className="input__error">{inputErrorMessage}</div>}
      </div>
    );
  }

  if (type === 'phone') {
    return (
      <div className="phone__input flex flex-col">
        <PhoneInput
          country={'cm'}
          value={textValue}
          onChange={(value, country, event, formattedValue) => {
            if (handleInputChange) {
              (handleInputChange as (
                value: string,
                data: CountryData | {},
                event: React.ChangeEvent<HTMLInputElement>,
                formattedValue: string
              ) => void)(value, country, event, formattedValue);
            }
          }}
          inputProps={{
            onBlur: handleBlur,
            required: true,
          }}
          inputClass={isInputError ? 'error' : ''}
        />
        {isInputError && <div className="text-red-600 text-[13px]">{inputErrorMessage}</div>}
      </div>
    );
  }

  return (
    <div className="input__field">
      <input
        type={isPasswordVisible ? 'password' : 'text'}
        placeholder={`e.g ${placeholder}`}
        value={textValue}
        onChange={handleInputChange as (e: React.ChangeEvent<HTMLInputElement>) => void}
        className={isInputError ? 'error' : ''}
        onBlur={handleBlur}
        required
      />
      <label className={isInputError ? 'error' : ''}>{label}</label>
      {isInputError && <div className="input__error">{inputErrorMessage}</div>}
      {isPasswordVisible ? (
        <FaRegEyeSlash className={`input__icon ${isInputError ? 'error' : ' '}`} onClick={togglePasswordVisibility} />
      ) : (
        <MdOutlineRemoveRedEye
          className={`input__icon ${isInputError ? 'error' : ' '}`}
          onClick={togglePasswordVisibility}
        />
      )}
    </div>
  );
};

export default InputField;