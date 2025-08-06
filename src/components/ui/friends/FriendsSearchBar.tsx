import React from 'react';
import { Search } from 'lucide-react';

interface FriendsSearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export const FriendsSearchBar = ({
  placeholder = '친구 검색...',
  value = '',
  onChange,
}: FriendsSearchBarProps): React.ReactNode => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <div className="w-full px-3 py-[2.5dvh]">
      <div className="relative w-full h-[1dvh] bg-[#f2f2f2] rounded-[20px] flex items-center px-2">
        <Search className="w-[18px] h-[18px] text-[#8c8c8c] mr-3" />
        <input
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className="border-0 bg-transparent [font-family:'Roboto-SemiBold',Helvetica] font-semibold text-[#8c8c8c] text-[15px] p-0 h-auto focus-visible:ring-0 placeholder:text-[#8c8c8c] flex-1"
        />
      </div>
    </div>
  );
};
