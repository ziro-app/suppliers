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
    <Button onClick={() => setShowModal(false)} style={{ marginTop: "15px" }}>
      Ok
    </Button>
  </>
)

export const TextError = () => (
  <>
    <Title>Ocorreu um erro</Title>
    <Text>Tente novamente ou contate suporte.</Text>
  </>
)
