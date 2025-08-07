import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getWalkDetail } from '../../utils/walkApi';
import { registerTrail, getAddressFromCoordinates } from '../../utils/trailApi';
import { formatDistance } from '../../utils/walkUtils';
import type { WalkDetail } from '../../types/walk';
import type { TrailRegisterRequest } from '../../types/trail';

const TrailRegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { walkId } = useParams<{ walkId: string }>();
  const [walk, setWalk] = useState<WalkDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // 폼 상태
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');

  // 산책 기록 상세 정보 로드
  useEffect(() => {
    const loadWalkDetail = async () => {
      if (!walkId) {
        setError('산책 기록 ID가 없습니다.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        const response = await getWalkDetail(parseInt(walkId, 10));
        
        if (response.data) {
          setWalk(response.data);
          setTitle(response.data.title || '');
          
          // 시작점 좌표로 주소 가져오기
          if (response.data.startPoint && response.data.startPoint.length === 2) {
            const address = await getAddressFromCoordinates(
              response.data.startPoint[0],
              response.data.startPoint[1]
            );
            setLocation(address);
          }
        }
      } catch (err) {
        console.error('산책 기록 상세 조회 실패:', err);
        setError('산책 기록을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadWalkDetail();
  }, [walkId]);

  // 산책로 등록 처리
  const handleSubmit = async () => {
    if (!walk || !title.trim() || !description.trim()) {
      setError('제목과 설명을 모두 입력해주세요.');
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const request: TrailRegisterRequest = {
        walkId: walk.walkId,
        title: title.trim(),
        description: description.trim(),
        location: location,
        length: walk.totalDistance / 1000, // m를 km로 변환
        routeImageUrl: walk.routeImageUrl || '',
        pathId: walk.walkId, // 임시로 walkId 사용
        startPoint: walk.startPoint,
        path: walk.path,
        isUploaded: false,
      };

      const response = await registerTrail(request);
      
      if (response.httpStatus === 200) {
        alert('산책로가 성공적으로 등록되었습니다!');
        navigate('/walk-history');
      } else {
        setError(response.message || '산책로 등록에 실패했습니다.');
      }
    } catch (err) {
      console.error('산책로 등록 실패:', err);
      setError('산책로 등록 중 오류가 발생했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">산책 기록을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error || !walk) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || '산책 기록을 찾을 수 없습니다.'}</p>
          <button
            onClick={() => navigate('/walk-history')}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center">
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-800 mr-4"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-lg font-bold text-gray-900">내 산책로 공유하기</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* 산책로 제목 */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex items-center space-x-3">
            <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="산책로 이름을 입력하세요"
              className="flex-1 text-lg font-medium text-gray-900 border-none outline-none bg-transparent"
              maxLength={50}
            />
          </div>
        </div>

        {/* 지도 영역 */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="h-64 bg-gray-200 relative">
            {/* 실제 지도 컴포넌트가 들어갈 자리 */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
                </svg>
                <p>산책 경로 지도</p>
                <p className="text-sm">총 거리: {formatDistance(walk.totalDistance)}</p>
              </div>
            </div>
            
            {/* 지도 컨트롤 */}
            <div className="absolute top-2 right-2 flex space-x-1">
              <button className="bg-white px-2 py-1 rounded text-xs shadow-sm">지도</button>
              <button className="bg-white px-2 py-1 rounded text-xs shadow-sm">스카이뷰</button>
            </div>
          </div>
        </div>

        {/* 설명 입력 */}
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="다른 유저들이 참고할 수 있도록 산책로 설명을 남겨주세요."
            className="w-full h-32 resize-none border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            maxLength={100}
          />
          <div className="flex justify-between items-center mt-2">
            <p className="text-xs text-gray-500">설명 작성 시 주의사항</p>
            <span className="text-xs text-gray-500">{description.length}/100</span>
          </div>
        </div>

        {/* 오류 메시지 */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* 공유하기 버튼 */}
        <button
          onClick={handleSubmit}
          disabled={submitting || !title.trim() || !description.trim()}
          className="w-full bg-green-500 text-white py-4 rounded-lg font-medium hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? '등록 중...' : '공유하기'}
        </button>
      </div>
    </div>
  );
};

export default TrailRegisterPage; 
