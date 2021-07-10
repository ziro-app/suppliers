import React, { forwardRef } from "react"
import themes from "@bit/ziro.utils.themes"
import textStyle from "./styles"

interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  /** font-size do texto */
  size?: keyof typeof themes.fontSize
  /** font-weight do text */
  weight?: keyof typeof themes.fontWeight
  /** Conteudo do texto */
  children: React.ReactNode
  /** Aqui pode-se passar estilos customizados */
  style?: React.CSSProperties
}

/** any usado pois o react 16.12 não possui a exportação do 'ForwardedRef'
 * -> React.ForwardedRef<HTMLHeadingElement>
 */
type RefType = any

const Text = forwardRef(({ size, weight, children, style, ...props }: TextProps, ref: RefType) => {
  const styles = { ...textStyle({ size, weight }), ...style }
  return (
    <p style={styles} ref={ref} {...props}>
      {children}
    </p>
  )
})

export default Text
