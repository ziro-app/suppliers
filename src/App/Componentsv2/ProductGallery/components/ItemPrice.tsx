import React, { MouseEventHandler } from "react"
import Badge from "@bit/ziro.views.badge"
import Title from "@bit/ziro.views.title"
import { giveDiscount } from "@bit/ziro.utils.give-discount"
import { integerToCurrency } from "@bit/ziro.utils.string-formatter"
import { discountValueStyle, priceContainerStyle, priceWithDiscountStyle } from "../styles"

interface ItemPriceProps {
  discount: string
  price: string
  onClick?: MouseEventHandler
  isLogged?: boolean
}

export const ItemPrice = ({ discount, price, onClick, isLogged }: ItemPriceProps) => {
  const valueWithDiscount = giveDiscount(price, discount) as number
  const _discount = parseFloat(parseFloat(discount).toFixed(2)) // makes 10.00 into 10
  const _valueWithDiscount = valueWithDiscount === 0 || valueWithDiscount // accounts for 0 being a falsy value
  return (
    <>
      {isLogged && (
        <div style={priceContainerStyle}>
          {/* Valor com desconto */}
          {_valueWithDiscount && (
            <Title size="xsmall" onClick={onClick}>
              {integerToCurrency(Math.round(valueWithDiscount))}
            </Title>
          )}

          {/* Valor normal */}
          <Title size="xsmall" onClick={onClick} style={_valueWithDiscount ? priceWithDiscountStyle : undefined}>
            {integerToCurrency(price)}
          </Title>
        </div>
      )}

      {/* Porcentagem do desconto */}
      {_valueWithDiscount && (
        <Badge badgePadding={3} fontSize={1.1} onClick={onClick} style={discountValueStyle}>
          {`-${_discount}%`}
        </Badge>
      )}
    </>
  )
}
