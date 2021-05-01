import React, { SyntheticEvent, MouseEvent, MouseEventHandler } from "react"
import { imagesContainer, imgStyleSlider } from "./styles"

interface ProductImagesProps {
  images: string[]
  onDragStart?: (event: SyntheticEvent) => void
  handleClick?: (event: MouseEvent, onClick: MouseEventHandler) => void
  onClick?: MouseEventHandler
}

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
