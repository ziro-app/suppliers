import React from "react"
import Products from "./Products"
import { container } from "./styles"
import { ProductGalleryProps } from "./types"

const ProductGallery = ({ ...props }: ProductGalleryProps) => (
  <div style={container}>
    <Products {...props} />
  </div>
)

export default ProductGallery
