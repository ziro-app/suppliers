import themes from "../themes"
import React from "react"

export const regular: React.CSSProperties = {
  width: "100%",
  minHeight: "38px",
  padding: "10px 0px",
  WebkitAppearance: "none",
  WebkitTapHighlightColor: "rgba(0,0,0,0)",
  MozAppearance: "none",
  outline: "none",
  cursor: "pointer",
  border: "none",
  borderRadius: "2px",
  fontFamily: themes.fontFamily.title,
  fontSize: themes.fontSize.small,
  color: "#FFF",
  textAlign: "center",
  background: themes.gradient.primary,
  boxShadow: themes.shadow.primaryAlt,
}

export const light: React.CSSProperties = {
  ...regular,
  background: themes.gradient.secondary,
  color: themes.colors.primary,
}

export const destructive: React.CSSProperties = {
  ...regular,
  background: themes.colors.alert,
}

export const disabled: React.CSSProperties = {
  ...regular,
  cursor: "initial",
  color: themes.colors.primary,
  background: themes.colors.gray4,
  boxShadow: "none",
}
