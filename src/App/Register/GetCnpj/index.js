import React from 'react'
import PropTypes from 'prop-types'
import maskInput from '@ziro/mask-input'
import Form from '@bit/vitorbarbosa19.ziro.form'
import FormInput from '@bit/vitorbarbosa19.ziro.form-input'
import InputText from '@bit/vitorbarbosa19.ziro.input-text'
import searchCnpj from './searchCnpj'

const GetCnpj = ({ cnpj, setState, suppliers, setCnpjValid }) => {
    const { setCnpj, ...rest } = setState
    const state = { cnpj, suppliers, setCnpjValid, ...rest }
    const validations = [
        {
            name: 'cnpj',
            validation: value => /^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/.test(value),
            value: cnpj,
            message: 'CNPJ inválido'
        }
    ]
    return (
        <Form
            buttonName='Validar CNPJ'
            buttonOnTop={true}
            validations={validations}
            sendToBackend={searchCnpj ? searchCnpj(state) : () => null}
            inputs={[
                <FormInput name='cnpj' label='CNPJ' input={
                    <InputText
                        value={cnpj}
                        onChange={({ target: { value } }) => setCnpj(maskInput(value, '##.###.###/####-##', true))}
                        placeholder='00.111.222/0001-33'
                        inputMode='numeric'
                    />
                } />
            ]}
        />
    )
}

GetCnpj.propTypes = {
    cnpj: PropTypes.string.isRequired,
    setState: PropTypes.object.isRequired,
    suppliers: PropTypes.array.isRequired,
    setCnpjValid: PropTypes.func.isRequired
}

export default GetCnpj