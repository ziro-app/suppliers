import themes from "@bit/ziro.utils.themes"
import React from "react"

export const mainContainer: React.CSSProperties = {
  display: "grid",
  width: "100%",
  WebkitTapHighlightColor: "rgba(0,0,0,0)",
}

export const checkboxContainer: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "auto auto",
  justifyContent: "start",
  alignItems: "center",
  position: "relative",
  width: "100%",
  gap: "0px 10px",
  cursor: "default",
}

export const resetInputStyles: React.CSSProperties = {
  position: "absolute",
  opacity: "0",
  cursor: "pointer",
  width: "27px",
  height: "27px",
}

export const defaultSquare = (value: boolean): React.CSSProperties => ({
  width: "27px",
  height: "27px",
  backgroundColor: value ? themes.colors.accent : "#fff",
  border: value ? "none" : "2px solid #E0E0E0",
  borderRadius: "8px",
  boxShadow: "rgba(34, 34, 34, 0.3) 0px 3px 10px -3px",
})

export const checkedSquare: React.CSSProperties = {
  zIndex: 999,
  position: "absolute",
  left: "10px",
  top: "5px",
  width: "8px",
  height: "13px",
  border: "1px solid #fff",
  borderWidth: "0 2px 2px 0",
  WebkitTransform: "rotate(45deg)",
  msTransform: "rotate(45deg)",
  transform: "rotate(45deg)",
  cursor: "pointer",
}

export const toggleContainer: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
}

export const toggleButton = (size: number, active: boolean, color: string): React.CSSProperties => ({
  width: `${size}px`,
  height: `${size / 2}px`,
  background: active ? `${color}` : themes.colors.gray1,
  borderRadius: "30px",
  padding: "5px",
  transition: "all 300ms ease-in-out",
  position: "relative",
})

export const innerCircle = (size: number, active: boolean): React.CSSProperties => ({
  position: "absolute",
  width: `${size / 2.5}px`,
  height: `${size / 2.5}px`,
  background: "#fff",
  borderRadius: "50%",
  left: active ? "54%" : "5%",
  bottom: "10%",
  transition: "all 200ms ease-in-out",
})
