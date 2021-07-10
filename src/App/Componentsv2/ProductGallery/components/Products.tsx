import React from "react"
import Link from "@bit/ziro.views.link"
import Skeleton, { SkeletonMultiple } from "@bit/ziro.views.skeleton"
import { CardType } from "@bit/ziro.utils.types"
import { ProductGalleryProps } from "../types"
import ProductCard from "./ProductCard"
import { skeletonContainer } from "../styles"

const Products = ({ isLoading, cards, baseUrl, skeletonCount, ...props }: ProductGalleryProps) => {
  if (isLoading)
    return (
      <SkeletonMultiple count={skeletonCount} styleContainer={skeletonContainer}>
        <Skeleton height="200px" />
        <Skeleton height="100%" />
        <Skeleton height="100%" />
      </SkeletonMultiple>
    )
  return (
    <>
      {cards.map((card: CardType) => (
        <Link href={`${baseUrl}/${card.id}`} key={card.id}>
          <ProductCard card={card} cards={cards} {...props} />
        </Link>
      ))}
    </>
  )
}

export default Products
