import React from "react"
import FixedBar from "@bit/ziro.views.fixed-bar"
import { ProductGalleryPage } from "@bit/ziro.views.product-gallery"
import { AllProductsTopBar, AllProductsBottomBar } from "../FixedBarContent"
import { AllProductsProps } from "./types"

const AllProducts = ({ supplierUid, routeStart, containerSizes }: AllProductsProps) => {
  return (
    <>
      {/** TopBar */}
      <FixedBar containerSizes={containerSizes} position="top">
        <AllProductsTopBar />
      </FixedBar>
      {/* Product gallery */}
      <ProductGalleryPage supplierUid={supplierUid} baseUrl={`${routeStart}/editar`} maxItems={12} />
      {/** BottomBar */}
      <FixedBar containerSizes={containerSizes} position="bottom">
        <AllProductsBottomBar />
      </FixedBar>
    </>
  )
}

export default AllProducts
