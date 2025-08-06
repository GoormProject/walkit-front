import Button from '@/components/ui/Button';
import { MoreVertical } from 'lucide-react';
import React from 'react';

export const FriendRequestsSection = (): React.ReactNode => {
  const friendData = {
    name: '봉준호',
    status: '온라인',
    isOnline: true,
  };

  return (
    <div className="w-full bg-white border-0 shadow-none flex items-center justify-between p-4">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="w-[39px] h-[39px] bg-gray-200 rounded-full flex items-center justify-center">
            <span className="text-gray-600 text-sm">
              {friendData.name.charAt(0)}
            </span>
          </div>
          {friendData.isOnline && (
            <div className="absolute w-[9px] h-[9px] bottom-0 right-0 bg-green-500 rounded-full border-2 border-white" />
          )}
        </div>
        <div className="flex flex-col">
          <div className="[font-family:'Roboto-SemiBold',Helvetica] font-semibold text-black text-[15px] leading-normal">
            {friendData.name}
          </div>
          <div className="[font-family:'Roboto-SemiBold',Helvetica] font-semibold text-green-500 text-xs leading-normal">
            {friendData.status}
          </div>
        </div>
      </div>
      <Button variant="ghost" size="sm" className="h-auto p-1">
        <MoreVertical className="w-4 h-4" />
      </Button>
    </div>
  );
};
