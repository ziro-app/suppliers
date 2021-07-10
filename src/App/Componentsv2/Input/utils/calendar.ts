import { stringToDateMask } from "@bit/ziro.utils.string-formatter"

export const timestampToDateString = (timestamp: number | string | undefined, locale = "pt-br") => {
  /** If user input length is less than 10, no rule apllies to convert from timestamp to DateString, as it is already a date string */
  if (`${timestamp}`?.length < 10 || timestamp === undefined) return stringToDateMask(`${timestamp}`)

  const _timestamp = typeof timestamp === "string" ? parseInt(timestamp, 10) : timestamp

  const date = new Date(_timestamp)
  const _formattedDate = date.toLocaleDateString(locale)

  const formattedDate = _formattedDate === "Invalid Date" ? "" : _formattedDate

  return formattedDate
}

export const dateRegex = new RegExp(
  /^(?:(?:31(\/-||\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/,
) // Regex retirada deste link: https://hkotsubo.github.io/blog/2019-04-05/posso-usar-regex-para-validar-datas

export const WEEKDAYS_SHORT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"]

export const WEEKDAYS_LONG = [
  "Domingo",
  "Segunda-Feira",
  "Terça-Feira",
  "Quarta-Feira",
  "Quinta-Feira",
  "Sexta-Feira",
  "Sábado",
]

export const MONTHS = [
  "Janeiro / ",
  "Fevereiro / ",
  "Março / ",
  "Abril / ",
  "Maio / ",
  "Junho / ",
  "Julho / ",
  "Agosto / ",
  "Setembro / ",
  "Outubro / ",
  "Novembro / ",
  "Dezembro / ",
]

export const PREV_MONTH = "Mês anterior"

export const NEXT_MONTH = "Próximo mês"

export const FORMAT = "dd/MM/yyyy"
