import { CSSProperties } from "react"

export const container: CSSProperties = {
  display: "grid",
  alignItems: "center",
  height: "55px",
  margin: "0 auto",
  padding: "0 15px",
}

export const header: CSSProperties = {
  margin: 0,
}

export const navContainer: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr auto",
  alignItems: "center",
  justifyContent: "space-between",
  height: "55px",
  margin: "0 auto",
  padding: "0 15px",
}

export const modal: CSSProperties = {
  display: "grid",
  justifyItems: "center",
  gridRowGap: "12px",
}

export const text: CSSProperties = {
  display: "grid",
  gridRowGap: "2px",
  textAlign: "center",
}

export const icon: CSSProperties = {
  cursor: "pointer",
}

export const btn: CSSProperties = {
  borderRadius: "0",
}
