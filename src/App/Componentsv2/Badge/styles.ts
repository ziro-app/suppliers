import themes from "../themes"
import React from "react"

interface contentType {
  fontSize: number
  badgePadding: number
  children: string | React.ReactNode
  width: number
  height: number
}

export const content = ({ fontSize, badgePadding, children, width, height }: contentType) => {
  const paddingHeight = width - height < 0 ? 0 : (width - height) / 2
  const paddingWidth = width - height < 0 ? Math.abs(width - height) / 2 : 0
  const paddingCalculation = `${paddingHeight + badgePadding}px ${paddingWidth + badgePadding}px`
  return {
    padding: width - height < 0 ? paddingCalculation : `${badgePadding}px`,
    width: "100%",
    borderRadius: typeof children === "string" && children.length <= 2 ? "50%" : `${fontSize * 1.5}rem`,
    textAlign: "center",
    fontSize: `${fontSize}rem`,
    color: "#fff",
    backgroundColor: themes.colors.alert,
  } as const
}
