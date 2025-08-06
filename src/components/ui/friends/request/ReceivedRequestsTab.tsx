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

export const ReceivedRequestsTab = (): React.ReactNode => {
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
        const requests = response.data.data.map((request: any) => ({
          id: request.id || 0,
          senderId: request.senderId || 0,
          senderNickname: request.senderNickname || 'Unknown',
          senderProfile: request.senderProfile,
          status: request.status || 'PENDING',
          createdAt: request.createdAt || '',
        }));

        setReceivedRequests(requests);

        if (import.meta.env.DEV) {
          console.log('✅ [BACKEND] 받은 친구 요청 데이터:', requests);
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
      setProcessingIds(prev => new Set(prev).add(requestId));

      await api.api.approveFriendRequest(requestId);

      // 성공 시 목록에서 제거
      setReceivedRequests(prev =>
        prev.filter(request => request.id !== requestId)
      );

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
      setProcessingIds(prev => new Set(prev).add(requestId));

      await api.api.rejectFriendRequest(requestId);

      // 성공 시 목록에서 제거
      setReceivedRequests(prev =>
        prev.filter(request => request.id !== requestId)
      );

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
