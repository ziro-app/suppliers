import { CSSProperties } from "react"

export const container: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
  gridGap: "10px",
}
export const skeletonContainer: CSSProperties = {
  display: "grid",
  gridTemplateRows: "1fr auto auto",
  gridRowGap: "4px",
}
export const cardContainer: CSSProperties = {
  display: "grid",
  gridTemplateRows: "1fr auto auto",
  cursor: "pointer",
}
export const badgeWrapper: CSSProperties = {
  margin: "0 3px -28px 0",
}
export const badge: CSSProperties = {
  display: "grid",
  background: "transparent",
}
export const imgStyle: CSSProperties = {
  width: "100%",
  maxHeight: "200px",
  objectFit: "cover",
}
export const imagesContainer = (numberOfImages: number): CSSProperties => ({
  display: "grid",
  gridTemplateColumns: `repeat(${numberOfImages},1fr)`,
  gridColumnGap: "6px",
})
export const imgStyleSlider: CSSProperties = {
  ...imgStyle,
  width: "auto",
}
export const textStyle: CSSProperties = {
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
}
