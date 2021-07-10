import { useState, useEffect } from "react"
import themes from "@bit/ziro.utils.themes"

type deviceType = "smallMobile" | "mobile" | "largeMobile" | "desktop"

const useDeviceSize = () => {
  const [device, setDevice] = useState<deviceType>("smallMobile")
  const [deviceWidth, setDeviceWidth] = useState<number>(0)

  useEffect(() => {
    // @ts-ignore
    const resizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]) =>
      setDeviceWidth(entries[0].target.clientWidth),
    )
    resizeObserver.observe(document.body)
    return () => resizeObserver.unobserve(document.body)
  }, [])

  useEffect(() => {
    if (themes.breakPoints.isSmallMobile(deviceWidth)) setDevice("smallMobile")
    if (themes.breakPoints.isMobile(deviceWidth)) setDevice("mobile")
    if (themes.breakPoints.isLargeMobile(deviceWidth)) setDevice("largeMobile")
    if (themes.breakPoints.isDesktop(deviceWidth)) setDevice("desktop")
  }, [deviceWidth])

  return device
}

export default useDeviceSize
