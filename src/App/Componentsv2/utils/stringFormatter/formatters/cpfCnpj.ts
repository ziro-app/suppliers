export const integerToCpfCnpj = (value: string | number): string => {
  const valueToString = `${value}`
  const cleanValue = valueToString.replace(/\D/g, "")
  let formattedValue

  if (cleanValue.length > 13) {
    formattedValue = cleanValue.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2}).*/, "$1.$2.$3/$4-$5")
  } else if (cleanValue.length > 12) {
    formattedValue = cleanValue.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d)/, "$1.$2.$3/$4-$5")
  } else if (cleanValue.length > 11) {
    formattedValue = cleanValue.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})/, "$1.$2.$3/$4")
  } else if (cleanValue.length > 10) {
    formattedValue = cleanValue.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4")
  } else if (cleanValue.length > 9) {
    formattedValue = cleanValue.replace(/^(\d{3})(\d{3})(\d{3})/, "$1.$2.$3-")
  } else if (cleanValue.length > 6) {
    formattedValue = cleanValue.replace(/^(\d{3})(\d{3})/, "$1.$2.")
  } else if (cleanValue.length > 3) {
    formattedValue = cleanValue.replace(/^(\d{3})/, "$1.")
  } else {
    formattedValue = cleanValue
  }

  return formattedValue
}

export const cpfCnpjToInteger = (value: string): string => {
  const cleanValue = value.replace(/\D/g, "")
  const formattedValue = cleanValue.replace(/(\d{14}).*/, "$1")

  return formattedValue
}
