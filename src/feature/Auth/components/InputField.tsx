import React, { useState } from 'react';
import { FaRegEyeSlash } from 'react-icons/fa6';
import { LuChevronDown } from 'react-icons/lu';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import 'react-phone-input-2/lib/style.css';
import { cm } from '../../../assets/icons';
import '../styles/input.scss';

interface InputProps {
  label: string;
  placeholder: string;
  textValue: string;
  handleInputChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
          onChange={handleInputChange}
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
      <div className="phone__input">
        <div className="country__code">
          <div>
            <img src={cm} alt="Cameroon flag" className="flag__icon" />
            <p>+237</p>
          </div>

          <LuChevronDown className="size-4" />
        </div>
        <div className="input__wrapper">
          <input
            type="tel"
            placeholder={placeholder}
            value={textValue}
            onChange={handleInputChange}
            className={`phone-input-field  ${isInputError ? 'error' : ' '}`}
            onBlur={handleBlur}
          />
          <label>{label}</label>
          {isInputError && <div className="input__error">{inputErrorMessage}</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="input__field">
      <input
        type={isPasswordVisible ? 'password' : 'text'}
        placeholder={`e.g ${placeholder}`}
        value={textValue}
        onChange={handleInputChange}
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
