import strip from "@bit/ziro.utils.strip-non-firebase-values"
import { AxiosRequestConfig, customAxios } from "@bit/ziro.utils.use-http"
import { CreateUser, SheetData } from "../types"
import { requestSheet } from "./requestSheet"
import { requestZoop } from "./requestZoop"
import { resendConfirmEmail } from "./resendConfirmEmail"

const config: AxiosRequestConfig = {
  url: "https://us-east1-ziro-app-data.cloudfunctions.net/createUser",
  method: "POST",
  headers: {
    Authorization: process.env.FIREBASE_AUTH_TOKEN,
  },
}

export async function createUser(data: CreateUser) {
  const { continueUrl, ...rest } = data
  const { collectionData, email } = rest
  const { zoopUrl, zoopData, spreadsheetData, spreadsheetId, spreadsheetRange } = rest
  let _collectionData = { ...collectionData }
  /** create user in zoop database, if necessary */
  if (zoopUrl && zoopData) {
    const zoop = await requestZoop({ url: zoopUrl, data: zoopData }, 4)
    const zoopId = zoop?.data?.id || ""
    _collectionData = { ...collectionData, zoopId }
  }
  const stripped = strip({ ..._collectionData, email })
  /** create user in firebase, sending data to a middleware cloud function */
  await customAxios.request({
    ...config,
    data: { ...rest, collectionData: stripped },
  })
  /** send email confirmation to user */
  await resendConfirmEmail({ type: "Email", email, continueUrl })
  /** create user in sheets, if necessary */
  if (spreadsheetData && spreadsheetId && spreadsheetRange) {
    const sheetData: SheetData = {
      apiResource: "values",
      apiMethod: "append",
      spreadsheetId,
      range: spreadsheetRange,
      resource: { values: [spreadsheetData] },
      valueInputOption: "user_entered",
    }
    await requestSheet(sheetData)
  }
}
