import React from 'react';
import { OnlineFriendPages } from '@/components/ui/friends/tabs/OnlineFriendPages';
import { OfflineFriendPages } from '@/components/ui/friends/tabs/OfflineFriendPages';

interface TotalFriendPagesProps {
  onlineFriends: number;
  offlineFriends: number;
}

export const TotalFriendPages = ({
  onlineFriends,
  offlineFriends,
}: TotalFriendPagesProps): React.ReactNode => {
  // DEV 환경에서만 로그 출력
  if (import.meta.env.DEV) {
    console.log(
      '🔧 [DEV] 전체 친구 페이지 - 온라인/오프라인 컴포넌트 조합 사용'
    );
    console.log(
      '🔧 [DEV] 온라인 친구:',
      onlineFriends,
      '명, 오프라인 친구:',
      offlineFriends,
      '명'
    );
  }

  return (
    <div className="w-full">
      {/* 온라인 친구 섹션 */}
      <div className="border-b border-gray-100">
        <OnlineFriendPages onlineFriends={onlineFriends} />
      </div>

      {/* 오프라인 친구 섹션 */}
      <div>
        <OfflineFriendPages offlineFriends={offlineFriends} />
      </div>
    </div>
  );
};
