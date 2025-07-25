import React, { useState } from 'react';
import KakaoMap from '../../components/KakaoMap';

const TrailVisualizationTest: React.FC = () => {
  const [showTrailPaths, setShowTrailPaths] = useState(true);
  const [selectedTrailId, setSelectedTrailId] = useState<string | undefined>();

  const handleTrailClick = (trailId: string) => {
    console.log('경로 클릭:', trailId);
    setSelectedTrailId(trailId);
  };

  const handleTrailHover = (trailId: string | null) => {
    console.log('경로 호버:', trailId);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            🗺️ 산책 경로 시각화 테스트
          </h1>
          <p className="text-gray-600 mb-4">
            카카오맵에 산책 경로를 표시하고 인터랙션을 테스트합니다.
          </p>
          
          <div className="flex gap-4 mb-4">
            <button
              onClick={() => setShowTrailPaths(!showTrailPaths)}
              className={`px-4 py-2 rounded-lg font-medium ${
                showTrailPaths 
                  ? 'bg-green-500 text-white hover:bg-green-600' 
                  : 'bg-gray-500 text-white hover:bg-gray-600'
              }`}
            >
              {showTrailPaths ? '경로 숨기기' : '경로 표시'}
            </button>
            
            <button
              onClick={() => setSelectedTrailId(undefined)}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
            >
              선택 해제
            </button>
          </div>

          {selectedTrailId && (
            <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-4">
              <strong>선택된 경로:</strong> {selectedTrailId}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <KakaoMap
            showTrailPaths={showTrailPaths}
            selectedTrailId={selectedTrailId}
            onTrailClick={handleTrailClick}
            onTrailHover={handleTrailHover}
          />
        </div>

        <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            📋 테스트 가이드
          </h2>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• <strong>경로 표시/숨김:</strong> 상단 버튼으로 모든 산책 경로를 토글할 수 있습니다.</p>
            <p>• <strong>경로 클릭:</strong> 지도상의 경로를 클릭하면 해당 경로가 선택됩니다.</p>
            <p>• <strong>경로 호버:</strong> 마우스를 경로 위에 올리면 하이라이트됩니다.</p>
            <p>• <strong>개별 토글:</strong> 좌상단 패널에서 개별 경로를 표시/숨김할 수 있습니다.</p>
            <p>• <strong>컬러 코딩:</strong> 
              <span className="text-green-600">초록색</span> (쉬움), 
              <span className="text-orange-600">주황색</span> (보통), 
              <span className="text-red-600">빨간색</span> (어려움), 
              <span className="text-blue-600">파란색</span> (전망)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrailVisualizationTest; 
