import React, { useState } from 'react'
import PropTypes from 'prop-types'
import maskInput from '@ziro/mask-input'
import { warningColor } from '@ziro/theme'
import Form from '@bit/vitorbarbosa19.ziro.form'
import FormInput from '@bit/vitorbarbosa19.ziro.form-input'
import InputText from '@bit/vitorbarbosa19.ziro.input-text'
import searchCnpj from './searchCnpj'
import { CnpjTextOne, CnpjTextTwo } from './modals'

const GetCnpj = ({ cnpj, setState, suppliers, setCnpjValid, validCnaes }) => {
    const [styledLabel, setStyledLabel] = useState(false)
    const [firstLabel, setFirstLabel] = useState(true)
    const { setCnpj, ...rest } = setState
    const state = { cnpj, suppliers, setCnpjValid, validCnaes, setStyledLabel, setFirstLabel, ...rest }
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
                <FormInput name='cnpj' label='CNPJ' LabelComponent={styledLabel ? (firstLabel ? <CnpjTextOne /> : <CnpjTextTwo />) : null} input={
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
    setCnpjValid: PropTypes.func.isRequired,
    validCnaes: PropTypes.array
}

export default GetCnpj