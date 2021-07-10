import themes from "@bit/ziro.utils.themes"

export const badgeTextRetailer: { [index: string]: string } = {
  "pendente-enviar": "Pronto para iniciar",
  "em-analise": "Em análise",
  "modificado-por-fabricante": "Modificado",
  "adicionado-por-fabricante": "Adicionado",
  confirmado: "Confirmado",
}

export const badgeColorRetailer: { [index: string]: string } = {
  "pendente-enviar": themes.colors.accent,
  "em-analise": themes.colors.accentAlt,
  "modificado-por-fabricante": themes.colors.warning,
  "adicionado-por-fabricante": themes.colors.warning,
  confirmado: themes.colors.success,
}

export const badgeTextSupplier: { [index: string]: string } = {
  "em-analise": "Pendente confirmar",
  "modificado-por-fabricante": "Aguardando cliente",
  "adicionado-por-fabricante": "Aguardando cliente",
  confirmado: "Confirmado",
}

export const badgeColorSupplier: { [index: string]: string } = {
  "em-analise": themes.colors.warning,
  "modificado-por-fabricante": themes.colors.accentAlt,
  "adicionado-por-fabricante": themes.colors.accentAlt,
  confirmado: themes.colors.success,
}
