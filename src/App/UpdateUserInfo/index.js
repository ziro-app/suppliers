import React, { useState, useContext } from 'react'
import { userContext } from '../appContext'
import InputEdit from '@bit/vitorbarbosa19.ziro.input-edit'
import maskInput from '@ziro/mask-input'
import capitalize from '@ziro/capitalize'
import currencyFormat from '@ziro/currency-format'
import simplifiedUpdate from './simplifiedUpdate'

const UpdateUserInfo = () => {
    const { fname, lname, cep, city, cityState, userPos, accountNumber,
        agency, docId, zoopId, typeRegister } = useContext(userContext)
    //const partAddress = address ? address.split(', ') : []
    const [newFName, setNewFName] = useState(fname)
    const [errorFName, setErrorFName] = useState('')
    const [loadingFName, setLoadingFName] = useState(false)
    const [newLName, setNewLName] = useState(lname)
    const [errorLName, setErrorLName] = useState('')
    const [loadingLName, setLoadingLName] = useState(false)

    const validateFName = () => {
        if (newFName !== '') {
            setErrorFName('')
            return true
        } else {
            setErrorFName('Valor inválido')
            return false
        }
    }
    const validateLName = () => {
        if (newLName !== '') {
            setErrorLName('')
            return true
        } else {
            setErrorLName('Valor inválido')
            return false
        }
    }

    return (
        <>
            {
                typeRegister === 'Simplificado' &&
                <>
                    <InputEdit
                        name="Nome"
                        value={newFName}
                        onChange={({ target: { value } }) => setNewFName(capitalize(value))}
                        validateInput={validateFName}
                        submit={simplifiedUpdate(newFName, newLName, docId, userPos, zoopId, setLoadingFName, setErrorFName)}
                        setError={() => { }}
                        error={errorFName}
                        placeholder="Seu nome..."
                        editable={true}
                        isLoading={loadingFName}
                    />
                    <InputEdit
                        name="Sobrenome"
                        value={newLName}
                        onChange={({ target: { value } }) => setNewLName(capitalize(value))}
                        validateInput={validateLName}
                        submit={simplifiedUpdate(newFName, newLName, docId, userPos, zoopId, setLoadingLName, setErrorLName)}
                        setError={() => { }}
                        error={errorLName}
                        placeholder="Seu sobrenome..."
                        editable={true}
                        isLoading={loadingLName}
                    />
                </>
            }
        </>
    )
}

export default UpdateUserInfo
