import React from "react"
import DotsLoader from "@bit/ziro.views.dots-loader"
import { LoaderProps } from "../types"
import { emptyLoader } from "../styles"

/** must be of the same height as the DotsLoader in order to prevent flickering and multiple unwanted fetch requests */
const EmptyLoader = () => <div style={emptyLoader} />

const Loader = ({ isLoading, hasScrollBar, pageEnd, endOfGallery, allowPagination }: LoaderProps) => {
  if (endOfGallery) return null
  if (!isLoading && hasScrollBar && pageEnd && !allowPagination) return null
  if (!isLoading && hasScrollBar && pageEnd) return <DotsLoader />
  if (!isLoading && hasScrollBar && !pageEnd) return <EmptyLoader />
  return null
}

export default Loader
