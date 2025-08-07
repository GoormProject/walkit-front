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

/**
 * Mock 산책로 목록 조회 (index.tsx에서 사용)
 */
export const getTrails = async () => {
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const trails = [
    {
      id: 1,
      name: '한강공원 산책로',
      location: '서울특별시 영등포구',
      length: 5.2,
      rating: 4.7,
      reviewCount: 35,
    },
    {
      id: 2,
      name: '남산 둘레길',
      location: '서울특별시 중구',
      length: 3.1,
      rating: 4.5,
      reviewCount: 28,
    },
    {
      id: 3,
      name: '북서울꿈의숲',
      location: '서울특별시 강북구',
      length: 2.8,
      rating: 4.3,
      reviewCount: 22,
    },
  ];

  return {
    status: 200,
    message: '산책로 리스트 조회 성공',
    trails: trails,
    totalElements: trails.length,
  };
};

/**
 * Mock 산책로 상세 조회 (TrailDetailCard에서 사용)
 */
export const getTrailById = async (trailId: number) => {
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Mock 상세 데이터
  const mockTrailDetail = {
    httpStatus: 200,
    message: '단건 조회 성공',
    data: {
      title: '남산 둘레길',
      description: '남산 둘레길을 돌아보는 초급 코스입니다.',
      location: '서울 중구 남산공원',
      length: 3.8,
      routeImageUrl: 'https://example.com/images/namsan-trail.png',
      reviewCount: 25,
      rating: 4.3,
      pathId: trailId,
      startPoint: [126.75791835403612, 37.662510637017874] as [number, number],
      path: [
        [126.75791835403612, 37.662510637017874],
        [126.75790151956403, 37.66262761454681],
        [126.75789029658108, 37.662723861742975],
        [126.75790900155192, 37.66283343532169],
        [126.75795763447428, 37.662935605134706],
        [126.75809792174988, 37.66306886989648],
        [126.75818770560676, 37.66312069501714]
      ]
    }
  };

  return mockTrailDetail;
}; 
