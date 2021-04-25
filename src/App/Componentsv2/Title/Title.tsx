import React, { forwardRef } from "react"
import themes from "../themes"
import titleStyle from "./styles"

interface TitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** font-size do titulo */
  size?: keyof typeof themes.fontSize
  /** Conteudo do titulo */
  children: React.ReactNode
  /** Aqui pode-se passar estilos customizados */
  style?: React.CSSProperties
}

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
