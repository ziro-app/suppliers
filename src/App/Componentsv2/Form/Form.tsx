import React, { useState, cloneElement, ReactNode, ReactElement } from "react"

import { Modal } from "../Modal"
import Button from "../Button"
import Illustration from "../Illustration"

import inputsValidation from "./utils/inputsValidation"
import { modalContainer, textContainer } from "./styles"
import * as types from "./types"

const Form = ({
  validations,
  onSubmit,
  ModalSuccess,
  ModalError,
  setModalState,
  TextSuccess,
  TextError,
  children,
}: types.FormProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [inputError, setInputError] = useState<types.errorMessages>({})
  const [modal, setModal] = useState<ReactNode>()
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false)
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false)

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault()

    const [formIsValid, errorMessages] = inputsValidation(validations)

    if (formIsValid) {
      setInputError({})
      setIsLoading(true)

      try {
        await onSubmit()

        if (ModalSuccess) setModal(ModalSuccess)
        else setShowSuccessModal(true)
      } catch (error) {
        if (ModalError) setModal(cloneElement(ModalError, { error, setModalState }))
        else setShowErrorModal(true)
      }
      /** chamada para abrir o modal apos o submit, seja para mostrar sucesso ou erro */
      if (setModalState) setModalState({ userInput: true })
      setIsLoading(false)
    } else {
      setInputError(errorMessages as types.errorMessages)
    }
  }

  return (
    <>
      {TextSuccess && (
        <Modal showModal={showSuccessModal} setShowModal={setShowSuccessModal}>
          <div style={modalContainer}>
            <Illustration name="PaymentSuccess" />
            <div style={textContainer}>{TextSuccess}</div>
          </div>
        </Modal>
      )}

      {TextError && (
        <Modal showModal={showErrorModal} setShowModal={setShowErrorModal}>
          <div style={modalContainer}>
            <Illustration name="BugFixRed" />
            <div style={textContainer}>{TextError}</div>
            <Button onClick={() => setShowErrorModal(false)}>Tentar novamente</Button>
          </div>
        </Modal>
      )}

      {modal}

      <form onSubmit={submitForm}>
        {children.map((element: ReactElement, i: number) => {
          if (element.props.inputName)
            return cloneElement(element, { key: i, isLoading, inputError: inputError[element.props.inputName] })
          return element
        })}
      </form>
    </>
  )
}

export default Form
