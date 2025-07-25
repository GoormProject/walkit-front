import React from 'react';

export interface GoogleLoginButtonProps {
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const GoogleLoginButton: React.FC<GoogleLoginButtonProps> = ({
  onClick,
  disabled = false,
  className = '',
  children = 'Sign in with Google'
}) => {
  return (
    <button
      className={`
        relative inline-flex items-center justify-center
        bg-[var(--google-button-bg)] border border-[var(--google-button-border)] rounded-[20px]
        text-[var(--google-button-text)] cursor-pointer
        font-['Roboto',arial,sans-serif] text-sm
        h-10 px-3 outline-none overflow-hidden
        transition-all duration-[218ms] ease-in-out
        hover:shadow-[var(--google-button-shadow)]
        focus:shadow-[var(--google-button-shadow)]
        disabled:cursor-default disabled:bg-[var(--google-button-disabled-bg)] disabled:border-[var(--google-button-disabled-border)]
        disabled:opacity-38
        ${className}
      `}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      {/* State overlay for hover/focus effects */}
      <div className="absolute inset-0 bg-[var(--google-button-hover-overlay)] opacity-0 transition-opacity duration-[218ms] ease-in-out hover:opacity-8 focus:opacity-12" />
      
      {/* Content wrapper */}
      <div className="relative flex items-center justify-between w-full h-full">
        {/* Google icon */}
        <div className="w-5 h-5 mr-3 min-w-5">
          <svg 
            version="1.1" 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 48 48" 
            xmlnsXlink="http://www.w3.org/1999/xlink" 
            className="block w-full h-full"
          >
            <path fill="var(--google-red)" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
            <path fill="var(--google-blue)" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
            <path fill="var(--google-yellow)" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
            <path fill="var(--google-green)" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
            <path fill="none" d="M0 0h48v48H0z" />
          </svg>
        </div>
        
        {/* Button text */}
        <span className="flex-grow font-['Roboto',arial,sans-serif] font-medium text-center overflow-hidden text-ellipsis whitespace-nowrap">
          {children}
        </span>
      </div>
    </button>
  );
};

export default GoogleLoginButton; 