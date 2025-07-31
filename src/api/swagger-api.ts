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

export interface BaseResponseListFriendResponseDTO {
  /** @format int32 */
  httpStatus?: number;
  message?: string;
  data?: FriendResponseDTO[];
}

export interface FriendResponseDTO {
  /** @format int64 */
  friendId?: number;
  nickname?: string;
  profile?: string;
  memberStatus?: 'OFFLINE' | 'ONLINE' | 'WALKING';
  lastLocation?: LocationDto;
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
        profileImage: File;
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
     * @description 현재 사용자의 친구 목록을 조회합니다.
     *
     * @tags 친구
     * @name GetFriends
     * @summary 친구 목록 조회
     * @request GET:/api/friends
     * @secure
     */
    getFriends: (params: RequestParams = {}) =>
      this.request<BaseResponseListFriendResponseDTO, any>({
        path: `/api/friends`,
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
  };
}
