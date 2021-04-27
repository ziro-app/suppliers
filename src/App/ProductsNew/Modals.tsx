import React from "react"
import Title from "../Componentsv2/Title"
import Text from "../Componentsv2/Text"
import Link from "../Componentsv2/Link"

export const TextSuccess = () => (
  <>
    <Title>Opa! Deu tudo certo!</Title>
    <Text>Que bom que deu tudo certo, pois um cavalo sem sede, é um cavalo com água.</Text>
    <Link isButton href="/" style={{ marginTop: "15px" }}>
      Ir para página inicial
    </Link>
  </>
)

export const TextError = () => (
  <>
    <Title>Desculpe, algo deu errado!</Title>
    <Text>Algo de errado não está certo, pois um cachorro morto é um cachorro sem vida.</Text>
  </>
)
