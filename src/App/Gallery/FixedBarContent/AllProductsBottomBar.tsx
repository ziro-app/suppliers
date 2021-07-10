import React from "react"
import { useLocation, getFirstElementOfPath } from "@bit/ziro.views.router"
import Link from "@bit/ziro.views.link"
import { btn } from "./styles"

export const AllProductsBottomBar = () => {
  /** get location and define routeStart */
  const [location] = useLocation()
  const [routeStart] = getFirstElementOfPath(location)
  return (
    <Link isButton href={`${routeStart}/novo`} style={btn}>
      Adicionar novo produto
    </Link>
  )
}
