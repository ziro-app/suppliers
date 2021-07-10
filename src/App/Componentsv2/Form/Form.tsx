import React, { useState, cloneElement, ReactNode, ReactElement } from "react"

import { Modal } from "@bit/ziro.views.modal"
import Button from "@bit/ziro.views.button"
import Illustration from "@bit/ziro.views.illustration"

import inputsValidation from "./utils/inputsValidation"
import { modalContainer, textContainer, btn } from "./styles"
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
  hideModalSuccess = false,
}: types.FormProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [inputError, setInputError] = useState<types.errorMessages>({})
  const [modal, setModal] = useState<ReactNode>()
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false)
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false)
  const [error, setError] = useState<Error>()

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault()

    const [formIsValid, errorMessages] = inputsValidation(validations)

    if (formIsValid) {
      setInputError({})
      setIsLoading(true)

      try {
        await onSubmit()
        if (!hideModalSuccess) {
          if (ModalSuccess) setModal(ModalSuccess)
          else setShowSuccessModal(true)
        }
      } catch (err) {
        if (ModalError) setModal(cloneElement(ModalError, { err, setModalState }))
        else {
          setShowErrorModal(true)
          setError(err)
          setIsLoading(false)
        }
      }
      if (!hideModalSuccess) {
        /** chamada para abrir o modal apos o submit, seja para mostrar sucesso ou erro */
        if (setModalState) setModalState({ userInput: true })
        setIsLoading(false)
      }
    } else setInputError(errorMessages as types.errorMessages)
  }

  return (
    <>
      {TextSuccess && (
        <Modal showModal={showSuccessModal} setShowModal={setShowSuccessModal}>
          <div style={modalContainer}>
            <Illustration name="PaymentSuccess" />
            <div style={textContainer}>{cloneElement(TextSuccess, { setShowModal: setShowSuccessModal })}</div>
          </div>
        </Modal>
      )}

      {TextError && (
        <Modal showModal={showErrorModal} setShowModal={setShowErrorModal}>
          <div style={modalContainer}>
            <Illustration name="BugFixRed" />
            <div style={textContainer}>{cloneElement(TextError, { error })}</div>
            <Button type="button" onClick={() => setShowErrorModal(false)} style={btn}>
              Tentar novamente
            </Button>
          </div>
        </Modal>
      )}

      {modal}

      <form onSubmit={submitForm}>
        {/* eslint-disable-next-line no-nested-ternary */}
        {Array.isArray(children)
          ? children.map((element: ReactElement, i: number) => {
              const {
                props: { inputName, type },
              } = element
              /** if element is an input, clone it and pass isLoading and inputError (the validation error message) */
              if (inputName) return cloneElement(element, { key: i, isLoading, inputError: inputError[inputName] })
              /** if element is a button, clone it and pass isLoading */
              if (type === "submit" || type === "button" || type === "fixedBar")
                return cloneElement(element, { key: i, isLoading })
              return element
            })
          : children.props.type === "submit" || children.props.type === "button" || children.props.type === "fixedBar"
          ? cloneElement(children, { isLoading })
          : children}
      </form>
    </>
  )
}

export default Form
