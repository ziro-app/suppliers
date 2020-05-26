import React, { useState } from 'react'
import GetCnpj from '@bit/vitorbarbosa19.ziro.get-cnpj'
import { containerWithPadding } from '@ziro/theme'

const TestCnpj = () => {
    const [cnpj, setCnpj] = useState('')
    const [reason, setReason] = useState('')
    const [fantasia, setFantasia] = useState('')
    const [suppliers, setSuppliers] = useState([])
    const [cnpjValid, setCnpjValid] = useState(false)
    const [cep, setCep] = useState('')
    const [street, setStreet] = useState('')
    const [number, setNumber] = useState('')
    const [complement, setComplement] = useState('')
    const [neighborhood, setNeighborhood] = useState('')
    const [city, setCity] = useState('')
    const [cityState, setCityState] = useState('')
    const validCnaes = ['4781-4/00', '1412-6/01', '1412-6/03'];
    // Usar as env's
    const cnpjUrl = process.env.CNPJ_URL;
    const cnpjToken = process.env.CNPJ_TOKEN;
    const setState = {
        setCnpj, setCnpjValid, setReason, setFantasia, setStreet, setNumber,
        setComplement, setNeighborhood, setCep, setCity, setCityState, cnpjToken, cnpjUrl
    }

    return (
        <div style={containerWithPadding}>
            <GetCnpj cnpj={cnpj} setState={setState} suppliers={suppliers} setCnpjValid={setCnpjValid} validCnaes={validCnaes} />
        </div>
    );
};

export default TestCnpj;