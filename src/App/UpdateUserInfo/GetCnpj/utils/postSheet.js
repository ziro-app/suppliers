const configPost = (arrayUpdate) => {
    return {
        method: 'POST',
        url: process.env.SHEET_URL,
        data:{
            "apiResource": "values",
            "apiMethod": "batchUpdate",
            "spreadsheetId": process.env.SHEET_SUPPLIERS_ID,
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