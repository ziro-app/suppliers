const configPost = arrayUpdate => {
  return {
    method: "POST",
    url: "https://ziro-sheets.netlify.app/.netlify/functions/api",
    data: {
      apiResource: "values",
      apiMethod: "batchUpdate",
      spreadsheetId: process.env.SHEET_SUPPLIERS_ID,
      resource: {
        data: arrayUpdate,
      },
      valueInputOption: "user_entered",
    },
    headers: {
      Authorization: process.env.SHEET_TOKEN,
      "Content-Type": "application/json",
    },
  }
}

module.exports = configPost
