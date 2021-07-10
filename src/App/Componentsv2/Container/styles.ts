import { CSSProperties } from "react"

export const container = (withoutHeight: boolean, withoutPadding: boolean, device: string): CSSProperties => {
  const minHeight = withoutHeight ? "none" : "100vh"
  const responsivePadding = device === "desktop" ? "15px 0 50px" : "15px 15px 50px"
  const padding = withoutPadding ? "none" : responsivePadding
  return {
    maxWidth: "500px",
    width: "100%",
    minHeight,
    boxSizing: "border-box",
    margin: "0 auto",
    padding,
  }
}
