import React, { memo } from "react"
import Products from "./components/Products"
import { container } from "./styles"
import { ProductGalleryProps } from "./types"

/** memo is needed to prevent rerenders when unrelated state changes happen in parent */
const ProductGallery = memo(({ ...props }: ProductGalleryProps) => (
  <div style={container}>
    <Products {...props} />
  </div>
))

export default ProductGallery
