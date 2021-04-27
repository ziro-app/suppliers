import React, { useState, useContext } from "react"
import Form from "../Componentsv2/Form"
import Title from "../Componentsv2/Title"
import { InputText } from "../Componentsv2/Input"
import Button from "../Componentsv2/Button"
import { userContext } from "../appContext"
import validations from "./validations"
import onSubmit from "./onSubmit"
import { TextSuccess, TextError } from "./Modals"

const Products = () => {
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [reference, setReference] = useState("")
  const [colors, setColors] = useState("")
  const [sizes, setSizes] = useState("")
  const { uid } = useContext(userContext)
  const state = { description, price, reference, colors, sizes, uid }
  return (
    <Form
      validations={validations(state)}
      onSubmit={() => onSubmit(state)}
      TextSuccess={TextSuccess}
      TextError={TextError}
    >
      <Title size="smallMedium">Descrição</Title>
      <InputText inputName="description" value={description} setValue={setDescription} placeholder="Blusa com alça" />
      <Title size="smallMedium">Preço</Title>
      <InputText inputName="price" value={price} setValue={setPrice} placeholder="R$100,00" />
      <Title size="smallMedium">Referência</Title>
      <InputText inputName="reference" value={reference} setValue={setReference} placeholder="123ABC" />
      <Title size="smallMedium">Cores</Title>
      <InputText inputName="colors" value={colors} setValue={setColors} placeholder="Amarelo,azul" />
      <Title size="smallMedium">Tamanhos</Title>
      <InputText inputName="sizes" value={sizes} setValue={setSizes} placeholder="P,M,G" />
      <Button type="submit" isLoading={false}>
        Enviar produto
      </Button>
    </Form>
  )
}

export default Products
