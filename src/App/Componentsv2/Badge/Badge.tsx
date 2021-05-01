import React, { useRef } from "react"
import useSize from "../useSize"
import { content } from "./styles"

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Tamanho da fonte, afeta o border-radius */
  fontSize: number
  /** Tamanho do círculo do Badge - altera diretamente o Padding */
  badgePadding: number
  /** Conteudo do badge */
  children: React.ReactNode
  /** Aqui pode-se passar estilos customizados */
  style?: React.CSSProperties
}

const Badge = ({ fontSize, badgePadding, children, style, ...props }: BadgeProps) => {
  const divRef = useRef(null)
  const { width, height } = useSize(divRef)
  const styles = { ...content({ fontSize, badgePadding, children, width, height }), ...style }
  return (
    <div ref={divRef} style={styles} {...props}>
      {children}
    </div>
  )
}

export default Badge
