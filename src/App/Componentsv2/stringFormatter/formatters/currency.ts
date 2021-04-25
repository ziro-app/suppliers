export const integerToCurrency = (value: string | number, monetarySymbol?: string): string => {
  const _monetarySymbol = monetarySymbol || "R$"
  const valueToString = `${value}`
  const cleanValue = valueToString.replace(/\D/g, "")

  const decimalValue = (parseInt(cleanValue, 10) / 100).toFixed(2)
  const [integer, decimal] = decimalValue.split(".")
  const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  const formattedValue = `${formattedInteger},${decimal}`

  return cleanValue ? `${_monetarySymbol}${formattedValue}` : ""
}

export const currencyToInteger = (value: string): string => {
  const cleanValue = value.replace(/\D/g, "")

  if (cleanValue === "00") return ""

  const decimalValue = `${(parseInt(cleanValue, 10) / 100).toFixed(2)}`
  const formattedValue = decimalValue.replace(/\D/g, "")

  return formattedValue === "000" ? "0" : formattedValue
}
