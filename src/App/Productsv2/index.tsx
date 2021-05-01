import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Menu } from "../Menu"
import useScrollEnd from "../Componentsv2/useScrollEnd"
import DotsLoader from "../Componentsv2/DotsLoader"
import Button from "../Componentsv2/Button"

import ProductGallery, { CardType } from "../Componentsv2/ProductGallery"
import { useProducts } from "./useProducts"

type timestamp = {
  seconds: number
  nanoseconds: number
}

const supplierUid = "mjx0FJZgOVNiDpAjSumVwuzIY3y1"
const maxItems = 10

const Productsv2 = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [infiniteScroll, setInfiniteScroll] = useState(false)
  const [productList, setProductList] = useState<CardType[]>([])
  const [lastProduct, setLastProduct] = useState<timestamp | string | null>("")
  const { status, products } = useProducts(supplierUid, maxItems, lastProduct)
  const [pageEnd, hasScrollBar] = useScrollEnd()
  /** if user reaches end of page, set the last product fetched so useProducts can trigger a new fetch */
  useEffect(() => {
    if (pageEnd === true)
      setLastProduct(products[products.length - 1] === undefined ? null : products[products.length - 1].dateUpdated)
  }, [pageEnd, products])
  /** if new products are fetched, concat with the old products */
  useEffect(() => {
    setInfiniteScroll(true)
    if (status === "success") {
      setProductList(prevProductList => prevProductList.concat(products))
      setInfiniteScroll(false)
      setIsLoading(false)
    }
  }, [status, products])
  return (
    <>
      <ProductGallery cards={productList} isLoading={isLoading} skeletonCount={maxItems} />
      {!isLoading && infiniteScroll && lastProduct !== null ? <DotsLoader /> : null}
      {!isLoading && !hasScrollBar && !lastProduct && (
        <Button
          onClick={() =>
            setLastProduct(
              products[products.length - 1] === undefined ? null : products[products.length - 1].dateUpdated,
            )
          }
          style={{ marginTop: "20px" }}
        >
          Ver mais
        </Button>
      )}
    </>
  )
}

export default Productsv2

{
  /* <Menu title="Fazer Upgrade">
<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
  <Upgrade />
</motion.div>
</Menu> */
}
