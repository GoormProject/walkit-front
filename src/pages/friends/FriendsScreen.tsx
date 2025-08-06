import Button from '@/components/ui/Button';
import { ChevronLeft } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { FriendPagesTab } from '@/components/ui/friends/FriendPagesTab';
import { OfflineFriendsViewOnly } from '@/components/ui/friends/viewonly/OfflineFriendsViewOnly';
import { OnlineFriendsViewOnly } from '@/components/ui/friends/viewonly/OnlineFriendsViewOnly';
import { TotalFriendsViewOnly } from '@/components/ui/friends/viewonly/TotalFriendsViewOnly';
import { FriendsSearchBar } from '@/components/ui/friends/FriendsSearchBar';

const FriendsScreen = (): React.ReactNode => {
  // 임시 데이터 상태
  const [friendsData, setFriendsData] = useState({
    totalFriends: 0,
    onlineFriends: 0,
    offlineFriends: 0,
    friendRequests: 0,
  });

  useEffect(() => {
    // DEV 환경에서만 임시값 설정
    if (import.meta.env.DEV) {
      const tempData = {
        totalFriends: 10,
        onlineFriends: 15,
        offlineFriends: 20,
        friendRequests: 25,
      };

      setFriendsData(tempData);

      console.log('🔧 [DEV] 임시 친구 데이터 설정:', tempData);
      console.log(
        '🔧 [DEV] 실제 백엔드 API 연결 시 이 부분을 실제 데이터로 교체하세요.'
      );
    }
  }, []);

  return (
    <div className="bg-white w-full max-w-[100%] min-h-[85dvh] flex flex-col relative mx-auto">
      {/* Status Bar */}
      {/* <div className="w-full h-[4.7dvh] flex items-center justify-between px-[22px] py-2.5">
        <div className="[font-family:'SamsungOne-400',Helvetica] font-normal text-black text-[14.2px] tracking-[0] leading-[normal]">
          4:19
        </div>
        <div className="flex items-center gap-2">
          <Signal className="w-[53px] h-[11px]" />
          <Wifi className="w-4 h-4" />
          <Battery className="w-[26px] h-[26px]" />
        </div>
      </div> */}

      {/* Header */}
      <div className="w-full h-[8.9dvh] flex items-center px-5 border-b border-[#dfe3e7]">
        <Button variant="ghost" className="w-[30px] h-[30px] p-0 mr-[35px]">
          <ChevronLeft className="w-[21px] h-5" />
        </Button>
        <div className="flex-1 text-center [font-family:'Roboto-SemiBold',Helvetica] font-semibold text-black text-lg tracking-[0] leading-[normal]">
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
          <TotalFriendsViewOnly totalFriends={friendsData.totalFriends} />
        </div>
        <div className="flex-1 flex justify-center items-center">
          <OnlineFriendsViewOnly onlineFriends={friendsData.onlineFriends} />
        </div>
        <div className="flex-1 flex justify-center items-center">
          <OfflineFriendsViewOnly friendRequests={friendsData.friendRequests} />
        </div>
      </div>

      {/* Friend Pages Tab */}
      <div className="w-full flex-1">
        <FriendPagesTab
          totalFriends={friendsData.totalFriends}
          onlineFriends={friendsData.onlineFriends}
          offlineFriends={friendsData.offlineFriends}
        />
      </div>
    </div>
  );
};

export default FriendsScreen;
