import { Card, CardContent } from '@/components/ui/card';
import React from 'react';

export const SearchBarSection = (): JSX.Element => {
  return (
    <Card className="w-[110px] h-[50px] bg-lime-100 rounded-[5px] overflow-hidden">
      <CardContent className="flex flex-col items-center justify-center h-full p-0">
        <div className="[font-family:'Roboto-SemiBold',Helvetica] font-semibold text-green-500 text-lg tracking-[0] leading-[normal]">
          3
        </div>
        <div className="[font-family:'Roboto-Medium',Helvetica] font-medium text-black text-[6px] tracking-[0] leading-[normal]">
          온라인
        </div>
      </CardContent>
    </Card>
  );
};
