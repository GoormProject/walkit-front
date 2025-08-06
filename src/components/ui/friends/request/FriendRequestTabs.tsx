import React, { useState } from 'react';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@/components/ui/friends/tabs/Tabs';
import { SentRequestsTab } from './SentRequestsTab';
import { ReceivedRequestsTab } from './ReceivedRequestsTab';

export const FriendRequestTabs = (): React.ReactNode => {
  const [activeTab, setActiveTab] = useState('received');

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-12 bg-gray-100 p-1 rounded-lg">
          <TabsTrigger
            value="received"
            className="h-10 rounded-md text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=inactive]:text-gray-600"
          >
            내가 받은 요청
          </TabsTrigger>
          <TabsTrigger
            value="sent"
            className="h-10 rounded-md text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=inactive]:text-gray-600"
          >
            내가 보낸 요청
          </TabsTrigger>
        </TabsList>

        <TabsContent value="received" className="mt-6">
          <ReceivedRequestsTab />
        </TabsContent>

        <TabsContent value="sent" className="mt-6">
          <SentRequestsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};
