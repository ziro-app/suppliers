import { CSSProperties } from "react"
import themes from "@bit/ziro.utils.themes"

export const modal: CSSProperties = {
  display: "grid",
  justifyItems: "center",
  gridGap: "12px",
}

export const text: CSSProperties = {
  display: "grid",
  gridRowGap: "2px",
  textAlign: "center",
}

export const btn: CSSProperties = {
  marginTop: "10px",
  padding: "10px",
}

export const header: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "auto 1fr",
  alignItems: "center",
  justifyItems: "end",
  padding: "18px 15px",
  background: themes.gradient.primary,
}

export const register: CSSProperties = {
  fontFamily: themes.fontFamily.body,
  fontSize: themes.fontSize.xsmall,
  color: "white",
}

export const main: CSSProperties = {
  padding: "0 15px",
}

export const welcome: CSSProperties = {
  margin: "20px 0 15px",
}

export const msg: CSSProperties = {
  display: "flex",
}

export const audienceStyle: CSSProperties = {
  background: "linear-gradient(transparent 60%, rgba(255,206,0,0.75) 100%)",
}

export const trouble: CSSProperties = {
  display: "flex",
  justifyContent: "center",
  margin: "15px auto 0",
}
