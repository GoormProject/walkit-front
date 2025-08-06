import React from 'react';

interface FriendRequestButtonProps {
  friendRequests: number;
  onClick?: () => void;
}

export const FriendRequestButton = ({
  friendRequests,
  onClick,
}: FriendRequestButtonProps): React.ReactNode => {
  return (
    <button
      onClick={onClick}
      className="w-[14dvh] h-[8dvh] bg-[#fed7aa87] rounded-[5px] overflow-hidden hover:bg-[#fed7aa] transition-colors cursor-pointer"
    >
      <div className="flex flex-col items-center justify-center h-full p-0">
        <div className="text-orange-500 [font-family:'Roboto-SemiBold',Helvetica] font-semibold text-3xl tracking-[0] leading-[normal]">
          {friendRequests}
        </div>
        <div className="[font-family:'Roboto-Medium',Helvetica] font-medium text-black text-[12px] tracking-[0] leading-[normal]">
          친구 요청
        </div>
      </div>
    </button>
  );
};
