import React from 'react';

interface OfflineFriendsViewOnlyProps {
  friendRequests: number;
}

export const OfflineFriendsViewOnly = ({
  friendRequests,
}: OfflineFriendsViewOnlyProps): React.ReactNode => {
  return (
    <div className="w-[14dvh] h-[8dvh] bg-[#fed7aa87] rounded-[5px] overflow-hidden">
      <div className="flex flex-col items-center justify-center h-full p-0">
        <div className="text-orange-500 [font-family:'Roboto-SemiBold',Helvetica] font-semibold text-3xl tracking-[0] leading-[normal]">
          {friendRequests}
        </div>
        <div className="[font-family:'Roboto-Medium',Helvetica] font-medium text-black text-[12px] tracking-[0] leading-[normal]">
          친구 요청
        </div>
      </div>
    </div>
  );
};
