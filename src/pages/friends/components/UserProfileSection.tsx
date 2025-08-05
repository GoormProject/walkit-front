import { Card, CardContent } from '@/components/ui/card';
import React from 'react';

export const UserProfileSection = (): JSX.Element => {
  return (
    <Card className="w-[109px] h-[50px] bg-blue-100 rounded-[5px] overflow-hidden">
      <CardContent className="flex flex-col items-center justify-center h-full p-0">
        <div className="text-blue-500 [font-family:'Roboto-SemiBold',Helvetica] font-semibold text-lg tracking-[0] leading-[normal] whitespace-nowrap">
          5
        </div>
        <div className="[font-family:'Roboto-Medium',Helvetica] font-medium text-black text-[6px] tracking-[0] leading-[normal] whitespace-nowrap">
          전체 친구
        </div>
      </CardContent>
    </Card>
  );
};
