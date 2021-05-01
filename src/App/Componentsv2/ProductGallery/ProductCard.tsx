import React from "react"
import Text from "../Text"
import Title from "../Title"
import Slider from "../Slider"
import Badge from "../Badge"
import BadgeWrapper from "../BadgeWrapper"
import Icon from "../Icon2"
import { integerToCurrency } from "../stringFormatter"
import ProductImages from "./ProductImages"
import { cardContainer, badgeWrapper, badge, imgStyle, textStyle } from "./styles"
import { CardProps } from "./types"

const ProductCard = ({ card, onClick }: CardProps) => {
  const { information } = card
  const { description, images, price, reference } = information
  const displaySlider = images.length > 1
  if (displaySlider)
    return (
      <div style={cardContainer}>
        <BadgeWrapper badgeStyle={badgeWrapper}>
          <Badge fontSize={1} badgePadding={2} style={badge}>
            <Icon customName="Carousel" size={16} fill="white" />
          </Badge>
          <Slider>
            <ProductImages images={images} onClick={onClick} />
          </Slider>
        </BadgeWrapper>
        <Text onClick={onClick} size="small" style={textStyle}>
          {description}&nbsp; {/** &nbsp; maintains the height of the line if field is empty */}
        </Text>
        <Title onClick={onClick} size="small">
          {integerToCurrency(price)}&nbsp; {/** &nbsp; maintains the height of the line if field is empty */}
        </Title>
        <Text onClick={onClick} size="small">
          {reference}&nbsp; {/** &nbsp; maintains the height of the line if field is empty */}
        </Text>
      </div>
    )
  return (
    <div onClick={onClick} role="link" style={cardContainer}>
      <img src={images[0]} alt={description} style={imgStyle} />
      <Text size="small" style={textStyle}>
        {description}
      </Text>
      <Title size="small">{integerToCurrency(price)}</Title>
      <Text size="small">{reference}</Text>
    </div>
  )
}

export default ProductCard
