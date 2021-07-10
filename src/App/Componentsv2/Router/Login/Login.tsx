import { config } from "config"
import React, { useState, FormEvent } from "react"
import Container from "@bit/ziro.views.container"
import FixedBar from "@bit/ziro.views.fixed-bar"
import Header from "@bit/ziro.views.header"
import { Modal } from "@bit/ziro.views.modal"
import Illustration from "@bit/ziro.views.illustration"
import Title from "@bit/ziro.views.title"
import Text from "@bit/ziro.views.text"
import Button from "@bit/ziro.views.button"
import Icon from "@bit/ziro.views.icon2"
import Link from "@bit/ziro.views.link"
import { InputEmail, InputText } from "@bit/ziro.views.input"
import inputsValidation from "./utils/validations"
import onSubmit from "./utils/onSubmit"
import FixedBarContent from "./FixedBarContent"
import { ErrorMessages } from "./types"
import { modal, text, btn, header, register, main, welcome, msg, audienceStyle, trouble } from "./styles"

const { collectionName, audience, preferencesRoute } = config

export const Login = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [pass, setPass] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const [inputError, setInputError] = useState<ErrorMessages>({})
  const [showModal, setShowModal] = useState(false)
  const validations = [
    {
      inputName: "email",
      validation: (value: string) => /^\S+@\S+\.\S+$/g.test(value),
      value: email,
      message: "Email inválido",
    },
    {
      inputName: "password",
      validation: (value: string) => value.length > 5,
      value: pass,
      message: "Mínimo 6 caracteres",
    },
  ]
  const submitForm = async (e: FormEvent) => {
    try {
      e.preventDefault()
      const { formIsValid, errorMessages } = inputsValidation(validations)
      if (formIsValid) {
        setInputError({})
        setIsLoading(true)
        await onSubmit(email, pass, collectionName)
      } else {
        setInputError(errorMessages)
      }
    } catch (error) {
      const { message } = error
      setIsLoading(false)
      setErrorMsg(message || "")
      setShowModal(true)
    }
  }
  return (
    <Container withoutHeight withoutPadding>
      {containerSizes => (
        <>
          <FixedBar containerSizes={containerSizes} position="top">
            <FixedBarContent>
              <Header useHistory title="Login" />
            </FixedBarContent>
          </FixedBar>
          <Modal showModal={showModal} setShowModal={setShowModal}>
            <div style={modal}>
              <Illustration name="BugFixRed" />
              <div style={text}>
                <Title>Erro no login</Title>
                <Text>{errorMsg || "Tente novamente ou contate suporte"}</Text>
                <Button type="button" onClick={() => setShowModal(false)} style={btn}>
                  Tentar novamente
                </Button>
              </div>
            </div>
          </Modal>
          <div style={header}>
            <Icon customName="OneHorizontal" width={70} height={19} />
            <Link href={`${preferencesRoute}/cadastrar`} style={register}>
              Sem conta? CADASTRAR
            </Link>
          </div>
          <div style={main}>
            <div style={welcome}>
              <div style={msg}>
                <Title>Bem vindo, &nbsp;</Title>
                <Title style={audienceStyle}>{audience}</Title>
              </div>
            </div>
            <form onSubmit={submitForm}>
              <Title size="smallMedium">Email</Title>
              <InputEmail
                inputName="email"
                value={email}
                setValue={setEmail}
                inputError={inputError.email}
                isLoading={isLoading}
              />
              <Title size="smallMedium">Senha</Title>
              <InputText
                inputName="password"
                value={pass}
                setValue={setPass}
                placeholder="Sua senha"
                inputType="password"
                inputError={inputError.password}
                isLoading={isLoading}
              />
              <Button type="submit" isLoading={isLoading}>
                Entrar
              </Button>
            </form>
            <Link href={`${preferencesRoute}/problemas-acesso`} style={trouble}>
              Problemas no acesso?
            </Link>
          </div>
        </>
      )}
    </Container>
  )
}
