import { config } from "config"
import React, { useState, useRef, MouseEvent } from "react"
import { createPortal } from "react-dom"
import { Modal } from "@bit/ziro.views.modal"
import Illustration from "@bit/ziro.views.illustration"
import Title from "@bit/ziro.views.title"
import Text from "@bit/ziro.views.text"
import Button from "@bit/ziro.views.button"
import Header from "@bit/ziro.views.header"
import Icon from "@bit/ziro.views.icon2"
import useClipboard, { ClipboardText } from "@bit/ziro.utils.use-clipboard"
import { navContainer, modal, text, header, icon } from "./styles"

const { baseUrlSupplier, gallerySupplierRoute } = config

export const AllProductsTopBar = () => {
  const [showClipboardResult, setShowClipboardResult] = useState(false)
  const clipboardRef = useRef(null)
  const { message, clipboardCopy } = useClipboard(clipboardRef)
  /** handle icon click, opening modal and copying link to clipboard */
  const handleClick = (event: MouseEvent) => {
    setShowClipboardResult(true)
    clipboardCopy(event)
  }
  /** helper variables */
  const { title, body } = message
  const illustrationName = title !== "Link copiado com sucesso" ? "PaymentError" : "PaymentSuccess"
  return (
    <div style={navContainer}>
      {createPortal(
        <Modal showModal={showClipboardResult} setShowModal={setShowClipboardResult}>
          <div style={modal}>
            <Illustration name={illustrationName} height={110} />
            <div style={text}>
              <Title size="medium">{title}</Title>
              <Text size="smallMedium">{body}</Text>
            </div>
            <Button type="button" onClick={() => setShowClipboardResult(false)}>
              Ok
            </Button>
          </div>
        </Modal>,
        document.body,
      )}
      <ClipboardText ref={clipboardRef} linkToCopy={`${baseUrlSupplier}${gallerySupplierRoute}`} />
      <Header title="Produtos" to={baseUrlSupplier} style={header} />
      <Icon featherName="Link" width={21} height={21} onClick={() => console.log("Haha")} style={icon} />
    </div>
  )
}
