import React, { useRef } from "react"
import useDeviceSize from "@bit/ziro.utils.use-device-size"
import { ContainerProps } from "./types"
import { container } from "./styles"

const Container = ({ withoutHeight = false, withoutPadding = false, children, style, ...props }: ContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const device = useDeviceSize()
  const initialRectState = { width: 0, height: 0, x: 0, y: 0, top: 0, right: 0, bottom: 0, left: 0 }
  const sizes = containerRef.current?.getBoundingClientRect() || initialRectState
  const styles = { ...container(withoutHeight, withoutPadding, device), ...style }
  return (
    <div ref={containerRef} style={styles} {...props}>
      {typeof children === "function" ? children(sizes) : children}
    </div>
  )
}

export default Container
