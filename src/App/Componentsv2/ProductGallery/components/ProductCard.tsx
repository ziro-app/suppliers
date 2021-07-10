/* eslint-disable no-console */
import React, { MouseEvent } from "react"
import { useUser } from "reactfire"
import { getFirstElementOfPath, useLocation, useRoute } from "@bit/ziro.views.router"
import Text from "@bit/ziro.views.text"
import Slider from "@bit/ziro.views.slider"
import Badge from "@bit/ziro.views.badge"
import Icon from "@bit/ziro.views.icon2"
import ProductImages from "./ProductImages"
import { ItemPrice } from "./ItemPrice"
import { useCartProducts } from "../utils/useCartProducts"
import { badgeColorRetailer, badgeTextRetailer, badgeColorSupplier, badgeTextSupplier } from "../utils/mappings"
import { CardProps } from "../types"
import { cardContainer, badgeWrapper, badge, text, img, addedToCart, badgeContainer } from "../styles"

const ProductCard = ({ card, onClick, orders, supplierUid, cards, endOfGallery }: CardProps) => {
  const user = useUser()
  const isLogged = !!user.data?.uid
  /** get location and defines routeStart */
  const [location] = useLocation()
  const [routeStart] = getFirstElementOfPath(location)
  const [match] = useRoute(`${routeStart}/:supplierUid`)
  const { information, id } = card
  const { title, images, price, reference, discount } = information
  const displaySlider = images.length > 1
  const productId = id
  /** filter orders to match the supplier */
  const [orderMatch] = orders
    ? orders.filter(_order => _order.supplierUid === supplierUid && _order.status !== "pago")
    : []
  const orderId = orderMatch?.NO_ID_FIELD || "empty"
  const retailerUid = orderMatch?.retailerUid || "empty"
  const { cartProducts } = useCartProducts(retailerUid, orderId)
  const [productMatch] = cartProducts.filter(_product => _product.id === productId)
  const { status } = productMatch ?? { status: "" }
  const isInCart = !!productMatch
  const validateStyle = !title && !price && !reference
  const badgeColor = match ? badgeColorRetailer : badgeColorSupplier
  const badgeText = match ? badgeTextRetailer : badgeTextSupplier
  const navigateToProduct = (e: MouseEvent) => {
    /** the try-catch block with the onClick inside the 'finally' prevents any localStorage error to block navigation */
    try {
      if (match) {
        localStorage.setItem("ProductGalleryPageProducts", JSON.stringify(cards))
        localStorage.setItem("ProductGalleryPageSupplierUid", supplierUid)
        if (endOfGallery) localStorage.setItem("ProductGalleryPageEndOfGallery", String(endOfGallery))
        /** save scroll position just before navigating so app can scroll back to where user was */
        localStorage.setItem("SupplierPageScrollPosition", String(window.scrollY))
      }
    } catch (error) {
      console.log(error)
    } finally {
      if (onClick) onClick(e)
    }
  }
  if (displaySlider)
    return (
      <div style={cardContainer(validateStyle)}>
        <div style={badgeWrapper}>
          <Badge fontSize={1} badgePadding={2} onClick={navigateToProduct} style={badge}>
            <Icon customName="Carousel" size={16} fill="white" />
          </Badge>
          <Slider>
            <ProductImages images={images} onClick={navigateToProduct} />
          </Slider>
          {isInCart && (
            <div onClick={navigateToProduct} style={badgeContainer} role="button">
              <Badge fontSize={1.2} badgePadding={2} style={addedToCart(badgeColor[status])}>
                {[badgeText[status]]}
              </Badge>
            </div>
          )}
        </div>
        <Text onClick={navigateToProduct} size="small" style={text}>
          {title}
        </Text>
        <ItemPrice price={price} discount={discount} onClick={navigateToProduct} isLogged={isLogged} />
        {reference && (
          <Text onClick={navigateToProduct} size="small" weight="muted">
            {`Ref.: ${reference}`}
          </Text>
        )}
      </div>
    )
  return (
    <div onClick={navigateToProduct} role="link" style={cardContainer(validateStyle)}>
      <img src={images[0]} alt={title} style={img} />
      {isInCart && (
        <Badge fontSize={1.2} badgePadding={2} style={addedToCart(badgeColor[status])}>
          {[badgeText[status]]}
        </Badge>
      )}
      <Text size="small" style={text}>
        {title}
      </Text>
      <ItemPrice price={price} discount={discount} isLogged={isLogged} />
      {reference && <Text size="small" weight="muted">{`Ref.: ${reference}`}</Text>}
    </div>
  )
}

export default ProductCard
