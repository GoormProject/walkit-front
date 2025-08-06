import React from 'react';
import { FriendCard } from '@/components/ui/friends/card/FriendCard';

interface OnlineFriendPagesProps {
  onlineFriends: number;
}

export const OnlineFriendPages = ({
  onlineFriends,
}: OnlineFriendPagesProps): React.ReactNode => {
  // 임시 온라인 친구 데이터 (DEV 환경에서만 사용)
  const onlineFriendsList = import.meta.env.DEV
    ? [
        { id: 1, name: '김철수', status: '온라인', isOnline: true },
        { id: 2, name: '이영희', status: '온라인', isOnline: true },
        { id: 3, name: '박민수', status: '온라인', isOnline: true },
      ]
    : [];

  // DEV 환경에서만 로그 출력
  if (import.meta.env.DEV) {
    console.log(
      '🔧 [DEV] 온라인 친구 페이지 - 임시 데이터 사용:',
      onlineFriendsList
    );
    console.log(
      '🔧 [DEV] 실제 백엔드 API 연결 시 이 부분을 실제 데이터로 교체하세요.'
    );
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
      {onlineFriendsList.map(friend => (
        <FriendCard key={friend.id} friend={friend} />
      ))}
    </div>
  );
};
