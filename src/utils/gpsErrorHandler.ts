// GPS 에러 코드
export const GPSErrorCode = {
  PERMISSION_DENIED: 1,
  POSITION_UNAVAILABLE: 2,
  TIMEOUT: 3,
} as const;

// GPS 에러 메시지 생성
export const handleGPSError = (error: GeolocationPositionError): string => {
  switch (error.code) {
    case GPSErrorCode.PERMISSION_DENIED:
      return '위치 권한이 거부되었습니다.';
    case GPSErrorCode.POSITION_UNAVAILABLE:
      return '위치 정보를 사용할 수 없습니다. HTTPS 환경에서 실행하거나 GPS를 활성화해주세요.';
    case GPSErrorCode.TIMEOUT:
      return '위치 요청 시간이 초과되었습니다.';
    default:
      return '위치 정보를 가져오는 중 오류가 발생했습니다.';
  }
};

interface GPSErrorInfo {
  message: string;
  guideText?: string;
  guideLink?: string;
}

export const getGPSErrorInfo = (error: GeolocationPositionError): GPSErrorInfo => {
  switch (error.code) {
    case GPSErrorCode.PERMISSION_DENIED:
      return {
        message: '위치 권한이 거부되었습니다',
        guideText: '설정에서 위치 권한을 허용해주세요',
        guideLink: '/guide/location-permission'  // 앱 가이드 문서 링크
      };
    case GPSErrorCode.POSITION_UNAVAILABLE:
      return {
        message: 'GPS 신호를 찾을 수 없습니다',
        guideText: 'HTTPS 환경에서 실행하거나 실외에서 다시 시도해주세요'
      };
    case GPSErrorCode.TIMEOUT:
      return {
        message: 'GPS 신호 수신 시간이 초과되었습니다',
        guideText: '잠시 후 다시 시도해주세요'
      };
    default:
      return {
        message: '알 수 없는 GPS 오류가 발생했습니다'
      };
  }
};

export const getAccuracyWarning = (accuracy: number): string | null => {
  if (accuracy > 100) {
    return '정말 실외인가요? GPS 신호가 매우 약합니다';
  }
  if (accuracy > 50) {
    return 'GPS 신호가 약합니다. 하늘이 잘 보이는 곳으로 이동해보세요';
  }
  return null;
}; 
