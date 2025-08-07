import React, { useState, useEffect } from 'react';
import { Api } from '@/api/swagger-api';
import Button from '@/components/ui/Button';

interface ReceivedRequest {
  id: number;
  senderId: number;
  senderNickname: string;
  senderProfile?: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
}

interface ReceivedRequestsTabProps {
  onDataChange?: () => void;
}

export const ReceivedRequestsTab = ({
  onDataChange,
}: ReceivedRequestsTabProps): React.ReactNode => {
  const [receivedRequests, setReceivedRequests] = useState<ReceivedRequest[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingIds, setProcessingIds] = useState<Set<number>>(new Set());

  const api = new Api({ withCredentials: true });

  const fetchReceivedRequests = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.api.getReceivedFriendRequests();

      if (response.data.data) {
        const requests = response.data.data.map((request: unknown) => {
          const req = request as Record<string, unknown>;
          const mappedRequest = {
            id: (req.friendRequestId as number) || -1, // friendRequestId를 직접 사용
            senderId: (req.senderId as number) || -1,
            senderNickname: (req.senderNickname as string) || 'Unknown',
            senderProfile: req.profile as string | undefined, // profile 필드명 수정
            status: ((req.requestStatus as string) || 'PENDING') as  // requestStatus 필드명 수정
              | 'PENDING'
              | 'ACCEPTED'
              | 'REJECTED',
            createdAt: (req.createdAt as string) || '',
          };

          // 백엔드에서 값을 제대로 못받아온 경우 로깅
          if (import.meta.env.DEV) {
            console.log('🔍 [DEBUG] 개별 요청 원본 데이터:', req);
            console.log(
              '🔍 [DEBUG] req.friendRequestId:',
              req.friendRequestId,
              '타입:',
              typeof req.friendRequestId
            );
            console.log(
              '🔍 [DEBUG] req.profile:',
              req.profile,
              '타입:',
              typeof req.profile
            );
            console.log(
              '🔍 [DEBUG] req.requestStatus:',
              req.requestStatus,
              '타입:',
              typeof req.requestStatus
            );

            if (!req.friendRequestId) {
              console.log(
                '⚠️ [BACKEND] friendRequestId 값을 받아오지 못함 (실패값 -1 설정):',
                req
              );
            }
            if (!req.senderNickname) {
              console.log(
                '⚠️ [BACKEND] senderNickname 값을 받아오지 못함:',
                req
              );
            }
            if (!req.createdAt) {
              console.log('⚠️ [BACKEND] createdAt 값을 받아오지 못함:', req);
            }
          }

          return mappedRequest;
        });

        setReceivedRequests(requests);

        if (import.meta.env.DEV) {
          console.log('✅ [BACKEND] 받은 친구 요청 데이터:', requests);
          console.log('🔍 [DEBUG] 원본 API 응답:', response.data.data);
          console.log('🔍 [DEBUG] 전체 API 응답 구조:', response.data);
        }
      } else {
        if (import.meta.env.DEV) {
          console.log('⚠️ [BACKEND] response.data.data가 없음:', response.data);
        }
      }
    } catch (err) {
      console.error('❌ 받은 친구 요청 가져오기 실패:', err);
      setError('받은 친구 요청을 가져오는데 실패했습니다.');

      if (import.meta.env.DEV) {
        console.log('🔧 [DEV] 받은 친구 요청 API 실패');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId: number) => {
    try {
      if (import.meta.env.DEV) {
        console.log('🔍 [DEBUG] 수락 요청 ID:', requestId);
      }

      if (!requestId || requestId === -1) {
        alert('유효하지 않은 요청 ID입니다.');
        return;
      }

      setProcessingIds(prev => new Set(prev).add(requestId));

      await api.api.approveFriendRequest(requestId);

      // 성공 시 목록에서 제거
      setReceivedRequests(prev =>
        prev.filter(request => request.id !== requestId)
      );

      // 부모 컴포넌트에 데이터 변경 알림
      if (onDataChange) {
        onDataChange();
      }

      if (import.meta.env.DEV) {
        console.log('✅ [BACKEND] 친구 요청 수락 성공:', requestId);
      }
    } catch (err) {
      console.error('❌ 친구 요청 수락 실패:', err);
      alert('친구 요청 수락에 실패했습니다.');
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(requestId);
        return newSet;
      });
    }
  };

  const handleRejectRequest = async (requestId: number) => {
    try {
      if (import.meta.env.DEV) {
        console.log('🔍 [DEBUG] 거절 요청 ID:', requestId);
      }

      if (!requestId || requestId === -1) {
        alert('유효하지 않은 요청 ID입니다.');
        return;
      }

      setProcessingIds(prev => new Set(prev).add(requestId));

      await api.api.rejectFriendRequest(requestId);

      // 성공 시 목록에서 제거
      setReceivedRequests(prev =>
        prev.filter(request => request.id !== requestId)
      );

      // 부모 컴포넌트에 데이터 변경 알림
      if (onDataChange) {
        onDataChange();
      }

      if (import.meta.env.DEV) {
        console.log('✅ [BACKEND] 친구 요청 거절 성공:', requestId);
      }
    } catch (err) {
      console.error('❌ 친구 요청 거절 실패:', err);
      alert('친구 요청 거절에 실패했습니다.');
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(requestId);
        return newSet;
      });
    }
  };

  useEffect(() => {
    fetchReceivedRequests();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-500">받은 친구 요청을 불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={fetchReceivedRequests}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (receivedRequests.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500">받은 친구 요청이 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {receivedRequests.map(request => (
        <div
          key={request.id}
          className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg"
        >
          <div className="flex items-center gap-3">
            {/* 프로필 이미지 */}
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              {request.senderProfile ? (
                <img
                  src={request.senderProfile}
                  alt={request.senderNickname}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <span className="text-gray-600 text-lg">
                  {request.senderNickname.charAt(0)}
                </span>
              )}
            </div>

            {/* 사용자 정보 */}
            <div>
              <div className="font-semibold text-gray-900">
                {request.senderNickname}
              </div>
              <div className="text-sm text-gray-500">
                {new Date(request.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* 액션 버튼 */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAcceptRequest(request.id)}
              disabled={processingIds.has(request.id)}
              className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
            >
              {processingIds.has(request.id) ? '처리중...' : '수락'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleRejectRequest(request.id)}
              disabled={processingIds.has(request.id)}
              className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
            >
              {processingIds.has(request.id) ? '처리중...' : '거절'}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};
