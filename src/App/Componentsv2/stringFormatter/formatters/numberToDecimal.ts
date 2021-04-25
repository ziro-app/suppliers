export const numberToDecimal = (value: string | number, fixed?: number): string => {
  const _fixed = fixed === 0 ? 0 : fixed || 2
  const valueToString = `${value}`
  const valueToNumber = parseFloat(valueToString).toFixed(_fixed)
  const [integer, decimal] = valueToNumber.split(".")
  const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ".")

  const formattedValue = _fixed === 0 ? `${formattedInteger}` : `${formattedInteger},${decimal}`

  return formattedValue
}
