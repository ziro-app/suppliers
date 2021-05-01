import React from "react"

export type validations = {
  inputName: string
  validation: (value: string | number | File | File[]) => boolean
  value: string | number | File | File[]
  message: string
}[]

export type errorMessages = {
  [field: string]: string
}

interface CommonProps {
  /** Validacao das entradas do usuario */
  validations: validations
  /** Funcao executada ao submeter o form */
  onSubmit: () => any
  /** Campos do form (inputs e button) */
  children: React.ReactElement | React.ReactElement[]
}

interface WithModal extends CommonProps {
  /** Modal personalizado a ser invocado caso o onSubmit seja bem sucedido */
  ModalSuccess: React.ReactNode
  /** Modal personalizado a ser invocado caso o onSubmit gere um erro */
  ModalError: React.ReactElement
  /** Funcao para controlar o estado de on/off do modal */
  setModalState: React.Dispatch<React.SetStateAction<{ userInput: boolean }>>
  /** Fragment para customizar o modal padrão de sucesso */
  TextSuccess?: never
  /** Fragment para customizar o modal padrão de erro */
  TextError?: never
}

interface WithoutModal extends CommonProps {
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
}

export type FormProps = WithModal | WithoutModal
