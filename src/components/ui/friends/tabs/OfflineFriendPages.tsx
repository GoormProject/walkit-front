import React from 'react';
import { FriendCard } from '@/components/ui/friends/card/FriendCard';

interface OfflineFriendPagesProps {
  offlineFriends: number;
}

export const OfflineFriendPages = ({
  offlineFriends,
}: OfflineFriendPagesProps): React.ReactNode => {
  // 임시 오프라인 친구 데이터 (DEV 환경에서만 사용)
  const offlineFriendsList = import.meta.env.DEV
    ? [
        { id: 1, name: '정수진', status: '오프라인', isOnline: false },
        { id: 2, name: '최동욱', status: '오프라인', isOnline: false },
        { id: 3, name: '한미영', status: '오프라인', isOnline: false },
      ]
    : [];

  // DEV 환경에서만 로그 출력
  if (import.meta.env.DEV) {
    console.log(
      '🔧 [DEV] 오프라인 친구 페이지 - 임시 데이터 사용:',
      offlineFriendsList
    );
    console.log(
      '🔧 [DEV] 실제 백엔드 API 연결 시 이 부분을 실제 데이터로 교체하세요.'
    );
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
      {offlineFriendsList.map(friend => (
        <FriendCard key={friend.id} friend={friend} />
      ))}
    </div>
  );
};
