import React, { useRef } from "react"
import Text from "../Text"
import Title from "../Title"
import useSize from "../useSize"
import Icon, { IconProps } from "../Icon2"

type IconTextProps = {
  /** boolean de se é um title ou não */
  isTitle?: boolean
  /** Conteudo do IconText */
  children: React.ReactNode
  /** Aqui pode-se passar estilos customizados */
  style?: React.CSSProperties
  /** estilo do texto */
  styleText?: React.CSSProperties
  /** estilo do icone */
  styleIcon?: React.CSSProperties
} & IconProps

const IconText = ({ featherName, customName, isTitle, children, style, styleText, styleIcon }: IconTextProps) => {
  const titleOrTextRef = useRef(null)
  const { height: titleHeight } = useSize(titleOrTextRef)
  const svgWidth = titleHeight - 2 < 0 ? 0 : titleHeight - 2
  const svgHeight = titleHeight - 2 < 0 ? 0 : titleHeight - 2
  const TitleOrText = isTitle ? Title : Text
  return (
    <div style={{ display: "flex", ...style }}>
      {featherName ? (
        <Icon featherName={featherName} width={svgWidth} height={svgHeight} style={styleIcon} />
      ) : (
        <Icon customName={customName || "Rocket"} width={svgWidth} height={svgHeight} style={styleIcon} />
      )}
      <TitleOrText ref={titleOrTextRef} style={{ marginLeft: "5px", ...styleText }}>
        {children}
      </TitleOrText>
    </div>
  )
}

export default IconText
