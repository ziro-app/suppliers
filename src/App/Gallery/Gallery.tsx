import React from "react"
import { useUser } from "reactfire"
import { Switch, Route, useLocation, getFirstElementOfPath } from "@bit/ziro.views.router"
import { ErrorNotFound } from "@bit/ziro.views.error"
import Container from "@bit/ziro.views.container"
import AllProducts from "./AllProducts"
import SingleProduct from "./SingleProduct"

const Gallery = () => {
  /** get location and define routeStart */
  const [location] = useLocation()
  const [routeStart] = getFirstElementOfPath(location)
  /** user info */
  const user = useUser()
  const supplierUid = user.data ? user.data.uid : "empty"
  const allProductsProps = { supplierUid, routeStart }
  console.log(user, supplierUid)
  return (
    <Container withoutHeight>
      {containerSizes => (
        <Switch>
          <Route path={routeStart} isPrivate>
            <AllProducts {...allProductsProps} containerSizes={containerSizes} />
          </Route>
          <Route path={`${routeStart}/novo`} isPrivate>
            <SingleProduct containerSizes={containerSizes} />
          </Route>
          <Route path={`${routeStart}/editar/:productId`} isPrivate>
            <SingleProduct containerSizes={containerSizes} />
          </Route>
          <Route path="/:rest*">
            <ErrorNotFound />
          </Route>
        </Switch>
      )}
    </Container>
  )
}

export default Gallery
