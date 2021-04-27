import React, { Suspense, ReactNode } from "react"
import { loader } from "./loader"
import * as Illustrations from "./Illustrations"

export interface IllustrationProps extends React.SVGAttributes<SVGElement> {
  /** nome das ilustracoes disponiveis na biblioteca propria */
  name: keyof typeof Illustrations
  /** elemento react de fallback */
  fallback?: ReactNode
}

const Illustration = ({ name, fallback, ...props }: IllustrationProps) => {
  return <Suspense fallback={fallback || null}>{React.createElement(loader(name), { ...props })}</Suspense>
}

export default Illustration
