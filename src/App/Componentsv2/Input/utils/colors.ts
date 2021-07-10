import theme from "@bit/ziro.utils.themes"

type Color = {
  [key: string]: string
}

export const matchColor: Color = {
  default: theme.colors.accent,
  primary: theme.colors.primary,
  gray: theme.colors.gray2,
  warning: theme.colors.warning,
  alert: theme.colors.alert,
  secondary: theme.colors.secondary,
  success: theme.colors.success,
}
