import React from "react"
import { wrapper, firstChild } from "./styles"

interface BadgeWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Conteudo do BadgeWrapper */
  children: React.ReactNode[]
  /** Aqui pode-se passar estilos customizados */
  style?: React.CSSProperties
  /** Aqui pode-se passar estilos customizados para o badge */
  badgeStyle?: React.CSSProperties
}

const BadgeWrapper = ({ children, style, badgeStyle, ...props }: BadgeWrapperProps) => {
  return (
    <div style={{ ...wrapper, ...style }} {...props}>
      <div style={{ ...firstChild, ...badgeStyle }}>{children[0]}</div>
      {children[1]}
    </div>
  )
}

export default BadgeWrapper
