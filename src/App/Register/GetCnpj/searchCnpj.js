import axios from 'axios'

const searchCnpj = state => () => {
    const { cnpj, suppliers, setCnpjValid,
        setStreet, setNumber,
        setComplement, setNeighborhood, setCep, setCity, setCityState,
        setReason, setFantasia, setOpening } = state
    const config = {
        method: 'POST',
        url: process.env.CNPJ_URL,
        data: { cnpj },
        headers: {
            'Authorization': process.env.CNPJ_TOKEN
        }
    }
    return new Promise(async (resolve, reject) => {
        try {
            if (cnpj.length === 18) {
                if (!suppliers.includes(cnpj)) {
                    const { data: { status, result } } = await axios(config)
                    if (status) {
                        // validations
                        const cnaes = [...result.atividades_secundarias, result.atividade_principal].map(({ code }) => code)
                        const cnaeIsValid = !!cnaes.filter(code => code === '47.81-4-00').pop()
                        if (!cnaeIsValid) throw { msg: 'CNPJ não tem CNAE 4781-4/00', customError: true }
                        const isActive = result.situacao === 'ATIVA'
                        if (!isActive) throw { msg: 'CNPJ não está ativo', customError: true }
                        // fill form fields to save time for user
                        // Alinhar os campos que vou precisar aqui
                        setReason(result.nome)
                        setFantasia(result.fantasia)
                        setOpening(result.abertura)

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
            setOpening('')
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