import Button from '@/components/ui/Button';
import { MoreVertical, User, UserMinus } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';

export const FriendCardMenu = (): React.ReactNode => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 메뉴 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleProfileView = () => {
    if (import.meta.env.DEV) {
      console.log('🔧 [DEV] 프로필 보기 클릭');
    }
    setIsMenuOpen(false);
  };

  const handleDeleteFriend = () => {
    if (import.meta.env.DEV) {
      console.log('🔧 [DEV] 친구 삭제 클릭');
    }
    setIsMenuOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <Button
        variant="ghost"
        size="sm"
        className="h-auto p-1"
        onClick={handleMenuToggle}
      >
        <MoreVertical className="w-4 h-4 text-gray-600" />
      </Button>

      {/* 드롭다운 메뉴 */}
      {isMenuOpen && (
        <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          <div className="py-1">
            {/* 프로필 보기 */}
            <button
              onClick={handleProfileView}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              프로필 보기
            </button>

            {/* 친구 삭제 */}
            <button
              onClick={handleDeleteFriend}
              className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
            >
              <UserMinus className="w-4 h-4" />
              친구 삭제
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
