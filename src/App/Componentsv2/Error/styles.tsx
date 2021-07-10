import React from "react"
import theme from "@bit/ziro.utils.themes"

export const container: React.CSSProperties = {
  display: "grid",
  justifyItems: "center",
  gridRowGap: "12px",
}

export const textContainer: React.CSSProperties = {
  display: "grid",
  justifyItems: "center",
  gridRowGap: "2px",
  color: theme.colors.alert,
}

export const buttonStyle: React.CSSProperties = {
  maxWidth: "150px",
  background: theme.colors.alert,
}
