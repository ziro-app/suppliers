export const stringToDateMask = (value: string) => {
  const valueToString = `${value}`
  const cleanValue = valueToString.replace(/\D/g, "")
  let formattedValue

  if (cleanValue.length > 7) {
    formattedValue = cleanValue.replace(/^(\d{2})(\d{2})(\d{4}).*/, "$1/$2/$3")
  } else if (cleanValue.length > 4) {
    formattedValue = cleanValue.replace(/^(\d{2})(\d{2})/, "$1/$2/")
  } else if (cleanValue.length > 2) {
    formattedValue = cleanValue.replace(/^(\d{2})/, "$1/")
  } else {
    formattedValue = cleanValue
  }

  return formattedValue
}

export const dateObjectToDateString = (value: Date, locale = "pt-br") => {
  const formattedDate = value?.toLocaleDateString(locale)

  return formattedDate
}

export const dateObjectToTimestamp = (value: Date | undefined) => {
  const timestamp = value?.getTime()

  return timestamp
}

export const timestampToDateString = (timestamp: number | string, locale = "pt-br") => {
  const date = new Date(timestamp)
  const _formattedDate = date.toLocaleDateString(locale)

  const formattedDate = _formattedDate === "Invalid Date" ? "" : _formattedDate

  return formattedDate
}

export const dateStringToTimestamp = (value: string) => {
  const splitted = value.split("/")
  const date = new Date(`${splitted[1]}/${splitted[0]}/${splitted[2]}`)
  const timestamp = date?.getTime()

  return timestamp
}

export const dateStringToDateObject = (value: string) => {
  const splitted = value.split("/")
  const date = new Date(`${splitted[1]}/${splitted[0]}/${splitted[2]}`)

  return date
}
