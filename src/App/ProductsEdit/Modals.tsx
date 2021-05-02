import React from "react"
import Title from "../Componentsv2/Title"
import Text from "../Componentsv2/Text"
import Link from "../Componentsv2/Link"
import Illustration from "../Componentsv2/Illustration"

export const TextSuccess = () => (
  <>
    <Title>Sucesso!</Title>
    <Text>Seu produto foi editado.</Text>
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

export const TextSuccessDelete = () => (
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

export const TextConfirmDelete = () => (
  <div>
    <Illustration name="PaymentError" height={110} />
    <Title>Confirmar exclusão</Title>
    <Text>Deseja mesmo excluir o produto? Essa ação é irreversível.</Text>
  </div>
)
