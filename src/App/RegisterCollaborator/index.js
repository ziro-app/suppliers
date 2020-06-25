import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Form from '@bit/vitorbarbosa19.ziro.form'
import FormInput from '@bit/vitorbarbosa19.ziro.form-input'
import InputText from '@bit/vitorbarbosa19.ziro.input-text'
import HeaderHome from '@bit/vitorbarbosa19.ziro.header-home'
import capitalize from '@ziro/capitalize'
import { containerWithPadding } from '@ziro/theme'
import sendToBackend from './sendToBackend'
import { welcome, marker } from './styles'

const RegisterCollaborator = () => {
    const [fname, setFName] = useState('');
    const [lname, setLName] = useState('');
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');

    const setState = { setFName, setLName, setEmail, setPass, setConfirmPass };
    const state = { fname, lname, email, pass, supplierId: new URLSearchParams(window.location.search).get('rel'), ...setState };
    const validations = [
        {
            name: 'fname',
            validation: value => !!value,
            value: fname,
            message: 'Campo obrigatório'
        }, {
            name: 'lname',
            validation: value => !!value,
            value: lname,
            message: 'Campo obrigatório'
        }, {
            name: 'email',
            validation: value => /^\S+@\S+\.\S+$/g.test(value),
            value: email,
            message: 'Email inválido'
        }, {
            name: 'pass',
            validation: value => !/^.{0,5}$/g.test(value), // tests for min length of 6 char
            value: pass,
            message: 'Mínimo 6 caracteres'
        }, {
            name: 'confirmPass',
            validation: value => value === pass,
            value: confirmPass,
            message: 'Deve ser igual ao campo anterior'
        }
    ]

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={containerWithPadding}>
            <HeaderHome linkPath='/login' linkText='Tem cadastro? LOGIN' />
            <h1 style={welcome}>
                Crie sua conta de <span style={marker}>Colaborador</span>,
			</h1>
            <Form
                validations={validations}
                sendToBackend={sendToBackend ? sendToBackend(state) : () => null}
                inputs={[
                    <FormInput name='fname' label='Nome' input={
                        <InputText
                            value={fname}
                            onChange={({ target: { value } }) => setFName(capitalize(value))}
                            placeholder='Seu nome'
                        />
                    } />,
                    <FormInput name='lname' label='Sobrenome' input={
                        <InputText
                            value={lname}
                            onChange={({ target: { value } }) => setLName(capitalize(value))}
                            placeholder='Seu sobrenome'
                        />
                    } />,
                    <FormInput name='email' label='Email' input={
                        <InputText
                            value={email}
                            onChange={({ target: { value } }) => setEmail(value.toLowerCase())}
                            placeholder='ex@exemplo.com'
                            inputMode='email'
                            autoComplete='email'
                        />
                    } />,
                    <FormInput name='pass' label='Senha' input={
                        <InputText
                            value={pass}
                            onChange={({ target: { value } }) => setPass(value)}
                            placeholder='Mínimo 6 caracteres'
                            type='password'
                        />
                    } />,
                    <FormInput name='confirmPass' label='Confirme a senha' input={
                        <InputText
                            value={confirmPass}
                            onChange={({ target: { value } }) => setConfirmPass(value)}
                            placeholder='Igual ao campo anterior'
                            type='password'
                        />
                    } />
                ]}
            />
        </motion.div>
    )
}

export default RegisterCollaborator
