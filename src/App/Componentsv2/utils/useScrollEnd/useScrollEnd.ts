import { useEffect } from "react"
import { SetStateType } from "@bit/ziro.utils.types"

/**
 * A hook to detect when the user has reached the bottom of the page while scrolling vertically
 * and to determine if the page has a vertical scroll bar at any given moment (is scrollable)
 * @param setPageEnd is true when the user reaches the bottom of the page
 * @param setHasScrollBar is true when the page has a vertical scroll bar (is scrollable)
 * @see https://stackoverflow.com/questions/9439725/javascript-how-to-detect-if-browser-window-is-scrolled-to-bottom
 * @see https://stackoverflow.com/questions/3962558/javascript-detect-scroll-end
 * @see https://stackoverflow.com/questions/2146874/detect-if-a-page-has-a-vertical-scrollbar
 */

interface Params {
  setPageEnd?: SetStateType<boolean>
  setHasScrollBar?: SetStateType<boolean>
}

const useScrollEnd = ({ setPageEnd, setHasScrollBar }: Params) => {
  useEffect(() => {
    const handleScroll = () => {
      if (setPageEnd) {
        if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight) setPageEnd(true)
        else setPageEnd(false)
      }
      if (setHasScrollBar) {
        if (document.documentElement.scrollHeight > document.documentElement.clientHeight) setHasScrollBar(true)
        else setHasScrollBar(false)
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [setPageEnd, setHasScrollBar])
}

export default useScrollEnd
