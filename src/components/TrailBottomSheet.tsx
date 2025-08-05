import React from 'react';
import BottomSheet from './ui/BottomSheet';

interface TrailBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  activeTab: 'trails' | 'weather';
  setActiveTab: (tab: 'trails' | 'weather') => void;
  nearbyTrails: any[];
  sortOption: string;
  setSortOption: (option: string) => void;
  onTrailCardClick: (trail: any) => void;
}

const TrailBottomSheet: React.FC<TrailBottomSheetProps> = ({
  isOpen,
  onClose,
  activeTab,
  setActiveTab,
  nearbyTrails,
  sortOption,
  setSortOption,
  onTrailCardClick
}) => {
  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
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
            </div>
          ) : (
            <div className="p-4">
              {/* 날씨 정보 */}
              <div className="bg-blue-500 rounded-lg p-4 text-white">
                <div className="flex justify-between items-start">
                  {/* 왼쪽 정보 */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold">고양시</h3>
                    <div className="text-3xl font-bold">29°C</div>
                    <div className="text-sm space-y-1">
                      <div>강수확률: 20%</div>
                      <div>습도: 74%</div>
                    </div>
                  </div>
                  
                  {/* 오른쪽 정보 */}
                  <div className="text-right space-y-2">
                    <div className="text-4xl">☀️</div>
                    <div className="text-sm">대체로 맑음</div>
                    <div className="text-xs">최고:31° 최저:31°</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 text-center text-gray-500 text-sm">
                날씨 API 연동 예정
              </div>
            </div>
          )}
        </div>
      </div>
    </BottomSheet>
  );
};

export default TrailBottomSheet; 
