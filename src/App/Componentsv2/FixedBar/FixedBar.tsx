/* eslint-disable react/no-unused-prop-types */
import React, { cloneElement, ReactElement, CSSProperties } from "react"
import { bar } from "./styles"

interface FixedBarProps {
  /** the sizes from the getBoundingClientRect of the parent container. Needed to calculate the left position of the bar */
  containerSizes: ClientRect
  /** where the bar will be fixed to */
  position: "bottom" | "top"
  /** the content of the bar */
  children: ReactElement
  /** to be used when the component is inside a Form */
  type?: "fixedBar"
  /** Form will pass this prop, so the component can pass along to its children */
  isLoading?: boolean
  /** the custom styles of the bar */
  style?: CSSProperties
}

const FixedBar = (props: FixedBarProps) => {
  const { containerSizes, position, children, isLoading, style } = props
  const { left } = containerSizes
  return <div style={bar(left, position, style)}>{isLoading ? cloneElement(children, { isLoading }) : children}</div>
}

export default FixedBar
