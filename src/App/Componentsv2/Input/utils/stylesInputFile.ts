import { CSSProperties } from "react"
import themes from "../../themes"

export const dropzone = (enter: boolean, disabled: boolean): CSSProperties => ({
  display: "grid",
  alignContent: "center",
  justifyItems: "center",
  gridRowGap: "10px",
  height: "100%",
  padding: "15px 0",
  border: !disabled && enter ? `2px dashed ${themes.colors.accent}` : "2px dashed rgb(204,204,204)",
  borderRadius: "6px",
  boxShadow: !disabled && enter ? themes.shadow.primaryAlt : "none",
})

export const text: CSSProperties = {
  width: "75%",
  textAlign: "center",
  pointerEvents: "none",
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
}

export const button = (enter: boolean): CSSProperties => ({
  width: "40%",
  padding: "10px 0px",
  WebkitAppearance: "none",
  WebkitTapHighlightColor: "rgba(0,0,0,0)",
  MozAppearance: "none",
  outline: "none",
  cursor: "pointer",
  pointerEvents: enter ? "none" : "initial",
  border: "none",
  borderRadius: "2px",
  fontFamily: themes.fontFamily.title,
  fontSize: themes.fontSize.small,
  color: "#FFF",
  textAlign: "center",
  background: themes.gradient.primary,
  boxShadow: themes.shadow.primaryAlt,
})

export const buttonDisabled: CSSProperties = {
  width: "40%",
  padding: "10px 0px",
  WebkitAppearance: "none",
  WebkitTapHighlightColor: "rgba(0,0,0,0)",
  MozAppearance: "none",
  outline: "none",
  cursor: "initial", // changed
  pointerEvents: "none", // changed
  border: "none",
  borderRadius: "2px",
  fontFamily: themes.fontFamily.title,
  fontSize: themes.fontSize.small,
  color: themes.colors.primary, // changed
  textAlign: "center",
  background: themes.colors.gray4, // changed
  boxShadow: "none", // changed
}

export const input: CSSProperties = {
  display: "none",
}
