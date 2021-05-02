/* eslint @typescript-eslint/no-explicit-any: "off" */

export interface HistoryFormat {
  routes: Array<RoutesFormat>
  length: number
}

export interface RoutesFormat {
  pathname: string
  search?: string
  state?: any
}

export interface StoreFormat {
  state: HistoryFormat
  hash: RoutesFormat | null
  setState: (newState: RoutesFormat, event: string) => void
  setters: any[]
}
