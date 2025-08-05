import Button from '@/components/ui/Button';
import {
  ArrowLeft,
  Battery,
  ChevronLeft,
  Circle,
  MoreHorizontal,
  Search,
  Signal,
  UserMinus,
  Wifi,
} from 'lucide-react';
import React from 'react';
import { FriendDetailsSection } from './components/FriendDetailsSection';
import { FriendRequestsSection } from './components/FriendRequestsSection';
import { FriendStatusSection } from './components/FriendStatusSection';
import { FriendsListSection } from './components/FriendsListSection';
import { OfflineFriendsSection } from './components/OfflineFriendsSection';
import { OnlineFriendsSection } from './components/OnlineFriendsSection';
import { SearchBarSection } from './components/SearchBarSection';
import { TotalFriendsSection } from './components/TotalFriendsSection';
import { UserProfileSection } from './components/UserProfileSection';

const FriendsScreen = (): React.ReactNode => {
  return (
    <div className="bg-white flex justify-center items-start w-screen min-h-screen h-full">
      <div className="bg-white w-[360px] min-h-[800px] flex flex-col relative">
        {/* Status Bar */}
        <div className="w-full h-[38px] flex items-center justify-between px-[22px] py-2.5">
          <div className="[font-family:'SamsungOne-400',Helvetica] font-normal text-black text-[14.2px] tracking-[0] leading-[normal]">
            4:19
          </div>
          <div className="flex items-center gap-2">
            <Signal className="w-[53px] h-[11px]" />
            <Wifi className="w-4 h-4" />
            <Battery className="w-[26px] h-[26px]" />
          </div>
        </div>

        {/* Header */}
        <div className="w-full h-[72px] flex items-center px-5 border-b border-[#dfe3e7]">
          <Button
            variant="ghost"
            size="sm"
            className="w-[30px] h-[30px] p-0 mr-[35px]"
          >
            <ArrowLeft className="w-[21px] h-5" />
          </Button>
          <div className="[font-family:'Roboto-SemiBold',Helvetica] font-semibold text-black text-lg tracking-[0] leading-[normal]">
            친구 관리
          </div>
        </div>

        {/* Search Bar */}
        <div className="w-full px-3 py-[14px]">
          <div className="relative w-full h-8 bg-[#f2f2f2] rounded-[20px] flex items-center px-2">
            <Search className="w-[18px] h-[18px] text-[#8c8c8c] mr-3" />
            <input
              placeholder="친구 검색..."
              className="border-0 bg-transparent [font-family:'Roboto-SemiBold',Helvetica] font-semibold text-[#8c8c8c] text-[15px] p-0 h-auto focus-visible:ring-0 placeholder:text-[#8c8c8c] flex-1"
            />
          </div>
        </div>

        {/* Top Section Row */}
        <div className="w-full flex">
          <div className="flex-1">
            <TotalFriendsSection />
          </div>
          <div className="flex-1">
            <SearchBarSection />
          </div>
          <div className="flex-1">
            <OfflineFriendsSection />
          </div>
        </div>

        {/* Friend Details Section */}
        <div className="w-full">
          <FriendDetailsSection />
        </div>

        {/* Online Friends Header */}
        <div className="w-full h-[29px] bg-[#f2f2f2] flex items-center px-[9px]">
          <div className="[font-family:'Roboto-SemiBold',Helvetica] font-semibold text-[#000000b2] text-[13px] tracking-[0] leading-[normal]">
            온라인 - 3명
          </div>
        </div>

        {/* Online Friends Section */}
        <div className="w-full">
          <OnlineFriendsSection />
        </div>

        {/* Friend Requests Section */}
        <div className="w-full">
          <FriendRequestsSection />
        </div>

        {/* Offline Friends Header */}
        <div className="w-full h-[29px] bg-[#f2f2f2] flex items-center px-2">
          <div className="[font-family:'Roboto-SemiBold',Helvetica] font-semibold text-[#000000b2] text-[13px] tracking-[0] leading-[normal]">
            오프라인 - 2명
          </div>
        </div>

        {/* Friend Status Section */}
        <div className="w-full">
          <FriendStatusSection />
        </div>

        {/* Friends List Section */}
        <div className="w-full">
          <FriendsListSection />
        </div>

        {/* User Profile Section */}
        <div className="w-full h-[88px] flex items-end pb-4">
          <div className="flex-1">
            <UserProfileSection />
          </div>
          <div className="w-[125px] h-10 mr-4">
            <Button
              variant="outline"
              className="w-full h-full bg-white rounded-[5px] border border-stone-300 shadow-[0px_4px_4px_#00000012] flex items-center justify-center gap-2 px-[9px]"
            >
              <UserMinus className="w-4 h-4 text-red-600" />
              <span className="[font-family:'Roboto-SemiBold',Helvetica] font-semibold text-red-600 text-[13px] tracking-[0] leading-[normal]">
                친구 삭제
              </span>
            </Button>
          </div>
        </div>

        {/* Bottom Navigation */}
        <div className="w-full h-[42px] bg-[#f2f2f2] flex items-center justify-around mt-auto">
          <div className="flex flex-col items-center">
            <MoreHorizontal className="w-[15px] h-[15px] text-[#8c8c8c]" />
          </div>
          <div className="flex flex-col items-center">
            <Circle className="w-[15px] h-[15px] text-[#8c8c8c]" />
          </div>
          <div className="flex flex-col items-center">
            <ChevronLeft className="w-[15px] h-[15px] text-[#8c8c8c]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FriendsScreen;
