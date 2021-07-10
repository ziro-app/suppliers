import React, { useRef } from "react"
import Icon from "@bit/ziro.views.icon2"
import Link from "@bit/ziro.views.link"
import Title from "@bit/ziro.views.title"
import useSize from "@bit/ziro.utils.use-size"
import { historyBack } from "./utils/historyBack"
import { HeaderProps } from "./types"
import { container, iconStyle, titleStyle } from "./styles"

const Header = ({ to, title, useHistory, style }: HeaderProps) => {
  /** adjust icon size based on title height */
  const titleRef = useRef(null)
  const { height: titleHeight } = useSize(titleRef)
  const backComponent = useHistory ? (
    <Icon
      onClick={historyBack}
      width={titleHeight}
      height={titleHeight}
      featherName="ArrowLeft"
      style={{ ...iconStyle, cursor: "pointer" }}
    />
  ) : (
    <Link href={to || ""}>
      <Icon width={titleHeight} height={titleHeight} featherName="ArrowLeft" style={iconStyle} />
    </Link>
  )
  return (
    <div style={{ ...container, ...style }}>
      {backComponent}
      <Title ref={titleRef} style={titleStyle}>
        {title}
      </Title>
    </div>
  )
}

export default Header
