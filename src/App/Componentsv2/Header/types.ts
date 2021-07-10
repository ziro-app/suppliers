import { CSSProperties } from "react"

type CommonProps = {
  /** titulo do header */
  title: string
  /** estilos customizados para o container principal */
  style?: CSSProperties
}
type UseHistory = {
  /** path para quando o usuario apertar o icone de voltar */
  to?: never
  /** usa o back da API do history do browser ao invés do componente Link */
  useHistory: true
} & CommonProps

type NotUseHistory = {
  /** path para quando o usuario apertar o icone de voltar */
  to: string
  /** usa o back da API do history do browser ao invés do componente Link */
  useHistory?: false
} & CommonProps

export type HeaderProps = UseHistory | NotUseHistory
