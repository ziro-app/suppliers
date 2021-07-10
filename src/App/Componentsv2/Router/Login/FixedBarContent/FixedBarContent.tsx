import React, { cloneElement, ReactElement } from "react"
import { container, header } from "./styles"

const FixedBarContent = ({ children }: { children: ReactElement }) => {
  return <div style={container}>{cloneElement(children, { style: header })}</div>
}

export default FixedBarContent
