import React from 'react';

interface TrailDetailCardProps {
  trail: any;
  onBack: () => void;
  onStartWalk: () => void;
  error?: any;
}

const TrailDetailCard: React.FC<TrailDetailCardProps> = ({
  trail,
  onBack,
  onStartWalk,
  error
}) => {
  return (
    <div className="absolute bottom-4 left-4 right-4 z-40 pointer-events-auto">
      <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <button
            onClick={onBack}
            className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="트레일 목록으로 돌아가기"
          >
            <span className="material-icons text-xl">arrow_back</span>
          </button>
          <h2 className="text-lg font-semibold text-gray-900">
            {trail.name}
          </h2>
          <div className="w-10"></div> {/* 균형을 위한 빈 공간 */}
        </div>

        {/* 콘텐츠 */}
        <div className="p-4">
          <div className="flex space-x-4">
            {/* 왼쪽 정보 */}
            <div className="flex-1">
              {/* 평점 */}
              <div className="flex items-center mb-2">
                <span className="text-yellow-400 text-sm">★★★★☆</span>
                <span className="text-sm text-gray-600 ml-1">
                  {trail.rating} ({trail.reviewCount})
                </span>
              </div>

              {/* 설명 */}
              <p className="text-sm text-gray-700 mb-2">
                {trail.description} {trail.category}
              </p>

              {/* 거리 */}
              <p className="text-sm text-gray-500">
                내 위치로부터 약 {trail.distance}km
              </p>
            </div>

            {/* 오른쪽 이미지 */}
            <div className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0">
              <img
                src={trail.image}
                alt={trail.name}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>

          {/* Walk it! 버튼 */}
          <div className="mt-4">
            <button
              onClick={onStartWalk}
              disabled={!!error}
              className="w-full py-3 bg-green-500 text-white rounded-lg shadow-lg hover:bg-green-600 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
            >
              Walk it!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrailDetailCard; 
