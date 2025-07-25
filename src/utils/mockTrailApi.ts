import type { GeoJSONFeatureCollection } from '../types/trail';

/**
 * Mock 산책 경로 데이터
 * 실제 API 응답과 동일한 구조로 설계
 */
const mockTrailPaths: GeoJSONFeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [
          [126.9780, 37.5665], // 서울시청
          [126.9790, 37.5675],
          [126.9800, 37.5685],
          [126.9810, 37.5695],
          [126.9820, 37.5705]
        ]
      },
      properties: {
        id: 'trail-1',
        name: '한강 산책로 (여의도)',
        courseType: 'easy',
        difficulty: '쉬움',
        distance: 2.5,
        duration: 30,
        description: '한강변을 따라 걷는 편안한 산책로'
      }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [
          [126.9850, 37.5715],
          [126.9860, 37.5725],
          [126.9870, 37.5735],
          [126.9880, 37.5745],
          [126.9890, 37.5755],
          [126.9900, 37.5765]
        ]
      },
      properties: {
        id: 'trail-2',
        name: '북한산 등산로',
        courseType: 'hard',
        difficulty: '어려움',
        distance: 5.2,
        duration: 120,
        description: '북한산 정상까지 이어지는 등산로'
      }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [
          [126.9750, 37.5645],
          [126.9760, 37.5655],
          [126.9770, 37.5665],
          [126.9780, 37.5675]
        ]
      },
      properties: {
        id: 'trail-3',
        name: '남산 타워 전망로',
        courseType: 'scenic',
        difficulty: '보통',
        distance: 1.8,
        duration: 45,
        description: '서울 전경을 감상할 수 있는 전망로'
      }
    },
    {
      type: 'Feature',
      geometry: {
        type: 'LineString',
        coordinates: [
          [126.9830, 37.5685],
          [126.9840, 37.5695],
          [126.9850, 37.5705],
          [126.9860, 37.5715],
          [126.9870, 37.5725]
        ]
      },
      properties: {
        id: 'trail-4',
        name: '올림픽 공원 둘레길',
        courseType: 'medium',
        difficulty: '보통',
        distance: 3.5,
        duration: 60,
        description: '올림픽 공원을 한 바퀴 도는 둘레길'
      }
    }
  ]
};

/**
 * Mock API 호출 함수
 * 실제 API와 동일한 인터페이스 제공
 */
export const getTrailPaths = async (): Promise<GeoJSONFeatureCollection> => {
  // 실제 API 호출을 시뮬레이션하기 위한 지연
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // 에러 시뮬레이션 (10% 확률)
  if (Math.random() < 0.1) {
    throw new Error('서버 연결에 실패했습니다.');
  }
  
  return mockTrailPaths;
};

/**
 * 특정 경로 조회 Mock API
 */
export const getTrailPathById = async (id: string): Promise<GeoJSONFeatureCollection> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const trail = mockTrailPaths.features.find(feature => feature.properties.id === id);
  
  if (!trail) {
    throw new Error(`경로를 찾을 수 없습니다: ${id}`);
  }
  
  return {
    type: 'FeatureCollection',
    features: [trail]
  };
};

/**
 * 지역별 경로 조회 Mock API
 */
export const getTrailPathsByRegion = async (region: string): Promise<GeoJSONFeatureCollection> => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // 지역별 필터링 로직 (실제로는 더 복잡할 수 있음)
  const filteredFeatures = mockTrailPaths.features.filter(feature => 
    feature.properties.name?.includes(region)
  );
  
  return {
    type: 'FeatureCollection',
    features: filteredFeatures
  };
};

/**
 * 코스 타입별 경로 조회 Mock API
 */
export const getTrailPathsByCourseType = async (courseType: string): Promise<GeoJSONFeatureCollection> => {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  const filteredFeatures = mockTrailPaths.features.filter(feature => 
    feature.properties.courseType === courseType
  );
  
  return {
    type: 'FeatureCollection',
    features: filteredFeatures
  };
}; 
