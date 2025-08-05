import { useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect, useCallback } from 'react';
import { toast, Toaster } from 'sonner';
import KakaoMap from '../components/KakaoMap';
import { GPSTracker } from '@/components/GPSTracker';
import { useGPSStore } from '@/features/gps/gpsSlice';
import { calculateDistance as calculateCoordinateDistance } from '@/utils/converter/pathConverter';
import { isOAuthCallback } from '@/utils/oauth';
import BottomSheet from '@/components/ui/BottomSheet';
import './index.css';

// 개발 모드에서만 로그를 출력하는 래퍼 함수
const logger = {
  log: (...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(...args);
    }
  },
  warn: (...args: any[]) => {
    if (process.env.NODE_ENV === 'development') {
      console.warn(...args);
    }
  },
  error: (...args: any[]) => {
    // 에러는 프로덕션에서도 로그 (중요한 에러이므로)
    console.error(...args);
  },
};

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

// 카테고리 정의 (컴포넌트 외부로 이동하여 재생성 방지)
const CATEGORIES: Category[] = [
  { id: 'toilet', name: '화장실', code: '', color: '#4F46E5' }, // 화장실은 키워드 검색 사용
  { id: 'convenience', name: '편의점', code: 'CS2', color: '#059669' },
  { id: 'subway', name: '지하철역', code: 'SW8', color: '#7C3AED' }
];

const Home = () => {
  const [isWalking, setIsWalking] = useState(false);
  const [pathPositions, setPathPositions] = useState<kakao.maps.LatLng[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [places, setPlaces] = useState<Place[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isPlacesServiceReady, setIsPlacesServiceReady] = useState(false);
  const [isMapReady, setIsMapReady] = useState(false);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);
  const map = useRef<kakao.maps.Map | null>(null);
  const polyline = useRef<kakao.maps.Polyline | null>(null);
  const markersRef = useRef<kakao.maps.Marker[]>([]);
  const placeOverlayRef = useRef<kakao.maps.CustomOverlay | null>(null);
  const placesServiceRef = useRef<kakao.maps.services.Places | null>(null);
  const isSearchingRef = useRef(false);
  const selectedCategoryRef = useRef<string>(''); // 현재 카테고리 상태를 실시간으로 추적
  const { error, isLoading, position } = useGPSStore();
  const navigate = useNavigate();

  // 검색 반경 상수
  const SEARCH_RADIUS = {
    INITIAL: 5000,  // 5km
    EXTENDED: 10000 // 10km
  } as const;

  // 컴포넌트 내부에서 categories 정의 제거

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
      errorMessage: error?.message,
    });
  }, [isLoading, error, position]);

  // 지도 및 서비스 상태 모니터링
  useEffect(() => {
    console.log('🗺️ 지도 상태 변경:', {
      hasMap: !!map.current,
      isMapReady,
      hasPlacesService: !!placesServiceRef.current,
      isPlacesServiceReady,
      selectedCategory,
    });
  }, [isMapReady, isPlacesServiceReady, selectedCategory]);

  // selectedCategory 상태가 변경될 때마다 ref도 업데이트
  useEffect(() => {
    selectedCategoryRef.current = selectedCategory;
  }, [selectedCategory]);

  // 산책 시작
  const handleStartWalk = () => {
    setIsWalking(true);
    setPathPositions([]);
    setIsBottomSheetOpen(false); // 바텀시트 닫기
    toast.success('산책을 시작합니다!', {
      description: 'GPS 신호가 안정적인 실외에서 이용해주세요.',
    });
  };

  // 산책 종료
  const handleEndWalk = () => {
    setIsWalking(false);
    setIsBottomSheetOpen(false); // 바텀시트 닫기
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
    markersRef.current.forEach((marker, index) => {
      console.log(`🗑️ 마커 ${index + 1} 제거`);
      marker.setMap(null);
    });
    markersRef.current = [];
  }, []);

  // 장소 마커 표시 (기존 마커 제거 후 새로 생성)
  const displayPlaces = useCallback((places: Place[], category: Category) => {
    console.log('🎯 displayPlaces 호출됨:', { 
      placesCount: places?.length, 
      category, 
      hasMap: !!map.current,
      isMapReady,
      currentSelectedCategory: selectedCategory,
      refSelectedCategory: selectedCategoryRef.current
    });
    
    // 카테고리가 해제된 상태에서는 마커를 생성하지 않음 (ref 사용)
    if (!selectedCategoryRef.current || selectedCategoryRef.current === '') {
      console.log('⏭️ 카테고리가 해제됨 - 마커 생성 건너뜀 (ref 확인)');
      return;
    }
    
    // 선택된 카테고리와 일치하지 않으면 마커를 생성하지 않음 (ref 사용)
    if (selectedCategoryRef.current !== category.id) {
      console.log('⏭️ 카테고리가 변경됨 - 마커 생성 건너뜀 (ref 확인)', {
        refSelectedCategory: selectedCategoryRef.current,
        categoryId: category.id
      });
      return;
    }
    
    if (!map.current || !isMapReady) {
      console.log('❌ 지도가 아직 준비되지 않음 - map.current:', !!map.current, 'isMapReady:', isMapReady);
      return;
    }

    // 지도 상태 추가 확인
    try {
      const mapLevel = map.current.getLevel();
      console.log('🗺️ 지도 상태 확인:', { mapLevel, isMapReady });
    } catch (error) {
      console.error('❌ 지도 상태 확인 실패:', error);
      return;
    }

    // 기존 검색 마커 제거
    removeMarkers();

    console.log('📍 새로운 마커 생성:', places.length, '개');

    places.forEach((place, index) => {
      console.log('📍 마커 생성 중:', index + 1, '/', places.length, place.place_name);

      try {
        const lat = parseFloat(place.y);
        const lng = parseFloat(place.x);

        if (isNaN(lat) || isNaN(lng)) {
          console.warn('⚠️ 잘못된 좌표:', place.place_name, 'lat:', place.y, 'lng:', place.x);
          return;
        }

        const marker = new window.kakao.maps.Marker({
          position: new window.kakao.maps.LatLng(lat, lng),
          map: map.current!,
        });

        // 마커의 z-index를 설정 (타입 캐스팅 사용)
        (marker as any).setZIndex(2);

        // 마커 클릭 이벤트
        window.kakao.maps.event.addListener(marker, 'click', () => {
          displayPlaceInfo(place);
        });

        markersRef.current.push(marker);
        console.log('✅ 마커 생성 성공:', place.place_name, '좌표:', { lat, lng });
      } catch (error) {
        console.error('❌ 마커 생성 실패:', place.place_name, error);
      }
    });

    console.log('✅ 마커 생성 완료:', markersRef.current.length, '개');

    // 검색 결과로 지도 중심 이동 및 범위 조정
    if (places.length > 0 && map.current) {
      try {
        const bounds = new window.kakao.maps.LatLngBounds();
        places.forEach(place => {
          const lat = parseFloat(place.y);
          const lng = parseFloat(place.x);
          if (!isNaN(lat) && !isNaN(lng)) {
            bounds.extend(new window.kakao.maps.LatLng(lat, lng));
          }
        });

        // 검색 결과가 모두 포함되도록 지도 범위 조정
        map.current.setBounds(bounds);

        console.log('🗺️ 지도 범위 조정 완료:', {
          placesCount: places.length,
          bounds: bounds,
        });
      } catch (error) {
        console.error('❌ 지도 범위 조정 실패:', error);
      }
    }

    // 마커가 지도에 제대로 표시되는지 확인
    setTimeout(() => {
      console.log('🔍 마커 표시 상태 확인:', {
        markersCount: markersRef.current.length,
        mapLevel: map.current?.getLevel(),
      });
    }, 100);
  }, [isMapReady, selectedCategory]); // selectedCategory 의존성 추가

  // 장소 정보 표시
  const displayPlaceInfo = useCallback((place: Place) => {
    if (!placeOverlayRef.current || !map.current) return;

    const content = `
      <div class="placeinfo">
        <a class="title" href="${place.place_url}" target="_blank" title="${place.place_name}">
          ${place.place_name}
        </a>
        ${
          place.road_address_name
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

    placeOverlayRef.current.setPosition(
      new window.kakao.maps.LatLng(parseFloat(place.y), parseFloat(place.x))
    );
    placeOverlayRef.current.setMap(map.current);
  }, []);

  // 공통 키워드 검색 함수
  const performKeywordSearch = useCallback((
    keywords: string[],
    category: Category,
    searchLocation: kakao.maps.LatLng | null,
    onSuccess: (data: Place[], keyword: string) => void
  ) => {
    const trySearch = (idx = 0) => {
      if (idx >= keywords.length) {
        // 확장 검색
        if (!placesServiceRef.current) {
          console.error('❌ Places 서비스가 초기화되지 않았습니다.');
          setIsSearching(false);
          isSearchingRef.current = false;
          return;
        }
        placesServiceRef.current.keywordSearch(
          keywords[0],
          (data: Place[], status: any) => {
            console.log('🔍 넓은 범위 검색 결과:', { status, count: data?.length });
            setPlaces(data || []);
            setIsSearching(false);
            isSearchingRef.current = false;
            if (status === window.kakao.maps.services.Status.OK && data?.length > 0) {
              // 카테고리 상태 확인 후 마커 생성 (ref 사용)
              if (selectedCategoryRef.current === category.id) {
                onSuccess(data, keywords[0]);
              } else {
                console.log('⏭️ 카테고리가 변경됨 - 마커 생성 건너뜀 (확장 검색, ref 확인)', {
                  refSelectedCategory: selectedCategoryRef.current,
                  categoryId: category.id
                });
              }
            }
          },
          { 
            useMapBounds: false,
            location: searchLocation ? new window.kakao.maps.LatLng(searchLocation.getLat(), searchLocation.getLng()) : undefined,
            radius: SEARCH_RADIUS.EXTENDED
          }
        );
        return;
      }
      
      if (!placesServiceRef.current) {
        console.error('❌ Places 서비스가 초기화되지 않았습니다.');
        setIsSearching(false);
        isSearchingRef.current = false;
        return;
      }
      
      placesServiceRef.current.keywordSearch(
        keywords[idx],
        (data: Place[], status: any) => {
          console.log('🔍 검색 결과:', { keyword: keywords[idx], status, count: data?.length });
          if (status === window.kakao.maps.services.Status.OK && data.length > 0) {
            console.log('✅ 검색 성공');
            setPlaces(data);
            // 카테고리 상태 확인 후 마커 생성 (ref 사용)
            if (selectedCategoryRef.current === category.id) {
              onSuccess(data, keywords[idx]);
            } else {
              console.log('⏭️ 카테고리가 변경됨 - 마커 생성 건너뜀 (일반 검색, ref 확인)', {
                refSelectedCategory: selectedCategoryRef.current,
                categoryId: category.id
              });
            }
            setIsSearching(false);
            isSearchingRef.current = false;
          } else {
            trySearch(idx + 1);
          }
        },
        { 
          useMapBounds: true,
          location: searchLocation ? new window.kakao.maps.LatLng(searchLocation.getLat(), searchLocation.getLng()) : undefined,
          radius: SEARCH_RADIUS.INITIAL
        }
      );
    };
    
    trySearch();
  }, []); // selectedCategory 의존성 제거 - ref 사용으로 변경

  // 카테고리 변경 시 검색 실행 (GPS 위치 업데이트와 분리)
  useEffect(() => {
    console.log('🔄 카테고리 변경 감지:', {
      selectedCategory,
      hasPlacesService: !!placesServiceRef.current,
      isPlacesServiceReady,
      hasMap: !!map.current,
      isMapReady,
    });
    
    // selectedCategory가 빈 문자열이거나 없으면 검색하지 않음
    if (!selectedCategory || selectedCategory === '') {
      console.log('⏭️ 카테고리가 선택되지 않음 - 검색 건너뜀');
      return;
    }
    
    if (placesServiceRef.current && isPlacesServiceReady && map.current && isMapReady) {
      console.log('🚀 검색 실행 - 모든 조건 충족');
      console.log('📍 현재 위치 상태:', { hasPosition: !!position, position });
      
      // 이미 검색 중이면 중복 실행 방지
      if (isSearchingRef.current) {
        console.log('⏳ 이미 검색 중 - 중복 실행 방지');
        return;
      }
      
      // searchPlaces 함수를 직접 호출하여 무한 렌더링 방지
      const category = CATEGORIES.find(cat => cat.id === selectedCategory);
      if (category) {
        isSearchingRef.current = true;
        setIsSearching(true);

        // 마커 제거하지 않고 새로운 검색만 실행
        if (placeOverlayRef.current) {
          placeOverlayRef.current.setMap(null);
        }

        // GPS 위치가 없으면 지도 중심을 기준으로 검색
        const searchLocation = position || (map.current as any).getCenter();
        console.log('🔍 검색 기준 위치:', searchLocation);

        // 화장실 키워드 검색
        if (category.id === 'toilet') {
          const toiletKeywords = ['화장실', '공공화장실', 'toilet'];
          performKeywordSearch(
            toiletKeywords,
            category,
            searchLocation,
            (data: Place[], keyword: string) => {
              displayPlaces(data, { ...category, name: keyword });
            }
          );
          return;
        }

        // 지하철역 키워드 검색
        if (category.id === 'subway') {
          const subwayKeywords = ['지하철역', '지하철', '역'];
          performKeywordSearch(
            subwayKeywords,
            category,
            searchLocation,
            (data: Place[], keyword: string) => {
              displayPlaces(data, { ...category, name: keyword });
            }
          );
          return;
        }

        // 편의점 카테고리 검색
        console.log('🔍 편의점 검색 시작:', category.code);
        placesServiceRef.current.categorySearch(
          category.code,
          (data: Place[], status: any) => {
            console.log('🔍 편의점 검색 결과:', {
              status,
              count: data?.length,
              data: data?.slice(0, 3),
            });
            isSearchingRef.current = false;
            setIsSearching(false);
            if (status === window.kakao.maps.services.Status.OK) {
              console.log('✅ 편의점 검색 성공, displayPlaces 호출');
              setPlaces(data);
              displayPlaces(data, category);
            } else {
              console.log('❌ 편의점 검색 실패, 더 넓은 범위로 재시도:', status);
              // 대안: 더 넓은 범위로 검색
              if (!placesServiceRef.current) {
                console.error('❌ Places 서비스가 초기화되지 않았습니다.');
                setIsSearching(false);
                isSearchingRef.current = false;
                return;
              }
              placesServiceRef.current.categorySearch(
                category.code,
                (data: Place[], status: any) => {
                  console.log('🔍 넓은 범위 편의점 검색 결과:', {
                    status,
                    count: data?.length,
                  });
                  setPlaces(data || []);
                  setIsSearching(false);
                  isSearchingRef.current = false;
                  if (
                    status === window.kakao.maps.services.Status.OK &&
                    data?.length > 0
                  ) {
                    displayPlaces(data, category);
                  }
                },
                {
                  useMapBounds: false, // 전국 범위로 검색
                  location: searchLocation
                    ? new window.kakao.maps.LatLng(
                        searchLocation.getLat(),
                        searchLocation.getLng()
                      )
                    : undefined,
                  radius: 10000, // 10km 반경으로 확장
                }
              );
            }
          },
          {
            useMapBounds: true, // 현재 지도 화면 범위 내에서만 검색
            location: searchLocation
              ? new window.kakao.maps.LatLng(
                  searchLocation.getLat(),
                  searchLocation.getLng()
                )
              : undefined,
            radius: 5000, // 5km 반경 내에서 검색
          }
        );
      }
    } else if (selectedCategory && !isPlacesServiceReady) {
      console.log('⏳ Places 서비스 대기 중...');
    }
  }, [selectedCategory, isPlacesServiceReady, isMapReady]); // position 의존성 제거 - GPS 위치 업데이트로 인한 무한 루프 방지

  // GPS 위치가 크게 변경되었을 때만 선택적 재검색 (무한 루프 방지)
  const lastSearchPositionRef = useRef<kakao.maps.LatLng | null>(null);
  useEffect(() => {
    if (!position || !selectedCategory || !map.current || isSearchingRef.current) {
      return;
    }
    
    // 이전 검색 위치와 현재 위치 비교
    if (lastSearchPositionRef.current) {
      const distance = calculateDistance(lastSearchPositionRef.current, position);
      // 500m 이상 이동했을 때만 재검색 (무한 루프 방지)
      if (distance < 0.5) { // 0.5km = 500m
        return;
      }
    }
    
    console.log('📍 위치 크게 변경됨 - 재검색 실행:', {
      selectedCategory,
      newPosition: position,
      previousPosition: lastSearchPositionRef.current
    });
    
    // 검색 위치 업데이트
    lastSearchPositionRef.current = position;
    
    // 카테고리가 선택된 상태에서만 재검색
    const category = CATEGORIES.find(cat => cat.id === selectedCategory);
    if (category && placesServiceRef.current && !isSearchingRef.current) {
      isSearchingRef.current = true;
      setIsSearching(true);
      
      if (category.id === 'toilet') {
        const toiletKeywords = ['화장실', '공공화장실', 'toilet'];
        performKeywordSearch(
          toiletKeywords,
          category,
          position,
          (data: Place[], keyword: string) => {
            displayPlaces(data, { ...category, name: keyword });
          }
        );
      } else if (category.id === 'subway') {
        const subwayKeywords = ['지하철역', '지하철', '역'];
        performKeywordSearch(
          subwayKeywords,
          category,
          position,
          (data: Place[], keyword: string) => {
            displayPlaces(data, { ...category, name: keyword });
          }
        );
      } else {
        // 편의점 등 카테고리 검색
        placesServiceRef.current.categorySearch(
          category.code,
          (data: Place[], status: any) => {
            isSearchingRef.current = false;
            setIsSearching(false);
            if (status === window.kakao.maps.services.Status.OK) {
              setPlaces(data);
              displayPlaces(data, category);
            }
          },
          { 
            useMapBounds: true,
            location: new window.kakao.maps.LatLng(position.getLat(), position.getLng()),
            radius: 5000
          }
        );
      }
    }
  }, [position]); // position만 의존성으로 두고, 내부에서 거리 기반 필터링

  // Places 서비스 준비 시 이전 선택된 카테고리 검색 실행
  useEffect(() => {
    if (
      isPlacesServiceReady &&
      selectedCategory &&
      placesServiceRef.current &&
      map.current &&
      isMapReady
    ) {
      console.log(
        '🚀 Places 서비스 준비됨, 이전 선택된 카테고리 검색 실행:',
        selectedCategory
      );
      // 여기서는 searchPlaces 함수를 직접 호출하지 않고 selectedCategory 변경을 트리거
    }
  }, [isPlacesServiceReady, isMapReady]);

  // 카테고리 선택
  const handleCategoryClick = useCallback(
    (categoryId: string) => {
      console.log(
        '🎯 카테고리 클릭:',
        categoryId,
        '현재 선택:',
        selectedCategory
      );
      if (selectedCategory === categoryId) {
        // 같은 카테고리 클릭 시 해제
        console.log('🔴 카테고리 해제:', categoryId);
        setSelectedCategory('');
        setPlaces([]);
        // 마커 제거는 displayPlaces에서 처리
        if (placeOverlayRef.current) {
          placeOverlayRef.current.setMap(null);
        }
      } else {
        // 새로운 카테고리 선택
        console.log('🟢 카테고리 선택:', categoryId);
        setSelectedCategory(categoryId);
      }
    },
    [selectedCategory]
  );

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
            setIsMapReady(true);

            // Places 서비스 초기화
            console.log('🔍 Places 서비스 초기화 시도:', {
              hasKakao: !!window.kakao,
              hasMaps: !!(window.kakao && window.kakao.maps),
              hasServices: !!(
                window.kakao &&
                window.kakao.maps &&
                window.kakao.maps.services
              ),
            });

            if (window.kakao && window.kakao.maps.services) {
              try {
                const placesService = new window.kakao.maps.services.Places(
                  mapInstance
                );
                placesServiceRef.current = placesService;
                setIsPlacesServiceReady(true);
                console.log('✅ Places 서비스 초기화 완료');

                // 커스텀 오버레이 생성
                const contentNode = document.createElement('div');
                contentNode.className = 'placeinfo_wrap';

                const placeOverlay = new window.kakao.maps.CustomOverlay({
                  zIndex: 1,
                  content: contentNode,
                });
                placeOverlayRef.current = placeOverlay;
              } catch (error) {
                console.error('❌ Places 서비스 생성 중 오류:', error);
              }
            } else {
              console.log('❌ Places 서비스 초기화 실패 - services 없음');
              console.log('window.kakao:', window.kakao);
              console.log('window.kakao.maps:', window.kakao?.maps);
              console.log(
                'window.kakao.maps.services:',
                window.kakao?.maps?.services
              );
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
                const latLng = new window.kakao.maps.LatLng(
                  position.getLat(),
                  position.getLng()
                );
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

        {/* 지도 하단 중앙 - 바텀시트 열기 버튼 */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 pointer-events-none">
          <button
            onClick={() => setIsBottomSheetOpen(true)}
            className="p-3 rounded-full bg-white/90 shadow-lg hover:bg-white transition-all pointer-events-auto"
          >
            <span className="material-icons text-gray-700">keyboard_arrow_up</span>
          </button>
        </div>

        {/* 카테고리 버튼들 */}
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 flex gap-2 pointer-events-none category-buttons">
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.id)}
              className={`px-3 py-2 rounded-full text-sm font-medium transition-all shadow-lg pointer-events-auto ${
                selectedCategory === category.id
                  ? 'text-white'
                  : 'text-gray-700 bg-white/90 hover:bg-white'
              }`}
              style={{
                backgroundColor:
                  selectedCategory === category.id ? category.color : undefined,
              }}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* 우측 상단 - 산책 시작 버튼 */}
        <div className="absolute top-4 right-4 z-10 pointer-events-none">
          {!isWalking ? (
            <button
              onClick={handleStartWalk}
              disabled={!!error}
              className="px-4 py-2 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed pointer-events-auto font-medium"
            >
              Walk it!
            </button>
          ) : (
            <button
              onClick={handleEndWalk}
              className="px-4 py-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-all pointer-events-auto font-medium"
            >
              Stop
            </button>
          )}
        </div>

        {/* 검색 결과 표시 */}
        {places.length > 0 && (
          <div className="absolute top-16 left-4 right-4 z-10 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-y-auto pointer-events-auto search-results">
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
                    <div className="font-medium text-gray-900 text-sm">
                      {place.place_name}
                    </div>
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

        {/* 바텀시트 */}
        <BottomSheet
          isOpen={isBottomSheetOpen}
          onClose={() => setIsBottomSheetOpen(false)}
          title="산책 컨트롤"
          defaultSnapPoint={40}
          className="safe-area-bottom"
        >
        <div className="space-y-6">
          {/* GPS 상태 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3">GPS 상태</h3>
            <div className="flex items-center gap-2">
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                  <span className="text-sm text-blue-600">GPS 로딩중...</span>
                </div>
              ) : error ? (
                <div className="flex items-center gap-2">
                  <span className="text-red-500">❌</span>
                  <span className="text-sm text-red-600">GPS 오류</span>
                </div>
              ) : position ? (
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✅</span>
                  <span className="text-sm text-green-600">GPS 연결됨</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">⏳</span>
                  <span className="text-sm text-gray-600">GPS 대기중</span>
                </div>
              )}
            </div>
          </div>

          {/* 산책 정보 */}
          {isWalking && (
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-blue-700 mb-3">산책 정보</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-blue-600">총 거리:</span>
                  <span className="text-sm font-medium text-blue-700">
                    {calculateTotalDistance(pathPositions).toFixed(2)}km
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-blue-600">경로 포인트:</span>
                  <span className="text-sm font-medium text-blue-700">
                    {pathPositions.length}개
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* 산책 컨트롤 버튼 */}
          <div className="space-y-3">
            {!isWalking ? (
              <button
                onClick={handleStartWalk}
                disabled={!!error}
                className="w-full py-4 bg-green-500 text-white rounded-lg shadow-lg hover:bg-green-600 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
              >
                🚶‍♂️ 산책 시작
              </button>
            ) : (
              <button
                onClick={handleEndWalk}
                className="w-full py-4 bg-red-500 text-white rounded-lg shadow-lg hover:bg-red-600 transition-all font-medium"
              >
                🛑 산책 종료
              </button>
            )}
          </div>

          {/* 추가 기능들 */}
          <div className="space-y-3">
            <button
              onClick={() => {
                if (position && map.current) {
                  const latLng = new window.kakao.maps.LatLng(
                    position.getLat(),
                    position.getLng()
                  );
                  (map.current as any).panTo(latLng);
                  setIsBottomSheetOpen(false);
                  toast.success('현재 위치로 이동했습니다!');
                } else {
                  toast.error('GPS 위치를 가져올 수 없습니다.');
                }
              }}
              className="w-full py-3 bg-blue-500 text-white rounded-lg shadow-lg hover:bg-blue-600 transition-all font-medium"
            >
              📍 현재 위치로 이동
            </button>
            
            <button
              onClick={() => {
                navigate('/friends');
                setIsBottomSheetOpen(false);
              }}
              className="w-full py-3 bg-purple-500 text-white rounded-lg shadow-lg hover:bg-purple-600 transition-all font-medium"
            >
              👥 친구 목록
            </button>
          </div>
        </div>
      </BottomSheet>
      </div>
    </div>
  );
};

export default Home;
