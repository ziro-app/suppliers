import React from "react"
import { useLocation, getFirstElementOfPath } from "@bit/ziro.views.router"
import { pushState } from "@bit/ziro.utils.history"
import Title from "@bit/ziro.views.title"
import Text from "@bit/ziro.views.text"
import Button from "@bit/ziro.views.button"
import Link from "@bit/ziro.views.link"
import Illustration from "@bit/ziro.views.illustration"
import { SetStateType } from "@bit/ziro.utils.types"

type TextSuccessProps = {
  setShowModal?: SetStateType<boolean>
  productExists: boolean
}

export const TextSuccess = ({ setShowModal, productExists }: TextSuccessProps) => {
  const [location] = useLocation()
  const [routeStart] = getFirstElementOfPath(location)
  return (
    <>
      <Title>Sucesso</Title>
      <Text>
        {productExists ? "O produto foi atualizado" : "O produto foi cadastrado e estará exposto na sua galeria"}
      </Text>
      <Button
        type="button"
        onClick={() => {
          if (setShowModal) setShowModal(false)
          if (productExists) pushState({}, "", routeStart)
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

export const TextSuccessDelete = () => {
  const [location] = useLocation()
  const [routeStart] = getFirstElementOfPath(location)
  return (
    <>
      <Title>Sucesso</Title>
      <Text>Seu produto foi excluído</Text>
      <Link isButton href={routeStart} style={{ marginTop: "15px" }}>
        Ok
      </Link>
    </>
  )
}

export const TextConfirmDelete = () => (
  <>
    <Illustration name="PaymentError" height={110} />
    <div>
      <Title>Confirmar exclusão</Title>
      <Text>Deseja mesmo excluir o produto? Essa ação é irreversível</Text>
    </div>
  </>
)
