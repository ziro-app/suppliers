import React, { useState, useEffect } from 'react'
import { get } from 'axios'
import HeaderHome from '@bit/vitorbarbosa19.ziro.header-home'
import Form from '@bit/vitorbarbosa19.ziro.form'
import FormInput from '@bit/vitorbarbosa19.ziro.form-input'
import InputText from '@bit/vitorbarbosa19.ziro.input-text'
import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown'
import Button from '@bit/vitorbarbosa19.ziro.button'
import Spinner from '@bit/vitorbarbosa19.ziro.spinner'
import Error from '@bit/vitorbarbosa19.ziro.error'
import maskInput from '@ziro/mask-input'
import capitalize from '@ziro/capitalize'
import { containerWithPadding } from '@ziro/theme'
import SingleImageUpload from './SingleImageUpload/index'
import GetCnpj from './GetCnpj/index'
import { welcome, marker, button } from './styles'
import banksList from './banks'
import fetch from './fetch'
import completeRegistration from './completeRegistration'
import simplifiedRegistration from './simplifiedRegistration'

const categories = {
	'Bijouterias': '09',
	'Calçados / Bolsas / Malas': '10',
	'Cosméticos / Produtos de beleza': '11',
	'Lavanderia / Tinturaria': '12',
	'Magazines': '13',
	'Roupas masc., fem., inf., geral': '14',
	'Uniformes': '15',
	'Vestuário': '25',
	'Joalheria': '32'
}

const Register = () => {
	const [isError, setIsError] = useState(false)
	const [isLoading, setIsLoading] = useState(true)
	const [suppliers, setSuppliers] = useState([])
	const [step, setStep] = useState(0)
	const [cnpjValid, setCnpjValid] = useState(false)
	// mixed form field
	const [cnpj, setCnpj] = useState('')
	// form fields 0
	const [typeOfRegistration, setTypeOfRegistration] = useState('')
	const typeOfRegistrationList = ['Simplificado', 'Completo']
	// form fields 1
	const [reason, setReason] = useState('')
	const [fantasia, setFantasia] = useState('')
	const [opening, setOpening] = useState('')
	const [categoryName, setCategoryName] = useState('')
	const [category, setCategory] = useState('')
	const categoryList = ['Bijouterias', 'Calçados / Bolsas / Malas', 'Cosméticos / Produtos de beleza', 'Lavanderia / Tinturaria', 'Magazines', 'Roupas masc., fem., inf., geral', 'Uniformes', 'Vestuário', 'Joalheria']
	const [cep, setCep] = useState('')
	const [street, setStreet] = useState('')
	const [number, setNumber] = useState('')
	const [complement, setComplement] = useState('')
	const [neighborhood, setNeighborhood] = useState('')
	const [city, setCity] = useState('')
	const [cityState, setCityState] = useState('')
	const [searchingCep, setSearchingCep] = useState(false)
	const statesList = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO']
	// form fields 2
	const [fname, setFName] = useState('')
	const [lname, setLName] = useState('')
	const [cpf, setCpf] = useState('')
	const [email, setEmail] = useState('')
	const [birthdate, setBirthdate] = useState('')
	const [phone, setPhone] = useState('')
	const [pass, setPass] = useState('')
	const [confirmPass, setConfirmPass] = useState('')
	// form fields 3 - Upload de documentos
	const [fileDoc, setFileDoc] = useState('')
	const [fileAtv, setFileAtv] = useState('')
	const [fileRes, setFileRes] = useState('')
	const [fileCnpj, setFileCnpj] = useState('')
	// form fields 4 - Dados bancários
	const [bankName, setBankName] = useState('')
	const [bankNumber, setBankNumber] = useState('')
	const [holderName, setHolderName] = useState('')
	const [agency, setAgency] = useState('')
	const [accountNumber, setAccountNumber] = useState('')
	const [accountTypeViewName, setAccountTypeViewName] = useState('')
	const [accountType, setAccountType] = useState('')
	const accountTypeList = ['Conta Corrente', 'Conta Poupança']

	const setState = {
		setTypeOfRegistration, setCnpj, setCnpjValid, setReason, setFantasia, setOpening, setCategory,
		setFName, setLName, setCpf, setEmail, setBirthdate, setPhone, setStreet, setNumber, setComplement,
		setNeighborhood, setCep, setCity, setCityState, setPass, setBankNumber, setHolderName, setAccountNumber,
		setAgency, setAccountType, setFileDoc, setFileAtv, setFileRes, setFileCnpj
	}
	const state = {
		cnpjValid, typeOfRegistration, cnpj, reason, fantasia, opening, category, cep, street, number,
		complement, neighborhood, city, cityState, fname, lname, cpf, email, birthdate, phone, pass,
		bankName, bankNumber, holderName, accountNumber, agency, accountType, fileDoc, fileAtv, fileRes,
		fileCnpj, categoryName, accountTypeViewName, ...setState
	}
	const validations = [
		{
			name: 'typeOfRegistration',
			validation: value => step <= 2 ? typeOfRegistrationList.includes(value) : true,
			value: typeOfRegistration,
			message: 'Valor inválido'
		}, {
			name: 'cnpj',
			validation: value => step === 1 ? /(^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$)/.test(value) : true,
			value: cnpj,
			message: 'CNPJ inválido'
		}, {
			name: 'reason',
			validation: value => (typeOfRegistration === 'Completo' && step === 1) ? !!value : true,
			value: reason,
			message: 'Campo obrigatório'
		}, {
			name: 'fantasia',
			validation: value => (typeOfRegistration === 'Completo' && step === 1) ? !!value : true,
			value: fantasia,
			message: 'Campo obrigatório'
		}, {
			name: 'opening',
			validation: value => (typeOfRegistration === 'Completo' && step === 1) ? (value === '' || /^(?:(?:31(\/)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/.test(value)) : true,
			value: opening,
			message: 'Campo obrigatório'
		}, {
			name: 'category',
			validation: value => (typeOfRegistration === 'Completo' && step === 1) ? categoryList.includes(value) : true,
			value: categoryName,
			message: 'Campo obrigatório'
		}, {
			name: 'fname',
			validation: value => ((typeOfRegistration === 'Simplificado' && step === 1) || step === 2) ? !!value : true,
			value: fname,
			message: 'Nome obrigatório'
		}, {
			name: 'lname',
			validation: value => ((typeOfRegistration === 'Simplificado' && step === 1) || step === 2) ? !!value : true,
			value: lname,
			message: 'Sobrenome obrigatório'
		}, {
			name: 'cpf',
			validation: value => step === 2 ? /(^\d{3}\.\d{3}\.\d{3}\-\d{2}$)/.test(value) : true,
			value: cpf,
			message: 'CPF inválido'
		}, {
			name: 'birthdate',
			validation: value => step === 2 ? (value === '' || /^(?:(?:31(\/)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/.test(value)) : true,
			value: birthdate,
			message: 'Data inválida'
		}, {
			name: 'phone',
			validation: value => step === 2 ? /(^\(\d{2}\) \d{5}\-\d{4}$)/.test(value) : true,
			value: phone,
			message: 'Telefone inválido'
		}, {
			name: 'email',
			validation: value => ((typeOfRegistration === 'Simplificado' && step === 1) || step === 2) ? /^\S+@\S+\.\S+$/g.test(value) : true,
			value: email,
			message: 'Email inválido'
		}, {
			name: 'pass',
			validation: value => ((typeOfRegistration === 'Simplificado' && step === 1) || step === 2) ? !/^.{0,5}$/g.test(value) : true, // tests for min length of 6 char
			value: pass,
			message: 'Mínimo 6 caracteres'
		}, {
			name: 'confirmPass',
			validation: value => ((typeOfRegistration === 'Simplificado' && step === 1) || step === 2) ? value === pass : true,
			value: confirmPass,
			message: 'Deve ser igual ao campo anterior'
		}, {
			name: 'cep',
			validation: value => step === 1 ? /(^\d{5}\-\d{3}$)/.test(value) : true,
			value: cep,
			message: 'CEP inválido'
		}, {
			name: 'street',
			validation: value => step === 1 ? !!value : true,
			value: street,
			message: 'Campo obrigatório'
		}, {
			name: 'neighborhood',
			validation: value => step === 1 ? !!value : true,
			value: neighborhood,
			message: 'Campo obrigatório'
		}, {
			name: 'city',
			validation: value => step === 1 ? !!value : true,
			value: city,
			message: 'Campo obrigatório'
		}, {
			name: 'cityState',
			validation: value => step === 1 ? /(^\D{2}$)/.test(value) & statesList.includes(value) : true,
			value: cityState,
			message: 'Campo obrigatório'
		}, {
			name: 'idDoc',
			validation: value => step === 3 ? value !== '' : true,
			value: fileDoc,
			message: 'Documento obrigatório'
		}, {
			name: 'idAtv',
			validation: value => step === 3 ? value !== '' : true,
			value: fileAtv,
			message: 'Documento obrigatório'
		}, {
			name: 'idRes',
			validation: value => step === 3 ? value !== '' : true,
			value: fileRes,
			message: 'Documento obrigatório'
		}, {
			name: 'idCnpj',
			validation: value => step === 3 ? value !== '' : true,
			value: fileCnpj,
			message: 'Documento obrigatório'
		}, {
			name: 'bankNumber',
			validation: value => step === 4 ? banksList.filter(bank => value === bank.split(' - ')) : true,
			value: bankNumber,
			message: 'Campo obrigatório'
		}, {
			name: 'holderName',
			validation: value => step === 4 ? !!value : true,
			value: holderName,
			message: 'Campo obrigatório'
		}, {
			name: 'agency',
			validation: value => step === 4 ? !!value : true,
			value: agency,
			message: 'Campo obrigatório'
		}, {
			name: 'accountNumber',
			validation: value => step === 4 ? !!value : true,
			value: accountNumber,
			message: 'Campo obrigatório'
		}, {
			name: 'accountType',
			validation: value => step === 4 ? ['savings', 'checking'].includes(value) : true,
			value: accountType,
			message: 'Campo obrigatório'
		}
	]

	const clearFields = () => {
		setTypeOfRegistration('')
		setCnpj('')
		setCnpjValid(false)
		setReason('')
		setFantasia('')
		setOpening('')
		setCategory('')
		setFName('')
		setLName('')
		setCpf('')
		setEmail('')
		setBirthdate('')
		setPhone('')
		setStreet('')
		setNumber('')
		setComplement('')
		setNeighborhood('')
		setCep('')
		setCity('')
		setCityState('')
		setPass('')
		setConfirmPass('')
		setBankNumber('')
		setHolderName('')
		setAccountNumber('')
		setAgency('')
		setAccountType('')
		setFileDoc('')
		setFileAtv('')
		setFileRes('')
		setFileCnpj('')
		setCategoryName('')
		setBankName('')
		setAccountTypeViewName('')
	}

	const cepHandleChange = async (e) => {
		const cep = maskInput(e.target.value, '#####-###', true)
		setCep(cep)
		if (cep.length === 9) {
			setSearchingCep(true)
			try {
				const { data } = await get(`https://viacep.com.br/ws/${cep}/json/`)
				setStreet(data.logradouro.toUpperCase())
				setNeighborhood(data.bairro.toUpperCase())
				setComplement(data.complemento.toUpperCase())
				setCity(data.localidade.toUpperCase())
				setCityState(data.uf.toUpperCase())
			} finally {
				setSearchingCep(false)
			}
		}
	}

	useEffect(() => fetch(setIsLoading, setIsError, setSuppliers), [])

	if (isLoading) return <div style={{ display: 'grid', marginTop: '15px' }}><Spinner size='5rem' /></div>
	if (isError) return <Error />

	return (
		<div style={containerWithPadding}>
			<HeaderHome linkPath='/login' linkText='Tem cadastro? LOGIN' />
			<h1 style={welcome}>
				Crie sua conta de <span style={marker}>Fabricante</span>,
			</h1>
			{step === 0 &&
				<Form
					buttonName="Avançar"
					validations={validations}
					sendToBackend={() => setStep(step + 1)}
					inputs={[
						<FormInput name='typeOfRegistration' label='Tipo de Cadastro' input={
							<Dropdown
								value={typeOfRegistration}
								onChange={({ target: { value } }) => {
									clearFields()
									setTypeOfRegistration(value)
									if (value === '') setStep(0)
									else setStep(1)
								}}
								onChangeKeyboard={element => {
									if (element) {
										clearFields()
										setTypeOfRegistration(element.value)
										if (element.value === '') setStep(0)
										else setStep(1)
									}
								}}
								list={typeOfRegistrationList}
								placeholder="Escolha Completo ou Simplificado"
								readOnly={true}
							/>
						} />
					]}
				/>
			}
			{typeOfRegistration === 'Simplificado' && step === 1 &&
				<>
					<FormInput name='typeOfRegistration' label='Tipo de Cadastro' input={
						<Dropdown
							value={typeOfRegistration}
							onChange={({ target: { value } }) => {
								clearFields()
								setTypeOfRegistration(value)
								if (value === '') setStep(0)
								else setStep(1)
							}}
							onChangeKeyboard={element => {
								if (element) {
									clearFields()
									setTypeOfRegistration(element.value)
									if (element.value === '') setStep(0)
									else setStep(1)
								}
							}}
							list={typeOfRegistrationList}
							placeholder="Escolha Completo ou Simplificado"
							readOnly={true}
						/>
					} />
					<GetCnpj cnpj={cnpj} setState={setState} suppliers={suppliers} setCnpjValid={setCnpjValid} />
					<Form
						validations={validations}
						sendToBackend={simplifiedRegistration ? simplifiedRegistration(state) : () => null}
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
				</>
			}
			{typeOfRegistration === 'Completo' && step === 1 &&
				<>
					<FormInput name='typeOfRegistration' label='Tipo de Cadastro' input={
						<Dropdown
							value={typeOfRegistration}
							onChange={({ target: { value } }) => {
								clearFields()
								setTypeOfRegistration(value)
								if (value === '') setStep(0)
								else setStep(1)
							}}
							onChangeKeyboard={element => {
								if (element) {
									clearFields()
									setTypeOfRegistration(element.value)
									if (element.value === '') setStep(0)
									else setStep(1)
								}
							}}
							list={typeOfRegistrationList}
							placeholder="Escolha Completo ou Simplificado"
							readOnly={true}
						/>
					} />
					<GetCnpj cnpj={cnpj} setState={setState} suppliers={suppliers} setCnpjValid={setCnpjValid} />
					<Form
						buttonName="Avançar"
						validations={validations}
						sendToBackend={() => setStep(step + 1)}
						inputs={[
							<FormInput name='reason' label='Razão Social' input={
								<InputText
									value={reason}
									onChange={({ target: { value } }) => setReason(value.toUpperCase())}
									placeholder='ALMEIDA MODAS LTDA'
								/>
							} />,
							<FormInput name='fantasia' label='Nome Fantasia' input={
								<InputText
									value={fantasia}
									onChange={({ target: { value } }) => setFantasia(value.toUpperCase())}
									placeholder='ATELIE DE ROUPAS'
								/>
							} />,
							<FormInput name='opening' label='Data de Abertura' input={
								<InputText
									value={opening}
									onChange={({ target: { value } }) => setOpening(maskInput(value, '##/##/####', true))}
									placeholder='01/01/2000'
									inputMode='numeric'
								/>
							} />,
							<FormInput name='category' label='Categoria' input={
								<Dropdown
									value={categoryName}
									onChange={({ target: { value } }) => {
										setCategoryName(value)
										setCategory(categories[value])
									}}
									onChangeKeyboard={element => {
										if (element) {
											setCategoryName(element.value)
											setCategory(categories[element.value])
										}
									}
									}
									list={categoryList}
									placeholder="Bijouterias"
									readOnly={true}
								/>
							} />,
							<FormInput name='cep' label='CEP' input={
								<InputText
									value={cep}
									disabled={searchingCep}
									submitting={searchingCep}
									onChange={(e) => cepHandleChange(e)}
									placeholder='00000-111'
									inputMode='numeric'
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
									inputMode='numeric'
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
							} />
						]}
					/>
				</>
			}
			{typeOfRegistration === 'Completo' && step === 2 &&
				<>
					<Form
						buttonName="Avançar"
						validations={validations}
						sendToBackend={() => setStep(step + 1)}
						inputs={[
							<FormInput name='typeOfRegistration' label='Tipo de Cadastro' input={
								<Dropdown
									value={typeOfRegistration}
									onChange={({ target: { value } }) => {
										clearFields()
										setTypeOfRegistration(value)
										if (value === '') setStep(0)
										else setStep(1)
									}}
									onChangeKeyboard={element => {
										if (element) {
											clearFields()
											setTypeOfRegistration(element.value)
											if (element.value === '') setStep(0)
											else setStep(1)
										}
									}}
									list={typeOfRegistrationList}
									placeholder="Escolha Completo ou Simplificado"
									readOnly={true}
								/>
							} />,
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
							<FormInput name='cpf' label='CPF' input={
								<InputText
									value={cpf}
									onChange={({ target: { value } }) => setCpf(maskInput(value, '###.###.###-##', true))}
									placeholder='000.000.000-00'
								/>
							} />,
							<FormInput name='birthdate' label='Data de Nascimento' input={
								<InputText
									value={birthdate}
									onChange={({ target: { value } }) => setBirthdate(maskInput(value, '##/##/####', true))}
									placeholder='01/01/2000'
									inputMode='numeric'
								/>
							} />,
							<FormInput name='phone' label='Telefone' input={
								<InputText
									value={phone}
									onChange={({ target: { value } }) => setPhone(maskInput(value, '(##) #####-####', true))}
									placeholder='(11) 99999-9999'
									inputMode='numeric'
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
					<div style={button} >
						<Button
							type="button"
							cta="Voltar"
							template="light"
							click={() => setStep(step - 1)}
						/>
					</div>
				</>
			}
			{typeOfRegistration === 'Completo' && step === 3 &&
				<>
					<Form
						buttonName="Avançar"
						validations={validations}
						sendToBackend={() => setStep(step + 1)}
						inputs={[
							<FormInput name='typeOfRegistration' label='Tipo de Cadastro' input={
								<Dropdown
									value={typeOfRegistration}
									onChange={({ target: { value } }) => {
										clearFields()
										setTypeOfRegistration(value)
										if (value === '') setStep(0)
										else setStep(1)
									}}
									onChangeKeyboard={element => {
										if (element) {
											clearFields()
											setTypeOfRegistration(element.value)
											if (element.value === '') setStep(0)
											else setStep(1)
										}
									}}
									list={typeOfRegistrationList}
									placeholder="Escolha Completo ou Simplificado"
									readOnly={true}
								/>
							} />,
							<FormInput name='idDoc' label='Documento de Identificação (Ex: RG)' input={
								<SingleImageUpload
									setFile={setFileDoc}
									persistFilename={fileDoc.name}
									indexOfFile={0}
								/>
							} />,
							<FormInput name='idAtv' label='Documento de Atividade (Ex: Alvará)' input={
								<SingleImageUpload
									setFile={setFileAtv}
									persistFilename={fileAtv.name}
									indexOfFile={1}
								/>
							} />,
							<FormInput name='idRes' label='Comprovante de Residência (Ex: Conta de luz)' input={
								<SingleImageUpload
									setFile={setFileRes}
									persistFilename={fileRes.name}
									indexOfFile={2}
								/>
							} />,
							<FormInput name='idCnpj' label='Documento de CNPJ' input={
								<SingleImageUpload
									setFile={setFileCnpj}
									persistFilename={fileCnpj.name}
									indexOfFile={3}
								/>
							} />
						]}
					/>
					<div style={button} >
						<Button
							type="button"
							cta="Voltar"
							template="light"
							click={() => setStep(step - 1)}
						/>
					</div>
				</>
			}
			{typeOfRegistration === 'Completo' && step === 4 &&
				<>
					<Form
						validations={validations}
						sendToBackend={completeRegistration ? completeRegistration(state) : () => null}
						inputs={[
							<FormInput name='typeOfRegistration' label='Tipo de Cadastro' input={
								<Dropdown
									value={typeOfRegistration}
									onChange={({ target: { value } }) => {
										clearFields()
										setTypeOfRegistration(value)
										if (value === '') setStep(0)
										else setStep(1)
									}}
									onChangeKeyboard={element => {
										if (element) {
											clearFields()
											setTypeOfRegistration(element.value)
											if (element.value === '') setStep(0)
											else setStep(1)
										}
									}}
									list={typeOfRegistrationList}
									placeholder="Escolha Completo ou Simplificado"
									readOnly={true}
								/>
							} />,
							<FormInput name='accountType' label='Tipo da Conta' input={
								<Dropdown
									value={accountTypeViewName}
									onChange={({ target: { value } }) => {
										setAccountTypeViewName(value)
										if (value === 'Conta Poupança') setAccountType('savings')
										else if (value === 'Conta Corrente') setAccountType('checking')
										else setAccountType('')
									}}
									onChangeKeyboard={element => {
										if (element) {
											setAccountTypeViewName(element.value)
											if (element.value === 'Conta Poupança') setAccountType('savings')
											else if (element.value === 'Conta Corrente') setAccountType('checking')
											else setAccountType('')
										}
									}}
									list={accountTypeList}
									placeholder="Corrente"
									readOnly={true}
								/>
							} />,
							<FormInput name='bankNumber' label='Banco' input={
								<Dropdown
									value={bankName}
									onChange={({ target: { value } }) => {
										setBankName(value)
										if (value.indexOf(' - ')) {
											value.split(' - ')[0] ? setBankNumber(value.split(' - ')[0]) : null
										}
									}}
									onChangeKeyboard={element => {
										if (element) {
											setBankName(element.value)
											if (element.value.indexOf(' - ')) {
												element.value.split(' - ')[0] ? setBankNumber(element.value.split(' - ')[0]) : null
											}
										}
									}}
									list={banksList}
									placeholder="Nubank"
								/>
							} />,
							<FormInput name='holderName' label='Titular' input={
								<InputText
									value={holderName}
									onChange={({ target: { value } }) => setHolderName(capitalize(value))}
									placeholder='Nome do titular'
								/>
							} />,
							<FormInput name='accountNumber' label='Número da Conta com DV' input={
								<InputText
									value={accountNumber}
									onChange={({ target: { value } }) => setAccountNumber(value)}
									placeholder='Ex.: 9472156-8'
									inputMode='numeric'
								/>
							} />,
							<FormInput name='agency' label='Agência sem DV' input={
								<InputText
									value={agency}
									onChange={({ target: { value } }) => setAgency(maskInput(value, '####', true))}
									placeholder='Ex.: 0001'
									inputMode='numeric'
								/>
							} />,
							<FormInput name='cnpj' label='CNPJ' input={
								<InputText
									value={cnpj}
									onChange={() => { }}
									disabled={true}
								/>
							} />
						]}
					/>
					<div style={button} >
						<Button
							type="button"
							cta="Voltar"
							template="light"
							click={() => setStep(step - 1)}
						/>
					</div>
				</>
			}
			{typeOfRegistration && <p style={{ textAlign: "center", fontWeight: "bold", paddingTop: "20px", fontSize: "15px" }}>Página {step === 0 ? step + 1 : step} de {typeOfRegistration === 'Completo' ? 4 : 1}.</p>}
		</div>
	)
}

export default Register