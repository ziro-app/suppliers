import React from "react"

export interface InputCommonProps<T> extends React.HTMLAttributes<HTMLInputElement> {
  /** Nome para referenciar o campo de input */
  inputName: string
  /** Variavel a qual o valor e exibido no input (nao precisa ser passado quando usar factory) */
  value?: T
  /** Funcao do setState para setar uma variavel com o valor do input (nao precisa ser passado quando usar factory) */
  setValue?: React.Dispatch<React.SetStateAction<T>>
  /** Quando este parametro é true o input assume seu estado disabled */
  isLoading?: boolean
  /** Quando este parametro é true o input assume seu estado disabled */
  isDisabled?: boolean
  /** Mensagem exibida quando o input do usuario e invalido */
  inputError?: string
  /** Estilo customizado do icone de erro do input */
  styleErrorIcon?: React.CSSProperties
  /** Estilo customizado do texto de erro do input */
  styleErrorText?: React.CSSProperties
  /** Usado para passar um estilo customizado ao input */
  style?: React.CSSProperties
}

export interface InputMoneyProps extends InputCommonProps<string> {
  monetarySymbol?: string
}

export interface InputTextProps extends InputCommonProps<string> {
  /** Tipo HTML do input */
  inputType?: "email" | "number" | "password" | "search" | "text" | "url"
  /** Placeholder mostrado antes de ser inserido algum valor no input */
  placeholder: string
  /** Usado para definir o tipo de dado do campo e do teclado mostrado em dispositivos moveis */
  inputMode?: "none" | "text" | "tel" | "url" | "email" | "numeric" | "decimal" | "search"
}
