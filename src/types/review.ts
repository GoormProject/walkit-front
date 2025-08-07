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
  trailId: number;
  createdAt: string;
}

// 리뷰 API 응답
export interface ReviewApiResponse {
  httpStatus: number;
  message: string;
  data: ReviewResponse;
}

// 리뷰 목록 조회 응답
export interface ReviewListResponse {
  trailId: number;
  rating: number;
  myReview: ReviewResponse | null;
  reviews: ReviewResponse[];
}

// 리뷰 목록 API 응답
export interface ReviewListApiResponse {
  httpStatus: number;
  message: string;
  data: ReviewListResponse;
} 
