import themes from "../themes"

type textStyleProps = {
  size?: keyof typeof themes.fontSize
  weight?: keyof typeof themes.fontWeight
}

const textStyle = ({ size = "smallMedium", weight = "body" }: textStyleProps) => ({
  fontFamily: themes.fontFamily.body,
  fontSize: themes.fontSize[size],
  fontWeight: themes.fontWeight[weight],
})

export default textStyle
