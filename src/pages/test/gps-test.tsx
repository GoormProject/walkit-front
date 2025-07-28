import React, { useEffect, useRef } from 'react';
import { KakaoMap } from '@/components/KakaoMap';
import { GPSSimulator } from '@/components/GPSSimulator';
import { MOCK_PATH_COORDS } from '@/utils/mockGPSData';

const GPSTestPage: React.FC = () => {
  // 폴리라인 객체 참조
  const polyline = useRef<kakao.maps.Polyline | null>(null);
  const map = useRef<kakao.maps.Map | null>(null);

  // 경로 표시
  useEffect(() => {
    if (!map.current) return;

    const path = MOCK_PATH_COORDS.map(coord => 
      new kakao.maps.LatLng(coord.lat, coord.lng)
    );

    polyline.current = new kakao.maps.Polyline({
      path,
      strokeWeight: 3,
      strokeColor: '#db4040',
      strokeOpacity: 0.7,
      strokeStyle: 'solid'
    });

    polyline.current.setMap(map.current);

    return () => {
      if (polyline.current) {
        polyline.current.setMap(null);
      }
    };
  }, []);

  // 위치 변경 핸들러
  const handlePositionChange = (lat: number, lng: number) => {
    if (!map.current) return;
    
    const position = new kakao.maps.LatLng(lat, lng);
    map.current.setCenter(position);
  };

  return (
    <div className="w-full h-screen relative">
      {/* 상단 설명 */}
      <div className="absolute top-4 left-4 z-10 bg-white p-4 rounded shadow">
        <h1 className="text-2xl font-bold mb-2">GPS 테스트</h1>
        <p className="text-gray-600">
          시뮬레이터를 사용하여 GPS 위치, 정확도, 에러 상황을 테스트할 수 있습니다.
        </p>
      </div>

      {/* 지도 */}
      <div className="w-full h-[calc(100vh-80px)]">
        <KakaoMap onMapLoad={(mapInstance) => { map.current = mapInstance; }} />
      </div>
      
      {/* 시뮬레이터 */}
      <div className="fixed right-4 top-20 z-50">
        <GPSSimulator onPositionChange={handlePositionChange} />
      </div>
    </div>
  );
};

export default GPSTestPage; 
