import React, { useEffect, useState } from 'react';

const SimpleMapTest: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadKakaoMap = async () => {
      try {
        // 환경 변수 확인
        const apiKey = import.meta.env.VITE_KAKAO_MAP_API_KEY;
        console.log('API Key:', apiKey ? '설정됨' : '설정되지 않음');

        if (!apiKey) {
          throw new Error('카카오맵 API 키가 설정되지 않았습니다.');
        }

        // 카카오맵 SDK 로드
        if (!window.kakao) {
          const script = document.createElement('script');
          script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${apiKey}&autoload=false`;
          script.async = true;
          
          script.onload = () => {
            window.kakao.maps.load(() => {
              console.log('카카오맵 SDK 로드 완료');
              createMap();
            });
          };
          
          script.onerror = () => {
            throw new Error('카카오맵 SDK 로드 실패');
          };
          
          document.head.appendChild(script);
        } else {
          createMap();
        }
      } catch (err) {
        console.error('카카오맵 초기화 실패:', err);
        setError(err instanceof Error ? err.message : '알 수 없는 오류');
        setIsLoading(false);
      }
    };

    const createMap = () => {
      const container = document.getElementById('map');
      if (!container) {
        throw new Error('지도 컨테이너를 찾을 수 없습니다.');
      }

      const map = new window.kakao.maps.Map(container, {
        center: new window.kakao.maps.LatLng(37.5665, 126.9780), // 서울 시청
        level: 3
      });

      console.log('지도 생성 완료:', map);
      setIsLoading(false);
    };

    loadKakaoMap();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          🗺️ 카카오맵 단순 테스트
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">카카오맵 표시 테스트</h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <strong>오류:</strong> {error}
            </div>
          )}
          
          {isLoading && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-2">카카오맵 로딩 중...</span>
            </div>
          )}
          
          <div 
            id="map" 
            className="w-full h-96 rounded-lg border-2 border-gray-300"
            style={{ minHeight: '400px' }}
          >
            {!isLoading && !error && (
              <div className="flex items-center justify-center h-full text-gray-500">
                지도가 여기에 표시됩니다...
              </div>
            )}
          </div>
          
          <div className="mt-4 text-sm text-gray-600">
            <p><strong>API 키:</strong> {import.meta.env.VITE_KAKAO_MAP_API_KEY ? '설정됨' : '설정되지 않음'}</p>
            <p><strong>환경:</strong> {import.meta.env.MODE}</p>
            <p><strong>Base URL:</strong> {import.meta.env.BASE_URL}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleMapTest; 
