import { CSSProperties } from "react"
import themes from "@bit/ziro.utils.themes"

export const seeMoreButton: CSSProperties = {
  marginTop: "10px",
  border: `1px solid ${themes.colors.primary}`,
  fontFamily: themes.fontFamily.body,
  fontWeight: themes.fontWeight.body,
  color: themes.colors.primary,
  background: "transparent",
  boxShadow: themes.shadow.secondaryAlt,
}
export const emptyLoader: CSSProperties = {
  width: "100%",
  height: "8px",
}
export const container: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
  gridGap: "5px",
}
export const skeletonContainer: CSSProperties = {
  display: "grid",
  gridTemplateRows: "1fr auto auto",
  gridRowGap: "4px",
}
export const cardContainer = (validateStyle: boolean): CSSProperties => ({
  display: "grid",
  gridTemplateRows: validateStyle ? "auto 1fr" : "1fr auto auto",
  alignItems: "start",
  cursor: "pointer",
})
export const badgeWrapper: CSSProperties = {
  display: "grid",
  justifyContent: "start",
}
export const badge: CSSProperties = {
  display: "grid",
  justifySelf: "end",
  backgroundColor: "rgba(34,34,34,.1)",
  borderRadius: "5px",
  position: "absolute",
  width: "unset",
  zIndex: 1000,
}
export const text: CSSProperties = {
  overflow: "hidden",
  whiteSpace: "nowrap",
  textOverflow: "ellipsis",
}
export const img: CSSProperties = {
  width: "100%",
  maxHeight: "200px",
  objectFit: "cover",
  borderRadius: "2px",
}
export const imagesContainer = (numberOfImages: number): CSSProperties => ({
  display: "grid",
  gridTemplateColumns: `repeat(${numberOfImages},1fr)`,
  gridColumnGap: "6px",
})
export const imgStyleSlider: CSSProperties = {
  ...img,
  width: "auto",
}
export const priceContainerStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "auto 1fr",
  gridTemplateRows: "auto auto auto",
  gap: "0px 5px",
}
export const priceWithDiscountStyle: CSSProperties = {
  textDecoration: "line-through",
  color: themes.colors.gray2,
}
export const discountValueStyle: CSSProperties = {
  display: "inline-block",
  justifySelf: "start",
  width: "auto",
  padding: "3px 6px",
}
export const addedToCart = (productStatus: string): CSSProperties => ({
  zIndex: 1001,
  display: "grid",
  alignItems: "center",
  marginTop: "-18px",
  padding: "0px",
  height: "18px",
  borderTopLeftRadius: "0px",
  borderTopRightRadius: "0px",
  borderBottomLeftRadius: "2px",
  borderBottomRightRadius: "2px",
  backgroundColor: productStatus,
})

export const noProductsContainer: CSSProperties = {
  display: "grid",
  placeItems: "center",
  maxWidth: "300px",
  margin: "0 auto",
  textAlign: "center",
}

export const noProductsText: CSSProperties = {
  color: themes.colors.primary,
}

export const noProductsButton: CSSProperties = {
  display: "none",
}

export const badgeContainer: CSSProperties = {
  zIndex: 1,
}
