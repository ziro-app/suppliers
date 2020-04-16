import React, { useState } from 'react'
import { get } from 'axios'
import sendToBackend from './sendToBackend'
import HeaderHome from '@bit/vitorbarbosa19.ziro.header-home'
import Form from '@bit/vitorbarbosa19.ziro.form'
import FormInput from '@bit/vitorbarbosa19.ziro.form-input'
import InputText from '@bit/vitorbarbosa19.ziro.input-text'
import maskInput from '@ziro/mask-input'
import capitalize from '@ziro/capitalize'
import { containerWithPadding } from '@ziro/theme'
import { welcome, marker } from './styles'

const Register = () => {
	// form fields
	const [name, setName] = useState('')
	const [lastName, setLastName] = useState('')
	const [cnpj, setCnpj] = useState('')
	const [birthdate, setBirthdate] = useState('')
	const [phone, setPhone] = useState('')
	const [street, setStreet] = useState('')
	const [number, setNumber] = useState('')
	const [complement, setComplement] = useState('')
	const [neighborhood, setNeighborhood] = useState('')
	const [cep, setCep] = useState('')
	const [city, setCity] = useState('')
	const [cityState, setCityState] = useState('')
	const [searchingCep, isSearchingCep] = useState(false)
	const statesList = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO']

	const [email, setEmail] = useState('')
	const [pass, setPass] = useState('')
	const [confirmPass, setConfirmPass] = useState('')
	const state = { name, lastName, cnpj, birthdate, phone, street, number, complement, neighborhood, cep, city, cityState, email, pass }
	const validations = [
		{
			name: 'name',
			validation: value => !!value,
			value: name,
			message: 'Campo obrigatório'
		}, {
			name: 'lastName',
			validation: value => !!value,
			value: lastName,
			message: 'Campo obrigatório'
		}, {
			name: 'cnpj',
			validation: value => /(^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$)/.test(value),
			value: cnpj,
			message: 'CNPJ inválido'
		}, {
			name: 'birthdate',
			validation: value => /^(?:(?:31(\/)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/.test(value),
			value: birthdate,
			message: 'Data inválida'
		}, {
			name: 'phone',
			validation: value => /(^\(\d{2}\) \d{5}\-\d{4}$)/.test(value),
			value: phone,
			message: 'Telefone inválido'
		}, {
			name: 'cep',
			validation: value => /(^\d{5}\-\d{3}$)/.test(value),
			value: cep,
			message: 'CEP inválido'
		}, {
			name: 'street',
			validation: value => !!value,
			value: street,
			message: 'Campo obrigatório'
		}, {
			name: 'number',
			validation: value => !!value,
			value: number,
			message: 'Campo obrigatório'
		}, {
			name: 'neighborhood',
			validation: value => !!value,
			value: neighborhood,
			message: 'Campo obrigatório'
		}, {
			name: 'city',
			validation: value => /[a-zA-Z]+/g.test(value),
			value: city,
			message: 'Campo obrigatório'
		}, {
			name: 'cityState',
			validation: value => /(^\D{2}$)/.test(value) & statesList.includes(value),
			value: cityState,
			message: 'Estado inválido'
		}, {
			name: 'email',
			validation: value => /^\S+@\S+\.\S+$/g.test(value), // tests for pattern a@b.c
			value: email,
			message: 'Formato inválido'
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

	const cepHandleChange = async (e) => {
		const cep = maskInput(e.target.value, '#####-###', true)
		setCep(cep)
		if (cep.length === 9) {
			isSearchingCep(true)
			try {
				const { data } = await get(`https://viacep.com.br/ws/${cep}/json/`)
				setStreet(data.logradouro.toUpperCase())
				setNeighborhood(data.bairro.toUpperCase())
				setComplement(data.complemento.toUpperCase())
				setCity(data.localidade.toUpperCase())
				setCityState(data.uf.toUpperCase())
			} finally {
				isSearchingCep(false)
			}
		}
	}

	return (
		<div style={containerWithPadding}>
			<HeaderHome linkPath='/login' linkText='Tem cadastro? LOGIN' />
			<h1 style={welcome}>
				Crie sua conta de <span style={marker}>Fabricante</span>,
			</h1>
			<Form
				validations={validations}
				sendToBackend={sendToBackend ? sendToBackend(state) : () => null}
				inputs={[
					<FormInput name='name' label='Nome' input={
						<InputText
							value={name}
							onChange={({ target: { value } }) => setName(capitalize(value))}
							placeholder='Nome do fabricante'
						/>
					} />,
					<FormInput name='lastName' label='Sobrenome' input={
						<InputText
							value={lastName}
							onChange={({ target: { value } }) => setLastName(capitalize(value))}
							placeholder='Sobrenome do fabricante'
						/>
					} />,
					<FormInput name='cnpj' label='CNPJ' input={
						<InputText
							value={cnpj}
							onChange={({ target: { value } }) => setCnpj(maskInput(value, '##.###.###/####-##', true))}
							placeholder='00.111.222/0001-33'
							inputmode='numeric'
						/>
					} />,
					<FormInput name='birthdate' label='Nascimento' input={
						<InputText
							value={birthdate}
							onChange={({ target: { value } }) => setBirthdate(maskInput(value, '##/##/####', true))}
							placeholder='01/10/1990'
							inputmode='numeric'
						/>
					} />,
					<FormInput name='phone' label='Telefone Pessoal' input={
						<InputText
							value={phone}
							onChange={({ target: { value } }) => setPhone(maskInput(value, '(##) #####-####', true))}
							placeholder='(86) 99743-6822'
							inputmode='tel'
						/>
					} />,
					<FormInput name='cep' label='CEP' input={
						<InputText
							value={cep}
							onChange={(e) => cepHandleChange(e)}
							disabled={searchingCep}
							placeholder='00000-111'
							inputmode='numeric'
						/>
					} />,
					<FormInput name='street' label='Rua' input={
						<InputText
							value={street}
							onChange={({ target: { value } }) => setStreet(value.toUpperCase())}
							placeholder='R HERMELINO CARDOSO'
						/>
					} />,
					<FormInput name='number' label='Número' input={
						<InputText
							value={number}
							onChange={({ target: { value } }) => setNumber(maskInput(value.toUpperCase(), '######', true))}
							placeholder='1283'
							inputmode='numeric'
						/>
					} />,
					<FormInput name='complement' label='Complemento' input={
						<InputText
							value={complement}
							onChange={({ target: { value } }) => setComplement(value.toUpperCase())}
							placeholder='BLOCO K'
						/>
					} />,
					<FormInput name='neighborhood' label='Bairro' input={
						<InputText
							value={neighborhood}
							onChange={({ target: { value } }) => setNeighborhood(value.toUpperCase())}
							placeholder='COHAB'
						/>
					} />,
					<FormInput name='city' label='Cidade' input={
						<InputText
							value={city}
							onChange={({ target: { value } }) => setCity(value.toUpperCase())}
							placeholder='SÃO PAULO'
						/>
					} />,
					<FormInput name='cityState' label='Estado' input={
						<InputText
							value={cityState}
							onChange={({ target: { value } }) => setCityState(maskInput(value.toUpperCase(), '##', false))}
							placeholder='SP'
						/>
					} />,
					<FormInput name='email' label='Email' input={
						<InputText
							value={email}
							onChange={({ target: { value } }) => setEmail(value.toLowerCase())}
							placeholder='Para acesso ao app'
							inputmode='email'
							autocomplete='email'
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
		</div>
	)
}

export default Register