import { useEffect, useRef, useCallback } from 'react';
import type { FriendLocation } from '@/types/friend';

interface FriendLocationMarkersProps {
  map: kakao.maps.Map | null;
  friends: FriendLocation[];
  isVisible: boolean;
}

const FriendLocationMarkers = ({ map, friends, isVisible }: FriendLocationMarkersProps) => {
  const markersRef = useRef<kakao.maps.Marker[]>([]);
  const infoWindowRef = useRef<kakao.maps.InfoWindow | null>(null);

  // 기본 프로필 이미지 생성 (SVG 기반)
  const createDefaultProfileImage = useCallback(() => {
    const svg = `
      <svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="20" fill="#3b82f6"/>
        <circle cx="20" cy="16" r="6" fill="white"/>
        <path d="M8 32c0-6.627 5.373-12 12-12s12 5.373 12 12" fill="white"/>
      </svg>
    `;
    
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    return URL.createObjectURL(blob);
  }, []);

  // 기존 마커 제거
  const removeMarkers = useCallback(() => {
    console.log('🗑️ 친구 마커 제거:', markersRef.current.length, '개');
    markersRef.current.forEach((marker, index) => {
      console.log(`🗑️ 친구 마커 ${index + 1} 제거`);
      marker.setMap(null);
    });
    markersRef.current = [];
  }, []);

  // 친구 정보창 표시
  const showFriendInfo = useCallback((friend: FriendLocation, marker: kakao.maps.Marker) => {
    if (!map) return;

    // 기존 정보창 제거
    if (infoWindowRef.current) {
      infoWindowRef.current.close();
    }

    const content = `
      <div class="friend-info-window" style="
        padding: 12px;
        min-width: 200px;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      ">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
          <img 
            src="${friend.profile || createDefaultProfileImage()}" 
            alt="${friend.nickname}"
            style="
              width: 32px;
              height: 32px;
              border-radius: 50%;
              object-fit: cover;
              border: 2px solid #e5e7eb;
            "
            onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIxNiIgY3k9IjE2IiByPSIxNiIgZmlsbD0iIzNiODJmNiIvPjxjaXJjbGUgY3g9IjE2IiBjeT0iMTIiIHI9IjUiIGZpbGw9IndoaXRlIi8+PHBhdGggZD0iTTYgMjZjMC01LjUyMyA0LjQ3Ny0xMCAxMC0xMHMxMCA0LjQ3NyAxMCAxMCIgZmlsbD0id2hpdGUiLz48L3N2Zz4='"
          />
          <div>
            <div style="font-weight: 600; color: #1f2937; font-size: 14px;">
              ${friend.nickname}
            </div>
            <div style="color: #6b7280; font-size: 12px;">
              친구
            </div>
          </div>
        </div>
        <div style="
          background: #f3f4f6;
          padding: 6px 8px;
          border-radius: 4px;
          font-size: 12px;
          color: #374151;
          margin-bottom: 8px;
        ">
          📍 현재 위치에서 활동 중
        </div>
        <div style="
          display: flex;
          gap: 4px;
          font-size: 11px;
          color: #6b7280;
        ">
          <span>위치: ${friend.location.lat.toFixed(4)}, ${friend.location.lng.toFixed(4)}</span>
        </div>
      </div>
    `;

    infoWindowRef.current = new window.kakao.maps.InfoWindow({
      content: content,
    } as any);

    infoWindowRef.current.open(map, marker);
  }, [map, createDefaultProfileImage]);

  // 친구 마커 생성
  const createFriendMarkers = useCallback(() => {
    if (!map || !isVisible || friends.length === 0) {
      removeMarkers();
      return;
    }

    console.log('👥 친구 마커 생성:', friends.length, '명');

    friends.forEach((friend, index) => {
      try {
        const { lat, lng } = friend.location;
        
        if (isNaN(lat) || isNaN(lng)) {
          console.warn('⚠️ 잘못된 친구 좌표:', friend.nickname, 'lat:', lat, 'lng:', lng);
          return;
        }

        const position = new window.kakao.maps.LatLng(lat, lng);
        
        // 프로필 이미지 마커 생성 (타입 캐스팅 사용)
        const imageSize = new (window.kakao.maps as any).Size(40, 40);
        const imageSrc = friend.profile || createDefaultProfileImage();
        
        const markerImage = new (window.kakao.maps as any).MarkerImage(imageSrc, imageSize, {
          offset: new (window.kakao.maps as any).Point(20, 20), // 중앙 정렬
          shape: 'circle' // 원형 마스크
        });

        const marker = new window.kakao.maps.Marker({
          position: position,
          map: map,
        } as any);

        // 마커에 이미지 설정 (타입 캐스팅 사용)
        (marker as any).setImage(markerImage);
        (marker as any).setZIndex(1); // 검색 마커보다 낮은 우선순위

        // 마커 클릭 이벤트
        window.kakao.maps.event.addListener(marker, 'click', () => {
          showFriendInfo(friend, marker);
        });

        markersRef.current.push(marker);
        console.log('✅ 친구 마커 생성 성공:', friend.nickname, '좌표:', { lat, lng });
      } catch (error) {
        console.error('❌ 친구 마커 생성 실패:', friend.nickname, error);
      }
    });

    console.log('✅ 친구 마커 생성 완료:', markersRef.current.length, '개');
  }, [map, friends, isVisible, removeMarkers, showFriendInfo, createDefaultProfileImage]);

  // 마커 생성/제거 효과
  useEffect(() => {
    if (isVisible) {
      createFriendMarkers();
    } else {
      removeMarkers();
    }

    // 컴포넌트 언마운트 시 정리
    return () => {
      removeMarkers();
      if (infoWindowRef.current) {
        infoWindowRef.current.close();
      }
    };
  }, [isVisible, createFriendMarkers, removeMarkers]);

  // 친구 목록 변경 시 마커 업데이트
  useEffect(() => {
    if (isVisible) {
      createFriendMarkers();
    }
  }, [friends, createFriendMarkers, isVisible]);

  return null; // 이 컴포넌트는 UI를 렌더링하지 않음
};

export default FriendLocationMarkers; 
