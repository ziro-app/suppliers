import axios from "axios"

const cancelToken = axios.CancelToken.source()

export const customAxios = axios.create({
  cancelToken: cancelToken.token,
  timeout: 40000,
  headers: { "Content-Type": "application/json" },
})
