import { useState, useLayoutEffect } from "react"
import useResizeObserver from "@react-hook/resize-observer"
import isRefObject from "./isRefObject"

/**
 * A React hook that returns the size of an HTML element whenever it changes
 *
 * @param refOrHTML A React ref created by `useRef()` or an HTML element
 */

const useSize = (refOrHTML: React.RefObject<HTMLElement> | HTMLElement) => {
  const [size, setSize] = useState({ width: 0, height: 0, x: 0, y: 0, top: 0, right: 0, bottom: 0, left: 0 })
  useLayoutEffect(() => {
    if (isRefObject(refOrHTML) && refOrHTML.current) setSize(refOrHTML.current.getBoundingClientRect())
  }, [refOrHTML])
  useResizeObserver(refOrHTML, entry => setSize(entry.contentRect))
  return size
}

export default useSize
