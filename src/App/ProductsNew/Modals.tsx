import React, { Dispatch, SetStateAction } from "react"
import Title from "../Componentsv2/Title"
import Text from "../Componentsv2/Text"
import Button from "../Componentsv2/Button"

type TextSuccessProps = {
  setShowModal?: Dispatch<SetStateAction<boolean>>
}

export const TextSuccess = ({ setShowModal }: TextSuccessProps) => (
  <>
    <Title>Sucesso!</Title>
    <Text>Seu produto foi cadastrado e estará exposto na sua galeria.</Text>
    <Button type="button" onClick={() => setShowModal(false)} style={{ marginTop: "15px" }}>
      Ok
    </Button>
  </>
)

export const TextError = ({ error }: { error?: Error }) => (
  <>
    <Title>Ocorreu um erro</Title>
    <Text>{(error && error.message) || "Tente novamente ou contate suporte."}</Text>
  </>
)
