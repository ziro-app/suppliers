/* eslint-disable no-useless-escape */
export const getLastElementOfPath = (url: string) => {
  const match = url.match(/\/[^\/]*$/g)
  if (!match) return []
  return match
}
