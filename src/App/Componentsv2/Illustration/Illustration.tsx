import React from "react"
import * as Illustrations from "./Illustrations"

export interface IllustrationProps extends React.SVGAttributes<SVGElement> {
  /** nome das ilustracoes disponiveis na biblioteca propria */
  name: keyof typeof Illustrations
}

const Illustration = ({ name, ...props }: IllustrationProps) => {
  return React.createElement(Illustrations[name], { ...props })
}

export default Illustration
