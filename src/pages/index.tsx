import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect, useCallback } from 'react';
import { toast, Toaster } from 'sonner';
import KakaoMap from '../components/KakaoMap';
import { GPSTracker } from '@/components/GPSTracker';
import { useGPSStore } from '@/features/gps/gpsSlice';
import { calculateDistance as calculateCoordinateDistance } from '@/utils/converter/pathConverter';
import { isOAuthCallback } from '@/utils/oauth';

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

const Home = () => {
  const [isWalking, setIsWalking] = useState(false);
  const [pathPositions, setPathPositions] = useState<kakao.maps.LatLng[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [places, setPlaces] = useState<Place[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isPlacesServiceReady, setIsPlacesServiceReady] = useState(false);
  const map = useRef<kakao.maps.Map | null>(null);
  const polyline = useRef<kakao.maps.Polyline | null>(null);
  const markersRef = useRef<any[]>([]);
  const placeOverlayRef = useRef<any>(null);
  const placesServiceRef = useRef<any>(null);
  const isSearchingRef = useRef(false);
  const currentLocationMarkerRef = useRef<any>(null);
  const { error, isLoading, position } = useGPSStore();
  const navigate = useNavigate();

  // 카테고리 정의
  const categories: Category[] = [
    { id: 'toilet', name: '화장실', code: 'SW8', color: '#4F46E5' },
    { id: 'convenience', name: '편의점', code: 'CS2', color: '#059669' },
    { id: 'subway', name: '지하철역', code: 'SW8', color: '#7C3AED' }
  ];

  // OAuth 콜백 확인 (디버깅용)
  useEffect(() => {
    console.log('🏠 홈 페이지 로드됨');
    console.log('📍 현재 URL:', window.location.href);
    console.log('🔍 URL 파라미터:', window.location.search);
    console.log('🔄 OAuth 콜백 여부:', isOAuthCallback());
    console.log('🌐 HTTPS 환경:', window.location.protocol === 'https:');
    console.log('📱 Geolocation 지원:', !!navigator.geolocation);

    if (isOAuthCallback()) {
      console.log('⚠️ 홈 페이지에서 OAuth 콜백 감지됨!');
      console.log('🚨 OAuth 콜백이 홈 페이지로 리다이렉트되었습니다.');
    }
  }, []);

  // GPS 상태 모니터링
  useEffect(() => {
    console.log('📡 GPS 상태 변경:', {
      isLoading,
      hasError: !!error,
      hasPosition: !!position,
      errorCode: error?.code,
      errorMessage: error?.message
    });
  }, [isLoading, error, position]);

  // 산책 시작
  const handleStartWalk = () => {
    setIsWalking(true);
    setPathPositions([]);
    toast.success('산책을 시작합니다!', {
      description: 'GPS 신호가 안정적인 실외에서 이용해주세요.',
    });
  };

  // 산책 종료
  const handleEndWalk = () => {
    setIsWalking(false);
    // TODO: 산책 기록 저장 로직 추가
    toast.success('산책이 종료되었습니다!', {
      description: `총 거리: ${calculateTotalDistance(pathPositions).toFixed(2)}km`,
    });
  };

  // 경로의 총 거리 계산
  const calculateTotalDistance = (positions: kakao.maps.LatLng[]): number => {
    let totalDistance = 0;
    for (let i = 1; i < positions.length; i++) {
      const prev = positions[i - 1];
      const curr = positions[i];
      totalDistance += calculateDistance(prev, curr);
    }
    return totalDistance;
  };

  // 두 지점 간의 거리 계산 (km)
  const calculateDistance = (
    pos1: kakao.maps.LatLng,
    pos2: kakao.maps.LatLng
  ): number => {
    return calculateCoordinateDistance(
      { lat: pos1.getLat(), lng: pos1.getLng() },
      { lat: pos2.getLat(), lng: pos2.getLng() }
    );
  };

  // 위치 업데이트 시 경로 그리기
  const handlePositionUpdate = (position: kakao.maps.LatLng) => {
    if (isWalking) {
      setPathPositions(prev => [...prev, position]);
    }
  };

  // 검색 마커 제거 (현재 위치 마커는 유지)
  const removeMarkers = useCallback(() => {
    console.log('🗑️ 검색 마커 제거:', markersRef.current.length, '개');
    markersRef.current.forEach(marker => {
      marker.setMap(null);
    });
    markersRef.current = [];
  }, []);

  // 장소 마커 표시
  const displayPlaces = useCallback((places: Place[], category: Category) => {
    if (!map.current) return;

    places.forEach((place, index) => {
      const marker = new window.kakao.maps.Marker({
        position: new window.kakao.maps.LatLng(parseFloat(place.y), parseFloat(place.x)),
        map: map.current!
      });

      // 마커 클릭 이벤트
      window.kakao.maps.event.addListener(marker, 'click', () => {
        displayPlaceInfo(place);
      });

      markersRef.current.push(marker);
    });
  }, []);

  // 장소 정보 표시
  const displayPlaceInfo = useCallback((place: Place) => {
    if (!placeOverlayRef.current || !map.current) return;

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
    placeOverlayRef.current.setMap(map.current);
  }, []);



  // 카테고리 변경 시 검색 실행
  useEffect(() => {
    console.log('🔄 카테고리 변경 감지:', selectedCategory, 'placesService:', !!placesServiceRef.current, 'isReady:', isPlacesServiceReady);
    if (selectedCategory && placesServiceRef.current && isPlacesServiceReady) {
      console.log('🚀 검색 실행');
      // searchPlaces 함수를 직접 호출하여 무한 렌더링 방지
      const category = categories.find(cat => cat.id === selectedCategory);
      if (category) {
        isSearchingRef.current = true;
        setIsSearching(true);
        removeMarkers();
        
        if (placeOverlayRef.current) {
          placeOverlayRef.current.setMap(null);
        }

        // 화장실 키워드 검색
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
              { useMapBounds: false }
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
              { useMapBounds: false }
            );
          };
          trySubwaySearch();
          return;
        }

        // 편의점 카테고리 검색
        console.log('🔍 편의점 검색 시작:', category.code);
        placesServiceRef.current.categorySearch(
          category.code,
          (data: Place[], status: any) => {
            console.log('🔍 편의점 검색 결과:', { status, count: data?.length });
            isSearchingRef.current = false;
            setIsSearching(false);
            if (status === window.kakao.maps.services.Status.OK) {
              setPlaces(data);
              displayPlaces(data, category);
            } else {
              console.log('❌ 편의점 검색 실패:', status);
              setPlaces([]);
            }
          },
          { useMapBounds: false }
        );
      }
    } else if (selectedCategory && !isPlacesServiceReady) {
      console.log('⏳ Places 서비스 대기 중...');
    }
  }, [selectedCategory, isPlacesServiceReady, categories, removeMarkers, displayPlaces]);

  // Places 서비스 준비 시 이전 선택된 카테고리 검색 실행
  useEffect(() => {
    if (isPlacesServiceReady && selectedCategory && placesServiceRef.current) {
      console.log('🚀 Places 서비스 준비됨, 이전 선택된 카테고리 검색 실행:', selectedCategory);
      // 여기서는 searchPlaces 함수를 직접 호출하지 않고 selectedCategory 변경을 트리거
    }
  }, [isPlacesServiceReady]);

  // 카테고리 선택
  const handleCategoryClick = useCallback((categoryId: string) => {
    console.log('🎯 카테고리 클릭:', categoryId, '현재 선택:', selectedCategory);
    if (selectedCategory === categoryId) {
      // 같은 카테고리 클릭 시 해제
      console.log('🔴 카테고리 해제:', categoryId);
      setSelectedCategory('');
      setPlaces([]);
      removeMarkers();
      if (placeOverlayRef.current) {
        placeOverlayRef.current.setMap(null);
      }
    } else {
      // 새로운 카테고리 선택
      console.log('🟢 카테고리 선택:', categoryId);
      setSelectedCategory(categoryId);
    }
  }, [selectedCategory, removeMarkers]);



  // 경로 표시 업데이트
  useEffect(() => {
    if (!map.current) return;

    // 기존 폴리라인 제거
    if (polyline.current) {
      polyline.current.setMap(null);
    }

    // 새 폴리라인 생성
    polyline.current = new kakao.maps.Polyline({
      map: map.current,
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
  }, [pathPositions]);

  return (
    <div className="flex flex-col h-screen">
      <Toaster position="top-center" richColors />

      {/* 지도 영역 */}
      <div className="relative flex-1">
        <KakaoMap
          onMapLoad={mapInstance => {
            console.log('🗺️ 지도 로드 콜백 실행');
            map.current = mapInstance;
            
            // Places 서비스 초기화
            console.log('🔍 Places 서비스 초기화 시도:', {
              hasKakao: !!window.kakao,
              hasMaps: !!(window.kakao && window.kakao.maps),
              hasServices: !!(window.kakao && window.kakao.maps && window.kakao.maps.services)
            });
            
            if (window.kakao && window.kakao.maps.services) {
              try {
                const placesService = new window.kakao.maps.services.Places(mapInstance);
                placesServiceRef.current = placesService;
                setIsPlacesServiceReady(true);
                console.log('✅ Places 서비스 초기화 완료');

                // 커스텀 오버레이 생성
                const contentNode = document.createElement('div');
                contentNode.className = 'placeinfo_wrap';
                
                const placeOverlay = new window.kakao.maps.CustomOverlay({
                  zIndex: 1,
                  content: contentNode
                });
                placeOverlayRef.current = placeOverlay;
              } catch (error) {
                console.error('❌ Places 서비스 생성 중 오류:', error);
              }
            } else {
              console.log('❌ Places 서비스 초기화 실패 - services 없음');
              console.log('window.kakao:', window.kakao);
              console.log('window.kakao.maps:', window.kakao?.maps);
              console.log('window.kakao.maps.services:', window.kakao?.maps?.services);
            }
          }}
        />
        
        {/* 현재 위치 추적 (별도 컴포넌트로 분리) */}
        {map.current && (
          <GPSTracker
            map={map.current}
            onPositionUpdate={handlePositionUpdate}
          />
        )}

        {/* 좌측 상단 - 메뉴 버튼 (사람 아이콘) */}
        <div className="absolute top-4 left-4 z-10 pointer-events-none">
          <button 
            onClick={() => navigate('/profile')}
            className="p-3 rounded-full bg-white/90 shadow-lg hover:bg-white transition-all pointer-events-auto"
          >
            <span className="material-icons text-gray-700">person</span>
          </button>
        </div>
        
        {/* 우측 하단 - GPS 버튼 */}
        <div className="absolute bottom-4 right-4 z-10 pointer-events-none">
          <button 
            onClick={() => {
              if (position && map.current) {
                const latLng = new window.kakao.maps.LatLng(position.getLat(), position.getLng());
                (map.current as any).panTo(latLng);
                toast.success('현재 위치로 이동했습니다!');
              } else {
                toast.error('GPS 위치를 가져올 수 없습니다.');
              }
            }}
            className="p-3 rounded-full bg-white/90 shadow-lg hover:bg-white transition-all pointer-events-auto"
          >
            <span className="material-icons text-gray-700">gps_fixed</span>
          </button>
        </div>
        
        {/* 카테고리 버튼들 */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 flex gap-2 pointer-events-none">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`px-3 py-2 rounded-full text-sm font-medium transition-all shadow-lg pointer-events-auto ${
                selectedCategory === category.id
                  ? 'text-white'
                  : 'text-gray-700 bg-white/90 hover:bg-white'
              }`}
              style={{
                backgroundColor: selectedCategory === category.id ? category.color : undefined
              }}
            >
              {category.name}
            </button>
          ))}
        </div>
        
        {/* 우측 상단 - GPS 상태 및 산책 버튼 */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2 pointer-events-none">
          {/* GPS 상태 표시 */}
          <div className="flex items-center gap-1 px-2 py-1 bg-white/90 rounded-full shadow-lg text-xs pointer-events-auto">
            {isLoading ? (
              <span className="text-blue-500">📍 GPS 로딩중...</span>
            ) : error ? (
              <span className="text-red-500">❌ GPS 오류</span>
            ) : position ? (
              <span className="text-green-500">✅ GPS 연결됨</span>
            ) : (
              <span className="text-gray-500">⏳ GPS 대기중</span>
            )}
          </div>
          
          {!isWalking ? (
            <button
              onClick={handleStartWalk}
              disabled={!!error}
              className="px-4 py-2 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed pointer-events-auto"
            >
              산책 시작
            </button>
          ) : (
            <button
              onClick={handleEndWalk}
              className="px-4 py-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-all pointer-events-auto"
            >
              산책 종료
            </button>
          )}
        </div>
        
        {/* 검색 결과 표시 */}
        {places.length > 0 && (
          <div className="absolute top-16 left-4 right-4 z-10 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto pointer-events-auto">
            <div className="p-3">
              <h3 className="text-sm font-semibold text-gray-800 mb-2">
                검색 결과 ({places.length}개)
              </h3>
              <div className="space-y-2">
                {places.map((place, index) => (
                  <div
                    key={place.id || index}
                    className="p-2 border-b last:border-b-0 hover:bg-gray-50 cursor-pointer rounded"
                    onClick={() => displayPlaceInfo(place)}
                  >
                    <div className="font-medium text-gray-900 text-sm">{place.place_name}</div>
                    <div className="text-xs text-gray-600">
                      {place.road_address_name || place.address_name}
                    </div>
                    {place.phone && (
                      <div className="text-xs text-blue-600">{place.phone}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* 검색 중 표시 */}
        {isSearching && (
          <div className="absolute top-16 left-4 right-4 z-10 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 p-4 pointer-events-none">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mr-2"></div>
              <span className="text-sm text-gray-600">장소 검색 중...</span>
            </div>
          </div>
        )}
      </div>
      
      {/* 장소 정보 오버레이 스타일 */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .placeinfo_wrap {
            position: absolute;
            bottom: 28px;
            left: -150px;
            width: 300px;
          }
          .placeinfo {
            position: relative;
            width: 100%;
            border-radius: 6px;
            border: 1px solid #ccc;
            border-bottom: 2px solid #ddd;
            padding-bottom: 10px;
            background: #fff;
          }
          .placeinfo:nth-of-type(1) {
            border: 0;
            box-shadow: 0px 1px 2px #888;
          }
          .placeinfo a {
            color: #2c3e50;
            text-decoration: none;
          }
          .placeinfo a:hover,
          .placeinfo a:active {
            color: #21f1bf;
            text-decoration: underline;
          }
          .placeinfo .title {
            display: block;
            overflow: hidden;
            margin: 14px 0 0 10px;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 14px;
            font-weight: 700;
          }
          .placeinfo .tel {
            color: #0f7833;
          }
          .placeinfo .jibun {
            color: #999;
            font-size: 11px;
            margin-top: 0;
          }
          .after {
            content: '';
            position: relative;
            margin-left: -12px;
            left: 50%;
            width: 22px;
            height: 12px;
            background: url('https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/vertex_white.png');
          }
        `
      }} />
    </div>
  );
};

export default Home;
