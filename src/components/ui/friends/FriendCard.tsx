import Button from '@/components/ui/Button';
import { MoreVertical } from 'lucide-react';
import React from 'react';

interface Friend {
  id: number;
  name: string;
  status: string;
  isOnline: boolean;
}

interface FriendCardProps {
  friend: Friend;
  onMoreClick?: (friendId: number) => void;
}

export const FriendCard = ({
  friend,
  onMoreClick,
}: FriendCardProps): React.ReactNode => {
  const handleMoreClick = () => {
    onMoreClick?.(friend.id);
  };

  return (
    <div className="w-full h-[7.8dvh] bg-white border-b border-gray-200 relative">
      <div className="flex items-center justify-between px-4 py-2 h-full">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-[39px] h-[39px] bg-gray-200 rounded-full flex items-center justify-center">
              <span className="text-gray-600 text-sm">
                {friend.name.charAt(0)}
              </span>
            </div>
            {/* 온라인일 때만 초록색 점 표시 */}
            {friend.isOnline && (
              <div className="absolute w-[9px] h-[9px] bottom-0 right-0 bg-green-500 rounded-full border-2 border-white" />
            )}
          </div>

          <div className="flex flex-col">
            <div className="[font-family:'Roboto-SemiBold',Helvetica] font-semibold text-black text-[15px] leading-[18px]">
              {friend.name}
            </div>
            <div
              className={`[font-family:'Roboto-SemiBold',Helvetica] font-semibold text-xs ${
                friend.isOnline ? 'text-green-500' : 'text-gray-500'
              }`}
            >
              {friend.status}
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="h-auto p-1"
          onClick={handleMoreClick}
        >
          <MoreVertical className="w-4 h-4 text-gray-600" />
        </Button>
      </div>
    </div>
  );
};
