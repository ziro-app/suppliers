export const integerToPhone = (value: string | number): string => {
  const valueToString = `${value}`
  const cleanValue = valueToString.replace(/\D/g, "")
  let formattedValue

  if (cleanValue.length > 10) {
    formattedValue = cleanValue.replace(/^(\d\d)(\d{5})(\d{4}).*/, "($1) $2-$3")
  } else if (cleanValue.length > 6) {
    formattedValue = cleanValue.replace(/^(\d\d)(\d{4})(\d{0,4}).*/, "($1) $2-$3")
  } else if (cleanValue.length > 2) {
    formattedValue = cleanValue.replace(/^(\d\d)(\d{0,5})/, "($1) $2")
  } else {
    formattedValue = cleanValue.replace(/^(\d*)/, "($1")
  }

  return value === "" ? "" : formattedValue
}

export const phoneToInteger = (value: string): string => {
  const cleanValue = value.replace(/\D/g, "")
  const formattedValue = cleanValue.replace(/(\d{11}).*/, "$1")

  return formattedValue
}
