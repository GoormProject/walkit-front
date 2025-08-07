import React, { useState, useEffect } from 'react';
import { Api } from '@/api/swagger-api';

interface SentRequest {
  id: number;
  receiverId: number;
  receiverNickname: string;
  receiverProfile?: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
}

export const SentRequestsTab = (): React.ReactNode => {
  const [sentRequests, setSentRequests] = useState<SentRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const api = new Api({ withCredentials: true });

  const fetchSentRequests = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await api.api.getSentFriendRequests();

      if (response.data.data) {
        const requests = response.data.data.map((request: any) => ({
          id: request.id || 0,
          receiverId: request.receiverId || 0,
          receiverNickname: request.receiverNickname || 'Unknown',
          receiverProfile: request.receiverProfile,
          status: request.status || 'PENDING',
          createdAt: request.createdAt || '',
        }));

        setSentRequests(requests);

        if (import.meta.env.DEV) {
          console.log('✅ [BACKEND] 보낸 친구 요청 데이터:', requests);
        }
      }
    } catch (err) {
      console.error('❌ 보낸 친구 요청 가져오기 실패:', err);
      setError('보낸 친구 요청을 가져오는데 실패했습니다.');

      if (import.meta.env.DEV) {
        console.log('🔧 [DEV] 보낸 친구 요청 API 실패');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSentRequests();
  }, []);

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return '대기중';
      case 'ACCEPTED':
        return '수락됨';
      case 'REJECTED':
        return '거절됨';
      default:
        return '알 수 없음';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-100';
      case 'ACCEPTED':
        return 'text-green-600 bg-green-100';
      case 'REJECTED':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-gray-500">보낸 친구 요청을 불러오는 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-4">{error}</div>
        <button
          onClick={fetchSentRequests}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          다시 시도
        </button>
      </div>
    );
  }

  if (sentRequests.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500">보낸 친구 요청이 없습니다.</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {sentRequests.map(request => (
        <div
          key={request.id}
          className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg"
        >
          <div className="flex items-center gap-3">
            {/* 프로필 이미지 */}
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
              {request.receiverProfile ? (
                <img
                  src={request.receiverProfile}
                  alt={request.receiverNickname}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <span className="text-gray-600 text-lg">
                  {request.receiverNickname.charAt(0)}
                </span>
              )}
            </div>

            {/* 사용자 정보 */}
            <div>
              <div className="font-semibold text-gray-900">
                {request.receiverNickname}
              </div>
              <div className="text-sm text-gray-500">
                {new Date(request.createdAt).toLocaleDateString()}
              </div>
            </div>
          </div>

          {/* 상태 */}
          <div
            className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(request.status)}`}
          >
            {getStatusText(request.status)}
          </div>
        </div>
      ))}
    </div>
  );
};
