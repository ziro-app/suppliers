/* eslint-disable no-console */
import React, { useState, useContext, useEffect } from "react"
import { UserContextSupplier } from "@bit/ziro.utils.context"
import { useRoute, useLocation, getFirstElementOfPath } from "@bit/ziro.views.router"
import { useErrorHandler } from "react-error-boundary"
import DotsLoader from "@bit/ziro.views.dots-loader"
import FixedBar from "@bit/ziro.views.fixed-bar"
import { Modal } from "@bit/ziro.views.modal"
import Illustration from "@bit/ziro.views.illustration"
import Text from "@bit/ziro.views.text"
import Button from "@bit/ziro.views.button"
import Slider from "@bit/ziro.views.slider"
import { ProductImages } from "@bit/ziro.views.product-gallery"
import Header from "@bit/ziro.views.header"
import Form from "@bit/ziro.views.form"
import Title from "@bit/ziro.views.title"
import Icon from "@bit/ziro.views.icon2"
import { InputFile, InputText, InputMoney, InputPercentage } from "@bit/ziro.views.input"
import { HeaderContainer } from "../FixedBarContent"
import DeleteAndSubmitButtons from "@bit/ziro.unpublished.delete-and-submit-buttons"
import fetchProduct from "./utils/fetchProduct"
import deleteProduct from "./utils/deleteProduct"
import validations from "./utils/validations"
import validationsEdit from "./utils/validationsEdit"
import onSubmit from "./utils/onSubmit"
import helpMessage from "./utils/helpMessage"
import { TextSuccess, TextError, TextSuccessDelete, TextConfirmDelete } from "./utils/Modals"
import { tooltipModal, titleRow, tooltip, confirmDeleteModal, confirmDeleteBtns, btn } from "./styles"

const SingleProduct = ({ containerSizes }: { containerSizes: ClientRect }) => {
  /** get location and define routeStart */
  const [location] = useLocation()
  const [routeStart] = getFirstElementOfPath(location)
  const [, params] = useRoute(`${routeStart}/editar/:productId`)
  const productId = (params && params.productId) || "empty"
  /** helper states */
  const [isLoading, setIsLoading] = useState(true)
  const [shouldFetch, setShouldFetch] = useState(false)
  const [fetchedImages, setFetchedImages] = useState<string[]>([]) /** different state because of FileList */
  /** form states */
  /* @ts-ignore */
  const [images, setImages] = useState<FileList>({ item: () => null, length: 0 })
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState("")
  const [discount, setDiscount] = useState("")
  const [reference, setReference] = useState("")
  const [colors, setColors] = useState("")
  const [sizes, setSizes] = useState("")
  const { uid: supplierUid, fantasia } = useContext(UserContextSupplier) ?? { uid: "", fantasia: "" }
  /** modal states and click handlers */
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [tooltipTitle, setTooltipTitle] = useState("")
  const [tooltipText, setTooltipText] = useState("")
  const modalClick = () => {
    setShowTooltip(false)
    setTooltipTitle("")
    setTooltipText("")
  }
  const tooltipClick = (inputName: string) => {
    const { header, body } = helpMessage(inputName)
    setShowTooltip(true)
    setTooltipTitle(header)
    setTooltipText(body)
  }
  /** helper variables */
  const _state = { fetchedImages, images, title, description, price, discount, reference, colors, sizes }
  const state = { ..._state, supplierUid, fantasia, productId }
  const _setState = { setShouldFetch, setIsLoading, setFetchedImages, setImages, setTitle, setDescription, setPrice }
  const setState = { ..._setState, setDiscount, setReference, setColors, setSizes }
  const productExists = productId !== "empty"
  const pageTitle = productExists ? "Editar produto" : "Adicionar novo produto"
  const _validations = productExists ? () => validationsEdit(state) : () => validations(state)
  /** error hook */
  const handleError = useErrorHandler()
  /** fetch data if user is editing a product */
  useEffect(() => {
    let mounted = true
    try {
      /** fetch products if user just landed on editing page or just finished editing */
      if (productExists || shouldFetch) {
        fetchProduct(supplierUid, productId, setState, isLoading, shouldFetch, mounted)
      } else if (mounted) setIsLoading(false)
    } catch (error) {
      if (error.response) console.log(error.response)
      handleError(error)
    }
    /** signals that the component unmounted so setState calls can be prevented */
    return () => {
      mounted = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supplierUid, productId, setState, shouldFetch])
  if (isLoading) return <DotsLoader />
  return (
    <>
      {/** TopBar */}
      <FixedBar containerSizes={containerSizes} position="top">
        <HeaderContainer>
          <Header title={pageTitle} to={routeStart} />
        </HeaderContainer>
      </FixedBar>
      {/** Modal */}
      <Modal showModal={showTooltip} setShowModal={setShowTooltip}>
        <div style={tooltipModal}>
          <Illustration name="NoteList" height={110} />
          <div>
            <Title>{tooltipTitle}</Title>
            <Text>{tooltipText}</Text>
          </div>
          <Button type="button" onClick={modalClick}>
            Ok
          </Button>
        </div>
      </Modal>
      {/** Slider */}
      <Slider>
        <ProductImages images={fetchedImages} />
      </Slider>
      {/** Form */}
      <Form
        validations={_validations()}
        onSubmit={() => onSubmit(state, setState)}
        TextSuccess={<TextSuccess productExists />}
        TextError={<TextError />}
      >
        <div style={titleRow}>
          <Title size="smallMedium">Imagens</Title>
          <Icon featherName="HelpCircle" onClick={() => tooltipClick("images")} style={tooltip} />
        </div>
        <InputFile inputName="images" value={images} setValue={setImages} />

        <div style={titleRow}>
          <Title size="smallMedium">Título</Title>
          <Icon featherName="HelpCircle" onClick={() => tooltipClick("title")} style={tooltip} />
        </div>
        <InputText inputName="title" value={title} setValue={setTitle} placeholder="Nome do produto" />

        <div style={titleRow}>
          <Title size="smallMedium">Descrição</Title>
          <Icon featherName="HelpCircle" onClick={() => tooltipClick("description")} style={tooltip} />
        </div>
        <InputText
          inputName="description"
          value={description}
          setValue={setDescription}
          placeholder="Blusa com alça, sabonete líquido"
        />

        <div style={titleRow}>
          <Title size="smallMedium">Preço</Title>
          <Icon featherName="HelpCircle" onClick={() => tooltipClick("price")} style={tooltip} />
        </div>
        <InputMoney inputName="price" value={price} setValue={setPrice} placeholder="R$100,00" />

        <div style={titleRow}>
          <Title size="smallMedium">Desconto</Title>
          <Icon featherName="HelpCircle" onClick={() => tooltipClick("discount")} style={tooltip} />
        </div>
        <InputPercentage inputName="discount" value={discount} setValue={setDiscount} placeholder="%5,00" />

        <div style={titleRow}>
          <Title size="smallMedium">Referência</Title>
          <Icon featherName="HelpCircle" onClick={() => tooltipClick("reference")} style={tooltip} />
        </div>
        <InputText inputName="reference" value={reference} setValue={setReference} placeholder="123ABC" />

        <div style={titleRow}>
          <Title size="smallMedium">Opções</Title>
          <Icon featherName="HelpCircle" onClick={() => tooltipClick("colors")} style={tooltip} />
        </div>
        <InputText inputName="colors" value={colors} setValue={setColors} placeholder="Cores, tipos, formatos" />

        <div style={titleRow}>
          <Title size="smallMedium">Tamanhos</Title>
          <Icon featherName="HelpCircle" onClick={() => tooltipClick("sizes")} style={tooltip} />
        </div>
        <InputText inputName="sizes" value={sizes} setValue={setSizes} placeholder="P, 38, 500ml, 20x10cm" />

        {/** BottomBar */}
        <FixedBar containerSizes={containerSizes} position="bottom" type="fixedBar">
          {productExists ? (
            <DeleteAndSubmitButtons handleClickDelete={() => setConfirmDelete(true)} />
          ) : (
            <Button type="submit" style={btn}>
              Adicionar produto
            </Button>
          )}
        </FixedBar>
      </Form>
      {/** Delete form (renders only when modal is called) */}
      <Form
        validations={[]}
        onSubmit={() => deleteProduct(supplierUid, productId)}
        TextSuccess={<TextSuccessDelete />}
        TextError={<TextError />}
      >
        <Modal showModal={confirmDelete} setShowModal={setConfirmDelete}>
          <div style={confirmDeleteModal}>
            <TextConfirmDelete />
            <div style={confirmDeleteBtns}>
              <Button type="submit" onClick={() => setConfirmDelete(false)}>
                Excluir
              </Button>
              <Button type="button" onClick={() => setConfirmDelete(false)} buttonStyle="light">
                Sair
              </Button>
            </div>
          </div>
        </Modal>
      </Form>
    </>
  )
}

export default SingleProduct
