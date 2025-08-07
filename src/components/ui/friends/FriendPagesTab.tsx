import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/friends/tabs/Tabs';
import React, { useState } from 'react';
import { TotalFriendPages } from '@/components/ui/friends/tabs/TotalFriendPages';
import { OnlineFriendPages } from '@/components/ui/friends/tabs/OnlineFriendPages';
import { OfflineFriendPages } from '@/components/ui/friends/tabs/OfflineFriendPages';

interface FriendPagesTabProps {
  totalFriends: number;
  onlineFriends: number;
  offlineFriends: number;
  actualOnlineFriends?: Array<{
    id: number;
    name: string;
    status: string;
    isOnline: boolean;
  }>;
  actualOfflineFriends?: Array<{
    id: number;
    name: string;
    status: string;
    isOnline: boolean;
  }>;
  onDataChange?: () => void;
}

export const FriendPagesTab = ({
  totalFriends,
  onlineFriends,
  offlineFriends,
  actualOnlineFriends = [],
  actualOfflineFriends = [],
  onDataChange,
}: FriendPagesTabProps): React.ReactNode => {
  const [activeTab, setActiveTab] = useState('all');

  const tabData = [
    { id: 'all', label: `전체 (${totalFriends})`, count: totalFriends },
    { id: 'online', label: `온라인 (${onlineFriends})`, count: onlineFriends },
    {
      id: 'offline',
      label: `오프라인 (${offlineFriends})`,
      count: offlineFriends,
    },
  ];

  return (
    <div className="w-full">
      {/* 탭 헤더 */}
      <div className="h-[5dvh] relative">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 h-[5dvh] bg-transparent p-0 rounded-none">
            {tabData.map(tab => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className={`
                  h-[5dvh] rounded-none border-t border-b border-[#00000033] text-[13px] font-semibold tracking-[0] leading-normal whitespace-nowrap
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

      {/* 탭 콘텐츠 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsContent value="all" className="mt-0">
          <TotalFriendPages
            onlineFriends={onlineFriends}
            offlineFriends={offlineFriends}
            onDataChange={onDataChange}
          />
        </TabsContent>

        <TabsContent value="online" className="mt-0">
          <OnlineFriendPages
            onlineFriends={onlineFriends}
            actualOnlineFriends={actualOnlineFriends}
            onDataChange={onDataChange}
          />
        </TabsContent>

        <TabsContent value="offline" className="mt-0">
          <OfflineFriendPages
            offlineFriends={offlineFriends}
            actualOfflineFriends={actualOfflineFriends}
            onDataChange={onDataChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
