import React from 'react';

export const UserProfileSection = (): React.ReactNode => {
  return (
    <div className="w-[109px] h-[50px] bg-blue-100 rounded-[5px] overflow-hidden flex flex-col items-center justify-center">
      <div className="text-blue-500 font-roboto-semibold font-semibold text-lg tracking-[0] leading-[normal] whitespace-nowrap">
        5
      </div>
      <div className="font-roboto-medium font-medium text-black text-[6px] tracking-[0] leading-[normal] whitespace-nowrap">
        전체 친구
      </div>
    </div>
  );
};
