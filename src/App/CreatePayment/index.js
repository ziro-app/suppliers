import React, { useState, useContext } from 'react'
import currencyFormat from '@ziro/currency-format'
import maskInput from '@ziro/mask-input'
import sendToBackend from './sendToBackend'
import capitalize from '@ziro/capitalize'
import Error from '@bit/vitorbarbosa19.ziro.error'
import Spinner from '@bit/vitorbarbosa19.ziro.spinner'
import Form from '@bit/vitorbarbosa19.ziro.form'
import FormInput from '@bit/vitorbarbosa19.ziro.form-input'
import InputText from '@bit/vitorbarbosa19.ziro.input-text'
import { userContext } from '../appContext'

const CreatePayment = () => {
    const { name, zoopId } = useContext(userContext)
    const [isLoading, setIsLoading] = useState(true)
    const [isError, setIsError] = useState(false)
    const [seller, setSeller] = useState('')
    const [sellers, setSellers] = useState([])
    const [sellersAndIds, setSellersAndIds] = useState([])
    const [charge, setCharge] = useState('')
    const [maxInstallments, setMaxInstallments] = useState('')
    const state = { seller: name, sellerId: zoopId, charge, maxInstallments, sellersAndIds, setSeller, setCharge, setMaxInstallments }
    const validations = [
        {
            name: 'charge',
            validation: value => value > 9 && value <= 3000000,
            value: charge,
            message: 'Deve ser entre 0,10 e 30mil'
        },
        {
            name: 'maxInstallments',
            validation: value => parseInt(value) > 0 && parseInt(value) <= 10,
            value: maxInstallments,
            message: 'Deve ser entre 1 e 10'
        }
    ]

    if (isError) return <Error />

    return (
        <Form
            validations={validations}
            sendToBackend={sendToBackend ? sendToBackend(state) : () => null}
            inputs={[
                <FormInput
                    name='charge'
                    label='Valor a cobrar'
                    input={
                        <InputText
                            value={currencyFormat(charge)}
                            onChange={({ target: { value } }) => {
                                const toInteger = parseInt(value.replace(/[R$\.,]/g, ''), 10)
                                return setCharge(maskInput(toInteger, '#######', true))
                            }}
                            placeholder='R$1.299,99'
                        />
                    }
                />,
                <FormInput
                    name='maxInstallments'
                    label='Parcelamento máximo'
                    input={
                        <InputText
                            value={maxInstallments}
                            onChange={({ target: { value } }) => setMaxInstallments(maskInput(value, '##', true))}
                            placeholder='10'
                        />
                    }
                />
            ]} />
    )
}

export default CreatePayment