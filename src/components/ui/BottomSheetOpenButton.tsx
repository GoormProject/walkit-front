import React from 'react';
import { ChevronUp } from 'lucide-react';

interface BottomSheetOpenButtonProps {
  onClick: () => void;
  children?: React.ReactNode;
  className?: string;
}

const BottomSheetOpenButton: React.FC<BottomSheetOpenButtonProps> = ({
  onClick,
  className = '',
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  const variantClasses =
    'bg-[#e0e0e0]/20 hover:bg-[#d0d0d0]/40 focus:ring-[#686868]';
  const sizeClasses = 'px-3 py-2 text-base';

  const buttonClasses = `${baseClasses} ${variantClasses} ${sizeClasses} fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40 ${className}`;

  return (
    <button type="button" className={buttonClasses} onClick={onClick}>
      <ChevronUp
        className="w-10 h-10 text-[#1F1F1F] opacity-100"
        strokeWidth={3.0}
      />
    </button>
  );
};

export default BottomSheetOpenButton;
