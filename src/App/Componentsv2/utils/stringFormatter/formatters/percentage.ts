export const integerToPercentage = (value: string | number): string => {
  const valueToString = `${value}`
  let cleanValue = valueToString.replace(/\D/g, "")
  if (cleanValue.length >= 5) cleanValue = "10000"

  const decimalValue = (parseInt(cleanValue, 10) / 100).toFixed(2)
  const [integer, decimal] = decimalValue.split(".")
  const formattedValue = `${integer},${decimal}`

  return cleanValue ? `%${formattedValue}` : ""
}

export const percentageToInteger = (value: string): string => {
  let cleanValue = value.replace(/\D/g, "")
  if (cleanValue.length >= 5) cleanValue = "10000"

  if (cleanValue === "00") return ""

  const decimalValue = `${(parseInt(cleanValue, 10) / 100).toFixed(2)}`
  const formattedValue = decimalValue.replace(/\D/g, "")

  return formattedValue === "000" ? "0" : formattedValue
}
