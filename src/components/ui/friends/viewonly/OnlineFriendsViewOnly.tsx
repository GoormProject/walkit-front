import React from 'react';

interface OnlineFriendsViewOnlyProps {
  onlineFriends: number;
}

export const OnlineFriendsViewOnly = ({
  onlineFriends,
}: OnlineFriendsViewOnlyProps): React.ReactNode => {
  return (
    <div className="w-[14dvh] h-[8dvh] bg-lime-100 rounded-[5px] overflow-hidden">
      <div className="flex flex-col items-center justify-center h-full p-0">
        <div className="font-roboto-semibold font-semibold text-green-500 text-3xl tracking-[0] leading-[normal]">
          {onlineFriends}
        </div>
        <div className="font-roboto-medium font-medium text-black text-[12px] tracking-[0] leading-[normal]">
          온라인
        </div>
      </div>
    </div>
  );
};
