import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import React, { useState } from 'react';

const tabData = [
  { id: 'all', label: '전체 (5)', count: 5 },
  { id: 'online', label: '온라인 (3)', count: 3 },
  { id: 'offline', label: '오프라인 (2)', count: 2 },
];

export const FriendDetailsSection = (): JSX.Element => {
  const [activeTab, setActiveTab] = useState('all');

  return (
    <div className="w-full h-[34px] relative">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 h-[34px] bg-transparent p-0 rounded-none">
          {tabData.map(tab => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className={`
                h-[34px] rounded-none border-t border-b border-[#00000033] text-[13px] font-semibold tracking-[0] leading-normal whitespace-nowrap
                data-[state=active]:bg-green-700 data-[state=active]:text-white data-[state=active]:shadow-none
                data-[state=inactive]:bg-white data-[state=inactive]:text-black data-[state=inactive]:shadow-none
                [font-family:'Roboto-SemiBold',Helvetica]
              `}
            >
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};
