import React, { useState } from 'react'
import PropTypes from 'prop-types'
import maskInput from '@ziro/mask-input'
import Form from '@bit/vitorbarbosa19.ziro.form'
import FormInput from '@bit/vitorbarbosa19.ziro.form-input'
import InputText from '@bit/vitorbarbosa19.ziro.input-text'
import Modal from '@bit/vitorbarbosa19.ziro.modal'
import Illustration from '@bit/vitorbarbosa19.ziro.illustration'
import Spinner from '@bit/vitorbarbosa19.ziro.spinner'
import searchCnpj from './searchCnpj'
import { modalBox, container, title, svg } from './styles'

const GetCnpj = ({ cnpj, setState, suppliers, setCnpjValid, validCnaes }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [firstLabel, setFirstLabel] = useState(true)
    const { setCnpj, ...rest } = setState
    const state = { cnpj, suppliers, setCnpjValid, validCnaes, setFirstLabel, setIsOpen, ...rest }
    const validations = [
        {
            name: 'cnpj',
            validation: value => /^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/.test(value),
            value: cnpj,
            message: 'CNPJ inválido'
        }
    ]
    return (
        <>
            <Modal boxStyle={modalBox} isOpen={isOpen} setIsOpen={() => { }}>
                <div style={container}>
                    <div style={svg} ><Illustration type="waiting" size={200} /></div>
                    <label style={title}>{firstLabel ? 'Aguarde...' : 'Só mais um momento...'}</label>
                    <label>{firstLabel
                        ? 'Estamos validando seu CNPJ. Não saia da página'
                        : 'Estamos concluindo a validação. Não saia da página'}
                    </label>
                    <Spinner size='3rem' />
                </div>
            </Modal>
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
        </>
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
