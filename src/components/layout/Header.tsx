import React from 'react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  height?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  overlay?: boolean;
}

/**
 * 헤더 컴포넌트
 */
const Header = ({
  height = 'lg',
  className = '',
  overlay = false,
}: HeaderProps) => {
  const navigate = useNavigate();

  const heightClasses = {
    sm: 'h-header-sm',
    md: 'h-header-md',
    lg: 'h-header-lg',
    xl: 'h-header-xl',
  };

  return (
    <header
      className={`${
        overlay
          ? 'absolute top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-sm border-b border-gray-200/50'
          : 'bg-white shadow-sm border-b border-gray-200'
      } ${heightClasses[height]} ${className}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-full">
          {/* 왼쪽 버튼들 */}
          <div className="flex gap-2">
            <button
              aria-label="메뉴 열기"
              className="p-2 rounded-full bg-white/80 shadow-lg hover:bg-white transition-all"
            >
              <span className="material-icons text-gray-700">menu</span>
            </button>
            <button
              aria-label="검색"
              className="p-2 rounded-full bg-white/80 shadow-lg hover:bg-white transition-all"
            >
              <span className="material-icons text-gray-700">search</span>
            </button>
            <button
              aria-label="위치 설정"
              className="p-2 rounded-full bg-white/80 shadow-lg hover:bg-white transition-all"
            >
              <span className="material-icons text-gray-700">location_on</span>
            </button>
          </div>

          {/* 중앙 제목 */}
          <div className="flex-1 text-center">
            <h1 className="text-lg font-semibold text-gray-800">Walkit</h1>
          </div>

          {/* 오른쪽 버튼들 */}
          <div className="flex gap-2">
            <button
              aria-label="프로필 페이지로 이동"
              onClick={() => navigate('/profile')}
              className="p-2 rounded-full bg-white/80 shadow-lg hover:bg-white transition-all"
            >
              <span className="material-icons text-gray-700">person</span>
            </button>
            <button
              aria-label="친구 목록으로 이동"
              onClick={() => navigate('/friends')}
              className="p-2 rounded-full bg-white/80 shadow-lg hover:bg-white transition-all"
            >
              <span className="material-icons text-gray-700">group</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
