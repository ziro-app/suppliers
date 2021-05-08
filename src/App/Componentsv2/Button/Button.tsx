import React from "react"
import { motion, MotionProps } from "framer-motion"

import DotsLoader from "../DotsLoader"

import { regular, light, destructive, disabled } from "./styles"

interface ButtonProps extends MotionProps {
  /** Tipo HTML do botao (exceto type="reset") */
  type: "button" | "submit"
  /** Funcao onClick  */
  onClick?: () => void
  /** Quando isLoading = true, e mostrado o loading dentro do botao */
  isLoading?: boolean
  /** Estilo predefinido */
  buttonStyle?: "regular" | "light" | "destructive"
  /** Quando isDisabled = true, o botao assume estilo de desabilitado */
  isDisabled?: boolean
  /** Cor do loader quando isLoading = true */
  loaderColor?: string
  /** Tamanho do loader quando isLoading = true */
  loaderSize?: string
  /** Conteudo do botao */
  children: React.ReactNode
  /** Estilos customizados ao botao */
  style?: React.CSSProperties
  /** Estilos customizados quando isDisable = true */
  styleDisabled?: React.CSSProperties
}

const Button = ({
  type = "button",
  onClick,
  isLoading = false,
  buttonStyle = "regular",
  isDisabled = false,
  style,
  styleDisabled,
  loaderColor,
  loaderSize = "6px",
  children,
  ...props
}: ButtonProps) => {
  const btnStyle = { regular, light, destructive }

  const _style = isDisabled
    ? {
        ...disabled,
        ...styleDisabled,
      }
    : {
        ...btnStyle[buttonStyle],
        ...style,
      }

  return (
    <motion.button
      type={type}
      onClick={onClick}
      style={isLoading ? { ..._style, cursor: "initial" } : _style}
      disabled={isDisabled || isLoading}
      whileTap={isLoading || isDisabled ? { scale: 1 } : { scale: 0.95 }}
      {...props}
    >
      {isLoading ? (
        <DotsLoader color={loaderColor || (buttonStyle === "light" ? "blackDots" : "whiteDots")} size={loaderSize} />
      ) : (
        children
      )}
    </motion.button>
  )
}

export default Button
