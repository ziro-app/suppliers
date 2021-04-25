import React from "react"
import * as Feather from "react-feather"
import * as Icons from "./Icons"

interface onlyFeatherIcon extends Feather.IconProps {
  /** nome dos icones da biblioteca Feather */
  featherName: keyof typeof Feather
  /** customName não é permitido se um featherName for passado */
  customName?: never
}
interface onlyCustomIcon extends Feather.IconProps {
  /** featherName não é permitido se um customName for passado */
  featherName?: never
  /** nome dos icones customizados (adicionados manualmente no componente) */
  customName: keyof typeof Icons
}

/** esse type garante que apenas uma das props seja aceita. Nenhuma ou ambas é inválido */
export type IconProps = onlyFeatherIcon | onlyCustomIcon

const Icon = ({ featherName, customName, ...props }: IconProps) => {
  const FeatherIcon = featherName && Feather[featherName]
  const CustomIcon = customName && Icons[customName]
  if (FeatherIcon) return <FeatherIcon {...props} />
  if (CustomIcon) return <CustomIcon {...props} />
  return null
}

export default Icon
