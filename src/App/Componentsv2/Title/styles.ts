import themes from "../themes"

type titleStyleProps = {
  size?: keyof typeof themes.fontSize
}

const titleStyle = ({ size = "largeMedium" }: titleStyleProps) => ({
  fontFamily: themes.fontFamily.title,
  fontSize: themes.fontSize[size],
  fontWeight: themes.fontWeight.title,
})

export default titleStyle
