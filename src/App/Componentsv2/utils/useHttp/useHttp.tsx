/* eslint-disable no-console */
import { useState, useEffect } from "react"
import axios from "axios"
import { useErrorHandler } from "react-error-boundary"
import { request, response } from "./interceptors"
import { HttpProps } from "./types"

const useHttp = <T,>({ initialState, config, requestInterceptor, responseInterceptor }: HttpProps) => {
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState<T>(initialState)
  const handleError = useErrorHandler()
  useEffect(() => {
    const instance = axios.create()
    const cancelToken = axios.CancelToken.source()
    const reqInterceptor = { ...request, ...requestInterceptor }
    const respInterceptor = { ...response, ...responseInterceptor }
    instance.interceptors.request.use(reqInterceptor.onFulfilled, reqInterceptor.onRejected)
    instance.interceptors.response.use(respInterceptor.onFulfilled, respInterceptor.onRejected)
    const axiosConfig = {
      timeout: 40000,
      cancelToken: cancelToken.token,
      ...config,
    }
    const run = async () => {
      try {
        const result = await instance.request<T>(axiosConfig)
        setData((result as unknown) as T)
      } catch (error) {
        if (axios.isCancel(error)) console.log("Request canceled")
        else handleError(error)
      } finally {
        setIsLoading(false)
      }
    }
    run()
    return () => cancelToken.cancel("Request canceled. Component unmounted")
  }, [config, requestInterceptor, responseInterceptor, handleError])
  return { isLoading, data }
}

export default useHttp
