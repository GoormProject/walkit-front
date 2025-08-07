import React from 'react';
import { FriendCard } from '@/components/ui/friends/card/FriendCard';

interface OnlineFriendPagesProps {
  onlineFriends: number;
  actualOnlineFriends?: Array<{
    id: number;
    name: string;
    status: string;
    isOnline: boolean;
  }>;
  onDataChange?: () => void;
}

export const OnlineFriendPages = ({
  onlineFriends,
  actualOnlineFriends = [],
  onDataChange,
}: OnlineFriendPagesProps): React.ReactNode => {
  // 실제 친구 데이터만 사용 (더미 데이터 제거)
  const onlineFriendsList = actualOnlineFriends;

  // DEV 환경에서만 로그 출력
  if (import.meta.env.DEV) {
    if (actualOnlineFriends.length > 0) {
      console.log(
        '✅ [BACKEND] 온라인 친구 페이지 - 백엔드 데이터 사용:',
        onlineFriendsList
      );
    } else {
      console.log('🔧 [EMPTY] 온라인 친구 페이지 - 데이터 없음');
    }
  }

  return (
    <div className="w-full">
      {/* 온라인 친구 섹션 헤더 */}
      <div className="bg-green-50 px-4 py-2">
        <h4 className="text-sm font-medium text-green-800">
          온라인 친구 ({onlineFriends}명)
        </h4>
      </div>

      {/* 온라인 친구 목록 */}
      {onlineFriendsList.length > 0 ? (
        onlineFriendsList.map(friend => (
          <FriendCard
            key={friend.id}
            friend={friend}
            onDataChange={onDataChange}
          />
        ))
      ) : (
        <div className="px-4 py-8 text-center text-gray-500">
          온라인 친구가 없습니다.
        </div>
      )}
    </div>
  );
};
