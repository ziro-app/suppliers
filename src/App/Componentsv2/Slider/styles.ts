import { CSSProperties } from "react"

export const container: CSSProperties = {
  display: "grid",
  touchAction: "pan-y", // allow only vertical scroll on touch
  overflow: "hidden",
}

export const slider = (drag: string | undefined): CSSProperties => ({
  display: "flex",
  columnGap: "10px",
  cursor: drag ? "grab" : "initial",
})
