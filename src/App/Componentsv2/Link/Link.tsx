import React from "react"
import { Link as Anchor } from "wouter"
import { motion } from "framer-motion"
import { link, linkDisabled, button, buttonDisabled } from "./styles"

interface LinkProps extends React.HTMLAttributes<HTMLAnchorElement> {
  /** path para onde navegar */
  href: string
  /** se é visualmente um botão (mudança de style e acessibilidade) */
  isButton?: boolean
  /** ativo ou inativo (mudança de style) */
  isDisabled?: boolean
  /** Conteudo do link */
  children: React.ReactNode
  /** style do componente quando está desabilitado */
  disabledStyle?: React.CSSProperties
  /** Aqui pode-se passar estilos customizados */
  style?: React.CSSProperties
}

const Link = ({ href, isButton, isDisabled, children, disabledStyle, style, ...props }: LinkProps) => {
  const anchorStyle = isDisabled ? { ...linkDisabled, ...disabledStyle } : { ...link, ...style }
  const buttonStyle = isDisabled ? { ...buttonDisabled, ...disabledStyle } : { ...button, ...style }
  const styles = isButton ? buttonStyle : anchorStyle
  if (isDisabled)
    return (
      <span aria-label={`Link para ${href} desativado`} style={styles} {...props}>
        {children}
      </span>
    )
  if (isButton)
    return (
      <Anchor href={href} {...props}>
        <motion.button whileTap={{ scale: 0.95 }} style={styles}>
          {children}
        </motion.button>
      </Anchor>
    )
  return (
    <Anchor href={href} style={styles} {...props}>
      {children}
    </Anchor>
  )
}

export default Link
