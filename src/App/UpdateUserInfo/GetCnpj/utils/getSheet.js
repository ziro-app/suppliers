const configGet = (ranges) => {
    return {
        method: 'POST',
        url: process.env.SHEET_URL,
        data: {
            'apiResource': 'values',
            'apiMethod': 'batchGet',
            'spreadsheetId': "1YlNSmVrawtxeKyy-tDdmI9B0bgSIIQswBnl3CEgdRRo",
            'ranges': ranges
        },
        headers: {
            'Authorization': process.env.SHEET_TOKEN,
            'Content-Type': 'application/json',
        }
    }
}

module.exports = configGet