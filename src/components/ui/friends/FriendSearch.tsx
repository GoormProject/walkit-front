import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface Friend {
  id: number;
  name: string;
  nickname: string;
  isOnline: boolean;
  profileImage?: string;
}

interface FriendSearchProps {
  friends: Friend[];
  onSearchResultsChange?: (filteredFriends: Friend[]) => void;
}

export const FriendSearch: React.FC<FriendSearchProps> = ({
  friends,
  onSearchResultsChange,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    // 검색어에 따른 필터링
    const filteredFriends = friends.filter(
      friend =>
        friend.name.toLowerCase().includes(value.toLowerCase()) ||
        friend.nickname.toLowerCase().includes(value.toLowerCase())
    );

    // 부모 컴포넌트에 검색 결과 전달
    onSearchResultsChange?.(filteredFriends);
  };

  return (
    <div className="w-full px-3 py-[1.7dvh]">
      <div className="relative w-full h-[1dvh] bg-[#f2f2f2] rounded-[20px] flex items-center px-2">
        <Search className="w-[18px] h-[18px] text-[#8c8c8c] mr-3" />
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="친구 검색..."
          className="border-0 bg-transparent [font-family:'Roboto-SemiBold',Helvetica] font-semibold text-[#8c8c8c] text-[15px] p-0 h-auto focus-visible:ring-0 placeholder:text-[#8c8c8c] flex-1"
        />
      </div>
    </div>
  );
};
