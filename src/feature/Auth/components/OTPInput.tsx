import React, {useState,useRef,ChangeEvent,KeyboardEvent,ClipboardEvent,} from "react";
import "../styles/otp.scss"

interface OTPInputProps {
  length?: number;
  onComplete: (otp: string) => void;
}

const OTPInput: React.FC<OTPInputProps> = ({ length = 6, onComplete }) => {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (/^[0-9]$/.test(value)) {
      // Only allow digits
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to next input if there's a next and the current input is valid
      if (index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }

      // Trigger onComplete if all fields are filled
      if (newOtp.every((val) => val !== "")) {
        onComplete(newOtp.join(""));
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);

      // Focus previous input if available
      if (index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text");
    if (/^[0-9]+$/.test(paste)) {
      // Ensure pasted data is numeric
      const pastedOtp = paste.slice(0, length).split("");
      const newOtp = [...otp];
      pastedOtp.forEach((digit, i) => {
        newOtp[i] = digit;
        if (i < length - 1) {
          inputRefs.current[i + 1]?.focus();
        }
      });
      setOtp(newOtp);
      if (newOtp.every((val) => val !== "")) {
        onComplete(newOtp.join(""));
      }
    }
  };

  return (
    <div className="otp__wrapper">
      {otp.map((_, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          type="text"
          maxLength={1}
          value={otp[index]}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          className="otp__input"
        />
      ))}
    </div>
  );
};

export default OTPInput;
