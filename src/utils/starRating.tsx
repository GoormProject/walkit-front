import React from 'react';

/**
 * 별점을 별 문자로 렌더링하는 함수
 * @param rating - 평점 (1-5 사이의 숫자, 소수점 가능)
 * @returns 별점 문자열 (예: "★★★☆☆")
 */
export const renderStarRating = (rating: number): string => {
  // 입력값 검증
  if (typeof rating !== 'number' || isNaN(rating)) {
    return '☆☆☆☆☆';
  }
  
  // 범위 제한 (0-5)
  const validRating = Math.max(0, Math.min(5, rating));
  
  const fullStars = Math.floor(validRating);
  const hasHalfStar = validRating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
  
  return '★'.repeat(fullStars) + (hasHalfStar ? '☆' : '') + '☆'.repeat(emptyStars);
};

/**
 * 별점을 별 문자로 렌더링하는 함수 (JSX 반환)
 * @param rating - 평점 (1-5 사이의 숫자, 소수점 가능)
 * @param className - CSS 클래스명 (기본값: "text-yellow-400 text-sm")
 * @returns JSX 요소
 */
export const renderStarRatingJSX = (rating: number, className: string = "text-yellow-400 text-sm") => {
  return (
    <span className={className}>
      {renderStarRating(rating)}
    </span>
  );
};

/**
 * 별점 입력값이 유효한지 검증하는 함수
 * @param rating - 검증할 평점
 * @returns 유효한지 여부
 */
export const isValidRating = (rating: number): boolean => {
  return typeof rating === 'number' && !isNaN(rating) && rating >= 0 && rating <= 5;
}; 
