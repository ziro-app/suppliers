import { RefObject } from "react"

const isRefObject = (arg: RefObject<HTMLElement> | HTMLElement): arg is RefObject<HTMLElement> =>
  (arg as RefObject<HTMLElement>).current !== undefined

export default isRefObject
