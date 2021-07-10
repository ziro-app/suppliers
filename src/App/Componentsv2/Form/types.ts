import React from "react"
import { SetStateType } from "@bit/ziro.utils.types"

export type FormValueType = string | number | FileList | boolean

export type validations = {
  inputName: string
  validation: (value: FormValueType) => boolean
  value: FormValueType
  message: string
}[]

export type errorMessages = {
  [field: string]: string
}

interface CommonProps {
  /** Validacao das entradas do usuario */
  validations: validations
  /** Funcao executada ao submeter o form */
  onSubmit: () => void
  /** Campos do form (inputs e button) */
  children: React.ReactElement | React.ReactElement[]
}

interface HideModalSuccessWithModal extends CommonProps {
  /** Modal personalizado a ser invocado caso o onSubmit seja bem sucedido */
  ModalSuccess?: never
  /** Modal personalizado a ser invocado caso o onSubmit gere um erro */
  ModalError: React.ReactElement
  /** Funcao para controlar o estado de on/off do modal */
  setModalState: SetStateType<{ userInput: boolean }>
  /** Fragment para customizar o modal padrão de sucesso */
  TextSuccess?: never
  /** Fragment para customizar o modal padrão de erro */
  TextError?: never
  /** opcao para nao mostrar o ModalSuccess quando o submit acontece. Exemplo de uso seria um botao de excluir um produto */
  hideModalSuccess: true
}

interface DontHideModalSuccessWithModal extends CommonProps {
  /** Modal personalizado a ser invocado caso o onSubmit seja bem sucedido */
  ModalSuccess: React.ReactNode
  /** Modal personalizado a ser invocado caso o onSubmit gere um erro */
  ModalError: React.ReactElement
  /** Funcao para controlar o estado de on/off do modal */
  setModalState: SetStateType<{ userInput: boolean }>
  /** Fragment para customizar o modal padrão de sucesso */
  TextSuccess?: never
  /** Fragment para customizar o modal padrão de erro */
  TextError?: never
  /** opcao para nao mostrar o ModalSuccess quando o submit acontece. Exemplo de uso seria um botao de excluir um produto */
  hideModalSuccess?: false
}

interface HideModalSuccessWithoutModal extends CommonProps {
  /** Modal personalizado a ser invocado caso o onSubmit seja bem sucedido */
  ModalSuccess?: never
  /** Modal personalizado a ser invocado caso o onSubmit gere um erro */
  ModalError?: never
  /** Funcao para controlar o estado de on/off do modal */
  setModalState?: never
  /** Fragment para customizar o modal padrão de sucesso */
  TextSuccess?: never
  /** Fragment para customizar o modal padrão de erro */
  TextError: React.ReactElement
  /** opcao para nao mostrar o ModalSuccess quando o submit acontece. Exemplo de uso seria um botao de excluir um produto */
  hideModalSuccess: true
}

interface DontHideModalSuccessWithoutModal extends CommonProps {
  /** Modal personalizado a ser invocado caso o onSubmit seja bem sucedido */
  ModalSuccess?: never
  /** Modal personalizado a ser invocado caso o onSubmit gere um erro */
  ModalError?: never
  /** Funcao para controlar o estado de on/off do modal */
  setModalState?: never
  /** Fragment para customizar o modal padrão de sucesso */
  TextSuccess: React.ReactElement
  /** Fragment para customizar o modal padrão de erro */
  TextError: React.ReactElement
  /** opcao para nao mostrar o ModalSuccess quando o submit acontece. Exemplo de uso seria um botao de excluir um produto */
  hideModalSuccess?: false
}

export type FormProps =
  | HideModalSuccessWithModal
  | DontHideModalSuccessWithModal
  | HideModalSuccessWithoutModal
  | DontHideModalSuccessWithoutModal
