import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import Form from '@bit/vitorbarbosa19.ziro.form';
import FormInput from '@bit/vitorbarbosa19.ziro.form-input';
import InputText from '@bit/vitorbarbosa19.ziro.input-text';
import Icon from '@bit/vitorbarbosa19.ziro.icon';
import Spinner from '@bit/vitorbarbosa19.ziro.spinner';
import Error from '@bit/vitorbarbosa19.ziro.error';
import { containerWithPadding } from '@ziro/theme';
import fetch from './fetch';
import sendToBackend from './sendToBackend';
import { container, marker, welcome } from './styles';

const RegisterCollaborator = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [errorLoading, setErrorLoading] = useState(false);
    const [customError, setCustomError] = useState(false);
    const [fname, setFName] = useState('');
    const [lname, setLName] = useState('');
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    const [docId, setDocId] = useState('');
    const [supplierId, setSupplierId] = useState('');
    const [role, setRole] = useState('');
    const [, setLocation] = useLocation();

    const setState = { setFName, setLName, setEmail, setPass, setConfirmPass, setDocId, setSupplierId, setRole };
    const state = { fname, lname, email, pass, docId, supplierId, role, ...setState };
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

    useEffect(() => fetch(setIsLoading, setErrorLoading, setCustomError, new URLSearchParams(window.location.search).get('dc'), setState), []);

    if (isLoading) return <div style={{ display: 'grid', marginTop: '15px' }}><Spinner size='5rem' /></div>;
    if (customError) return <Error
        message="Link inválido, contate suporte."
        type="notFound"
        title="Link inválido"
        backRoute="/"
        backRouteFunction={route => setLocation(route)}
    />
    if (errorLoading) return <Error />


    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={containerWithPadding}>
            <div style={container}>
                <Icon type='ziro' size={45} />
            </div>
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
                            onChange={() => null}
                            placeholder='Seu nome'
                            disabled={true}
                        />
                    } />,
                    <FormInput name='lname' label='Sobrenome' input={
                        <InputText
                            value={lname}
                            onChange={() => null}
                            placeholder='Seu sobrenome'
                            disabled={true}
                        />
                    } />,
                    <FormInput name='email' label='Email' input={
                        <InputText
                            value={email}
                            onChange={() => null}
                            placeholder='ex@exemplo.com'
                            inputMode='email'
                            autoComplete='email'
                            disabled={true}
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
