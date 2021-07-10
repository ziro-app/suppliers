/* eslint-disable no-console */
import React, { useState, useEffect, useLayoutEffect } from "react"
import { useRoute, useLocation, getFirstElementOfPath } from "@bit/ziro.views.router"
import { useErrorHandler } from "react-error-boundary"
import useScrollEnd from "@bit/ziro.utils.use-scroll-end"
import Button from "@bit/ziro.views.button"
import { CardType, Timestamp, Order } from "@bit/ziro.utils.types"

import ProductGallery from "../index"
import Loader from "./Loader"
import NoProducts from "./NoProducts"
import { fetchDb } from "../utils/fetchDb"
import { dedupeProducts } from "../utils/dedupeProducts"
import { seeMoreButton } from "../styles"

interface Props {
  /** the firebase uid of the supplier, so the correct products can be fetched */
  supplierUid: string
  /** the url prefix for the pages that the component will navigate to after a product click */
  baseUrl: string
  /** max number of products to be fetched on each request */
  maxItems?: number
  /** blocks pagination, preventing more than the initial amount of products to be fetched */
  allowPagination?: boolean
  /** array contendo os pedidos contidos no carrinho do usuario */
  orders?: Order[]
}

const ProductGalleryPage = ({ supplierUid, baseUrl, maxItems = 10, allowPagination = true, orders }: Props) => {
  /** product states */
  const [productList, setProductList] = useState<CardType[]>([])
  const [lastProduct, setLastProduct] = useState<Timestamp>({ seconds: 0, nanoseconds: 0 })
  /** helper states */
  const [isLoading, setIsLoading] = useState(true)
  const [infiniteScrollFetch, setInfiniteScrollFetch] = useState(false)
  const [endOfGallery, setEndOfGallery] = useState(false)
  const [pageEnd, setPageEnd] = useState(false)
  const [hasScrollBar, setHasScrollBar] = useState(false)
  /** get location and define routeStart */
  const [location] = useLocation()
  const [routeStart] = getFirstElementOfPath(location)
  /** hooks */
  useScrollEnd({ setPageEnd, setHasScrollBar })
  const [match] = useRoute(`${routeStart}/:supplierUid`)
  const handleError = useErrorHandler()
  /** helper variables */
  const cardsAndItems = { cards: productList, skeletonCount: maxItems }
  const productGalleryProps = { ...cardsAndItems, supplierUid, baseUrl, orders, endOfGallery, isLoading }
  const loaderProps = { isLoading, hasScrollBar, pageEnd, endOfGallery, allowPagination }
  useEffect(() => {
    /** variable to control when component is mounted */
    let mounted = true
    const fetch = async () => {
      try {
        let storedProductList = null
        let storedSupplierUid = null
        let storedEndOfGallery = false
        if (match) {
          /** fetch data from localstorage in order to allow user to continue product selection from where he stopped */
          const storedProductListToParse = window.localStorage.getItem("ProductGalleryPageProducts")
          storedProductList = storedProductListToParse && JSON.parse(storedProductListToParse)
          storedSupplierUid = window.localStorage.getItem("ProductGalleryPageSupplierUid")
          storedEndOfGallery = !!window.localStorage.getItem("ProductGalleryPageEndOfGallery")
        }
        if (allowPagination && (pageEnd || infiniteScrollFetch)) {
          const data = await fetchDb(supplierUid, maxItems, lastProduct)
          const lastProductFromDataExists = data[data.length - 1]?.dateUpdated
          if (mounted) {
            setProductList(prevProductList => {
              /** remove possible duplicate products */
              const deduped = dedupeProducts(prevProductList, data)
              return prevProductList.concat(deduped)
            })
            /** for every fetched data, set the last product or keep the old value */
            setLastProduct(prevLastProduct => lastProductFromDataExists ?? prevLastProduct)
            setInfiniteScrollFetch(false)
            if (!lastProductFromDataExists) setEndOfGallery(true)
          }
        } else if ((isLoading && !storedProductList) || (storedProductList && storedSupplierUid !== supplierUid)) {
          const data = await fetchDb(supplierUid, maxItems)
          const lastProductFromDataExists = data[data.length - 1]?.dateUpdated
          if (mounted) {
            setProductList(data)
            /** for every fetched data, set the last product or keep the old value */
            setLastProduct(prevLastProduct => lastProductFromDataExists ?? prevLastProduct)
            if (storedSupplierUid && storedSupplierUid !== supplierUid) {
              window.localStorage.removeItem("ProductGalleryPageProducts")
              window.localStorage.removeItem("ProductGalleryPageSupplierUid")
              window.localStorage.removeItem("ProductGalleryPageEndOfGallery")
            }
          }
        } else if (storedProductList && supplierUid === storedSupplierUid) {
          /** fetch on initial render all products user saw, since firebase's startAfter can't be used to accomplish this */
          const data = await fetchDb(supplierUid, storedProductList.length)
          const lastProductFromDataExists = data[data.length - 1]?.dateUpdated
          if (mounted) {
            setProductList(data)
            /** for every fetched data, set the last product or keep the old value */
            setLastProduct(prevLastProduct => lastProductFromDataExists ?? prevLastProduct)
            setEndOfGallery(storedEndOfGallery)
            window.localStorage.removeItem("ProductGalleryPageProducts")
            window.localStorage.removeItem("ProductGalleryPageSupplierUid")
            window.localStorage.removeItem("ProductGalleryPageEndOfGallery")
          }
        }
      } catch (error) {
        if (error.response) console.log(error.response)
        handleError(error)
      } finally {
        setIsLoading(false)
      }
    }
    fetch()
    /** signals that the component unmounted so setState calls can be prevented */
    return () => {
      mounted = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageEnd, infiniteScrollFetch])
  /** scroll back to where user was */
  useLayoutEffect(() => {
    if (match && isLoading) window.scrollTo(0, 0)
    if (match && !isLoading) {
      const scrollPositionBefore = window.localStorage.getItem("SupplierPageScrollPosition")
      window.scrollTo(0, Number(scrollPositionBefore))
      window.localStorage.removeItem("SupplierPageScrollPosition")
    }
  }, [match, isLoading])
  return (
    <>
      {!isLoading && productList.length === 0 && <NoProducts />}
      <ProductGallery {...productGalleryProps} />
      <Loader {...loaderProps} />
      {!isLoading && !hasScrollBar && !endOfGallery && productList.length >= 2 && (
        <Button
          type="button"
          onClick={() => setInfiniteScrollFetch(true)}
          isLoading={infiniteScrollFetch}
          style={seeMoreButton}
        >
          Ver mais
        </Button>
      )}
    </>
  )
}

export default ProductGalleryPage
