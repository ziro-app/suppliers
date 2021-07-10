import { CSSProperties } from "react"
import themes from "@bit/ziro.utils.themes"

const backgroundColor: { [index: string]: string } = {
  whiteDots: themes.gradient.secondary,
  blackDots: themes.gradient.primary,
}

export const container: CSSProperties = {
  display: "flex",
  gridColumnGap: "10px",
  justifyContent: "center",
}

export const dots: (dotsColor: string, dotsSize: string) => CSSProperties = (dotsColor, dotsSize) => ({
  width: dotsSize,
  height: dotsSize,
  borderRadius: "50%",
  background: backgroundColor[dotsColor] || dotsColor,
  opacity: "0.5",
  animation: "effect 0.96s ease-in-out infinite",
})

export const dot1: CSSProperties = {
  animationDelay: "0s",
}

export const dot2: CSSProperties = {
  animationDelay: "0.32s",
}

export const dot3: CSSProperties = {
  animationDelay: "0.64s",
}

/** PulseLoader. For the original CSS @see https://loading.io/css/ */

export const loaderContainer: CSSProperties = {
  display: "grid",
  alignItems: "center",
  justifyItems: "center",
}

export const ripple = (size: number): CSSProperties => ({
  position: "relative",
  display: "grid",
  alignItems: "center",
  justifyItems: "center",
  width: `${size}px`,
  height: `${size}px`,
})

export const first = (borderColor: string, bgColor: string): CSSProperties => ({
  position: "absolute",
  opacity: 1,
  border: `6px solid ${borderColor}`,
  borderRadius: "50%",
  background: `${bgColor}`,
  animation: "first-ripple 2s cubic-bezier(0.23, 1, 0.32, 1) infinite",
})

export const second = (borderColor: string, bgColor: string): CSSProperties => ({
  position: "absolute",
  opacity: 1,
  border: `6px solid ${borderColor}`,
  borderRadius: "50%",
  background: `${bgColor}`,
  animation: "first-ripple 2s cubic-bezier(0.23, 1, 0.32, 1) infinite",
  animationDelay: "-0.5s",
})
