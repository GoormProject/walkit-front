import Button from '@/components/ui/Button';
import { MoreVertical } from 'lucide-react';
import React from 'react';

export const FriendStatusSection = (): React.ReactNode => {
  return (
    <div className="w-full h-[7.8dvh] bg-white border-b border-gray-200 relative">
      <div className="flex items-center justify-between px-4 py-2 h-full">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-[39px] h-[39px] bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-600 text-sm">홍</span>
            </div>
            <div className="absolute w-[9px] h-[9px] bottom-0 right-0 bg-green-500 rounded-full border-2 border-white" />
          </div>

          <div className="flex flex-col">
            <div className="font-roboto-semibold font-semibold text-black text-[15px] leading-[18px]">
              홍길동
            </div>
            <div className="font-roboto-semibold font-semibold text-green-500 text-xs">
              온라인
            </div>
          </div>
        </div>

        <Button variant="ghost" size="sm" className="h-auto p-1">
          <MoreVertical className="w-4 h-4 text-gray-600" />
        </Button>
      </div>
    </div>
  );
};
