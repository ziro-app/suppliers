import React from "react"
import Link from "../Link"
import Skeleton, { SkeletonMultiple } from "../Skeleton"
import ProductCard from "./ProductCard"
import { skeletonContainer } from "./styles"
import { ProductGalleryProps, CardType } from "./types"

const Products = ({ isLoading, cards, baseUrl, skeletonCount }: ProductGalleryProps) => {
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
        <Link href={`${baseUrl}/${card.NO_ID_FIELD}/editar`} key={card.NO_ID_FIELD}>
          <ProductCard card={card} />
        </Link>
      ))}
    </>
  )
}

export default Products
