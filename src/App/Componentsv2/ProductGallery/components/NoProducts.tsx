import React from "react"
import { ErrorGeneric } from "@bit/ziro.views.error"
import { noProductsContainer, noProductsText, noProductsButton } from "../styles"

const NoProducts = () => {
  return (
    <div style={noProductsContainer}>
      <ErrorGeneric
        illustration="BlankCanvas"
        title="Em breve"
        text="Novos produtos chegando..."
        styleTextContainer={noProductsText}
        styleButton={noProductsButton}
      />
    </div>
  )
}

export default NoProducts
