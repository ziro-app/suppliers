const configPost = (arrayUpdate) => {
    return {
        method: 'POST',
        url: process.env.SHEET_URL,
        data:{
            "apiResource": "values",
            "apiMethod": "batchUpdate",
            // "spreadsheetId": process.env.SHEET_STOREOWNERS_ID,
            "spreadsheetId": "1YlNSmVrawtxeKyy-tDdmI9B0bgSIIQswBnl3CEgdRRo",
            "resource": {
                "data": arrayUpdate
            },
            "valueInputOption": "user_entered"
        },
        headers: {
            'Authorization': process.env.SHEET_TOKEN,
            'Content-Type': 'application/json',
        }
    }
}

module.exports = configPost