import React from 'react';
import { FriendCard } from '@/components/ui/friends/card/FriendCard';

interface OfflineFriendPagesProps {
  offlineFriends: number;
  actualOfflineFriends?: Array<{
    id: number;
    name: string;
    status: string;
    isOnline: boolean;
  }>;
}

export const OfflineFriendPages = ({
  offlineFriends,
  actualOfflineFriends = [],
}: OfflineFriendPagesProps): React.ReactNode => {
  // 실제 친구 데이터만 사용 (더미 데이터 제거)
  const offlineFriendsList = actualOfflineFriends;

  // DEV 환경에서만 로그 출력
  if (import.meta.env.DEV) {
    if (actualOfflineFriends.length > 0) {
      console.log(
        '✅ [BACKEND] 오프라인 친구 페이지 - 백엔드 데이터 사용:',
        offlineFriendsList
      );
    } else {
      console.log('🔧 [EMPTY] 오프라인 친구 페이지 - 데이터 없음');
    }
  }

  return (
    <div className="w-full">
      {/* 오프라인 친구 섹션 헤더 */}
      <div className="bg-gray-50 px-4 py-2">
        <h4 className="text-sm font-medium text-gray-800">
          오프라인 친구 ({offlineFriends}명)
        </h4>
      </div>

      {/* 오프라인 친구 목록 */}
      {offlineFriendsList.length > 0 ? (
        offlineFriendsList.map(friend => (
          <FriendCard key={friend.id} friend={friend} />
        ))
      ) : (
        <div className="px-4 py-8 text-center text-gray-500">
          오프라인 친구가 없습니다.
        </div>
      )}
    </div>
  );
};
