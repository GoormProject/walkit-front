import React from 'react';

export interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url';
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  error?: boolean;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  label?: string;
  helperText?: string;
  required?: boolean;
  className?: string;
  id?: string;
}

const Input: React.FC<InputProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  onFocus,
  disabled = false,
  error = false,
  size = 'md',
  fullWidth = false,
  label,
  helperText,
  required = false,
  className = '',
  id,
}) => {
  const baseClasses = 'border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  const stateClasses = error 
    ? 'border-error focus:ring-error focus:border-error' 
    : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500';
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  const inputClasses = `${baseClasses} ${sizeClasses[size]} ${stateClasses} ${widthClass} ${className}`;
  
  const labelClasses = `block text-sm font-medium text-text-primary mb-1 ${required ? 'after:content-["*"] after:ml-1 after:text-error' : ''}`;
  
  const helperClasses = `text-sm mt-1 ${error ? 'text-error' : 'text-text-secondary'}`;
  
  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label htmlFor={id} className={labelClasses}>
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        disabled={disabled}
        required={required}
        className={inputClasses}
      />
      {helperText && (
        <p className={helperClasses}>
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Input; 
