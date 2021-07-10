import { CSSProperties } from "react"
import themes from "@bit/ziro.utils.themes"

export const bar = (left: number, position: "bottom" | "top", style?: CSSProperties): CSSProperties => ({
  zIndex: 99999999,
  position: "fixed",
  left,
  top: position === "top" ? 0 : undefined,
  bottom: position === "bottom" ? 0 : undefined,
  maxWidth: "500px",
  width: "100%",
  background: "white",
  boxShadow: themes.shadow.secondaryAlt,
  ...style,
})
