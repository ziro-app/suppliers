import themes from "../themes"

const { fontFamily, fontWeight, fontSize, colors, gradient, shadow } = themes

export const link: React.CSSProperties = {
  fontFamily: fontFamily.title,
  fontWeight: fontWeight.title,
  fontSize: fontSize.small,
  textDecoration: "underline",
  color: colors.primary,
  cursor: "pointer",
}

export const linkDisabled: React.CSSProperties = {
  fontFamily: fontFamily.title,
  fontWeight: fontWeight.title,
  fontSize: fontSize.small,
  textDecoration: "none",
  color: colors.gray1,
  cursor: "default",
}

export const button: React.CSSProperties = {
  width: "100%",
  minHeight: "38px",
  padding: "10px 0px",
  WebkitAppearance: "none",
  WebkitTapHighlightColor: "rgba(0,0,0,0)",
  MozAppearance: "none",
  outline: "none",
  cursor: "pointer",
  border: "none",
  borderRadius: "2px",
  fontFamily: fontFamily.title,
  fontSize: fontSize.small,
  color: "#FFF",
  textAlign: "center",
  background: gradient.primary,
  boxShadow: shadow.primaryAlt,
}

export const buttonDisabled: React.CSSProperties = {
  ...button,
  display: "block",
  cursor: "initial",
  color: colors.primary,
  background: colors.gray4,
  boxShadow: "none",
}
