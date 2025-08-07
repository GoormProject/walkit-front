// 리뷰 작성 요청
export interface ReviewCreateRequest {
  trailId: number;
  content: string;
  rating: number; // 1-5점
}

// 리뷰 응답
export interface ReviewResponse {
  reviewId: number;
  content: string;
  rating: number;
  eventId: number;
  createdAt: string;
}

// 리뷰 API 응답
export interface ReviewApiResponse {
  httpStatus: number;
  message: string;
  data: ReviewResponse;
} 
