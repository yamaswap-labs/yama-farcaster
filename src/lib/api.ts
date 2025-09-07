/** 请求(必填)配置信息 */
export interface RequiredRequestOptions {
  /**
   * 具体 api 路径，
   * 一般为请求 api 后缀，如 `/main-api/get_etf_list`
   */
  url: string;
}

/** 请求(可选的)配置信息 */
export interface OptionalRequestOptions<P, D> {
  baseUrl?: string;
  /** api query */
  params?: P;
  /** api body */
  data?: D;
  /** route locale */
  locale?: string;
}

export type CustomRequestOptions<P, D> = RequiredRequestOptions & OptionalRequestOptions<P, D>;

export type RequestInitOptions<P, D> = Exclude<RequestInit, CustomRequestOptions<P, D>>;

export type RequestOptions<P, D> = RequestInitOptions<P, D> & CustomRequestOptions<P, D>;

export const request = async <Response, Params = unknown, Data = unknown>(
  props: RequestOptions<Params, Data>,
): Promise<Response> => {
  const { baseUrl = '', url, method, params, data, ...options } = props;
  let apiUrl = baseUrl + url;
  apiUrl += params ? `?${new URLSearchParams(params).toString()}` : '';

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  const requestOptions = {
    method: method || 'GET',
    body: data && JSON.stringify(data),
    ...options,
    headers: {
      ...headers,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(apiUrl, requestOptions);

    if (response.ok) {
      return response.json();
    }

    return Promise.reject(response);
  } catch (error) {
    console.error('[API ERROR]: ', error);
    return Promise.reject(error);
  }
};

export type ApiRequestOptions<P, D> = Omit<RequestOptions<P, D>, 'url' | 'method'>;

export type ApiCommonResponse<T> = {
  code: number;
  msg: string;
  data: T;
};

const api = {
  get: <Response, Params = unknown, Data = unknown>(
    url: string,
    options?: ApiRequestOptions<Params, Data>,
  ) => request<Response, Params, Data>({ ...options, url, method: 'GET' }),
  post: <Response, Params = unknown, Data = unknown>(
    url: string,
    options?: ApiRequestOptions<Params, Data>,
  ) => request<Response, Params, Data>({ ...options, url, method: 'POST' }),
};

export default api;
