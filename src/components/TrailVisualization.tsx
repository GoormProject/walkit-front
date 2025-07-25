import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import type { GeoJSONFeatureCollection, TrailPathData } from '../types/trail';
import { getTrailPaths } from '../utils/mockTrailApi';
import TrailPathLayer from './TrailPathLayer';
import LoadingSpinner from './LoadingSpinner';

interface TrailVisualizationProps {
  map: kakao.maps.Map | null;
  showTrailPaths?: boolean;
  selectedTrailId?: string;
  onTrailClick?: (trailId: string) => void;
  onTrailHover?: (trailId: string | null) => void;
}

const TrailVisualization: React.FC<TrailVisualizationProps> = ({
  map,
  showTrailPaths = true,
  selectedTrailId,
  onTrailClick,
  onTrailHover
}) => {
  const [trailData, setTrailData] = useState<GeoJSONFeatureCollection | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visibleTrails, setVisibleTrails] = useState<Set<string>>(new Set());

  // 경로 데이터 로드
  const loadTrailData = useCallback(async () => {
    if (!showTrailPaths) return;

    try {
      setIsLoading(true);
      setError(null);
      
      const data = await getTrailPaths();
      setTrailData(data);
      
      // 모든 경로를 기본적으로 보이도록 설정
      const allTrailIds = new Set(data.features.map(feature => feature.properties.id).filter(Boolean) as string[]);
      setVisibleTrails(allTrailIds);
      
    } catch (err) {
      console.error('경로 데이터 로드 실패:', err);
      setError('산책 경로를 불러오는 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [showTrailPaths]);

  // 코스 타입별 스타일 정의 (메모이제이션)
  const courseStyles = useMemo(() => ({
    easy: {
      strokeColor: '#4CAF50',
      strokeWeight: 3,
      strokeOpacity: 0.8,
      strokeStyle: 'solid' as const,
      markerColor: '#4CAF50'
    },
    medium: {
      strokeColor: '#FF9800',
      strokeWeight: 4,
      strokeOpacity: 0.8,
      strokeStyle: 'solid' as const,
      markerColor: '#FF9800'
    },
    hard: {
      strokeColor: '#F44336',
      strokeWeight: 5,
      strokeOpacity: 0.8,
      strokeStyle: 'solid' as const,
      markerColor: '#F44336'
    },
    scenic: {
      strokeColor: '#2196F3',
      strokeWeight: 4,
      strokeOpacity: 0.8,
      strokeStyle: 'dashed' as const,
      markerColor: '#2196F3'
    },
    unknown: {
      strokeColor: '#9E9E9E',
      strokeWeight: 3,
      strokeOpacity: 0.6,
      strokeStyle: 'solid' as const,
      markerColor: '#9E9E9E'
    }
  }), []);

  // GeoJSON을 카카오맵 형식으로 변환 (메모이제이션)
  const convertGeoJSONToTrailPaths = useCallback((geoJSON: GeoJSONFeatureCollection): TrailPathData[] => {
    return geoJSON.features
      .filter(feature => feature.geometry.type === 'LineString')
      .map(feature => {
        const coordinates = (feature.geometry.coordinates as [number, number][]).map(coord => 
          new kakao.maps.LatLng(coord[1], coord[0]) // GeoJSON은 [경도, 위도], 카카오맵은 [위도, 경도]
        );

        const courseType = feature.properties.courseType || 'unknown';
        const style = courseStyles[courseType as keyof typeof courseStyles] || courseStyles.unknown;

        return {
          id: feature.properties.id || `trail-${Math.random()}`,
          name: feature.properties.name || '이름 없는 경로',
          courseType,
          coordinates,
          style,
          properties: feature.properties
        };
      });
  }, [courseStyles]);

  // 경로 데이터가 변경될 때 변환 (메모이제이션)
  const convertedPaths = useMemo(() => {
    if (!trailData) return [];
    return convertGeoJSONToTrailPaths(trailData);
  }, [trailData, convertGeoJSONToTrailPaths]);

  // 필터링된 경로 (메모이제이션)
  const filteredPaths = useMemo(() => {
    return convertedPaths.filter(path => visibleTrails.has(path.id));
  }, [convertedPaths, visibleTrails]);

  // 초기 데이터 로드
  useEffect(() => {
    loadTrailData();
  }, [loadTrailData]);

  // 경로 토글 기능
  const toggleTrailVisibility = useCallback((trailId: string) => {
    setVisibleTrails(prev => {
      const newSet = new Set(prev);
      if (newSet.has(trailId)) {
        newSet.delete(trailId);
      } else {
        newSet.add(trailId);
      }
      return newSet;
    });
  }, []);

  // 모든 경로 표시/숨김
  const toggleAllTrails = useCallback((show: boolean) => {
    if (show) {
      const allTrailIds = new Set(convertedPaths.map(path => path.id));
      setVisibleTrails(allTrailIds);
    } else {
      setVisibleTrails(new Set());
    }
  }, [convertedPaths]);

  if (!map) {
    return null;
  }

  return (
    <div className="trail-visualization">
      {/* 로딩 상태 */}
      {isLoading && (
        <div className="absolute top-4 right-4 z-10">
          <LoadingSpinner 
            show={true} 
            message="산책 경로를 불러오는 중"
            size="small"
            variant="inline"
          />
        </div>
      )}

      {/* 에러 상태 */}
      {error && (
        <div className="absolute top-4 left-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-10">
          <strong className="font-bold">오류: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* 경로 레이어 */}
      {showTrailPaths && filteredPaths.length > 0 && (
        <TrailPathLayer
          map={map}
          paths={filteredPaths}
          selectedTrailId={selectedTrailId}
          onTrailClick={onTrailClick}
          onTrailHover={onTrailHover}
        />
      )}

      {/* 컨트롤 패널 */}
      {showTrailPaths && convertedPaths.length > 0 && (
        <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3 z-10">
          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-semibold text-gray-700">산책 경로</h4>
            <div className="flex gap-2">
              <button
                onClick={() => toggleAllTrails(true)}
                className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                모두 표시
              </button>
              <button
                onClick={() => toggleAllTrails(false)}
                className="px-2 py-1 text-xs bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                모두 숨김
              </button>
            </div>
            <div className="max-h-32 overflow-y-auto">
              {convertedPaths.map(path => (
                <div key={path.id} className="flex items-center gap-2 text-xs">
                  <input
                    type="checkbox"
                    checked={visibleTrails.has(path.id)}
                    onChange={() => toggleTrailVisibility(path.id)}
                    className="w-3 h-3"
                  />
                  <span 
                    className="flex-1 truncate cursor-pointer hover:text-blue-600"
                    onClick={() => onTrailClick?.(path.id)}
                  >
                    {path.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrailVisualization; 
