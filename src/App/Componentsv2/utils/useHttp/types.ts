import { AxiosInterceptorManager, AxiosRequestConfig as ARC } from "axios"

type InterceptorArguments<V> = Parameters<AxiosInterceptorManager<V>["use"]>

type Interceptor<V> = {
  onFulfilled?: InterceptorArguments<V>[0]
  onRejected?: InterceptorArguments<V>[1]
}

export type AxiosRequestConfig = ARC
export type RequestInterceptor = Interceptor<ARC>
export type ResponseInterceptor<T = any> = Interceptor<T>

export interface HttpProps {
  initialState: any
  config: ARC
  requestInterceptor?: RequestInterceptor
  responseInterceptor?: ResponseInterceptor
}
