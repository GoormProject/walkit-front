import React, { useState } from 'react';
import BottomSheet from './ui/BottomSheet';
import type { Trail } from '../types/trail';
import { useWeather } from '@/hooks/useWeather';

interface TrailBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: 'trails' | 'weather';
  setActiveTab: (tab: 'trails' | 'weather') => void;
  nearbyTrails: Trail[];
  isTrailsLoading?: boolean;
  sortOption: string;
  setSortOption: (option: string) => void;
  onTrailCardClick: (trail: Trail) => void;
}

interface WeatherInfo {
  city: string;
  temperature: number;
  precipitation: number;
  humidity: number;
  condition: string;
  icon: string;
}

const TrailBottomSheet: React.FC<TrailBottomSheetProps> = ({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  nearbyTrails,
  isTrailsLoading = false,
  sortOption,
  setSortOption,
  onTrailCardClick
}) => {
  const {
    weatherInfo,
    threeHourLater,
    tomorrow,
    dayAfterTomorrow,
    threeDaysLater,
    isLoading: isWeatherLoading,
    error: weatherError,
    getCloudDescription
  } = useWeather();

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={activeTab === 'trails' ? '근처 산책로 및 날씨 정보' : '날씨 정보'}
      defaultSnapPoint={60}
      className="safe-area-bottom"
      showBackdrop={false}
    >
      <div className="h-full flex flex-col">
        {/* 탭 헤더 */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
          <div className="flex space-x-6">
            <button
              onClick={() => setActiveTab('trails')}
              className={`text-sm font-medium transition-colors ${
                activeTab === 'trails'
                  ? 'text-black border-b-2 border-black pb-1'
                  : 'text-gray-500'
              }`}
            >
              근처 산책로
            </button>
            <button
              onClick={() => setActiveTab('weather')}
              className={`text-sm font-medium transition-colors ${
                activeTab === 'weather'
                  ? 'text-black border-b-2 border-black pb-1'
                  : 'text-gray-500'
              }`}
            >
              날씨
            </button>
          </div>
          
          {/* 정렬 옵션 (산책로 탭에서만 표시) */}
          {activeTab === 'trails' && (
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="text-xs text-gray-600 bg-transparent border-none outline-none"
            >
              <option value="distance">가까운 거리 순</option>
              <option value="rating">평점 순</option>
              <option value="popularity">인기 순</option>
            </select>
          )}
        </div>

        {/* 탭 콘텐츠 */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'trails' ? (
            <div className="p-4 space-y-4">
              {/* 로딩 상태 */}
              {isTrailsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mr-3"></div>
                  <span className="text-gray-600 text-sm">산책로 목록을 불러오는 중...</span>
                </div>
              ) : (
                <>
                  {/* 근처 산책로 목록 */}
                  {nearbyTrails.length > 0 ? (
                    nearbyTrails.map((trail, index) => (
                      <div 
                        key={index} 
                        className="flex space-x-3 p-3 bg-white rounded-lg shadow-sm border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => onTrailCardClick(trail)}
                      >
                        {/* 이미지 */}
                        <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0">
                          <img
                            src={trail.image || '/public/test_picture/test_for_success.jpg'}
                            alt={trail.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                        
                        {/* 정보 */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-gray-900 text-sm mb-1">
                            {trail.name}
                          </h3>
                          
                          {/* 평점 */}
                          <div className="flex items-center mb-1">
                            <span className="text-yellow-400 text-xs">★★★★☆</span>
                            <span className="text-xs text-gray-600 ml-1">
                              {trail.rating} ({trail.reviewCount})
                            </span>
                          </div>
                          
                          {/* 설명 */}
                          <p className="text-xs text-gray-600 mb-1">
                            {trail.description}
                          </p>
                          
                          {/* 카테고리 */}
                          <span className="text-xs text-gray-500">
                            {trail.category}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 text-sm">근처 산책로를 찾는 중...</p>
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            <div className="p-4 overflow-y-auto">
              {/* 날씨 로딩 또는 에러 처리 */}
              {isWeatherLoading ? (
                <div className="text-center text-sm text-gray-500">날씨 정보를 불러오는 중...</div>
              ) : weatherError ? (
                <div className="text-center text-sm text-red-500">{weatherError}</div>
              ) : (
                <>
                  <div className="bg-blue-500 rounded-lg p-4 text-white">
                    <div className="flex justify-between items-start">
                      <div className="space-y-2 text-left">
                        <h3 className="text-lg font-semibold">{weatherInfo.city}</h3>
                        <div className="text-3xl font-bold">{weatherInfo.temperature}°C</div>
                        <div className="text-sm space-y-1">
                          <div>습도: {weatherInfo.humidity}%</div>
                          <div>풍속: {weatherInfo.windSpeed}m/s</div>
                        </div>
                      </div>
                      <div className="text-right space-y-2">
                        <div className="text-4xl">{weatherInfo.icon}</div>
                        <div className="text-sm">{weatherInfo.condition}</div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 text-center text-gray-500 text-sm">
                    <div className="mt-4 text-center text-gray-500 text-sm">
                      <div className="text-left font-semibold text-black mb-2">날씨 예보</div>

                      <div className="flex space-x-3 overflow-x-auto pb-2">
                        {[ 
                          { label: '현재', data: weatherInfo },
                          { label: '3시간 뒤', data: threeHourLater },
                          { label: '내일', data: tomorrow },
                          { label: '모레', data: dayAfterTomorrow },
                          { label: '3일 뒤', data: threeDaysLater },
                        ].map(
                          (forecast, idx) =>
                            forecast.data && (
                              <div
                                key={idx}
                                className="min-w-[100px] bg-white rounded-lg shadow p-2 text-black text-center"
                              >
                                <div className="text-xs font-medium">{forecast.label}</div>
                                <div className="text-xl font-bold mt-1">{forecast.data.temperature}°C</div>
                                <div className="text-2xl mt-1">{forecast.data.icon}</div>
                                <div className="text-xs mt-2 space-y-1">
                                  {getCloudDescription(forecast.data.clouds) && (
                                    <div>☁️ {getCloudDescription(forecast.data.clouds)}</div>
                                  )}
                                  <div>💧 {forecast.data.humidity}%</div>
                                </div>
                              </div>
                            )
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </BottomSheet>
  );
};

export default TrailBottomSheet; 
