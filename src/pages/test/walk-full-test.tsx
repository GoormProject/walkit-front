import React, { useState, useRef, useEffect, useCallback } from 'react';
import { toast, Toaster } from 'sonner';
import KakaoMap from '@/components/KakaoMap';
import { GPSTracker } from '@/components/GPSTracker';
import { useWalkStore } from '@/features/walk/walkSlice';
import { useGPSStore } from '@/features/gps/gpsSlice';
import { calculateDistance as calculateCoordinateDistance } from '@/utils/converter/pathConverter';
import type { WalkCreateRequest } from '@/types/walk';

const WalkFullTest: React.FC = () => {
  const [map, setMap] = useState<kakao.maps.Map | null>(null);
  const [pathPositions, setPathPositions] = useState<kakao.maps.LatLng[]>([]);
  const polyline = useRef<kakao.maps.Polyline | null>(null);
  
  // 인증 관련 상태
  const [accessToken, setAccessToken] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  // Walk Store
  const {
    currentWalk,
    walkRecords,
    isLoading,
    error,
    actions: walkActions,
  } = useWalkStore();
  
  // GPS Store
  const { position, error: gpsError } = useGPSStore();

  // 컴포넌트 마운트 시 토큰 확인
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setAccessToken(token);
      setIsAuthenticated(true);
    }
    
    // 쿠키에서 토큰 확인
    const cookies = document.cookie.split(';');
    const accessTokenCookie = cookies.find(cookie => 
      cookie.trim().startsWith('ACCESS_TOKEN=')
    );
    
    if (accessTokenCookie) {
      const tokenValue = accessTokenCookie.split('=')[1];
      console.log('🍪 쿠키에서 발견된 ACCESS_TOKEN:', tokenValue);
      setAccessToken(tokenValue);
      setIsAuthenticated(true);
    }
  }, []);

  // 쿠키에서 토큰 가져오기
  const handleGetCookieToken = () => {
    const cookies = document.cookie.split(';');
    const accessTokenCookie = cookies.find(cookie => 
      cookie.trim().startsWith('ACCESS_TOKEN=')
    );
    
    if (accessTokenCookie) {
      const tokenValue = accessTokenCookie.split('=')[1];
      setAccessToken(tokenValue);
      localStorage.setItem('accessToken', tokenValue);
      setIsAuthenticated(true);
      toast.success('쿠키에서 토큰을 가져왔습니다!');
    } else {
      toast.error('쿠키에서 ACCESS_TOKEN을 찾을 수 없습니다.');
    }
  };

  // 모든 쿠키 확인
  const handleShowAllCookies = () => {
    const cookies = document.cookie.split(';');
    console.log('🍪 모든 쿠키:', cookies);
    console.log('🍪 쿠키 개수:', cookies.length);
    console.log('🍪 document.cookie:', document.cookie);
    
    if (cookies.length === 0 || (cookies.length === 1 && cookies[0].trim() === '')) {
      toast.error('쿠키가 없습니다. 로그인이 필요합니다.');
      console.log('❌ 쿠키가 없습니다. OAuth 로그인을 먼저 수행해주세요.');
    } else {
      toast.success('콘솔에서 모든 쿠키를 확인하세요.');
      cookies.forEach((cookie, index) => {
        console.log(`🍪 쿠키 ${index + 1}:`, cookie.trim());
      });
    }
  };

  // OAuth 로그인 링크 생성
  const handleShowOAuthLinks = () => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
    const kakaoUrl = `${baseUrl}/oauth2/authorization/kakao`;
    const googleUrl = `${baseUrl}/oauth2/authorization/google`;
    
    console.log('🔗 OAuth 로그인 링크:');
    console.log('📱 카카오 로그인:', kakaoUrl);
    console.log('🔍 구글 로그인:', googleUrl);
    
    toast.info('콘솔에서 OAuth 로그인 링크를 확인하세요.');
  };

  // 토큰 설정
  const handleSetToken = () => {
    if (accessToken.trim()) {
      localStorage.setItem('accessToken', accessToken);
      setIsAuthenticated(true);
      toast.success('토큰이 설정되었습니다!');
    } else {
      toast.error('토큰을 입력해주세요.');
    }
  };

  // 로그아웃
  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    setAccessToken('');
    setIsAuthenticated(false);
    toast.success('로그아웃되었습니다.');
  };

  // 테스트용 토큰 설정
  const handleSetTestToken = () => {
    const testToken = 'test-token-12345';
    localStorage.setItem('accessToken', testToken);
    setAccessToken(testToken);
    setIsAuthenticated(true);
    toast.success('테스트 토큰이 설정되었습니다!');
  };

  // 총 거리 계산 함수
  const calculateTotalDistance = (positions: kakao.maps.LatLng[]): number => {
    if (positions.length < 2) return 0;
    
    let totalDistance = 0;
    for (let i = 1; i < positions.length; i++) {
      totalDistance += calculateCoordinateDistance(
        { lat: positions[i - 1].getLat(), lng: positions[i - 1].getLng() },
        { lat: positions[i].getLat(), lng: positions[i].getLng() }
      );
    }
    return totalDistance;
  };

  // 위치 업데이트 시 경로 그리기 및 저장 (메모이제이션)
  const handlePositionUpdate = useCallback((position: kakao.maps.LatLng) => {
    if (currentWalk.status === 'walking') {
      setPathPositions(prev => [...prev, position]);
      
      // Walk Store에 좌표 추가
      walkActions.addPathCoordinate([position.getLng(), position.getLat()]);
    }
  }, [currentWalk.status, walkActions]);

  // 산책 시작
  const handleStartWalk = async () => {
    try {
      await walkActions.startWalk();
      setPathPositions([]);
      toast.success('산책을 시작합니다!', {
        description: 'GPS 신호가 안정적인 실외에서 이용해주세요.',
      });
    } catch (error) {
      toast.error('산책 시작에 실패했습니다.');
    }
  };

  // 산책 일시정지
  const handlePauseWalk = async () => {
    try {
      await walkActions.pauseWalk();
      toast.success('산책이 일시정지되었습니다.');
    } catch (error) {
      toast.error('산책 일시정지에 실패했습니다.');
    }
  };

  // 산책 재개
  const handleResumeWalk = async () => {
    try {
      await walkActions.resumeWalk();
      toast.success('산책이 재개되었습니다.');
    } catch (error) {
      toast.error('산책 재개에 실패했습니다.');
    }
  };

  // 산책 종료
  const handleEndWalk = async () => {
    try {
      const pathCoordinates = pathPositions.map(pos => [pos.getLng(), pos.getLat()]);
      await walkActions.endWalk(pathCoordinates);
      
      const totalDistance = calculateTotalDistance(pathPositions);
      toast.success('산책이 종료되었습니다!', {
        description: `총 거리: ${totalDistance.toFixed(2)}km`,
      });
    } catch (error) {
      toast.error('산책 종료에 실패했습니다.');
    }
  };

  // 산책 기록 등록
  const handleRegisterWalk = async () => {
    if (!currentWalk.walkId || !currentWalk.eventId) {
      toast.error('먼저 산책을 시작하고 종료해주세요.');
      return;
    }

    const totalDistance = calculateTotalDistance(pathPositions);
    const totalTime = currentWalk.startTime 
      ? Math.floor((new Date().getTime() - new Date(currentWalk.startTime).getTime()) / 1000)
      : 0;
    const pace = totalTime > 0 ? (totalDistance * 1000) / totalTime : 0; // m/s

    const walkData: WalkCreateRequest = {
      walkId: currentWalk.walkId,
      walkTitle: `테스트 산책 기록 - ${new Date().toLocaleDateString()}`,
      totalTime,
      totalDistance: totalDistance * 1000, // km -> m
      pace,
      path: currentWalk.path,
      startPoint: currentWalk.path[0] || [0, 0],
      eventId: currentWalk.eventId,
      eventType: 'END',
      routeUrl: 'https://example.com/route-image.jpg',
    };

    try {
      await walkActions.createWalk(walkData);
      toast.success('산책 기록이 등록되었습니다!');
    } catch (error) {
      toast.error('산책 기록 등록에 실패했습니다.');
    }
  };

  // 산책 기록 목록 조회
  const handleGetWalkRecords = async () => {
    try {
      await walkActions.getWalkRecords();
      toast.success('산책 기록 목록을 조회했습니다.');
    } catch (error) {
      toast.error('산책 기록 목록 조회에 실패했습니다.');
    }
  };

  // 산책 기록 삭제
  const handleDeleteWalk = async (walkId: number) => {
    try {
      await walkActions.deleteWalk(walkId);
      toast.success('산책 기록이 삭제되었습니다.');
    } catch (error) {
      toast.error('산책 기록 삭제에 실패했습니다.');
    }
  };

  // 경로 표시 업데이트
  useEffect(() => {
    if (!map) return;

    // 기존 폴리라인 제거
    if (polyline.current) {
      polyline.current.setMap(null);
    }

    // 새 폴리라인 생성
    polyline.current = new kakao.maps.Polyline({
      map: map,
      path: pathPositions,
      strokeWeight: 4,
      strokeColor: '#3b82f6',
      strokeOpacity: 0.8,
      strokeStyle: 'solid',
    });

    return () => {
      if (polyline.current) {
        polyline.current.setMap(null);
      }
    };
  }, [pathPositions, map]);

  // 컴포넌트 마운트 시 산책 기록 목록 조회
  useEffect(() => {
    walkActions.getWalkRecords();
  }, [walkActions]);

  return (
    <div className="flex flex-col h-screen">
      <Toaster position="top-center" richColors />

      {/* 헤더 */}
      <div className="bg-white p-4 shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">산책 통합 테스트</h1>
        <p className="text-gray-600">GPS + 지도 + API 통합 테스트</p>
      </div>

      {/* 지도 영역 */}
      <div className="relative flex-1">
        <KakaoMap
          onMapLoad={mapInstance => {
            setMap(mapInstance);
          }}
        />
        {map && (
          <GPSTracker
            map={map}
            onPositionUpdate={handlePositionUpdate}
          />
        )}

        {/* 상단 컨트롤 */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
          <div className="flex gap-2">
            <button className="p-2 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-all">
              <span className="material-icons text-gray-700">menu</span>
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            {/* 인증 상태 표시 */}
            <div className="flex items-center gap-1 px-2 py-1 bg-white rounded-full shadow-lg text-xs">
              {isAuthenticated ? (
                <span className="text-green-500">✅ 인증됨</span>
              ) : (
                <span className="text-red-500">❌ 인증 필요</span>
              )}
            </div>

            {/* GPS 상태 표시 */}
            <div className="flex items-center gap-1 px-2 py-1 bg-white rounded-full shadow-lg text-xs">
              {gpsError ? (
                <span className="text-red-500">❌ GPS 오류</span>
              ) : position ? (
                <span className="text-green-500">✅ GPS 연결됨</span>
              ) : (
                <span className="text-gray-500">⏳ GPS 대기중</span>
              )}
            </div>

            {/* 산책 상태 표시 */}
            <div className="flex items-center gap-1 px-2 py-1 bg-white rounded-full shadow-lg text-xs">
              {currentWalk.status === 'idle' && (
                <span className="text-gray-500">⏳ 대기중</span>
              )}
              {currentWalk.status === 'walking' && (
                <span className="text-green-500">🚶 산책중</span>
              )}
              {currentWalk.status === 'paused' && (
                <span className="text-yellow-500">⏸️ 일시정지</span>
              )}
              {currentWalk.status === 'completed' && (
                <span className="text-blue-500">🏁 완료</span>
              )}
            </div>

            {/* 산책 컨트롤 버튼 */}
            {currentWalk.status === 'idle' && (
              <button
                onClick={handleStartWalk}
                disabled={isLoading || !!gpsError || !isAuthenticated}
                className="px-4 py-2 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
              >
                {isLoading ? '시작중...' : '산책 시작'}
              </button>
            )}

            {currentWalk.status === 'walking' && (
              <div className="flex gap-2">
                <button
                  onClick={handlePauseWalk}
                  disabled={isLoading}
                  className="px-4 py-2 bg-yellow-500 text-white rounded-full shadow-lg hover:bg-yellow-600 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
                >
                  {isLoading ? '일시정지중...' : '일시정지'}
                </button>
                <button
                  onClick={handleEndWalk}
                  disabled={isLoading}
                  className="px-4 py-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
                >
                  {isLoading ? '종료중...' : '산책 종료'}
                </button>
              </div>
            )}

            {currentWalk.status === 'paused' && (
              <div className="flex gap-2">
                <button
                  onClick={handleResumeWalk}
                  disabled={isLoading}
                  className="px-4 py-2 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
                >
                  {isLoading ? '재개중...' : '재개'}
                </button>
                <button
                  onClick={handleEndWalk}
                  disabled={isLoading}
                  className="px-4 py-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
                >
                  {isLoading ? '종료중...' : '산책 종료'}
                </button>
              </div>
            )}

            {currentWalk.status === 'completed' && (
              <div className="flex gap-2">
                <button
                  onClick={handleRegisterWalk}
                  disabled={isLoading}
                  className="px-4 py-2 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
                >
                  {isLoading ? '등록중...' : '기록 등록'}
                </button>
                <button
                  onClick={() => walkActions.resetWalk()}
                  className="px-4 py-2 bg-gray-500 text-white rounded-full shadow-lg hover:bg-gray-600 transition-all font-medium"
                >
                  초기화
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 인증 컨트롤 패널 */}
        <div className="absolute top-20 left-4 right-4 bg-white p-4 rounded-lg shadow-lg z-10">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Access Token을 입력하세요"
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
              />
            </div>
            <button
              onClick={handleSetToken}
              disabled={isLoading || !accessToken.trim()}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
            >
              {isLoading ? '설정중...' : '토큰 설정'}
            </button>
            <button
              onClick={handleSetTestToken}
              disabled={isLoading}
              className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
            >
              테스트 토큰
            </button>
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                disabled={isLoading}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
              >
                {isLoading ? '로그아웃중...' : '로그아웃'}
              </button>
            )}
            <button
              onClick={handleGetCookieToken}
              disabled={isLoading}
              className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
            >
              {isLoading ? '쿠키 토큰 가져오기...' : '쿠키 토큰 가져오기'}
            </button>
            <button
              onClick={handleShowAllCookies}
              disabled={isLoading}
              className="px-4 py-2 bg-teal-500 text-white rounded-md hover:bg-teal-600 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
            >
              {isLoading ? '모든 쿠키 보기...' : '모든 쿠키 보기'}
            </button>
            <button
              onClick={handleShowOAuthLinks}
              disabled={isLoading}
              className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
            >
              {isLoading ? 'OAuth 링크 보기...' : 'OAuth 링크 보기'}
            </button>
          </div>
        </div>
      </div>

      {/* 하단 패널 */}
      <div className="bg-white p-4 shadow-md max-h-80 overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">산책 기록 목록</h2>
          <button
            onClick={handleGetWalkRecords}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
          >
            {isLoading ? '조회중...' : '새로고침'}
          </button>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* 산책 기록 목록 */}
        <div className="overflow-y-auto max-h-32">
          {walkRecords.length === 0 ? (
            <p className="text-gray-500 text-center py-4">산책 기록이 없습니다.</p>
          ) : (
            <div className="space-y-2">
              {walkRecords.map((record) => (
                <div
                  key={record.walkId}
                  className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium truncate">{record.title}</h3>
                    <p className="text-sm text-gray-600">
                      거리: {(record.totalDistance / 1000).toFixed(2)}km | 
                      시간: {Math.floor(record.totalTime / 60)}분 | 
                      속도: {record.pace.toFixed(2)}m/s
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(record.eventTime).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteWalk(record.walkId)}
                    disabled={isLoading}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed text-sm font-medium ml-2 flex-shrink-0"
                  >
                    삭제
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 현재 산책 정보 */}
        {currentWalk.walkId && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-blue-800">현재 산책 정보</h3>
            <p className="text-sm text-blue-600">
              Walk ID: {currentWalk.walkId} | 
              Event ID: {currentWalk.eventId} | 
              상태: {currentWalk.status} | 
              경로 포인트: {currentWalk.path.length}개
            </p>
            {currentWalk.startTime && (
              <p className="text-sm text-blue-600">
                시작 시간: {new Date(currentWalk.startTime).toLocaleString()}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default WalkFullTest; 
