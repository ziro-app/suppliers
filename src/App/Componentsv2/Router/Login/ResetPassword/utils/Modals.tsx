import React from "react"
import { pushState } from "@bit/ziro.utils.history"
import { useLocation, getFirstElementOfPath } from "@bit/ziro.views.router"
import Title from "@bit/ziro.views.title"
import Text from "@bit/ziro.views.text"
import Button from "@bit/ziro.views.button"
import { SetStateType } from "@bit/ziro.utils.types"

type TextSuccessProps = {
  setShowModal?: SetStateType<boolean>
}

export const TextSuccess = ({ setShowModal }: TextSuccessProps) => {
  const [location] = useLocation()
  const [routeStart] = getFirstElementOfPath(location)
  return (
    <>
      <Title>Sucesso</Title>
      <Text>Acesse o link na sua caixa de entrada para resetar a senha</Text>
      <Button
        type="button"
        onClick={() => {
          if (setShowModal) setShowModal(false)
          pushState({}, "", routeStart)
        }}
        style={{ marginTop: "15px" }}
      >
        Ok
      </Button>
    </>
  )
}

export const TextError = ({ error }: { error?: Error }) => (
  <>
    <Title>Ocorreu um erro</Title>
    <Text>{(error && error.message) || "Tente novamente ou contate suporte."}</Text>
  </>
)
