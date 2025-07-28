import React, { useState } from 'react';
import { useGPSStore } from '@/features/gps/gpsSlice';
import { MOCK_PATH_COORDS, MOCK_ACCURACY_VALUES, MOCK_GPS_ERRORS } from '@/utils/mockGPSData';

interface GPSSimulatorProps {
  onPositionChange?: (lat: number, lng: number) => void;
}

export const GPSSimulator: React.FC<GPSSimulatorProps> = ({ onPositionChange }) => {
  const [currentPathIndex, setCurrentPathIndex] = useState(0);
  const [currentAccuracyIndex, setCurrentAccuracyIndex] = useState(0);
  const { setError, setAccuracy } = useGPSStore(state => state.actions);

  // 다음 위치로 이동
  const handleNextPosition = () => {
    const nextIndex = (currentPathIndex + 1) % MOCK_PATH_COORDS.length;
    setCurrentPathIndex(nextIndex);
    const { lat, lng } = MOCK_PATH_COORDS[nextIndex];
    onPositionChange?.(lat, lng);
  };

  // 이전 위치로 이동
  const handlePrevPosition = () => {
    const prevIndex = (currentPathIndex - 1 + MOCK_PATH_COORDS.length) % MOCK_PATH_COORDS.length;
    setCurrentPathIndex(prevIndex);
    const { lat, lng } = MOCK_PATH_COORDS[prevIndex];
    onPositionChange?.(lat, lng);
  };

  // 정확도 변경
  const handleChangeAccuracy = () => {
    const nextIndex = (currentAccuracyIndex + 1) % MOCK_ACCURACY_VALUES.length;
    setCurrentAccuracyIndex(nextIndex);
    setAccuracy(MOCK_ACCURACY_VALUES[nextIndex]);
  };

  // GPS 에러 시뮬레이션
  const handleSimulateError = (errorIndex: number) => {
    setError(MOCK_GPS_ERRORS[errorIndex]);
  };

  const currentPosition = MOCK_PATH_COORDS[currentPathIndex];
  const currentAccuracy = MOCK_ACCURACY_VALUES[currentAccuracyIndex];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold">GPS 시뮬레이터</h3>
      
      {/* 현재 위치 정보 */}
      <div className="text-sm space-y-1 p-3 bg-white rounded-lg border border-gray-200">
        <p>현재 위치:</p>
        <p className="font-mono text-xs">
          {currentPosition.lat.toFixed(6)}, {currentPosition.lng.toFixed(6)}
        </p>
        <p className="mt-2">정확도: <span className="font-semibold">{currentAccuracy}m</span></p>
      </div>

      {/* 위치 제어 버튼 */}
      <div className="flex space-x-2">
        <button
          onClick={handlePrevPosition}
          className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex-1 text-sm"
        >
          ← 이전 위치
        </button>
        <button
          onClick={handleNextPosition}
          className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex-1 text-sm"
        >
          다음 위치 →
        </button>
      </div>

      {/* 정확도 제어 */}
      <button
        onClick={handleChangeAccuracy}
        className="w-full px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
      >
        정확도 변경 ({currentAccuracy}m)
      </button>

      {/* 에러 시뮬레이션 */}
      <div className="space-y-2 pt-2 border-t border-gray-200">
        <p className="text-sm font-medium text-gray-700">에러 시뮬레이션</p>
        <button
          onClick={() => handleSimulateError(0)}
          className="w-full px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
        >
          권한 거부 에러
        </button>
        <button
          onClick={() => handleSimulateError(1)}
          className="w-full px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
        >
          신호 없음 에러
        </button>
        <button
          onClick={() => handleSimulateError(2)}
          className="w-full px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
        >
          타임아웃 에러
        </button>
      </div>
    </div>
  );
}; 
