// @ts-nocheck
// This file is generated by Umi automatically
// DO NOT CHANGE IT MANUALLY!
import axios, {
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type AxiosError,
} from '/Users/tanxinyu/meiteng/tougao/node_modules/axios';
import useUmiRequest, { UseRequestProvider } from '/Users/tanxinyu/meiteng/tougao/node_modules/@ahooksjs/use-request';
import { ApplyPluginsType } from 'umi';
import { getPluginManager } from '../core/plugin';

import {
  BaseOptions,
  BasePaginatedOptions,
  BaseResult,
  CombineService,
  LoadMoreFormatReturn,
  LoadMoreOptions,
  LoadMoreOptionsWithFormat,
  LoadMoreParams,
  LoadMoreResult,
  OptionsWithFormat,
  PaginatedFormatReturn,
  PaginatedOptionsWithFormat,
  PaginatedParams,
  PaginatedResult,
} from '/Users/tanxinyu/meiteng/tougao/node_modules/@ahooksjs/use-request/es/types';

type ResultWithData< T = any > = { data?: T; [key: string]: any };

function useRequest<
  R = any,
  P extends any[] = any,
  U = any,
  UU extends U = any,
>(
  service: CombineService<R, P>,
  options: OptionsWithFormat<R, P, U, UU>,
): BaseResult<U, P>;
function useRequest<R extends ResultWithData = any, P extends any[] = any>(
  service: CombineService<R, P>,
  options?: BaseOptions<R['data'], P>,
): BaseResult<R['data'], P>;
function useRequest<R extends LoadMoreFormatReturn = any, RR = any>(
  service: CombineService<RR, LoadMoreParams<R>>,
  options: LoadMoreOptionsWithFormat<R, RR>,
): LoadMoreResult<R>;
function useRequest<
  R extends ResultWithData<LoadMoreFormatReturn | any> = any,
  RR extends R = any,
>(
  service: CombineService<R, LoadMoreParams<R['data']>>,
  options: LoadMoreOptions<RR['data']>,
): LoadMoreResult<R['data']>;

function useRequest<R = any, Item = any, U extends Item = any>(
  service: CombineService<R, PaginatedParams>,
  options: PaginatedOptionsWithFormat<R, Item, U>,
): PaginatedResult<Item>;
function useRequest<Item = any, U extends Item = any>(
  service: CombineService<
    ResultWithData<PaginatedFormatReturn<Item>>,
    PaginatedParams
  >,
  options: BasePaginatedOptions<U>,
): PaginatedResult<Item>;
function useRequest(service: any, options: any = {}) {
  return useUmiRequest(service, {
    formatResult: result => result?.data,
    requestMethod: (requestOptions: any) => {
      if (typeof requestOptions === 'string') {
        return request(requestOptions);
      }
      if (typeof requestOptions === 'object') {
        const { url, ...rest } = requestOptions;
        return request(url, rest);
      }
      throw new Error('request options error');
    },
    ...options,
  });
}

// request 方法 opts 参数的接口
interface IRequestOptions extends AxiosRequestConfig {
  skipErrorHandler?: boolean;
  requestInterceptors?: IRequestInterceptorTuple[];
  responseInterceptors?: IResponseInterceptorTuple[];
  [key: string]: any;
}

interface IRequestOptionsWithResponse extends IRequestOptions {
  getResponse: true;
}

interface IRequestOptionsWithoutResponse extends IRequestOptions{
  getResponse: false;
}

interface IRequest{
   <T = any>(url: string, opts: IRequestOptionsWithResponse): Promise<AxiosResponse<T>>;
   <T = any>(url: string, opts: IRequestOptionsWithoutResponse): Promise<T>;
   <T = any>(url: string, opts: IRequestOptions): Promise<T>; // getResponse 默认是 false， 因此不提供该参数时，只返回 data
   <T = any>(url: string): Promise<T>;  // 不提供 opts 时，默认使用 'GET' method，并且默认返回 data
}

type RequestError = AxiosError | Error

interface IErrorHandler {
  (error: RequestError, opts: IRequestOptions): void;
}
type WithPromise<T> = T | Promise<T>;
type IRequestInterceptorAxios = (config: IRequestOptions) => WithPromise<IRequestOptions>;
type IRequestInterceptorUmiRequest = (url: string, config : IRequestOptions) => WithPromise<{ url: string, options: IRequestOptions }>;
type IRequestInterceptor = IRequestInterceptorAxios | IRequestInterceptorUmiRequest;
type IErrorInterceptor = (error: Error) => Promise<Error>;
type IResponseInterceptor = <T = any>(response : AxiosResponse<T>) => WithPromise<AxiosResponse<T>> ;
type IRequestInterceptorTuple = [IRequestInterceptor , IErrorInterceptor] | [IRequestInterceptor] | IRequestInterceptor
type IResponseInterceptorTuple = [IResponseInterceptor, IErrorInterceptor] | [IResponseInterceptor] | IResponseInterceptor

export interface RequestConfig<T = any> extends AxiosRequestConfig {
  errorConfig?: {
    errorHandler?: IErrorHandler;
    errorThrower?: ( res: T ) => void
  };
  requestInterceptors?: IRequestInterceptorTuple[];
  responseInterceptors?: IResponseInterceptorTuple[];
}

let requestInstance: AxiosInstance;
let config: RequestConfig;
const getConfig = (): RequestConfig => {
  if (config) return config;
  config = getPluginManager().applyPlugins({
    key: 'request',
    type: ApplyPluginsType.modify,
    initialValue: {},
  });
  return config;
};

const getRequestInstance = (): AxiosInstance => {
  if (requestInstance) return requestInstance;
  const config = getConfig();
  requestInstance = axios.create(config);

  config?.requestInterceptors?.forEach((interceptor) => {
    if(interceptor instanceof Array){
      requestInstance.interceptors.request.use(async (config) => {
        const { url } = config;
        if(interceptor[0].length === 2){
          const { url: newUrl, options } = await interceptor[0](url, config);
          return { ...options, url: newUrl };
        }
        return interceptor[0](config);
      }, interceptor[1]);
    } else {
      requestInstance.interceptors.request.use(async (config) => {
        const { url } = config;
        if(interceptor.length === 2){
          const { url: newUrl, options } = await interceptor(url, config);
          return { ...options, url: newUrl };
        }
        return interceptor(config);
      })
    }
  });

  config?.responseInterceptors?.forEach((interceptor) => {
    interceptor instanceof Array ?
      requestInstance.interceptors.response.use(interceptor[0], interceptor[1]):
       requestInstance.interceptors.response.use(interceptor);
  });

  // 当响应的数据 success 是 false 的时候，抛出 error 以供 errorHandler 处理。
  requestInstance.interceptors.response.use((response) => {
    const { data } = response;
    if(data?.success === false && config?.errorConfig?.errorThrower){
      config.errorConfig.errorThrower(data);
    }
    return response;
  })
  return requestInstance;
};

const request: IRequest = (url: string, opts: any = { method: 'GET' }) => {
  const requestInstance = getRequestInstance();
  const config = getConfig();
  const { getResponse = false, requestInterceptors, responseInterceptors } = opts;
  const requestInterceptorsToEject = requestInterceptors?.map((interceptor) => {
    if(interceptor instanceof Array){
      return requestInstance.interceptors.request.use(async (config) => {
        const { url } = config;
        if(interceptor[0].length === 2){
          const { url: newUrl, options } = await interceptor[0](url, config);
          return { ...options, url: newUrl };
        }
        return interceptor[0](config);
      }, interceptor[1]);
    } else {
      return requestInstance.interceptors.request.use(async (config) => {
        const { url } = config;
        if(interceptor.length === 2){
          const { url: newUrl, options } = await interceptor(url, config);
          return { ...options, url: newUrl };
        }
        return interceptor(config);
      })
    }
    });
  const responseInterceptorsToEject = responseInterceptors?.map((interceptor) => {
    return interceptor instanceof Array ?
      requestInstance.interceptors.response.use(interceptor[0], interceptor[1]):
       requestInstance.interceptors.response.use(interceptor);
    });
  return new Promise((resolve, reject)=>{
    requestInstance
      .request({...opts, url})
      .then((res)=>{
        requestInterceptorsToEject?.forEach((interceptor) => {
          requestInstance.interceptors.request.eject(interceptor);
        });
        responseInterceptorsToEject?.forEach((interceptor) => {
          requestInstance.interceptors.response.eject(interceptor);
        });
        resolve(getResponse ? res : res.data);
      })
      .catch((error)=>{
        requestInterceptorsToEject?.forEach((interceptor) => {
          requestInstance.interceptors.request.eject(interceptor);
        });
        responseInterceptorsToEject?.forEach((interceptor) => {
          requestInstance.interceptors.response.eject(interceptor);
        });
        try {
          const handler =
            config?.errorConfig?.errorHandler;
          if(handler)
            handler(error, opts, config);
        } catch (e) {
          reject(e);
        }
        reject(error);
      })
  })
}

export {
  useRequest,
  UseRequestProvider,
  request,
  getRequestInstance,
};

export type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  RequestError,
  IRequestInterceptorAxios as RequestInterceptorAxios,
  IRequestInterceptorUmiRequest as RequestInterceptorUmiRequest,
  IRequestInterceptor as RequestInterceptor,
  IErrorInterceptor as ErrorInterceptor,
  IResponseInterceptor as ResponseInterceptor,
  IRequestOptions as RequestOptions,
  IRequest as Request,
};
