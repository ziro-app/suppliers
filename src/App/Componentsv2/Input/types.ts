import React from "react"
import { SetStateType } from "@bit/ziro.utils.types"
import DayPicker from "react-day-picker"

export interface InputCommonProps<T> extends React.HTMLAttributes<HTMLInputElement> {
  /** Nome para referenciar o campo de input */
  inputName: string
  /** Variavel a qual o valor e exibido no input (nao precisa ser passado quando usar factory) */
  value?: T
  /** Funcao do setState para setar uma variavel com o valor do input (nao precisa ser passado quando usar factory) */
  setValue?: SetStateType<T>
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

interface checkboxWithToggleProps extends InputCommonProps<boolean> {
  /** Define o tamanho do Toggle */
  size?: number
  /** Define a cor do Toggle (padrão é "default" - que corresponde ao themes.colors.accent) */
  template?: string
  /** Define se o componente vai ser um Toggle ou não */
  isToggle: true
  /** Estilos customizados do label que segura o <input /> do InputCheckbox */
  styleInput?: React.CSSProperties
}

interface checkboxWithoutToggleProps extends InputCommonProps<boolean> {
  /** Define o tamanho do Toggle */
  size?: never
  /** Define a cor do Toggle (padrão é "default" - que corresponde ao themes.colors.accent) */
  template?: never
  /** Define se o componente vai ser um Toggle ou não */
  isToggle?: false
  /** Estilos customizados do label que segura o <input /> do InputCheckbox */
  styleInput?: React.CSSProperties
}

export type checkboxProps = checkboxWithToggleProps | checkboxWithoutToggleProps

export interface InputDropdownProps extends InputCommonProps<string> {
  /** Lista de opções a serem exibidas dentro do modal do Dropdown */
  list: string[]
  /** Define se o input será apenas de leitura (sem poder digitar) ou não */
  readOnly?: boolean
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

export interface InputCalendarProps extends InputCommonProps<string> {
  dayPickerProps?: DayPicker.DayPickerProps
}
