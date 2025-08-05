import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MoreVertical } from 'lucide-react';
import React from 'react';

export const FriendsListSection = (): JSX.Element => {
  return (
    <div className="w-full h-[63px] bg-white border-b border-gray-200 relative">
      <div className="flex items-center justify-between px-4 py-2 h-full">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="w-[39px] h-[39px]">
              <AvatarImage src="/rectangle-13-4.png" alt="홍길동" />
              <AvatarFallback className="bg-gray-200 text-gray-600 text-sm">
                홍
              </AvatarFallback>
            </Avatar>
            <div className="absolute w-[9px] h-[9px] bottom-0 right-0 bg-green-500 rounded-full border-2 border-white" />
          </div>

          <div className="flex flex-col">
            <div className="[font-family:'Roboto-SemiBold',Helvetica] font-semibold text-black text-[15px] leading-[18px]">
              홍길동
            </div>
            <Badge
              variant="secondary"
              className="w-fit mt-1 px-0 bg-transparent text-green-500 [font-family:'Roboto-SemiBold',Helvetica] font-semibold text-xs h-auto"
            >
              온라인
            </Badge>
          </div>
        </div>

        <Button variant="ghost" size="sm" className="h-auto p-1">
          <MoreVertical className="w-4 h-4 text-gray-600" />
        </Button>
      </div>
    </div>
  );
};
