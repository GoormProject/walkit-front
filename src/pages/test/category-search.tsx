import React, { useEffect, useState, useRef, useCallback } from 'react';
import { createMap as createKakaoMap, loadKakaoMapSDK } from '../../utils/kakaoMapApi';
import './category-search.css';

interface Place {
  id: string;
  place_name: string;
  address_name: string;
  road_address_name?: string;
  phone?: string;
  place_url: string;
  x: string;
  y: string;
}

interface Category {
  id: string;
  name: string;
  code: string;
  color: string;
}

const CategorySearchTest: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPosition, setCurrentPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [places, setPlaces] = useState<Place[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const placeOverlayRef = useRef<any>(null);
  const placesServiceRef = useRef<any>(null);
  const isInitializedRef = useRef(false);
  const isSearchingRef = useRef(false); // 검색 중 여부 ref 추가

  // 카테고리 정의 (카카오맵 API 카테고리 코드)
  const categories: Category[] = [
    { id: 'toilet', name: '화장실', code: 'SW8', color: '#4F46E5' },
    { id: 'convenience', name: '편의점', code: 'CS2', color: '#059669' },
    { id: 'subway', name: '지하철역', code: 'SW8', color: '#7C3AED' }
  ];

  // GPS 위치 가져오기
  const getCurrentPosition = useCallback((): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation이 지원되지 않습니다.'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error('GPS 위치 가져오기 실패:', error);
          // 기본 위치 (서울 시청)
          resolve({ lat: 37.5665, lng: 126.9780 });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    });
  }, []);

  // 마커 제거
  const removeMarkers = useCallback(() => {
    markersRef.current.forEach(marker => {
      marker.setMap(null);
    });
    markersRef.current = [];
  }, []);

  // 장소 마커 표시
  const displayPlaces = useCallback((places: Place[], category: Category) => {
    if (!mapRef.current) return;

    places.forEach((place, index) => {
      const marker = new window.kakao.maps.Marker({
        position: new window.kakao.maps.LatLng(parseFloat(place.y), parseFloat(place.x)),
        map: mapRef.current
      });

      // 마커 클릭 이벤트
      window.kakao.maps.event.addListener(marker, 'click', () => {
        displayPlaceInfo(place);
      });

      markersRef.current.push(marker);
    });
  }, []);

  // 장소 검색
  const searchPlaces = useCallback(() => {
    if (!selectedCategory || !placesServiceRef.current || isSearchingRef.current) {
      return;
    }
    isSearchingRef.current = true;
    setIsSearching(true);
    
    // 기존 마커 제거
    removeMarkers();
    
    // 커스텀 오버레이 숨기기
    if (placeOverlayRef.current) {
      placeOverlayRef.current.setMap(null);
    }

    const category = categories.find(cat => cat.id === selectedCategory);
    if (!category) {
      isSearchingRef.current = false;
      setIsSearching(false);
      return;
    }



    // 화장실 키워드 검색 (카테고리 코드 없음)
    if (category.id === 'toilet') {
      const toiletKeywords = ['화장실', '공공화장실', 'toilet'];
      const tryToiletSearch = (idx = 0) => {
        if (idx >= toiletKeywords.length) {
          setPlaces([]);
          setIsSearching(false);
          isSearchingRef.current = false;
          return;
        }
        placesServiceRef.current.keywordSearch(
          toiletKeywords[idx],
          (data: Place[], status: any) => {
            if (status === window.kakao.maps.services.Status.OK && data.length > 0) {
              setPlaces(data);
              displayPlaces(data, { ...category, name: toiletKeywords[idx] });
              setIsSearching(false);
              isSearchingRef.current = false;
            } else {
              tryToiletSearch(idx + 1);
            }
          },
          { useMapBounds: true }
        );
      };
      tryToiletSearch();
      return;
    }

    // 지하철역 키워드 검색
    if (category.id === 'subway') {
      const subwayKeywords = ['지하철역', '지하철', '역'];
      const trySubwaySearch = (idx = 0) => {
        if (idx >= subwayKeywords.length) {
          setPlaces([]);
          setIsSearching(false);
          isSearchingRef.current = false;
          return;
        }
        placesServiceRef.current.keywordSearch(
          subwayKeywords[idx],
          (data: Place[], status: any) => {
            if (status === window.kakao.maps.services.Status.OK && data.length > 0) {
              setPlaces(data);
              displayPlaces(data, { ...category, name: subwayKeywords[idx] });
              setIsSearching(false);
              isSearchingRef.current = false;
            } else {
              trySubwaySearch(idx + 1);
            }
          },
          { useMapBounds: true }
        );
      };
      trySubwaySearch();
      return;
    }

    // 나머지 카테고리는 기존대로 categorySearch
    placesServiceRef.current.categorySearch(
      category.code,
      (data: Place[], status: any) => {
        isSearchingRef.current = false;
        setIsSearching(false);
        if (status === window.kakao.maps.services.Status.OK) {
          setPlaces(data);
          displayPlaces(data, category);
        } else {
          setPlaces([]);
        }
      },
      { useMapBounds: true }
    );
  }, [selectedCategory, categories, removeMarkers, displayPlaces, setPlaces, setIsSearching]);

  // 지도 생성
    const createMap = useCallback((position: { lat: number; lng: number }) => {
    const map = createKakaoMap(position);
    mapRef.current = map;

    // Places 서비스 초기화
    const placesService = new window.kakao.maps.services.Places(map);
    placesServiceRef.current = placesService;

    // 커스텀 오버레이 생성
    const contentNode = document.createElement('div');
    contentNode.className = 'placeinfo_wrap';

    const placeOverlay = new window.kakao.maps.CustomOverlay({
      zIndex: 1,
      content: contentNode
    });
    placeOverlayRef.current = placeOverlay;

    // 지도 idle 이벤트 등록 (검색 중이면 무시)
    window.kakao.maps.event.addListener(map, 'idle', () => {
      if (selectedCategory && !isSearchingRef.current) {
        searchPlaces();
      }
    });

    setIsLoading(false);
    isInitializedRef.current = true;
  }, [selectedCategory, searchPlaces]);

  // 장소 정보 표시
  const displayPlaceInfo = useCallback((place: Place) => {
    if (!placeOverlayRef.current || !mapRef.current) return;

    const content = `
      <div class="placeinfo">
        <a class="title" href="${place.place_url}" target="_blank" title="${place.place_name}">
          ${place.place_name}
        </a>
        ${place.road_address_name 
          ? `<span title="${place.road_address_name}">${place.road_address_name}</span>
             <span class="jibun" title="${place.address_name}">(지번: ${place.address_name})</span>`
          : `<span title="${place.address_name}">${place.address_name}</span>`
        }
        ${place.phone ? `<span class="tel">${place.phone}</span>` : ''}
      </div>
      <div class="after"></div>
    `;

    const contentNode = placeOverlayRef.current.getContent();
    contentNode.innerHTML = content;
    
    placeOverlayRef.current.setPosition(new window.kakao.maps.LatLng(parseFloat(place.y), parseFloat(place.x)));
    placeOverlayRef.current.setMap(mapRef.current);
  }, []);

  // 카테고리 선택
  const handleCategoryClick = useCallback((categoryId: string) => {
    if (selectedCategory === categoryId) {
      // 같은 카테고리 클릭 시 해제
      setSelectedCategory('');
      setPlaces([]);
      removeMarkers();
      if (placeOverlayRef.current) {
        placeOverlayRef.current.setMap(null);
      }
    } else {
      // 새로운 카테고리 선택
      setSelectedCategory(categoryId);
    }
  }, [selectedCategory, removeMarkers]);

  // 컴포넌트 마운트 시 초기화
  useEffect(() => {
    const initializeMap = async () => {
      try {
        const apiKey = import.meta.env.VITE_KAKAO_MAP_API_KEY;
        console.log('카카오맵 API 키 확인:', apiKey ? `${apiKey.substring(0, 8)}...` : '설정되지 않음');
        if (!apiKey) {
          throw new Error('카카오맵 API 키가 설정되지 않았습니다.');
        }
        if (apiKey.length !== 32) {
          console.warn('카카오맵 API 키 길이가 예상과 다릅니다:', apiKey.length);
        }
        // 현재 위치 가져오기
        const position = await getCurrentPosition();
        setCurrentPosition(position);
        
        // 카카오맵 SDK 로드
        try {
          await loadKakaoMapSDK();
          createMap(position);
        } catch (error) {
          console.error('카카오맵 SDK 로드 실패:', error);
          setError(error instanceof Error ? error.message : '카카오맵 SDK 로드 실패');
          setIsLoading(false);
        }
      } catch (err) {
        console.error('맵 초기화 실패:', err);
        const errorMessage = err instanceof Error ? err.message : '알 수 없는 오류';
        setError(errorMessage);
        setIsLoading(false);
        if (errorMessage.includes('API 키')) {
          console.error('API 키 확인 필요:', import.meta.env.VITE_KAKAO_MAP_API_KEY);
        }
      }
    };
    initializeMap();
  }, []); // getCurrentPosition, createMap 제거

  // 카테고리 변경 시 검색 실행
  useEffect(() => {
    if (isInitializedRef.current && selectedCategory) {
      searchPlaces();
    }
  }, [selectedCategory]); // searchPlaces 제거

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          🏪 카테고리별 장소 검색 테스트
        </h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">근처 편의시설 조회</h2>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <strong>오류:</strong> {error}
              <div className="mt-2 text-sm">
                <p><strong>해결 방법:</strong></p>
                <ul className="list-disc list-inside mt-1">
                  <li>카카오 개발자 콘솔에서 API 키가 유효한지 확인</li>
                  <li>도메인 설정에 <code>localhost</code> 또는 <code>127.0.0.1</code>이 등록되어 있는지 확인</li>
                  <li>JavaScript 키가 올바르게 설정되어 있는지 확인</li>
                  <li>네트워크 연결 상태 확인</li>
                </ul>
              </div>
            </div>
          )}

          {/* 현재 위치 표시 */}
          {currentPosition && (
            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>현재 위치:</strong> {currentPosition.lat.toFixed(6)}, {currentPosition.lng.toFixed(6)}
              </p>
            </div>
          )}

          {/* 카테고리 버튼 */}
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-3">카테고리 선택</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    selectedCategory === category.id
                      ? 'text-white shadow-lg'
                      : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                  }`}
                  style={{
                    backgroundColor: selectedCategory === category.id ? category.color : undefined
                  }}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* 검색 상태 */}
          {isSearching && (
            <div className="mb-4 flex items-center justify-center py-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mr-2"></div>
              <span className="text-sm text-gray-600">장소 검색 중...</span>
            </div>
          )}

          {/* 검색 결과 */}
          {places.length > 0 && (
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">
                검색 결과 ({places.length}개)
              </h3>
              <div className="max-h-40 overflow-y-auto border rounded-lg">
                {places.map((place, index) => (
                  <div
                    key={place.id || index}
                    className="p-3 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer"
                    onClick={() => displayPlaceInfo(place)}
                  >
                    <div className="font-medium text-gray-900">{place.place_name}</div>
                    <div className="text-sm text-gray-600">
                      {place.road_address_name || place.address_name}
                    </div>
                    {place.phone && (
                      <div className="text-sm text-blue-600">{place.phone}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* 화장실 안내 메시지 */}
          {places.length === 0 && !isLoading && selectedCategory === 'toilet' && (
            <div className="text-center text-gray-500 mt-4">
              주변에 화장실 검색 결과가 없습니다.<br/>
              카카오맵 API의 한계로 일부 화장실은 표시되지 않을 수 있습니다.
            </div>
          )}

          {/* 지하철역 안내 메시지 */}
          {places.length === 0 && !isLoading && selectedCategory === 'subway' && (
            <div className="text-center text-gray-500 mt-4">
              주변에 지하철역 검색 결과가 없습니다.<br/>
              카카오맵 API의 한계로 일부 역은 표시되지 않을 수 있습니다.
            </div>
          )}
          
          {/* 지도 */}
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
            <p><strong>API 키 길이:</strong> {import.meta.env.VITE_KAKAO_MAP_API_KEY?.length || 0}자</p>
            <p><strong>현재 도메인:</strong> {window.location.hostname}</p>
            <p><strong>프로토콜:</strong> {window.location.protocol}</p>
            <p><strong>선택된 카테고리:</strong> {selectedCategory || '없음'}</p>
            <p><strong>검색된 장소:</strong> {places.length}개</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategorySearchTest; 
