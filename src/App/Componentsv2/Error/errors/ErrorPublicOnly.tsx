import React from "react"
import theme from "@bit/ziro.utils.themes"
import { ErrorGeneric } from "./ErrorGeneric"

export const ErrorPublicOnly = () => {
  return (
    <ErrorGeneric
      illustration="NotFound"
      title="Você já fez login"
      text="Essa página é apenas para usuários deslogados"
      button="Voltar"
      styleTextContainer={{ color: theme.colors.primary }}
      styleButton={{ background: theme.colors.primary }}
    />
  )
}
