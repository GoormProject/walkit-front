import Button from '@/components/ui/Button';
import Card, { CardContent } from '@/components/ui/Card';
import { MoreVertical } from 'lucide-react';
import React from 'react';

export const OnlineFriendsSection = (): React.ReactNode => {
  return (
    <Card className="w-full bg-white border-0 shadow-none">
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-[39px] h-[39px] bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-600 text-sm">김</span>
            </div>
            <div className="absolute w-[9px] h-[9px] bottom-0 right-0 bg-green-500 rounded-full border-2 border-white" />
          </div>
          <div className="flex flex-col">
            <div className="[font-family:'Roboto-SemiBold',Helvetica] font-semibold text-black text-[15px] leading-normal">
              김철수
            </div>
            <div className="[font-family:'Roboto-SemiBold',Helvetica] font-semibold text-green-500 text-xs">
              온라인
            </div>
          </div>
        </div>
        <Button variant="ghost" size="sm" className="h-auto p-1">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </CardContent>
    </Card>
  );
};
