/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface BaseResponseWalkEventResponse {
  /** @format int32 */
  httpStatus?: number;
  message?: string;
  data?: WalkEventResponse;
}

export interface WalkEventResponse {
  /** @format int64 */
  walkId?: number;
  /** @format int64 */
  eventId?: number;
  eventType?: 'START' | 'PAUSE' | 'RESUME' | 'END';
  /** @format date-time */
  eventTime?: string;
}

export interface ProfileRequest {
  /**
   * @minLength 0
   * @maxLength 20
   */
  name: string;
  /**
   * @minLength 0
   * @maxLength 20
   */
  nickname: string;
}

export interface BaseResponseProfileResponse {
  /** @format int32 */
  httpStatus?: number;
  message?: string;
  data?: ProfileResponse;
}

export interface ProfileResponse {
  name?: string;
  nickname?: string;
  email?: string;
  profile?: string;
}

export interface LocationDto {
  /**
   * @format double
   * @min -180
   * @max 180
   */
  lng: number;
  /**
   * @format double
   * @min -90
   * @max 90
   */
  lat: number;
}

export interface BaseResponseLocationDto {
  /** @format int32 */
  httpStatus?: number;
  message?: string;
  data?: LocationDto;
}

export interface BaseResponseFriendRequestApprovedResponse {
  /** @format int32 */
  httpStatus?: number;
  message?: string;
  data?: FriendRequestApprovedResponse;
}

export interface FriendRequestApprovedResponse {
  /** @format int64 */
  friendId?: number;
}

export interface WalkRequest {
  /** @format int64 */
  walkId?: number;
  /**
   * @minLength 0
   * @maxLength 100
   */
  walkTitle: string;
  /**
   * @format int32
   * @min 0
   */
  totalTime: number;
  /**
   * @format double
   * @min 0
   */
  totalDistance: number;
  /**
   * @format double
   * @min 0
   */
  pace: number;
  /** @minItems 1 */
  path: number[][];
  /** @minItems 1 */
  startPoint: number[];
  /** @format int64 */
  eventId?: number;
  eventType?: string;
  routeUrl?: string;
}

export interface BaseResponseWalkCreateResponse {
  /** @format int32 */
  httpStatus?: number;
  message?: string;
  data?: WalkCreateResponse;
}

export interface WalkCreateResponse {
  /** @format int64 */
  walkId?: number;
}

export interface GeoPoint {
  /** @format double */
  longitude?: number;
  /** @format double */
  latitude?: number;
}

export interface TrailCreateRequest {
  /** @format int64 */
  walkId: number;
  /**
   * @minLength 1
   * @maxLength 100
   */
  title?: string;
  /**
   * @minLength 1
   * @maxLength 100
   */
  description?: string;
  /**
   * @minLength 1
   * @maxLength 100
   */
  location?: string;
  /** @format double */
  length: number;
  routeImageUrl?: string;
  geoPoint: GeoPoint;
  path: GeoPoint[];
  isUploaded: boolean;
}

export interface BaseResponseTrailCreateResponse {
  /** @format int32 */
  httpStatus?: number;
  message?: string;
  data?: TrailCreateResponse;
}

export interface TrailCreateResponse {
  /** @format int64 */
  walkId?: number;
  /** @format int64 */
  trailId?: number;
  /** @format date-time */
  createdAt?: string;
  isUploaded?: boolean;
}

export interface BaseResponseFriendRequestResponseDTO {
  /** @format int32 */
  httpStatus?: number;
  message?: string;
  data?: FriendRequestResponseDTO;
}

export interface FriendRequestResponseDTO {
  status?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  senderNickname?: string;
  receiverNickname?: string;
  /** @format int64 */
  friendRequestId?: number;
}

export interface BaseResponseVoid {
  /** @format int32 */
  httpStatus?: number;
  message?: string;
  data?: any;
}

export interface BaseResponseWeatherForecastResponseDto {
  /** @format int32 */
  httpStatus?: number;
  message?: string;
  data?: WeatherForecastResponseDto;
}

export interface WeatherDto {
  /** @format double */
  temperature?: number;
  weather?: string;
  /** @format int32 */
  humidity?: number;
  /** @format double */
  windSpeed?: number;
  /** @format int32 */
  clouds?: number;
}

export interface WeatherForecastResponseDto {
  adminAreaName?: string;
  current?: WeatherDto;
  after3hours?: WeatherDto;
  tomorrow?: WeatherDto;
  dayAfterTomorrow?: WeatherDto;
  threeDaysLater?: WeatherDto;
}

export interface BaseResponseClothResponse {
  /** @format int32 */
  httpStatus?: number;
  message?: string;
  data?: ClothResponse;
}

export interface ClothResponse {
  recommendations?: any[];
}

export interface BaseResponseListWalkListResponse {
  /** @format int32 */
  httpStatus?: number;
  message?: string;
  data?: WalkListResponse[];
}

export interface WalkListResponse {
  /** @format int64 */
  walkId?: number;
  /** @format int64 */
  trailId?: number;
  /** @format int64 */
  eventId?: number;
  eventTime?: string;
  /** @format int64 */
  trailImageId?: number;
  routeImageUrl?: string;
  /** @format double */
  totalDistance?: number;
  totalTime?: string;
  pace?: string;
  title?: string;
  isUploaded?: boolean;
}

export interface BaseResponsePageTrailListResponse {
  /** @format int32 */
  httpStatus?: number;
  message?: string;
  data?: PageTrailListResponse;
}

export interface PageTrailListResponse {
  /** @format int64 */
  totalElements?: number;
  /** @format int32 */
  totalPages?: number;
  first?: boolean;
  last?: boolean;
  /** @format int32 */
  size?: number;
  content?: TrailListResponse[];
  /** @format int32 */
  number?: number;
  sort?: SortObject;
  /** @format int32 */
  numberOfElements?: number;
  pageable?: PageableObject;
  empty?: boolean;
}

export interface PageableObject {
  /** @format int64 */
  offset?: number;
  sort?: SortObject;
  paged?: boolean;
  /** @format int32 */
  pageNumber?: number;
  /** @format int32 */
  pageSize?: number;
  unpaged?: boolean;
}

export interface SortObject {
  empty?: boolean;
  sorted?: boolean;
  unsorted?: boolean;
}

export interface TrailListResponse {
  /** @format int64 */
  trailId?: number;
  title?: string;
  location?: string;
  /** @format double */
  length?: number;
  routeImageUrl?: string;
  /** @format int32 */
  reviewCount?: number;
  /** @format double */
  rating?: number;
}

export interface BaseResponseTrailDetailResponse {
  /** @format int32 */
  httpStatus?: number;
  message?: string;
  data?: TrailDetailResponse;
}

export interface TrailDetailResponse {
  title?: string;
  description?: string;
  location?: string;
  /** @format double */
  length?: number;
  routeImageUrl?: string;
  /** @format int32 */
  reviewCount?: number;
  /** @format double */
  rating?: number;
  startPoint?: number[];
  path?: number[][];
}

export interface BaseResponseFriendListResponseDTO {
  /** @format int32 */
  httpStatus?: number;
  message?: string;
  data?: FriendListResponseDTO;
}

export interface FriendListResponseDTO {
  /** @format int32 */
  total?: number;
  /** @format int32 */
  online?: number;
  /** @format int32 */
  offline?: number;
  onlineFriends?: FriendResponseDTO[];
  offlineFriends?: FriendResponseDTO[];
}

export interface FriendResponseDTO {
  /** @format int64 */
  friendId?: number;
  nickname?: string;
  profile?: string;
  memberStatus?: 'OFFLINE' | 'ONLINE' | 'WALKING';
}

export interface BaseResponseListFriendResponseDTO {
  /** @format int32 */
  httpStatus?: number;
  message?: string;
  data?: FriendResponseDTO[];
}

export interface BaseResponseListSentFriendResponse {
  /** @format int32 */
  httpStatus?: number;
  message?: string;
  data?: SentFriendResponse[];
}

export interface SentFriendResponse {
  receiverNickname?: string;
  memberStatus?: 'OFFLINE' | 'ONLINE' | 'WALKING';
}

export interface BaseResponseListReceivedFriendResponse {
  /** @format int32 */
  httpStatus?: number;
  message?: string;
  data?: ReceivedFriendResponse[];
}

export interface ReceivedFriendResponse {
  senderNickname?: string;
  profile?: string;
  requestStatus?: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
}

export interface BaseResponseListFriendLocationResponseDTO {
  /** @format int32 */
  httpStatus?: number;
  message?: string;
  data?: FriendLocationResponseDTO[];
}

export interface FriendLocationResponseDTO {
  /** @format int64 */
  friendId?: number;
  /** @format int64 */
  memberId?: number;
  nickname?: string;
  profile?: string;
  location?: LocationDto;
}

export interface BaseResponseCurrentUserDto {
  /** @format int32 */
  httpStatus?: number;
  message?: string;
  data?: CurrentUserDto;
}

export interface CurrentUserDto {
  /** @format int64 */
  memberId?: number;
  email?: string;
  isProfileSet?: boolean;
}

export interface BaseResponseWalkDeleteResponse {
  /** @format int32 */
  httpStatus?: number;
  message?: string;
  data?: WalkDeleteResponse;
}

export interface WalkDeleteResponse {
  /** @format int64 */
  walkId?: number;
  /** @format int64 */
  memberId?: number;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from 'axios';
import axios from 'axios';

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, 'data' | 'params' | 'url' | 'responseType'> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  'body' | 'method' | 'query' | 'path'
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, 'data' | 'cancelToken'> {
  securityWorker?: (
    securityData: SecurityDataType | null
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = 'application/json',
  JsonApi = 'application/vnd.api+json',
  FormData = 'multipart/form-data',
  UrlEncoded = 'application/x-www-form-urlencoded',
  Text = 'text/plain',
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>['securityWorker'];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || 'http://localhost:8080',
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === 'object' && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem)
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === 'boolean' ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === 'object'
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== 'string'
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { 'Content-Type': type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title Walkit API
 * @version v1.0.0
 * @baseUrl http://localhost:8080
 * @contact Walkit Team (https://walkit.life)
 *
 * 소셜 위치 기반 산책 플랫폼 Walkit의 API 명세서입니다.
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * @description 일시정지된 산책을 다시 시작합니다.
     *
     * @tags 산책 기록
     * @name ResumeWalk
     * @summary 산책 기록 재개
     * @request PUT:/api/walks/{walkId}/resume
     */
    resumeWalk: (walkId: number, params: RequestParams = {}) =>
      this.request<BaseResponseWalkEventResponse, any>({
        path: `/api/walks/${walkId}/resume`,
        method: 'PUT',
        ...params,
      }),

    /**
     * @description 진행 중인 산책을 일시정지합니다.
     *
     * @tags 산책 기록
     * @name PauseWalk
     * @summary 산책 기록 일시정지
     * @request PUT:/api/walks/{walkId}/pause
     */
    pauseWalk: (walkId: number, params: RequestParams = {}) =>
      this.request<BaseResponseWalkEventResponse, any>({
        path: `/api/walks/${walkId}/pause`,
        method: 'PUT',
        ...params,
      }),

    /**
     * @description 진행 중인 산책을 최종 종료합니다.
     *
     * @tags 산책 기록
     * @name EndWalk
     * @summary 산책 기록 종료
     * @request PUT:/api/walks/{walkId}/end
     */
    endWalk: (walkId: number, params: RequestParams = {}) =>
      this.request<BaseResponseWalkEventResponse, any>({
        path: `/api/walks/${walkId}/end`,
        method: 'PUT',
        ...params,
      }),

    /**
     * @description 이름과 닉네임, 프로필 이미지, 이메일을 조회합니다.
     *
     * @tags 회원
     * @name GetProfile
     * @summary 내 정보 조회
     * @request GET:/api/members/{memberId}
     * @secure
     */
    getProfile: (memberId: number, params: RequestParams = {}) =>
      this.request<BaseResponseProfileResponse, any>({
        path: `/api/members/${memberId}`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * @description 이름과 닉네임, 프로필 이미지를 수정합니다.
     *
     * @tags 회원
     * @name UpdateProfile
     * @summary 프로필 수정
     * @request PUT:/api/members/{memberId}
     * @secure
     */
    updateProfile: (
      memberId: number,
      data: {
        data: ProfileRequest;
        /** @format binary */
        profileImage?: File;
      },
      params: RequestParams = {}
    ) =>
      this.request<BaseResponseProfileResponse, any>({
        path: `/api/members/${memberId}`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.FormData,
        ...params,
      }),

    /**
     * @description 자신의 현재 위치를 갱신합니다.
     *
     * @tags 회원
     * @name UpdateLocation
     * @summary 현재 위치 갱신
     * @request PUT:/api/members/{memberId}/location
     * @secure
     */
    updateLocation: (
      memberId: number,
      data: LocationDto,
      params: RequestParams = {}
    ) =>
      this.request<BaseResponseLocationDto, any>({
        path: `/api/members/${memberId}/location`,
        method: 'PUT',
        body: data,
        secure: true,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description 친구 요청을 승인합니다.
     *
     * @tags 친구
     * @name ApproveFriendRequest
     * @summary 친구 요청 승인
     * @request PUT:/api/friends/request/{friendRequestId}
     * @secure
     */
    approveFriendRequest: (
      friendRequestId: number,
      params: RequestParams = {}
    ) =>
      this.request<BaseResponseFriendRequestApprovedResponse, any>({
        path: `/api/friends/request/${friendRequestId}`,
        method: 'PUT',
        secure: true,
        ...params,
      }),

    /**
     * @description 친구 요청을 거절합니다.
     *
     * @tags 친구
     * @name RejectFriendRequest
     * @summary 친구 요청 거절
     * @request DELETE:/api/friends/request/{friendRequestId}
     * @secure
     */
    rejectFriendRequest: (
      friendRequestId: number,
      params: RequestParams = {}
    ) =>
      this.request<BaseResponseVoid, any>({
        path: `/api/friends/request/${friendRequestId}`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),

    /**
     * @description 새로운 산책 기록을 시작하고, 생성된 walkId와 eventId를 반환합니다.
     *
     * @tags 산책 기록
     * @name StartWalk
     * @summary 산책 기록 시작
     * @request POST:/api/walks/start
     */
    startWalk: (params: RequestParams = {}) =>
      this.request<BaseResponseWalkEventResponse, any>({
        path: `/api/walks/start`,
        method: 'POST',
        ...params,
      }),

    /**
     * @description 종료된 산책의 상세 정보(경로, 시간, 거리 등)를 저장합니다.
     *
     * @tags 산책 기록
     * @name CreateWalk
     * @summary 산책 기록 저장
     * @request POST:/api/walks/new
     */
    createWalk: (data: WalkRequest, params: RequestParams = {}) =>
      this.request<BaseResponseWalkCreateResponse, any>({
        path: `/api/walks/new`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description 새로운 산책로를 등록합니다.
     *
     * @tags 산책로
     * @name CreateTrail
     * @summary 산책로 생성
     * @request POST:/api/trails/new
     */
    createTrail: (data: TrailCreateRequest, params: RequestParams = {}) =>
      this.request<BaseResponseTrailCreateResponse, any>({
        path: `/api/trails/new`,
        method: 'POST',
        body: data,
        type: ContentType.Json,
        ...params,
      }),

    /**
     * @description 다른 사용자에게 친구 요청을 보냅니다.
     *
     * @tags 친구
     * @name SendFriendRequest
     * @summary 친구 요청 생성
     * @request POST:/api/friends/request
     * @secure
     */
    sendFriendRequest: (
      query: {
        targetNickname: string;
      },
      params: RequestParams = {}
    ) =>
      this.request<BaseResponseFriendRequestResponseDTO, any>({
        path: `/api/friends/request`,
        method: 'POST',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description 리프레시 토큰을 이용해 액세스 토큰을 재발급합니다.
     *
     * @tags 인증
     * @name ReissueAccessToken
     * @summary 액세스 토큰 재발급
     * @request POST:/api/auth/reissue
     * @secure
     */
    reissueAccessToken: (
      query: {
        deviceId: string;
      },
      params: RequestParams = {}
    ) =>
      this.request<BaseResponseVoid, any>({
        path: `/api/auth/reissue`,
        method: 'POST',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description AccessToken 및 RefreshToken 쿠키를 삭제하여 로그아웃합니다.
     *
     * @tags 인증
     * @name Logout
     * @summary 로그아웃
     * @request POST:/api/auth/logout
     * @secure
     */
    logout: (
      query: {
        deviceId: string;
      },
      params: RequestParams = {}
    ) =>
      this.request<BaseResponseVoid, any>({
        path: `/api/auth/logout`,
        method: 'POST',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description 내 주변의 날씨 예보를 조회합니다.
     *
     * @tags 날씨
     * @name GetWeatherByCurrentLocation
     * @summary 주변 날씨 조회
     * @request GET:/api/weather
     */
    getWeatherByCurrentLocation: (
      query: {
        location: LocationDto;
      },
      params: RequestParams = {}
    ) =>
      this.request<BaseResponseWeatherForecastResponseDto, any>({
        path: `/api/weather`,
        method: 'GET',
        query: query,
        ...params,
      }),

    /**
     * @description 내 주변에 추천하는 옷차림을 조회합니다.
     *
     * @tags 날씨
     * @name GetClothRecommendations
     * @summary 맞춤 옷차림 조회
     * @request GET:/api/weather/clothing
     */
    getClothRecommendations: (
      query: {
        location: LocationDto;
      },
      params: RequestParams = {}
    ) =>
      this.request<BaseResponseClothResponse, any>({
        path: `/api/weather/clothing`,
        method: 'GET',
        query: query,
        ...params,
      }),

    /**
     * @description 자신이 기록한 모든 산책 기록의 목록을 조회합니다.
     *
     * @tags 산책 기록
     * @name GetWalkList
     * @summary 산책 기록 목록 조회
     * @request GET:/api/walks
     */
    getWalkList: (params: RequestParams = {}) =>
      this.request<BaseResponseListWalkListResponse, any>({
        path: `/api/walks`,
        method: 'GET',
        ...params,
      }),

    /**
     * @description 페이징 처리된 산책로 목록을 조회합니다.
     *
     * @tags 산책로
     * @name GetTrailList
     * @summary 산책로 목록 조회
     * @request GET:/api/trails
     */
    getTrailList: (
      query?: {
        /**
         * @format int32
         * @default 0
         */
        page?: number;
      },
      params: RequestParams = {}
    ) =>
      this.request<BaseResponsePageTrailListResponse, any>({
        path: `/api/trails`,
        method: 'GET',
        query: query,
        ...params,
      }),

    /**
     * @description 특정 산책로의 상세 정보를 조회합니다.
     *
     * @tags 산책로
     * @name GetTrailDetail
     * @summary 산책로 상세 조회
     * @request GET:/api/trails/{trailId}
     */
    getTrailDetail: (trailId: number, params: RequestParams = {}) =>
      this.request<BaseResponseTrailDetailResponse, any>({
        path: `/api/trails/${trailId}`,
        method: 'GET',
        ...params,
      }),

    /**
     * @description 현재 사용자의 친구 목록을 조회합니다.
     *
     * @tags 친구
     * @name GetFriends
     * @summary 친구 목록 조회
     * @request GET:/api/friends
     * @secure
     */
    getFriends: (params: RequestParams = {}) =>
      this.request<BaseResponseFriendListResponseDTO, any>({
        path: `/api/friends`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * @description 특정 상태(예: ONLINE)의 친구 목록을 조회합니다.
     *
     * @tags 친구
     * @name GetFriendsByStatus
     * @summary 상태별 친구 목록 조회
     * @request GET:/api/friends/status/{status}
     * @secure
     */
    getFriendsByStatus: (
      status: 'OFFLINE' | 'ONLINE' | 'WALKING',
      params: RequestParams = {}
    ) =>
      this.request<BaseResponseListFriendResponseDTO, any>({
        path: `/api/friends/status/${status}`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * @description 내가 보낸 친구 요청 목록을 조회합니다.
     *
     * @tags 친구
     * @name GetSentFriendRequests
     * @summary 친구 요청 발신 목록 조회
     * @request GET:/api/friends/request/sent
     * @secure
     */
    getSentFriendRequests: (params: RequestParams = {}) =>
      this.request<BaseResponseListSentFriendResponse, any>({
        path: `/api/friends/request/sent`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * @description 내가 받은 친구 요청 목록을 조회합니다.
     *
     * @tags 친구
     * @name GetReceivedFriendRequests
     * @summary 친구 요청 수신 목록 조회
     * @request GET:/api/friends/request/received
     * @secure
     */
    getReceivedFriendRequests: (params: RequestParams = {}) =>
      this.request<BaseResponseListReceivedFriendResponse, any>({
        path: `/api/friends/request/received`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * @description 친구들의 위치 정보를 조회합니다.
     *
     * @tags 친구
     * @name GetFriendLocations
     * @summary 친구 위치 조회
     * @request GET:/api/friends/location
     * @secure
     */
    getFriendLocations: (params: RequestParams = {}) =>
      this.request<BaseResponseListFriendLocationResponseDTO, any>({
        path: `/api/friends/location`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * @description 현재 로그인한 사용자의 정보를 조회합니다.
     *
     * @tags 인증
     * @name GetCurrentUser
     * @summary 본인확인
     * @request GET:/api/auth/me
     * @secure
     */
    getCurrentUser: (params: RequestParams = {}) =>
      this.request<BaseResponseCurrentUserDto, any>({
        path: `/api/auth/me`,
        method: 'GET',
        secure: true,
        ...params,
      }),

    /**
     * @description 특정 산책 기록을 삭제합니다.
     *
     * @tags 산책 기록
     * @name DeleteWalk
     * @summary 산책 기록 삭제
     * @request DELETE:/api/walks/{walkId}
     */
    deleteWalk: (walkId: number, params: RequestParams = {}) =>
      this.request<BaseResponseWalkDeleteResponse, any>({
        path: `/api/walks/${walkId}`,
        method: 'DELETE',
        ...params,
      }),

    /**
     * @description 친구 관계를 삭제합니다.
     *
     * @tags 친구
     * @name DeleteFriend
     * @summary 친구 삭제하기
     * @request DELETE:/api/friends/{friendMemberId}
     * @secure
     */
    deleteFriend: (friendMemberId: number, params: RequestParams = {}) =>
      this.request<BaseResponseVoid, any>({
        path: `/api/friends/${friendMemberId}`,
        method: 'DELETE',
        secure: true,
        ...params,
      }),
  };
  swagger = {
    /**
     * @description 카카오 OAuth2 로그인을 위한 리디렉션 URL입니다. [실제 로그인 URL: `/oauth2/authorization/kakao?state={deviceId}`] 브라우저에서 직접 접속하세요.
     *
     * @tags OAuth 로그인
     * @name KakaoLoginDocOnly
     * @summary 카카오 로그인
     * @request GET:/swagger/oauth/kakao-login
     */
    kakaoLoginDocOnly: (params: RequestParams = {}) =>
      this.request<any, void>({
        path: `/swagger/oauth/kakao-login`,
        method: 'GET',
        ...params,
      }),

    /**
     * @description 구글 OAuth2 로그인을 위한 리디렉션 URL입니다. [실제 로그인 URL: `/oauth2/authorization/google?state={deviceId}`] 브라우저에서 직접 접속하세요.
     *
     * @tags OAuth 로그인
     * @name GoogleLoginDocOnly
     * @summary 구글 로그인
     * @request GET:/swagger/oauth/google-login
     */
    googleLoginDocOnly: (params: RequestParams = {}) =>
      this.request<any, void>({
        path: `/swagger/oauth/google-login`,
        method: 'GET',
        ...params,
      }),
  };
}
