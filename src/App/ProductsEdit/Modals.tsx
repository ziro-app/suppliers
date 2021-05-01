import React, { Dispatch, SetStateAction } from "react"
import Title from "../Componentsv2/Title"
import Text from "../Componentsv2/Text"
import Link from "../Componentsv2/Link"
import Illustration from "../Componentsv2/Illustration"
import Button from "../Componentsv2/Button"

type TextSuccessProps = {
  setShowModal?: Dispatch<SetStateAction<boolean>>
}

export const TextSuccess = ({ setShowModal }: TextSuccessProps) => (
  <>
    <Title>Sucesso!</Title>
    <Text>Seu produto foi cadastrado e estará exposto na sua galeria.</Text>
    <Link isButton href="/produtos" style={{ marginTop: "15px" }}>
      Ok
    </Link>
  </>
)

export const TextError = ({ error }: { error?: Error }) => (
  <>
    <Title>Ocorreu um erro</Title>
    <Text>{(error && error.message) || "Tente novamente ou contate suporte."}</Text>
  </>
)

export const TextSuccessDelete = ({ setShowModal }: TextSuccessProps) => (
  <>
    <Title>Sucesso!</Title>
    <Text>Seu produto foi excluido.</Text>
    <Link isButton href="/produtos" style={{ marginTop: "15px" }}>
      Ok
    </Link>
  </>
)

export const TextErrorDelete = ({ error }: { error?: Error }) => (
  <>
    <Title>Ocorreu um erro</Title>
    <Text>{(error && error.message) || "Tente novamente ou contate suporte."}</Text>
  </>
)

export const TextConfirmDelete = ({ error }: { error?: Error }) => (
  <div>
    <Illustration name="PaymentError" height={110} />
    <Title>Confirmar exclusão</Title>
    <Text>Deseja mesmo excluir o produto? Essa ação é irreversível.</Text>
  </div>
)
