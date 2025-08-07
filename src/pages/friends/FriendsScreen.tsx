import React, { useState, useEffect } from 'react';
import { FriendPagesTab } from '@/components/ui/friends/FriendPagesTab';
import { FriendRequestButton } from '@/components/ui/friends/viewonly/FriendRequestButton';
import { FriendRequestModal } from '@/components/ui/friends/request/FriendRequestModal';
import { OnlineFriendsViewOnly } from '@/components/ui/friends/viewonly/OnlineFriendsViewOnly';
import { TotalFriendsViewOnly } from '@/components/ui/friends/viewonly/TotalFriendsViewOnly';
import { FriendsSearchBar } from '@/components/ui/friends/FriendsSearchBar';
import { Api } from '@/api/swagger-api';
import type { FriendListResponseDTO } from '@/api/swagger-api';

// 통합된 친구 데이터 타입 정의
interface FriendsData {
  total: number;
  online: number;
  offline: number;
  friendRequests: number;
  onlineFriends: Array<{
    id: number;
    name: string;
    status: string;
    isOnline: boolean;
  }>;
  offlineFriends: Array<{
    id: number;
    name: string;
    status: string;
    isOnline: boolean;
  }>;
}

const FriendsScreen = (): React.ReactNode => {
  // API 인스턴스 생성 (쿠키 인증을 위해 withCredentials 설정)
  const api = new Api({
    withCredentials: true,
  });

  // 통합된 친구 데이터 상태
  const [friendsData, setFriendsData] = useState<FriendsData>({
    total: 0,
    online: 0,
    offline: 0,
    friendRequests: 0,
    onlineFriends: [],
    offlineFriends: [],
  });

  // 로딩 상태
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 친구 요청 모달 상태
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);

  // 친구 데이터 가져오기
  const fetchFriendsData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      let friendRequestsCount = 0;

      // 친구 요청 수 가져오기 (개별 처리)
      try {
        const friendRequestsResponse =
          await api.api.getReceivedFriendRequests();
        if (friendRequestsResponse.data.data) {
          friendRequestsCount = friendRequestsResponse.data.data.length || 0;
          if (import.meta.env.DEV) {
            console.log('✅ [BACKEND] 받은 친구 요청 수:', friendRequestsCount);
            console.log(
              '✅ [BACKEND] 받은 친구 요청 데이터:',
              friendRequestsResponse.data.data
            );
          }
        } else {
          // data가 없는 경우도 에러로 처리
          if (import.meta.env.DEV) {
            console.log(
              '🔧 [DEV] 백엔드 응답에 data가 없어서 임시 데이터 사용: friendRequests = -1'
            );
          }
          friendRequestsCount = -1;
        }
      } catch (friendRequestsError) {
        console.error(
          '❌ 친구 요청 데이터 가져오기 실패:',
          friendRequestsError
        );
        if (import.meta.env.DEV) {
          console.log(
            '🔧 [DEV] 백엔드 요청 실패로 임시 데이터 사용: friendRequests = -1'
          );
        }
        friendRequestsCount = -1;
      }

      // 친구 목록 가져오기
      const friendsResponse = await api.api.getFriends();

      if (friendsResponse.data.data) {
        const friendData: FriendListResponseDTO = friendsResponse.data.data;

        // 백엔드에서 받아온 실제 친구 데이터를 변환
        const actualOnlineFriends =
          friendData.onlineFriends?.map(friend => ({
            id: friend.friendId || 0,
            name: friend.nickname || 'Unknown',
            status:
              friend.memberStatus === 'ONLINE'
                ? '온라인'
                : friend.memberStatus === 'WALKING'
                  ? '산책중'
                  : '오프라인',
            isOnline:
              friend.memberStatus === 'ONLINE' ||
              friend.memberStatus === 'WALKING',
          })) || [];

        const actualOfflineFriends =
          friendData.offlineFriends?.map(friend => ({
            id: friend.friendId || 0,
            name: friend.nickname || 'Unknown',
            status:
              friend.memberStatus === 'ONLINE'
                ? '온라인'
                : friend.memberStatus === 'WALKING'
                  ? '산책중'
                  : '오프라인',
            isOnline:
              friend.memberStatus === 'ONLINE' ||
              friend.memberStatus === 'WALKING',
          })) || [];

        // 통합된 데이터로 상태 업데이트
        setFriendsData({
          total: friendData.total || 0,
          online: friendData.online || 0,
          offline: friendData.offline || 0,
          friendRequests: friendRequestsCount,
          onlineFriends: actualOnlineFriends,
          offlineFriends: actualOfflineFriends,
        });

        if (import.meta.env.DEV) {
          console.log(
            '✅ [BACKEND] API에서 받아온 실제 친구 데이터:',
            friendData
          );
          console.log('✅ [BACKEND] 변환된 온라인 친구:', actualOnlineFriends);
          console.log(
            '✅ [BACKEND] 변환된 오프라인 친구:',
            actualOfflineFriends
          );
        }
      }
    } catch (err) {
      console.error('❌ 친구 데이터 가져오기 실패:', err);

      // 에러 상세 정보 출력
      if (err instanceof Error) {
        console.error('❌ 에러 메시지:', err.message);
        console.error('❌ 에러 스택:', err.stack);
      }

      // Axios 에러인 경우 응답 정보도 출력
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as {
          response?: { status?: number; data?: unknown };
          config?: { url?: string; method?: string };
        };
        console.error('❌ HTTP 상태 코드:', axiosError.response?.status);
        console.error('❌ 응답 데이터:', axiosError.response?.data);
        console.error('❌ 요청 URL:', axiosError.config?.url);
        console.error('❌ 요청 메서드:', axiosError.config?.method);
      }

      setError('친구 데이터를 가져오는데 실패했습니다.');

      // DEV 환경에서는 임시 데이터 사용 (실패 표시용 -1)
      if (import.meta.env.DEV) {
        const tempData: FriendsData = {
          total: -1,
          online: -1,
          offline: -1,
          friendRequests: -1,
          onlineFriends: [],
          offlineFriends: [],
        };
        setFriendsData(tempData);
        console.log(
          '🔧 [DEV] API 실패로 임시 데이터 사용 (실패 표시):',
          tempData
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFriendsData();
  }, []);

  // 로딩 중일 때
  if (isLoading) {
    return (
      <div className="bg-white w-full max-w-[100%] min-h-[85dvh] flex flex-col relative mx-auto">
        <div className="w-full h-[8.9dvh] flex items-center px-5 border-b border-[#dfe3e7]">
          <div className="flex-1 text-center [font-family:'Roboto-SemiBold',Helvetica] font-semibold text-black text-4xl tracking-[0] leading-[normal]">
            친구 관리
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-gray-500">친구 데이터를 불러오는 중...</div>
        </div>
      </div>
    );
  }

  // 에러가 있을 때
  if (error) {
    return (
      <div className="bg-white w-full max-w-[100%] min-h-[85dvh] flex flex-col relative mx-auto">
        <div className="w-full h-[8.9dvh] flex items-center px-5 border-b border-[#dfe3e7]">
          <div className="flex-1 text-center [font-family:'Roboto-SemiBold',Helvetica] font-semibold text-black text-4xl tracking-[0] leading-[normal]">
            친구 관리
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-red-500 text-center">
            <div>{error}</div>
            <button
              onClick={fetchFriendsData}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              다시 시도
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white w-full max-w-[100%] min-h-[85dvh] flex flex-col relative mx-auto">
      {/* Page-Header */}
      <div className="w-full h-[8.9dvh] flex items-center px-5 border-b border-[#dfe3e7]">
        <div className="flex-1 text-center font-roboto-semibold font-semibold text-black text-4xl tracking-[0] leading-[normal]">
          친구 관리
        </div>
      </div>

      {/* Search Bar */}
      <>
        <FriendsSearchBar />
      </>

      {/* Top Section Row */}
      <div className="w-full flex">
        <div className="flex-1 flex justify-center items-center">
          <TotalFriendsViewOnly totalFriends={friendsData.total} />
        </div>
        <div className="flex-1 flex justify-center items-center">
          <OnlineFriendsViewOnly onlineFriends={friendsData.online} />
        </div>
        <div className="flex-1 flex justify-center items-center">
          <FriendRequestButton
            friendRequests={friendsData.friendRequests}
            onClick={() => setIsRequestModalOpen(true)}
          />
        </div>
      </div>

      {/* Friend Pages Tab */}
      <div className="w-full flex-1">
        <FriendPagesTab
          totalFriends={friendsData.total}
          onlineFriends={friendsData.online}
          offlineFriends={friendsData.offline}
          actualOnlineFriends={friendsData.onlineFriends}
          actualOfflineFriends={friendsData.offlineFriends}
          onDataChange={fetchFriendsData}
        />
      </div>

      {/* Friend Request Modal */}
      <FriendRequestModal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        onDataChange={fetchFriendsData}
      />
    </div>
  );
};

export default FriendsScreen;
