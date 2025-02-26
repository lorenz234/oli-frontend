import React, { ReactNode } from 'react';
import { CheckCircle } from 'lucide-react';

interface InputWithCheckProps {
  value: boolean | string | undefined;
  isValid?: boolean;
  children: ReactNode;
  error?: string;
}

const InputWithCheck: React.FC<InputWithCheckProps> = ({ 
  value, 
  isValid = true, 
  children, 
  error 
}) => {
  const showCheck = value && isValid;
  
  return (
    <div className="relative">
      {children}
      {showCheck && (
        <CheckCircle 
          className="absolute right-[-30px] top-1/2 -translate-y-1/2 text-green-500 w-5 h-5"  
        />
      )}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default InputWithCheck;