import { useState, useEffect, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import { getFriendsLocation } from '@/utils/friendApi';
import type { FriendLocation } from '@/types/friend';

interface UseFriendLocationsReturn {
  friends: FriendLocation[];
  isLoading: boolean;
  error: string | null;
  refreshLocations: () => Promise<void>;
  lastUpdated: Date | null;
}

export const useFriendLocations = (
  isEnabled: boolean = true,
  refreshInterval: number = 30000 // 30초
): UseFriendLocationsReturn => {
  const [friends, setFriends] = useState<FriendLocation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // 친구 위치 조회 함수
  const fetchFriendLocations = useCallback(async () => {
    if (!isEnabled) return;

    try {
      setIsLoading(true);
      setError(null);
      
      console.log('👥 친구 위치 조회 시작');
      const response = await getFriendsLocation();
      
      setFriends(response.friends);
      setLastUpdated(new Date());
      
      console.log('✅ 친구 위치 조회 성공:', response.friends.length, '명');
      
      if (response.friends.length > 0) {
        toast.success(`${response.friends.length}명의 친구가 근처에 있습니다!`, {
          description: '지도에서 친구들의 위치를 확인해보세요.',
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : '친구 위치 조회에 실패했습니다.';
      setError(errorMessage);
      console.error('❌ 친구 위치 조회 실패:', err);
      
      // 사용자에게 에러 알림 (401, 403 등은 조용히 처리)
      if (!errorMessage.includes('인증') && !errorMessage.includes('친구 관계')) {
        toast.error('친구 위치를 가져올 수 없습니다.', {
          description: errorMessage,
        });
      }
    } finally {
      setIsLoading(false);
    }
  }, [isEnabled]);

  // 수동 새로고침 함수
  const refreshLocations = useCallback(async () => {
    await fetchFriendLocations();
  }, [fetchFriendLocations]);

  // 자동 새로고침 설정
  useEffect(() => {
    if (!isEnabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // 초기 로드
    fetchFriendLocations();

    // 주기적 업데이트 설정
    intervalRef.current = setInterval(() => {
      fetchFriendLocations();
    }, refreshInterval);

    // 정리 함수
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isEnabled, refreshInterval, fetchFriendLocations]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    friends,
    isLoading,
    error,
    refreshLocations,
    lastUpdated,
  };
}; 
