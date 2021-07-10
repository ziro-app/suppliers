import React from "react"
import theme from "@bit/ziro.utils.themes"
import { ErrorGeneric } from "./ErrorGeneric"

export const ErrorNotFound = () => {
  return (
    <ErrorGeneric
      illustration="NotFound"
      title="Página não encontrada"
      text="Verifique a URL e tente novamente"
      button="Voltar"
      styleTextContainer={{ color: theme.colors.primary }}
      styleButton={{ background: theme.colors.primary }}
    />
  )
}
