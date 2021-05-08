import React, { useState, useContext, useEffect } from "react"
import { useRoute } from "wouter"
import Form from "../Componentsv2/Form"
import Title from "../Componentsv2/Title"
import { InputFile, InputText, InputMoney, InputPercentage } from "../Componentsv2/Input"
import Button from "../Componentsv2/Button"
import DotsLoader from "../Componentsv2/DotsLoader"
import Slider from "../Componentsv2/Slider"
import { Modal } from "../Componentsv2/Modal"
import ProductImages from "../Componentsv2/ProductGallery/ProductImages"
import { userContext } from "../appContext"
import validations from "./validations"
import onSubmit from "./onSubmit"
import useProduct from "./useProduct"
import deleteProduct from "./deleteProduct"
import { TextSuccess, TextError, TextSuccessDelete, TextErrorDelete, TextConfirmDelete } from "./Modals"
import { buttonDelete, buttonSubmit, confirmDeleteModal, confirmDeleteButtons } from "./styles"

const ProductsEdit = () => {
  const [, params] = useRoute("/produtos/:productId/editar")
  const [isLoading, setIsLoading] = useState(true)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [fetchedImages, setFetchedImages] = useState<string[]>()
  const [images, setImages] = useState<File[]>()
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [discount, setDiscount] = useState("")
  const [reference, setReference] = useState("")
  const [colors, setColors] = useState("")
  const [sizes, setSizes] = useState("")
  const { uid, fantasy } = useContext(userContext)
  const productId = params && params.productId
  const state = {
    fetchedImages,
    images,
    description,
    price,
    discount,
    reference,
    colors,
    sizes,
    uid,
    fantasy,
    productId,
  }
  const setState = {
    setIsLoading,
    setFetchedImages,
    setImages,
    setDescription,
    setPrice,
    setDiscount,
    setReference,
    setColors,
    setSizes,
  }
  useProduct(uid, productId, setState, isLoading)
  if (isLoading) return <DotsLoader />
  return (
    <>
      <Slider>
        <ProductImages images={fetchedImages} />
      </Slider>
      <br />
      <Form
        validations={validations()}
        onSubmit={() => onSubmit(state, setState)}
        TextSuccess={<TextSuccess />}
        TextError={<TextError />}
      >
        <Title size="smallMedium">Imagens</Title>
        <InputFile inputName="images" value={images} setValue={setImages} />
        <Title size="smallMedium">Descrição</Title>
        <InputText inputName="description" value={description} setValue={setDescription} placeholder="Blusa com alça" />
        <Title size="smallMedium">Preço</Title>
        <InputMoney inputName="price" value={price} setValue={setPrice} placeholder="R$100,00" />
        <Title size="smallMedium">Desconto</Title>
        <InputPercentage inputName="discount" value={discount} setValue={setDiscount} placeholder="%5,00" />
        <Title size="smallMedium">Referência</Title>
        <InputText inputName="reference" value={reference} setValue={setReference} placeholder="123ABC" />
        <Title size="smallMedium">Cores</Title>
        <InputText inputName="colors" value={colors} setValue={setColors} placeholder="Amarelo,azul" />
        <Title size="smallMedium">Tamanhos</Title>
        <InputText inputName="sizes" value={sizes} setValue={setSizes} placeholder="P,M,G" />
        <Button type="submit" style={buttonSubmit}>
          Enviar produto
        </Button>
      </Form>
      <Form
        validations={[]}
        onSubmit={() => deleteProduct(uid, productId)}
        TextSuccess={<TextSuccessDelete />}
        TextError={<TextErrorDelete />}
      >
        <Modal showModal={confirmDelete} setShowModal={setConfirmDelete}>
          <div style={confirmDeleteModal}>
            <TextConfirmDelete />
            <div style={confirmDeleteButtons}>
              <Button type="submit" onClick={() => setConfirmDelete(false)}>
                Excluir
              </Button>
              <Button type="button" onClick={() => setConfirmDelete(false)} buttonStyle="light">
                Sair
              </Button>
            </div>
          </div>
        </Modal>
        <Button type="button" onClick={() => setConfirmDelete(true)} buttonStyle="destructive" style={buttonDelete}>
          Excluir produto
        </Button>
      </Form>
    </>
  )
}

export default ProductsEdit
