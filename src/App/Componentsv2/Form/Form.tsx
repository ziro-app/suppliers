import React, { useState, cloneElement, ReactNode } from "react"

import * as types from "./types"

import inputsValidation from "./utils/inputsValidation"

export interface FormProps {
  /** Validacao das entradas do usuário */
  validations: types.validations
  /** Funcao executada ao submeter o form o retorno dever ser do tipo Promise<[React.ReactNode, boolean, React.Dispatch<React.SetStateAction<{ userInput: boolean }>>]> */
  // onSubmit: () => Promise<[React.ReactNode, boolean, React.Dispatch<React.SetStateAction<{ userInput: boolean }>>]>
  onSubmit: () => any
  /** Campos do form (inputs e button) */
  children: React.ReactElement
}

const Form = ({ validations, onSubmit, children }: FormProps) => {
  const [isLoading, setIsLoading] = useState(false)
  // const [inputError, setInputError] = useState<types.errorMessages>({})
  const [inputError, setInputError] = useState({})
  const [modal, setModal] = useState<ReactNode>()

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault()

    const [formIsValid, errorMessages] = inputsValidation(validations)

    if (formIsValid) {
      setInputError({})
      setIsLoading(true)

      const [sfModal, stateModal, setStateModal] = await onSubmit()

      setModal(sfModal)
      setStateModal({ userInput: true })

      setIsLoading(false)
    } else {
      setInputError(errorMessages)
    }
  }

  return (
    <>
      {modal}
      <form onSubmit={submitForm}>
        {children.props.children.map((element: any, i: any) => {
          return cloneElement(element, { key: i, isLoading, inputError: inputError[element.props.inputName] })
        })}
      </form>
    </>
  )
}

export default Form
