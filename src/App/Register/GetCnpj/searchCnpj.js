import axios from 'axios'
import arrayObject from '@ziro/array-object'

const searchCnpj = state => () => {
    const { cnpj, suppliers, setCnpjValid,
        setStreet, setNumber,
        setComplement, setNeighborhood, setCep, setCity, setCityState,
        setReason, setFantasia } = state
    const config = {
        method: 'POST',
        url: process.env.CNPJ_URL,
        data: { cnpj },
        headers: {
            'Authorization': process.env.CNPJ_TOKEN
        }
    }
    const configSheet = {
        method: 'POST',
        url: process.env.SHEET_URL,
        data: {
            "apiResource": "values",
            "apiMethod": "batchGet",
            "spreadsheetId": process.env.SHEET_CNPJ_ID,
            "ranges": ["Base CNPJ!A:B"]
        },
        headers: {
            'Authorization': process.env.SHEET_TOKEN,
            'Content-Type': 'application/json'
        }
    }
    return new Promise(async (resolve, reject) => {
        try {
            if (cnpj.length === 18) {
                if (!suppliers.includes(cnpj)) {
                    const dadosSheet = await axios(configSheet)
                    const objectSheet = arrayObject(dadosSheet.data.valueRanges[0]).filter(item => item.cnpj === Number(cnpj.replace('.','').replace('.','').replace('/','').replace('-','')))
                    const { data: { status, result } } = await axios(config)
                    const resultFantasia = objectSheet[0].fantasia ? objectSheet[0].fantasia : result.fantasia
                    if (status) {
                        // validations
                        const isActive = result.situacao === 'ATIVA'
                        if (!isActive) throw { msg: 'CNPJ não está ativo', customError: true }
                        // fill form fields to save time for user
                        // Alinhar os campos que vou precisar aqui
                        setReason(result.nome)
                        setFantasia(resultFantasia)
                        setStreet(result.logradouro)
                        setNumber(result.numero)
                        setComplement(result.complemento)
                        setNeighborhood(result.bairro)
                        setCep(result.cep.replace('.', ''))
                        setCity(result.municipio)
                        setCityState(result.uf)

                        // resolve
                        setCnpjValid(true)
                        resolve('CNPJ válido')
                    } else throw { msg: 'CNPJ inválido na Receita', customError: true }
                } else {
                    setCnpjValid(false)
                    throw { msg: 'CNPJ já cadastrado', customError: true }
                }
            } else {
                setCnpjValid(false)
                throw { msg: 'Deve ter 14 números', customError: true }
            }
        } catch (error) {
            // clear all fields
            setReason('')
            setFantasia('')
            if (error.customError) reject(error)
            else {
                console.log(error)
                if (error.response) console.log(error.response)
                reject(error)
            }
        }
    })
}

export default searchCnpj