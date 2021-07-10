import { CSSProperties } from "react"

export const container: CSSProperties = {
  position: "relative",
  display: "grid",
  gridTemplateColumns: "auto 1fr",
  marginBottom: "10px",
}

export const iconStyle: CSSProperties = {
  cursor: "pointer",
  zIndex: 1,
}

export const titleStyle: CSSProperties = {
  position: "absolute",
  width: "100%",
  padding: "0 25px",
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
  textAlign: "center",
}
