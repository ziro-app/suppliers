import React from "react"
import { ProductImagesProps } from "../types"
import { imagesContainer, imgStyleSlider } from "../styles"

const ProductImages = ({ images, onDragStart, handleClick, onClick }: ProductImagesProps) => {
  return (
    <div onDragStart={onDragStart} style={imagesContainer(images.length)} role="link">
      {images.map(image => (
        <img
          src={image}
          alt={image}
          key={image}
          onClick={handleClick && onClick ? event => handleClick(event, onClick) : () => null}
          style={imgStyleSlider}
        />
      ))}
    </div>
  )
}

export default ProductImages
