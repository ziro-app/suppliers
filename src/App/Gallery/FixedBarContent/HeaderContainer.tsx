import React, { cloneElement, ReactElement } from "react"
import { container, header } from "./styles"

export const HeaderContainer = ({ children }: { children: ReactElement }) => {
  return <div style={container}>{cloneElement(children, { style: header })}</div>
}
