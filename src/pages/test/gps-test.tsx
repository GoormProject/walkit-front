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
    <div className="w-full h-screen flex flex-col">
      {/* 상단 설명 */}
      <div className="p-4 bg-white shadow-sm">
        <h1 className="text-2xl font-bold mb-2">GPS 테스트</h1>
        <p className="text-gray-600">
          시뮬레이터를 사용하여 GPS 위치, 정확도, 에러 상황을 테스트할 수 있습니다.
        </p>
      </div>

      {/* 메인 컨텐츠 영역 */}
      <div className="flex-1 flex">
        {/* 지도 */}
        <div className="flex-1 relative">
          <KakaoMap onMapLoad={(mapInstance) => { map.current = mapInstance; }} />
        </div>

        {/* 시뮬레이터 */}
        <div className="w-[300px] p-4 bg-gray-50 border-l border-gray-200">
          <GPSSimulator onPositionChange={handlePositionChange} />
        </div>
      </div>
    </div>
  );
};

export default GPSTestPage; 
