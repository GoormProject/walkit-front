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

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, 'body' | 'bodyUsed'>;

export interface FullRequestParams extends Omit<RequestInit, 'body'> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<
  FullRequestParams,
  'body' | 'method' | 'query' | 'path'
>;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, 'baseUrl' | 'cancelToken' | 'signal'>;
  securityWorker?: (
    securityData: SecurityDataType | null
  ) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown>
  extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = 'application/json',
  JsonApi = 'application/vnd.api+json',
  FormData = 'multipart/form-data',
  UrlEncoded = 'application/x-www-form-urlencoded',
  Text = 'text/plain',
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = 'http://localhost:8080';
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>['securityWorker'];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) =>
    fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: 'same-origin',
    headers: {},
    redirect: 'follow',
    referrerPolicy: 'no-referrer',
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === 'number' ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join('&');
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter(
      key => 'undefined' !== typeof query[key]
    );
    return keys
      .map(key =>
        Array.isArray(query[key])
          ? this.addArrayQueryParam(query, key)
          : this.addQueryParam(query, key)
      )
      .join('&');
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : '';
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === 'object' || typeof input === 'string')
        ? JSON.stringify(input)
        : input,
    [ContentType.JsonApi]: (input: any) =>
      input !== null && (typeof input === 'object' || typeof input === 'string')
        ? JSON.stringify(input)
        : input,
    [ContentType.Text]: (input: any) =>
      input !== null && typeof input !== 'string'
        ? JSON.stringify(input)
        : input,
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === 'object' && property !== null
              ? JSON.stringify(property)
              : `${property}`
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(
    params1: RequestParams,
    params2?: RequestParams
  ): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (
    cancelToken: CancelToken
  ): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === 'boolean' ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(
      `${baseUrl || this.baseUrl || ''}${path}${queryString ? `?${queryString}` : ''}`,
      {
        ...requestParams,
        headers: {
          ...(requestParams.headers || {}),
          ...(type && type !== ContentType.FormData
            ? { 'Content-Type': type }
            : {}),
        },
        signal:
          (cancelToken
            ? this.createAbortSignal(cancelToken)
            : requestParams.signal) || null,
        body:
          typeof body === 'undefined' || body === null
            ? null
            : payloadFormatter(body),
      }
    ).then(async response => {
      const r = response.clone() as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then(data => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch(e => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
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
     * @description 다른 사용자에게 친구 요청을 보냅니다.
     *
     * @tags 친구
     * @name SendFriendRequest
     * @summary 친구 요청 생성
     * @request POST:/api/friends/requests
     * @secure
     */
    sendFriendRequest: (
      query: {
        targetNickname: string;
      },
      params: RequestParams = {}
    ) =>
      this.request<BaseResponseFriendRequestResponseDTO, any>({
        path: `/api/friends/requests`,
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
     * @description 친구 요청을 승인합니다.
     *
     * @tags 친구
     * @name ApproveFriendRequest
     * @summary 친구 요청 승인
     * @request PATCH:/api/friends/requests/approve
     * @secure
     */
    approveFriendRequest: (
      query: {
        /** @format int64 */
        friendRequestId: number;
      },
      params: RequestParams = {}
    ) =>
      this.request<BaseResponseVoid, any>({
        path: `/api/friends/requests/approve`,
        method: 'PATCH',
        query: query,
        secure: true,
        ...params,
      }),

    /**
     * @description 내가 보낸 친구 요청 목록을 조회합니다.
     *
     * @tags 친구
     * @name GetSentFriendRequests
     * @summary 친구 요청 발신 목록 조회
     * @request GET:/api/friends/requests/sent
     * @secure
     */
    getSentFriendRequests: (params: RequestParams = {}) =>
      this.request<BaseResponseListSentFriendResponse, any>({
        path: `/api/friends/requests/sent`,
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
     * @request GET:/api/friends/requests/received
     * @secure
     */
    getReceivedFriendRequests: (params: RequestParams = {}) =>
      this.request<BaseResponseListReceivedFriendResponse, any>({
        path: `/api/friends/requests/received`,
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
