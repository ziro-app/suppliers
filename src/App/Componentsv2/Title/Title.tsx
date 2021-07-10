import React, { forwardRef } from "react"
import themes from "@bit/ziro.utils.themes"
import titleStyle from "./styles"

interface TitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** font-size do titulo */
  size?: keyof typeof themes.fontSize
  /** Conteudo do titulo */
  children: React.ReactNode
  /** Aqui pode-se passar estilos customizados */
  style?: React.CSSProperties
}

/** any usado pois o react 16.12 não possui a exportação do 'ForwardedRef'
 * -> React.ForwardedRef<HTMLHeadingElement>
 */
type RefType = any

const Title = forwardRef(({ size, children, style, ...props }: TitleProps, ref: RefType) => {
  const styles = { ...titleStyle({ size }), ...style }
  return (
    <h2 style={styles} ref={ref} {...props}>
      {children}
    </h2>
  )
})

export default Title
