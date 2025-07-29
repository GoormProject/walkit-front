import React, { useState } from 'react';
import { useTrailPathsSafe } from '../../hooks/useTrailPaths';
import { useWalkPaths } from '../../hooks/useWalkRecords';

import { parseWktLineString } from '@/utils/converter';
import { getApiModeInfo } from '@/utils/backendApi';
import { getCourseStyle } from '@/utils/converter';

const TestPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'trail' | 'walk' | 'converter'>('trail');
  
  // API 모드 정보
  const apiModeInfo = getApiModeInfo();

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">🧪 개발 테스트 페이지</h1>
      
      {/* 빠른 테스트 링크 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <a
          href="/test/trail-visualization"
          className="bg-blue-500 text-white p-4 rounded-lg text-center hover:bg-blue-600 transition-colors"
        >
          🗺️ 경로 시각화
        </a>
        <a
          href="/test/gps"
          className="bg-green-500 text-white p-4 rounded-lg text-center hover:bg-green-600 transition-colors"
        >
          📍 GPS 테스트
        </a>
        <a
          href="/test/trail-progress"
          className="bg-purple-500 text-white p-4 rounded-lg text-center hover:bg-purple-600 transition-colors"
        >
          🚶‍♂️ 진행률 추적
        </a>
        <a
          href="/test/bottom-sheet"
          className="bg-orange-500 text-white p-4 rounded-lg text-center hover:bg-orange-600 transition-colors"
        >
          📱 BottomSheet
        </a>
      </div>
      
      {/* API 모드 정보 */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-2">🔧 API 모드 정보</h2>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <strong>모드:</strong> {apiModeInfo.isMock ? 'Mock API' : '실제 API'}
          </div>
          <div>
            <strong>환경:</strong> {apiModeInfo.environment}
          </div>
          <div>
            <strong>Base URL:</strong> {apiModeInfo.baseUrl || '설정되지 않음'}
          </div>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="flex space-x-1 mb-6">
        <button
          onClick={() => setActiveTab('trail')}
          className={`px-4 py-2 rounded-lg font-medium ${
            activeTab === 'trail'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          🗺️ 산책 경로 API
        </button>
        <button
          onClick={() => setActiveTab('walk')}
          className={`px-4 py-2 rounded-lg font-medium ${
            activeTab === 'walk'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          📝 산책 기록 API
        </button>
        <button
          onClick={() => setActiveTab('converter')}
          className={`px-4 py-2 rounded-lg font-medium ${
            activeTab === 'converter'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          🔄 변환 유틸리티
        </button>
      </div>

      {/* 탭 컨텐츠 */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        {activeTab === 'trail' && <TrailApiTest />}
        {activeTab === 'walk' && <WalkApiTest />}
        {activeTab === 'converter' && <ConverterTest />}
      </div>
    </div>
  );
};

// 산책 경로 API 테스트 컴포넌트
const TrailApiTest: React.FC = () => {
  const { trailPaths, isLoading, error, refetch } = useTrailPathsSafe();

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">🗺️ 산책 경로 API 테스트</h2>
      
      <div className="mb-4">
        <button
          onClick={refetch}
          disabled={isLoading}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50"
        >
          {isLoading ? '로딩 중...' : '데이터 새로고침'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          <strong>오류:</strong> {error}
        </div>
      )}

      {isLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">데이터를 불러오는 중...</p>
        </div>
      )}

      {!isLoading && !error && (
        <div>
          <h3 className="text-lg font-medium mb-3">수신된 경로 데이터 ({trailPaths.length}개)</h3>
          <div className="space-y-4">
            {trailPaths.map((path, index) => (
              <div key={path.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-lg">{path.name}</h4>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    path.courseType === 'easy' ? 'bg-green-100 text-green-800' :
                    path.courseType === 'medium' ? 'bg-orange-100 text-orange-800' :
                    path.courseType === 'hard' ? 'bg-red-100 text-red-800' :
                    path.courseType === 'scenic' ? 'bg-blue-100 text-blue-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {path.courseType}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-2">{path.properties.description}</p>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div><strong>거리:</strong> {path.properties.distance}km</div>
                  <div><strong>소요시간:</strong> {path.properties.duration}분</div>
                  <div><strong>좌표 수:</strong> {path.coordinates.length}개</div>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  <strong>스타일:</strong> {path.style.strokeColor}, {path.style.strokeWeight}px, {path.style.strokeStyle}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// 산책 기록 API 테스트 컴포넌트
const WalkApiTest: React.FC = () => {
  const { walkPaths, isLoading, error, refetch } = useWalkPaths();

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">📝 산책 기록 API 테스트</h2>
      
      <div className="mb-4">
        <button
          onClick={refetch}
          disabled={isLoading}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50"
        >
          {isLoading ? '로딩 중...' : '데이터 새로고침'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          <strong>오류:</strong> {error}
        </div>
      )}

      {isLoading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">데이터를 불러오는 중...</p>
        </div>
      )}

      {!isLoading && !error && (
        <div>
          <h3 className="text-lg font-medium mb-3">수신된 경로 데이터 ({walkPaths.length}개)</h3>
          <div className="space-y-4">
            {walkPaths.map((path) => (
              <div key={path.pathId} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-lg">{path.name}</h4>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    path.courseType === 'easy' ? 'bg-green-100 text-green-800' :
                    path.courseType === 'medium' ? 'bg-orange-100 text-orange-800' :
                    path.courseType === 'hard' ? 'bg-red-100 text-red-800' :
                    path.courseType === 'scenic' ? 'bg-blue-100 text-blue-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {path.courseType}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-2">{path.description}</p>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div><strong>거리:</strong> {path.distance}km</div>
                  <div><strong>소요시간:</strong> {path.duration}분</div>
                  <div><strong>난이도:</strong> {path.difficulty}</div>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  <strong>WKT:</strong> {path.path.substring(0, 50)}...
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// 변환 유틸리티 테스트 컴포넌트
const ConverterTest: React.FC = () => {
  const [wktInput, setWktInput] = useState('LINESTRING(126.9780 37.5665, 126.9790 37.5675, 126.9800 37.5685)');
  const [parsedCoordinates, setParsedCoordinates] = useState<[number, number][]>([]);
  const [parseError, setParseError] = useState<string | null>(null);

  const testWktParsing = () => {
    try {
      setParseError(null);
      const coordinates = parseWktLineString(wktInput);
      setParsedCoordinates(coordinates);
    } catch (error) {
      setParseError(error instanceof Error ? error.message : '알 수 없는 오류');
      setParsedCoordinates([]);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">🔄 변환 유틸리티 테스트</h2>
      
      <div className="space-y-6">
        {/* WKT 파싱 테스트 */}
        <div>
          <h3 className="text-lg font-medium mb-3">WKT LINESTRING 파싱 테스트</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                WKT LINESTRING 입력:
              </label>
              <textarea
                value={wktInput}
                onChange={(e) => setWktInput(e.target.value)}
                className="w-full h-20 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="LINESTRING(경도1 위도1, 경도2 위도2, ...)"
              />
            </div>
            <button
              onClick={testWktParsing}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              파싱 테스트
            </button>
            
            {parseError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                <strong>파싱 오류:</strong> {parseError}
              </div>
            )}
            
            {parsedCoordinates.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h4 className="font-medium text-green-800 mb-2">파싱 결과 ({parsedCoordinates.length}개 좌표)</h4>
                <div className="space-y-1">
                  {parsedCoordinates.map((coord, index) => (
                    <div key={index} className="text-sm text-green-700">
                      Point {index + 1}: 경도 {coord[0].toFixed(6)}, 위도 {coord[1].toFixed(6)}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

                {/* 스타일 테스트 */}
        <div>
          <h3 className="text-lg font-medium mb-3">코스별 스타일 테스트</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {['easy', 'medium', 'hard', 'scenic', 'default'].map((courseType) => {
              const courseStyle = getCourseStyle(courseType);
              const style = {
                color: courseStyle.strokeColor,
                weight: courseStyle.strokeWeight,
                style: courseStyle.strokeStyle === 'dashed' ? 'dashed' : 'solid'
              };

              return (
                <div key={courseType} className="border border-gray-200 rounded-lg p-3 text-center">
                  <div className="text-sm font-medium mb-2">{courseType}</div>
                  <div 
                    className="h-4 rounded mb-2"
                    style={{
                      backgroundColor: style.color,
                      opacity: courseStyle.strokeOpacity,
                      borderTop: style.style === 'dashed' ? '2px dashed white' : 'none'
                    }}
                  ></div>
                  <div className="text-xs text-gray-600">
                    {style.color}, {style.weight}px, {style.style}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPage; 
