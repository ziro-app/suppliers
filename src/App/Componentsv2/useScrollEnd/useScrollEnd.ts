import { useState, useEffect } from "react"

/**
 * A hook to detect when the user has reached the bottom of the page while scrolling vertically
 * @see https://stackoverflow.com/questions/9439725/javascript-how-to-detect-if-browser-window-is-scrolled-to-bottom
 * @see https://stackoverflow.com/questions/3962558/javascript-detect-scroll-end
 * @see https://stackoverflow.com/questions/2146874/detect-if-a-page-has-a-vertical-scrollbar
 */

const useScrollEnd = () => {
  const [pageEnd, setPageEnd] = useState(false)
  const [hasScrollBar, setHasScrollBar] = useState(
    document.documentElement.scrollHeight > document.documentElement.clientHeight,
  )
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight) setPageEnd(true)
      else setPageEnd(false)
      if (document.documentElement.scrollHeight > document.documentElement.clientHeight) setHasScrollBar(true)
      else setHasScrollBar(false)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return [pageEnd, hasScrollBar]
}

export default useScrollEnd
