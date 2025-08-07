import React from 'react';

interface TotalFriendsViewOnlyProps {
  totalFriends: number;
}

export const TotalFriendsViewOnly = ({
  totalFriends,
}: TotalFriendsViewOnlyProps): React.ReactNode => {
  return (
    <div className="w-[14dvh] h-[8dvh] bg-blue-100 rounded-[5px] overflow-hidden">
      <div className="flex flex-col items-center justify-center h-full p-0">
        <div className="text-blue-500 font-roboto-semibold font-semibold text-3xl tracking-[0] leading-[normal] whitespace-nowrap">
          {totalFriends}
        </div>
        <div className="font-roboto-medium font-medium text-black text-[12px] tracking-[0] leading-[normal] whitespace-nowrap">
          전체 친구
        </div>
      </div>
    </div>
  );
};
