import axios from 'axios'

const fetch = (setIsLoading, setIsError, setSuppliers) => {
    const source = axios.CancelToken.source()
    const cnpjs = []
    const run = async () => {
        const config = {
            method: 'POST',
            url: process.env.SHEET_URL,
            data: {
                apiResource: 'values',
                apiMethod: 'get',
                spreadsheetId: process.env.SHEET_SUPPLIERS_ID,
                range: 'Base!E:E'
            },
            headers: {
                'Authorization': process.env.SHEET_TOKEN,
                'Content-Type': 'application/json'
            },
            cancelToken: source.token
        }
        try {
            const dataSuppliers = await axios(config)
            const [, ...listSuppliers] = dataSuppliers.data.values
            listSuppliers.map(supplier => cnpjs.push(supplier[0]))
            setSuppliers(cnpjs)
        } catch (error) {
            if (error.response) console.log(error.response)
            else console.log(error)
            setIsError(true)
        } finally {
            setIsLoading(false)
        }
    }
    run()
    return () => source.cancel('Canceled fetch request. Component unmounted')
}

export default fetch
