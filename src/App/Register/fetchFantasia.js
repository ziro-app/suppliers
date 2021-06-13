import axios from "axios"
import arrayObject from "@ziro/array-object"

const fetch = (setFantasias, setIsLoading, setIsError) => {
  const source = axios.CancelToken.source()
  const run = async () => {
    const configSheet = {
      method: "POST",
      url: "https://ziro-sheets.netlify.app/.netlify/functions/api",
      data: {
        apiResource: "values",
        apiMethod: "batchGet",
        spreadsheetId: process.env.SHEET_CNPJ_ID,
        ranges: ["Base CNPJ!A:B"],
      },
      headers: {
        Authorization: process.env.SHEET_TOKEN,
        "Content-Type": "application/json",
      },
    }
    try {
      const dadosSheet = await axios(configSheet)
      const objectSheet = arrayObject(dadosSheet.data.valueRanges[0])
      setFantasias(objectSheet)
    } catch (error) {
      if (error.response) console.log(error.response)
      else console.log(error)
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }
  run()
  return () => source.cancel("Canceled fetch request. Component unmounted")
}

export default fetch
