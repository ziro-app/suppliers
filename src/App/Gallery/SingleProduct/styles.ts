import { CSSProperties } from "react"
import themes from "@bit/ziro.utils.themes"

export const tooltipModal: CSSProperties = {
  display: "grid",
  justifyItems: "center",
  gridGap: "12px",
  textAlign: "center",
}

export const titleRow: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "auto 1fr",
  columnGap: "3px",
}

export const tooltip: CSSProperties = {
  width: 15,
  height: 15,
  color: themes.colors.accent,
  cursor: "pointer",
}

export const confirmDeleteModal: CSSProperties = {
  display: "grid",
  justifyItems: "center",
  gridRowGap: "12px",
  textAlign: "center",
}

export const confirmDeleteBtns: CSSProperties = {
  display: "grid",
  gridRowGap: "5px",
  width: "100%",
}

export const btn: CSSProperties = {
  borderRadius: "0",
}
