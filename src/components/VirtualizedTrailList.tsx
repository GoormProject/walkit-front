import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { TrailPathData } from '../types/trail';

interface VirtualizedTrailListProps {
  paths: TrailPathData[];
  visibleTrails: Set<string>;
  onTrailToggle: (trailId: string) => void;
  onTrailClick: (trailId: string) => void;
  itemHeight?: number;
  containerHeight?: number;
}

const VirtualizedTrailList: React.FC<VirtualizedTrailListProps> = ({
  paths,
  visibleTrails,
  onTrailToggle,
  onTrailClick,
  itemHeight = 32,
  containerHeight = 128
}) => {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // 가상화 계산
  const totalHeight = paths.length * itemHeight;
  const visibleItemCount = Math.ceil(containerHeight / itemHeight);
  const startIndex = Math.floor(scrollTop / itemHeight);
  const endIndex = Math.min(startIndex + visibleItemCount + 1, paths.length);

  // 스크롤 핸들러
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  // 스크롤 위치 동기화
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = scrollTop;
    }
  }, [scrollTop]);

  // 보이는 아이템들만 렌더링
  const visibleItems = paths.slice(startIndex, endIndex).map((path, index) => {
    const actualIndex = startIndex + index;
    const isVisible = visibleTrails.has(path.id);

    return (
      <div
        key={path.id}
        className="flex items-center gap-2 text-xs hover:bg-gray-50 transition-colors duration-150"
        style={{
          height: itemHeight,
          transform: `translateY(${actualIndex * itemHeight}px)`,
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0
        }}
      >
        <input
          type="checkbox"
          checked={isVisible}
          onChange={() => onTrailToggle(path.id)}
          className="w-3 h-3"
        />
        <span 
          className="flex-1 truncate cursor-pointer hover:text-blue-600 transition-colors duration-150"
          onClick={() => onTrailClick(path.id)}
          title={path.name}
        >
          {path.name}
        </span>
        <div 
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: path.style.strokeColor }}
          title={`${path.courseType} - ${path.properties.difficulty || '난이도 정보 없음'}`}
        />
      </div>
    );
  });

  return (
    <div
      ref={containerRef}
      className="relative overflow-y-auto"
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        {visibleItems}
      </div>
    </div>
  );
};

export default VirtualizedTrailList; 
