import React, { useState, useEffect } from 'react';
import { Pause, Play, Square, Timer, MapPin, TrendingUp } from 'lucide-react';

interface WalkControlPanelProps {
  isWalking: boolean;
  isPaused: boolean;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  distance: number; // km
  startTime: Date | null;
}

const WalkControlPanel: React.FC<WalkControlPanelProps> = ({
  isWalking,
  isPaused,
  onPause,
  onResume,
  onStop,
  distance,
  startTime,
}) => {
  const [elapsedTime, setElapsedTime] = useState(0);

  // 경과 시간 계산
  useEffect(() => {
    if (!isWalking || !startTime || isPaused) {
      return;
    }

    const interval = setInterval(() => {
      const now = new Date();
      const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000);
      setElapsedTime(elapsed);
    }, 1000);

    return () => clearInterval(interval);
  }, [isWalking, startTime, isPaused]);

  // 시간 포맷팅
  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 평균 페이스 계산 (분/km)
  const calculateAveragePace = (): string => {
    if (distance === 0) return '0:00';
    
    const totalMinutes = elapsedTime / 60;
    const paceMinutes = totalMinutes / distance;
    const paceMin = Math.floor(paceMinutes);
    const paceSec = Math.floor((paceMinutes - paceMin) * 60);
    
    return `${paceMin}:${paceSec.toString().padStart(2, '0')}`;
  };

  if (!isWalking) {
    return null;
  }

  return (
    <div className="absolute bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-t border-gray-200 shadow-lg animate-slide-up">
      <div className="p-4">
        {/* 산책 정보 */}
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <Timer className="w-6 h-6 text-blue-600" />
              <div>
                <div className="text-xs text-gray-500">산책 시간</div>
                <div className="text-xl font-bold text-gray-900">
                  {formatTime(elapsedTime)}
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-6 h-6 text-green-600" />
              <div>
                <div className="text-xs text-gray-500">총 거리</div>
                <div className="text-xl font-bold text-gray-900">
                  {distance.toFixed(2)}km
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-6 h-6 text-purple-600" />
              <div>
                <div className="text-xs text-gray-500">평균 페이스</div>
                <div className="text-xl font-bold text-gray-900">
                  {calculateAveragePace()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 컨트롤 버튼들 */}
        <div className="flex justify-center space-x-3">
          {isPaused ? (
            <button
              onClick={onResume}
              className="flex items-center space-x-2 px-8 py-4 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all shadow-lg font-semibold"
            >
              <Play className="w-6 h-6" />
              <span>재개</span>
            </button>
          ) : (
            <button
              onClick={onPause}
              className="flex items-center space-x-2 px-8 py-4 bg-yellow-500 text-white rounded-xl hover:bg-yellow-600 transition-all shadow-lg font-semibold"
            >
              <Pause className="w-6 h-6" />
              <span>일시정지</span>
            </button>
          )}
          
          <button
            onClick={onStop}
            className="flex items-center space-x-2 px-8 py-4 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all shadow-lg font-semibold"
          >
            <Square className="w-6 h-6" />
            <span>중단</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WalkControlPanel; 
