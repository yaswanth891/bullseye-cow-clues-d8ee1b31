
import { useState, useRef, useEffect, KeyboardEvent, ClipboardEvent } from 'react';

interface NumberInputProps {
  onComplete: (value: string) => void;
  isDisabled?: boolean;
  label?: string;
  autofocus?: boolean;
  type?: string; // Added type property to support password/text toggle
}

const NumberInput = ({ 
  onComplete, 
  isDisabled = false, 
  label, 
  autofocus = false,
  type = "text" // Default to "text" if not provided
}: NumberInputProps) => {
  const [digits, setDigits] = useState<string[]>(Array(4).fill(''));
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null)
  ];
  
  useEffect(() => {
    if (autofocus && inputRefs[0].current) {
      inputRefs[0].current.focus();
    }
  }, [autofocus]);

  useEffect(() => {
    // Check if all digits are filled
    const allDigitsFilled = digits.every(digit => digit !== '');
    if (allDigitsFilled) {
      onComplete(digits.join(''));
    }
  }, [digits, onComplete]);

  const handleChange = (index: number, value: string) => {
    // Only allow digits 1-9
    if (!/^[1-9]$/.test(value)) return;
    
    // Check for duplicate digits
    if (digits.includes(value)) return;
    
    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);
    
    // Move to next input if available
    if (index < 3 && inputRefs[index + 1].current) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (digits[index] === '') {
        // Move to previous input if current is empty
        if (index > 0 && inputRefs[index - 1].current) {
          inputRefs[index - 1].current?.focus();
        }
      } else {
        // Clear current input
        const newDigits = [...digits];
        newDigits[index] = '';
        setDigits(newDigits);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs[index - 1].current?.focus();
    } else if (e.key === 'ArrowRight' && index < 3) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();
    
    // Check if pasted data is valid
    if (!/^[1-9]{4}$/.test(pastedData)) return;
    
    // Check for duplicate digits
    if (new Set(pastedData).size !== 4) return;
    
    const pastedDigits = pastedData.split('');
    setDigits(pastedDigits);
    
    // Focus on last input
    inputRefs[3].current?.focus();
  };

  const resetDigits = () => {
    setDigits(Array(4).fill(''));
    if (inputRefs[0].current) {
      inputRefs[0].current.focus();
    }
  };

  return (
    <div className="flex flex-col items-center">
      {label && <label className="mb-2 text-sm font-medium">{label}</label>}
      <div className="flex gap-2">
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={inputRefs[index]}
            className="digit-input"
            type={type} // Use the type prop here
            inputMode="numeric"
            pattern="[1-9]"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            disabled={isDisabled}
            placeholder="-"
          />
        ))}
      </div>
      <button 
        type="button" 
        className="mt-2 text-xs text-cowbulls-brown hover:text-cowbulls-orange"
        onClick={resetDigits}
      >
        Reset
      </button>
    </div>
  );
};

export default NumberInput;
