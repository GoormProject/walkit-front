import Button from '@/components/ui/Button';
import { MoreVertical, User, UserMinus } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';
import { Api } from '@/api/swagger-api';

interface FriendCardMenuProps {
  friendId: number;
  onDataChange?: () => void;
}

export const FriendCardMenu = ({
  friendId,
  onDataChange,
}: FriendCardMenuProps): React.ReactNode => {
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

  const handleDeleteFriend = async () => {
    if (import.meta.env.DEV) {
      console.log('🔧 [DEV] 친구 삭제 클릭 - friendId:', friendId);
    }

    try {
      // API 인스턴스 생성 (withCredentials: true 설정)
      const api = new Api({
        baseURL: import.meta.env.VITE_API_BASE_URL,
        withCredentials: true,
      });

      if (import.meta.env.DEV) {
        console.log(
          '📤 [REQUEST] DELETE:/api/friends/{friendMemberId} 요청 시작'
        );
        console.log('📤 [REQUEST] friendMemberId:', friendId);
        console.log(
          '📤 [REQUEST] 요청 URL:',
          `${import.meta.env.VITE_API_BASE_URL}/api/friends/${friendId}`
        );
        console.log('📤 [REQUEST] 요청 메서드: DELETE');
        console.log('📤 [REQUEST] withCredentials: true');
      }

      // DELETE:/api/friends/{friendMemberId} API 호출
      const response = await api.api.deleteFriend(friendId);

      if (import.meta.env.DEV) {
        console.log('✅ [SUCCESS] 친구 삭제 성공!');
        console.log('📥 [RESPONSE] HTTP 상태 코드:', response.status);
        console.log('📥 [RESPONSE] 응답 데이터:', response.data);
        console.log('📥 [RESPONSE] 응답 헤더:', response.headers);
        console.log('✅ [BACKEND] 삭제된 friendId:', friendId);
      }

      // 성공 메시지 표시
      alert('친구가 삭제되었습니다.');

      // 부모 컴포넌트에 데이터 변경 알림
      if (onDataChange) {
        onDataChange();
      }
    } catch (error) {
      console.error('❌ [ERROR] 친구 삭제 실패!');
      console.error('❌ [ERROR] 전체 에러 객체:', error);

      // 에러 상세 정보 출력
      if (error instanceof Error) {
        console.error('❌ [ERROR] 에러 메시지:', error.message);
        console.error('❌ [ERROR] 에러 스택:', error.stack);
      }

      // Axios 에러인 경우 응답 정보도 출력
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as {
          response?: { status?: number; data?: unknown; headers?: unknown };
          request?: unknown;
          config?: { url?: string; method?: string; baseURL?: string };
          message?: string;
        };

        console.error('❌ [ERROR] Axios 에러 상세 정보:');
        console.error(
          '❌ [ERROR] HTTP 상태 코드:',
          axiosError.response?.status
        );
        console.error('❌ [ERROR] 응답 데이터:', axiosError.response?.data);
        console.error('❌ [ERROR] 응답 헤더:', axiosError.response?.headers);
        console.error('❌ [ERROR] 요청 URL:', axiosError.config?.url);
        console.error('❌ [ERROR] 요청 메서드:', axiosError.config?.method);
        console.error('❌ [ERROR] baseURL:', axiosError.config?.baseURL);
        console.error('❌ [ERROR] 요청 객체:', axiosError.request);
        console.error('❌ [ERROR] 에러 메시지:', axiosError.message);
      }

      alert('친구 삭제에 실패했습니다.');
    } finally {
      setIsMenuOpen(false);
    }
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
            {/* <button
              onClick={handleProfileView}
              className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              프로필 보기
            </button> */}

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
