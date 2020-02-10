import React, { useState } from 'react'
import sendToBackend from './sendToBackend'
import InitialLoader from '@bit/vitorbarbosa19.ziro.initial-loader'
import Error from '@bit/vitorbarbosa19.ziro.error'
import HeaderHome from '@bit/vitorbarbosa19.ziro.header-home'
import Form from '@bit/vitorbarbosa19.ziro.form'
import FormInput from '@bit/vitorbarbosa19.ziro.form-input'
import InputText from '@bit/vitorbarbosa19.ziro.input-text'
import { containerWithPadding } from '@ziro/theme'
import { welcome, marker } from './styles'

const Register = () => {
	const [isLoading, setIsLoading] = useState(false)
	const [isError, setIsError] = useState(false)
	// form fields
	const [email, setEmail] = useState('')
	const [pass, setPass] = useState('')
	const [confirmPass, setConfirmPass] = useState('')
	const state = { email, pass, confirmPass }
	const validations = [
		{
			name: 'email',
			validation: value => /^\S+@\S+\.\S+$/g.test(value), // tests for pattern a@b.c
			value: email,
			message: 'Formato inválido'
		},{
			name: 'pass',
			validation: value => !/^.{0,5}$/g.test(value), // tests for min length of 6 char
			value: pass,
			message: 'Mínimo 6 caracteres'
		},{
			name: 'confirmPass',
			validation: value => value === pass,
			value: confirmPass,
			message: 'Deve ser igual ao campo anterior'
		}
	]
	if (isLoading) return <InitialLoader />
	if (isError) return <Error />
	return (
		<div style={containerWithPadding}>
			<HeaderHome linkPath='/login' linkText='Tem cadastro? LOGIN' />
			<h1 style={welcome}>
				Crie sua conta de <span style={marker}>{`<INSIRA UM NOME>`}</span>,
			</h1>
			<Form
				validations={validations}
				sendToBackend={sendToBackend ? sendToBackend(state) : () => null}
				inputs={[
					<FormInput name='email' label='Email' input={
						<InputText
							value={email}
							onChange={({ target: { value } }) => setEmail(value.toLowerCase())}
							placeholder='Para acesso ao app'
						/>
					}/>,
					<FormInput name='pass' label='Senha' input={
						<InputText
							value={pass}
							onChange={({ target: { value } }) => setPass(value)}
							placeholder='Mínimo 6 caracteres'
							type='password'
						/>
					}/>,
					<FormInput name='confirmPass' label='Confirme a senha' input={
						<InputText
							value={confirmPass}
							onChange={({ target: { value } }) => setConfirmPass(value)}
							placeholder='Igual ao campo anterior'
							type='password'
						/>
					}/>
				]}
			/>
		</div>
	)
}

export default Register