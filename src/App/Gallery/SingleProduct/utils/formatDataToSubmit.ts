import { integerToPercentage } from "@bit/ziro.utils.string-formatter"
import { stateType } from "../types"

const formatDataToSubmit = (state: stateType) => {
  const { title, description, price, discount, reference, colors, sizes } = state
  /** Title -> capitalize and remove white spaces */
  const _title = title ? `${title[0].toUpperCase()}${title.toLowerCase().slice(1)}`.trim() : ""
  /** Description -> capitalize and remove white spaces */
  const _description = description ? `${description[0].toUpperCase()}${description.toLowerCase().slice(1)}`.trim() : ""
  /** Discount -> remove % and replace , to . */
  const _discount = integerToPercentage(discount).replace(",", ".").replace("%", "")
  /** Colors -> lower case and remove white spaces */
  const splitColors = colors.split(",")
  const _colors = splitColors.map(_color => _color.trim().toLowerCase()).join(",")
  /** Sizes -> lower case and remove white spaces */
  const splitSizes = sizes.split(",")
  const _sizes = splitSizes.map(_size => _size.trim().toLowerCase()).join(",")
  return {
    title: _title,
    description: _description,
    price,
    discount: _discount,
    reference,
    colors: _colors,
    sizes: _sizes,
  }
}

export default formatDataToSubmit
