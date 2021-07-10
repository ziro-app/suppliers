import theme from "@bit/ziro.utils.themes"

export const container: React.CSSProperties = {
  position: "relative",
}
export const close: React.CSSProperties = {
  position: "absolute",
  right: "9px",
  top: "8px",
  width: "18px",
  height: "18px",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  transform: "none",
  background: theme.colors.gray2,
  borderRadius: "50%",
  cursor: "pointer",
}
export const modal: React.CSSProperties = {
  zIndex: 1, // don't remove
  position: "absolute",
  display: "grid",
  alignContent: "start",
  overflowY: "scroll",
  boxSizing: "border-box",
  width: "100%",
  maxHeight: "120px",
  margin: "1px auto 0",
  border: `2px solid ${theme.colors.gray3}`,
  borderRadius: "8px",
  fontFamily: `${theme.fontFamily.body}, 'system-ui', 'sans-serif'`,
  color: theme.colors.primary,
  backgroundColor: "#FDFDFD",
  boxShadow: `rgba(34,34,34,0.3) 0px 3px 10px -3px`,
}
export const data = (isActive?: boolean): React.CSSProperties => ({
  WebkitAppearance: "none",
  MozAppearance: "none",
  outline: "none",
  boxSizing: "border-box",
  width: "100%",
  height: "30px",
  padding: "0 20px",
  border: "none",
  fontFamily: `${theme.fontFamily.body}, 'system-ui', 'sans-serif'`,
  fontSize: theme.fontSize.small,
  color: theme.colors.primary,
  backgroundColor: isActive ? "#F3F3F3" : "#FDFDFD",
  cursor: "pointer",
})

export const defaultInputStyle: React.CSSProperties = {
  WebkitAppearance: "none",
  MozAppearance: "none",
  outline: "none",
  boxSizing: "border-box",
  width: "100%",
  padding: "8px 22px",
  border: `2px solid #E0E0E0`,
  borderRadius: "8px",
  fontFamily: theme.fontFamily.body,
  fontSize: theme.fontSize.small,
  color: theme.colors.primary,
  backgroundColor: "#FDFDFD",
  boxShadow: `rgba(34,34,34,0.3) 0px 3px 10px -3px`,
}

export const errorContainer: React.CSSProperties = {
  width: "100%",
  height: "15px",
  display: "flex",
  marginLeft: "2px",
}

export const errorText: React.CSSProperties = {
  fontSize: theme.fontSize.xsmall,
  fontWeight: theme.fontWeight.title,
  color: theme.colors.alert,
}

export const errorIcon: React.CSSProperties = {
  strokeWidth: "3px",
  stroke: theme.colors.alert,
}
