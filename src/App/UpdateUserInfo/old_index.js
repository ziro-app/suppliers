import React, { useState, useContext } from 'react'
import Lottie from 'react-lottie'
import { motion } from 'framer-motion'
import InputEdit from '@bit/vitorbarbosa19.ziro.input-edit'
import capitalize from '@ziro/capitalize'
import maskInput from '@ziro/mask-input'
import currencyFormat from '@ziro/currency-format'
import { warningColor } from '@ziro/theme';
import { userContext } from '../appContext'
import WebProgramming from '../animations/webprogramming.json'
import simplifiedUpdate from './simplifiedUpdate'

const custom = (fontSize, color) => ({
    display: 'grid',
    justifyItems: 'center',
    fontSize: `${(fontSize + 2) / 10}rem`,
    fontWeight: '500',
    color: color
})

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
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: WebProgramming,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice'
        }
    }

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
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{
            display: 'grid',
            gridTemplateRows: '1fr auto',
            gridRowGap: '20px',
            justifyContent: 'center',
            alignContent: 'center'
        }}>
            <span style={custom(16, warningColor)}>Aguarde. Em desenvolvimento</span>
            <Lottie
                options={defaultOptions}
                height={250}
                width={250}
                speed={2}
                isPaused={false}
                isStopped={false}
                isClickToPauseDisabled
            />
        </motion.div>
    )
}

export default UpdateUserInfo

/*

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

*/