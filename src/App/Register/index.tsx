// @ts-nocheck
import React, { useState, useEffect, memo } from 'react';
import axios from 'axios';
import HeaderHome from '@bit/vitorbarbosa19.ziro.header-home';
import Form from '@bit/vitorbarbosa19.ziro.form';
import FormInput from '@bit/vitorbarbosa19.ziro.form-input';
import InputText from '@bit/vitorbarbosa19.ziro.input-text';
import InputEmail from '@bit/vitorbarbosa19.ziro.input-email';
import InputPhone from '@bit/vitorbarbosa19.ziro.input-phone';
import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown';
import Button from '@bit/vitorbarbosa19.ziro.button';
import Spinner from '@bit/vitorbarbosa19.ziro.spinner';
import Error from '@bit/vitorbarbosa19.ziro.error';
import GetCnpj from '@bit/vitorbarbosa19.ziro.get-cnpj';
import Illustration from '@bit/vitorbarbosa19.ziro.illustration';
import ToggleButton from '@bit/vitorbarbosa19.ziro.toggle-button';
import TooltipHelp from '@bit/vitorbarbosa19.ziro.tooltip-help';
import maskInput from '@ziro/mask-input';
import capitalize from '@ziro/capitalize';
import { containerWithPadding, fontTitle } from '@ziro/theme';
import SingleImageUpload from './SingleImageUpload/index';
import fetchFantasia from './fetchFantasia';
import banksList from './banks';
import fetch from './fetch';
import completeRegistration from './completeRegistration';
import simplifiedRegistration from './simplifiedRegistration';
import { AtvdText, CnpjText, DocText, HolderText, HomeText, supportModalTitle, supportModalBody, supportModalTitleRegister, supportModalBodyRegister } from './modals';
import { allCategories } from '../utils/allCategories';
import validateDocuments from '../utils/validateDocuments';
import useRollback from '../utils/useRollback/useRollback';

// const categories = {
//     Bijouterias: '09',
//     'Calçados/Bolsas/Malas': '10',
//     'Roupas masc., fem., inf., geral': '14',
//     Vestuário: '25',
// };

const Register = () => {
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [step, setStep] = useState(0);
    const [formToggle, setFormToggle] = useState(false);
    const [suppliers, setSuppliers] = useState([]);
    const [fantasias, setFantasias] = useState([]);
    const [cnpjValid, setCnpjValid] = useState(false);
    // mixed form field
    const [cnpj, setCnpj] = useState('');
    // form fields 0
    const [typeOfRegistration, setTypeOfRegistration] = useState('Simplificado');
    const typeOfRegistrationList = ['Simplificado', 'Completo'];
    // form fields 1
    const [reason, setReason] = useState('');
    const [fantasia, setFantasia] = useState('');
    const [categoryName, setCategoryName] = useState('');
    const [category, setCategory] = useState('');
    const categoryList = Object.keys(allCategories);
    const [cep, setCep] = useState('');
    const [street, setStreet] = useState('');
    const [number, setNumber] = useState('');
    const [complement, setComplement] = useState('');
    const [neighborhood, setNeighborhood] = useState('');
    const [city, setCity] = useState('');
    const [cityState, setCityState] = useState('');
    const [searchingCep, setSearchingCep] = useState(false);
    const statesList = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];
    // form fields 2
    const [fname, setFName] = useState('');
    const [lname, setLName] = useState('');
    const [cpf, setCpf] = useState('');
    const [whatsApp, setWhatsApp] = useState('');
    const [email, setEmail] = useState('');
    const [birthdate, setBirthdate] = useState('');
    const [fone, setFone] = useState('');
    const [pass, setPass] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    // form fields 3 - Upload de documentos
    const [fileDoc, setFileDoc] = useState('');
    const [fileAtv, setFileAtv] = useState('');
    const [fileRes, setFileRes] = useState('');
    const [fileCnpj, setFileCnpj] = useState('');
    // form fields 4 - Dados bancários
    const [bankName, setBankName] = useState('');
    const [bankNumber, setBankNumber] = useState('');
    const [agency, setAgency] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [accountTypeViewName, setAccountTypeViewName] = useState('');
    const [accountType, setAccountType] = useState('');
    const accountTypeList = ['Conta Corrente', 'Conta Poupança'];
    const validCnaes = ['47.81-4-00', '14.12-6-01', '14.12-6-03', '46.41-9-01', '46.42-7-01', '14.12-6-02', '15.31-9-01', '15.33-5-00', '15.39-4-00', '15.40-8-00', '14.12-6-02'];
    const cnpjUrl = process.env.CNPJ_URL || '';
    const cnpjToken = process.env.CNPJ_TOKEN || '';
    const customValidation = () => true;
    const { dataRollback, startRollback, createRollbackItem, cleanRollback } = useRollback();

    //console.log('1',dataRollback)
    //console.log('2',startRollback)
    //console.log('3',addRollbackItem)
    /*useEffect(() =>{

    setTimeout(function(){
        const newZoopId:IZoopData = {origin:'zoop',zoopId:'1234'}
        createRollbackItem(newZoopId) }, 3000);
    setTimeout(function(){
        const newZoopId:IFirebaseData = {origin:'firebase',collection:'suppliers',field:'id',identifier:'4567'}
        createRollbackItem(newZoopId) }, 9000);
    setTimeout(function(){
        const newZoopId:ISheetsData = {origin:'sheets',range:'E3', spreadsheetId:'UEIEJ3H5K6', values:['alessandro','24']}
        createRollbackItem(newZoopId) }, 18000);
    console.log('dataRollback',dataRollback)
    },[])*/
    const setState = {
        setTypeOfRegistration,
        setCnpj,
        setCnpjValid,
        setReason,
        setFantasia,
        setCategory,
        setFName,
        setLName,
        setCpf,
        setWhatsApp,
        setEmail,
        setBirthdate,
        setFone,
        setStreet,
        setNumber,
        setComplement,
        setNeighborhood,
        setCep,
        setCity,
        setCityState,
        setPass,
        setBankNumber,
        setAccountNumber,
        setAgency,
        setAccountType,
        setFileDoc,
        setFileAtv,
        setFileRes,
        setFileCnpj,
        cnpjUrl,
        cnpjToken,
        setFantasias,
        createRollbackItem,
        cleanRollback,
        startRollback,
    };
    const state = {
        cnpjValid,
        typeOfRegistration,
        cnpj,
        reason,
        fantasia,
        category,
        cep,
        whatsApp,
        street,
        number,
        complement,
        neighborhood,
        city,
        cityState,
        fname,
        lname,
        cpf,
        email,
        birthdate,
        fone,
        pass,
        bankName,
        bankNumber,
        accountNumber,
        agency,
        accountType,
        fileDoc,
        fileAtv,
        fileRes,
        fileCnpj,
        categoryName,
        accountTypeViewName,
        fantasias,
        ...setState,
    };
    const validateFile = file => {
        const validTypes = ['application/pdf', 'image/jpeg', 'image/png'];
        const { name, type } = file;
        return /(\.jpg|\.jpeg|\.png|\.pdf)$/.test(name.toLowerCase()) && validTypes.includes(type);
    };
    const validations = [
        {
            name: 'cnpjValid',
            validation: value => (step === 1 || (step === 4 && typeOfRegistration === 'Completo') ? value : true),
            value: cnpjValid,
            message: 'CNPJ precisa ser validado',
        },
        {
            name: 'typeOfRegistration',
            validation: value => (step <= 2 ? typeOfRegistrationList.includes(value) : true),
            value: typeOfRegistration,
            message: 'Valor inválido',
        },
        {
            name: 'cnpj',
            validation: value => (step === 1 ? /(^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$)/.test(value) : true),
            value: cnpj,
            message: 'CNPJ inválido',
        },
        {
            name: 'reason',
            validation: value => (typeOfRegistration === 'Completo' && step === 1 ? !!value : true),
            value: reason,
            message: 'Campo obrigatório',
        },
        {
            name: 'fantasia',
            validation: value => (typeOfRegistration === 'Completo' && step === 1 ? !!value : true),
            value: fantasia,
            message: 'Campo obrigatório',
        },
        {
            name: 'category',
            validation: value => (typeOfRegistration === 'Completo' && step === 1 ? categoryList.includes(value) : true),
            value: categoryName,
            message: 'Campo obrigatório',
        },
        {
            name: 'fname',
            validation: value => ((typeOfRegistration === 'Simplificado' && step === 1) || step === 2 ? !!value : true),
            value: fname,
            message: 'Nome obrigatório',
        },
        {
            name: 'lname',
            validation: value => ((typeOfRegistration === 'Simplificado' && step === 1) || step === 2 ? !!value : true),
            value: lname,
            message: 'Sobrenome obrigatório',
        },
        {
            name: 'cpf',
            validation: value => (step === 2 ? /(^\d{3}\.\d{3}\.\d{3}\-\d{2}$)/.test(value) && (process.env.HOMOLOG ? true : validateDocuments(value)) : true),
            value: cpf,
            message: 'CPF inválido',
        },
        {
            name: 'birthdate',
            validation: value =>
                step === 2
                    ? /^(?:(?:31(\/)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/.test(
                        value,
                    )
                    : true,
            value: birthdate,
            message: 'Data inválida',
        },
        {
            name: 'fone',
            validation: value =>
                step === 1 && value.length <= 14 && value !== '' ? /(^\(\d{2}\) \d{4}\-\d{4}$)/.test(value) : step === 1 && value.length === 15 ? /(^\(\d{2}\) \d{5}\-\d{4}$)/.test(value) : true,
            value: fone,
            message: 'Telefone inválido',
        },
        {
            name: 'whatsApp',
            validation: value => (step === 1 && typeOfRegistration === 'Completo' && value === '' ? true : /(^\(\d{2}\) \d{5}\-\d{4}$)/.test(value)),
            value: whatsApp,
            message: 'WhatsApp inválido',
        },
        {
            name: 'email',
            validation: value => ((typeOfRegistration === 'Simplificado' && step === 1) || step === 2 ? /^\S+@\S+\.\S+$/g.test(value) : true),
            value: email,
            message: 'Email inválido',
        },
        {
            name: 'pass',
            validation: value => ((typeOfRegistration === 'Simplificado' && step === 1) || step === 2 ? !/^.{0,5}$/g.test(value) : true), // tests for min length of 6 char
            value: pass,
            message: 'Mínimo 6 caracteres',
        },
        {
            name: 'confirmPass',
            validation: value => ((typeOfRegistration === 'Simplificado' && step === 1) || step === 2 ? value === pass : true),
            value: confirmPass,
            message: 'Deve ser igual ao campo anterior',
        },
        {
            name: 'cep',
            validation: value => (step === 1 ? /(^\d{5}\-\d{3}$)/.test(value) : true),
            value: cep,
            message: 'CEP inválido',
        },
        {
            name: 'street',
            validation: value => (step === 1 ? !!value : true),
            value: street,
            message: 'Campo obrigatório',
        },
        {
            name: 'number',
            validation: value => (step === 1 ? !!value : true),
            value: number,
            message: 'Campo obrigatório',
        },
        {
            name: 'neighborhood',
            validation: value => (step === 1 ? !!value : true),
            value: neighborhood,
            message: 'Campo obrigatório',
        },
        {
            name: 'city',
            validation: value => (step === 1 ? !!value : true),
            value: city,
            message: 'Campo obrigatório',
        },
        {
            name: 'cityState',
            validation: value => (step === 1 ? /(^\D{2}$)/.test(value) && statesList.includes(value) : true),
            value: cityState,
            message: 'Campo obrigatório',
        },
        {
            name: 'idDoc',
            validation: value => (step === 3 ? value !== '' && validateFile(value) : true),
            value: fileDoc,
            message: 'Formatos válidos: .png, .jpg, .jpeg e .pdf',
        },
        {
            name: 'idAtv',
            validation: value => (step === 3 ? value !== '' && validateFile(value) : true),
            value: fileAtv,
            message: 'Formatos válidos: .png, .jpg, .jpeg e .pdf',
        },
        {
            name: 'idRes',
            validation: value => (step === 3 ? value !== '' && validateFile(value) : true),
            value: fileRes,
            message: 'Formatos válidos: .png, .jpg, .jpeg e .pdf',
        },
        {
            name: 'idCnpj',
            validation: value => (step === 3 ? value !== '' && /(\.jpg|\.jpeg|\.png|\.pdf)$/.test(value.name) : true),
            value: fileCnpj,
            message: 'Formatos válidos: .png, .jpg, .jpeg e .pdf',
        },
        {
            name: 'bankNumber',
            validation: value => (step === 4 ? banksList.includes(bankName) : true),
            value: bankNumber,
            message: 'Campo obrigatório',
        },
        {
            name: 'agency',
            validation: value => (step === 4 ? !!value : true),
            value: agency,
            message: 'Campo obrigatório',
        },
        {
            name: 'accountNumber',
            validation: value => (step === 4 ? !!value : true),
            value: accountNumber,
            message: 'Campo obrigatório',
        },
        {
            name: 'accountType',
            validation: value => (step === 4 ? ['savings', 'checking'].includes(value) : true),
            value: accountType,
            message: 'Campo obrigatório',
        },
    ];

    const clearFields = () => {
        setTypeOfRegistration('');
        setCnpj('');
        setCnpjValid(false);
        setReason('');
        setFantasia('');
        setCategory('');
        setFName('');
        setLName('');
        setCpf('');
        setWhatsApp('');
        setEmail('');
        setBirthdate('');
        setFone('');
        setStreet('');
        setNumber('');
        setComplement('');
        setNeighborhood('');
        setCep('');
        setCity('');
        setCityState('');
        setPass('');
        setConfirmPass('');
        setBankNumber('');
        setAccountNumber('');
        setAgency('');
        setAccountType('');
        setFileDoc('');
        setFileAtv('');
        setFileRes('');
        setFileCnpj('');
        setCategoryName('');
        setBankName('');
        setAccountTypeViewName('');
    };

    const cepHandleChange = async e => {
        const cep = maskInput(e.target.value, '#####-###', true);
        setCep(cep);
        if (cep.length === 9) {
            setSearchingCep(true);
            try {
                const { data } = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
                setStreet(data.logradouro.toUpperCase());
                setNeighborhood(data.bairro.toUpperCase());
                setComplement(data.complemento.toUpperCase());
                setCity(data.localidade.toUpperCase());
                setCityState(data.uf.toUpperCase());
            } finally {
                setSearchingCep(false);
            }
        }
    };

    function handleFormToggle() {
        setFormToggle(!formToggle);
        typeOfRegistration === 'Simplificado' ? setTypeOfRegistration('Completo') : setTypeOfRegistration('Simplificado');
    }

    useEffect(() => fetch(setIsLoading, setIsError, setSuppliers), []);
    useEffect(() => fetchFantasia(setFantasias, setIsLoading, setIsError), []);
    useEffect(() => console.log("formToggle:", formToggle, "tipo:", typeOfRegistration, "step:", step, "whatsapp:", whatsApp, "fone:", fone), [step])

    if (isLoading)
        return (
            <div style={{ display: 'grid', marginTop: '15px' }}>
                <Spinner size="5rem" />
            </div>
        );
    if (isError) return <Error />;

    return (
        <div style={containerWithPadding}>
            <HeaderHome linkPath="/login" linkText="Tem cadastro? LOGIN" />

            {step === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                        <Illustration type="onlinePosts" size={220} />
                    </div>
                    <h1 style={{ fontFamily: 'Rubik', textTransform: 'uppercase', color: 'rgb(45, 156, 219)', textAlign: 'center', paddingTop: '30px', margin: '0' }}>Crie sua conta na Ziro</h1>

                    <label style={{ color: 'rgb(34, 34, 34)', marginTop: '10px' }}>Comece agora a fazer consultas no SERASA e evite fraudes e inadimplência. São 10 consultas gratuitas para começar!</label>

                    <label style={{ color: 'rgb(34, 34, 34)', marginTop: '10px' }}>Você também pode se cadastrar para criar links de pagamento e vender online via WhatsApp.</label>

                    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                        <p style={{ fontSize: '16px', fontWeight: 'bold', paddingTop: '30px', textAlign: 'center' }}>
                            Além do SERASA, deseja habilitar vendas online?{' '}
                            <TooltipHelp illustration="upgradePlan" illustrationSize={180} title={supportModalTitle} body={supportModalBody} iconColor="#2D9CDB" iconSize={18} supportButton={false} />
                        </p>
                        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingTop: '8px' }}>
                            <span style={{ fontSize: '16px', paddingRight: '10px' }}>Não</span>
                            <ToggleButton active={formToggle} onClick={handleFormToggle} size={20} />
                            <span style={{ fontSize: '16px', paddingLeft: '10px' }}>Sim</span>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', marginTop: '20px', opacity: '1' }}>
                        <Button type="button" cta="Criar conta" template="regular" click={() => setStep(step + 1)} />
                    </div>
                </div>
            ) : undefined}

            {typeOfRegistration === 'Simplificado' && step === 1 && formToggle === false && (
                <>
                    <p style={{ textAlign: 'center', fontSize: '1.6rem', color: 'rgb(34, 34, 34)', marginTop: '-10px', marginBottom: '10px' }}>
                        Preencha os dados abaixo e<br /> qualquer dúvida fale conosco.{' '}
                        <TooltipHelp
                            illustration="chatting"
                            illustrationSize={150}
                            title={supportModalTitleRegister}
                            body={supportModalBodyRegister}
                            iconColor="#2D9CDB"
                            iconSize={20}
                            supportButton
                        />
                    </p>

                    <GetCnpj cnpj={cnpj} setState={setState} baseCnpj={suppliers} setCnpjValid={setCnpjValid} validCnaes={validCnaes} customValidation={customValidation} />
                    <div style={{ marginTop: '-15px' }}>
                        <Form
                            buttonName="Cadastrar"
                            validations={validations}
                            sendToBackend={simplifiedRegistration ? simplifiedRegistration(state) : () => null}
                            inputs={[
                                <FormInput name="fname" label="Nome" input={<InputText value={fname} onChange={({ target: { value } }) => setFName(capitalize(value))} placeholder="Seu nome" />} />,
                                <FormInput name="lname" label="Sobrenome" input={<InputText value={lname} onChange={({ target: { value } }) => setLName(capitalize(value))} placeholder="Seu sobrenome" />} />,
                                <FormInput
                                    name="whatsApp"
                                    label="WhatsApp"
                                    input={
                                        // <InputText
                                        //     value={whatsApp}
                                        //     onChange={({ target: { value } }) => setWhatsApp(maskInput(value, '(##) #####-####', true))}
                                        //     placeholder='(11) 99999-9999'
                                        //     inputMode='numeric'
                                        // />
                                        <InputPhone value={whatsApp} setValue={setWhatsApp} />
                                    }
                                />,
                                <FormInput name="email" label="Email" input={<InputEmail value={email} setValue={setEmail} />} />,
                                <FormInput name="pass" label="Senha" input={<InputText value={pass} onChange={({ target: { value } }) => setPass(value)} placeholder="Mínimo 6 caracteres" type="password" />} />,
                                <FormInput
                                    name="confirmPass"
                                    label="Confirme a senha"
                                    input={<InputText value={confirmPass} onChange={({ target: { value } }) => setConfirmPass(value)} placeholder="Igual ao campo anterior" type="password" />}
                                />,
                                <FormInput name="cnpjValid" label="" input={<></>} />,
                            ]}
                        />
                    </div>
                    <div style={{ paddingTop: '15px' }}>
                        <Button type="button" cta="Voltar" template="light" click={() => setStep(step - 1)} />
                    </div>
                </>
            )}
            {typeOfRegistration === 'Completo' && step === 1 && formToggle === true && (
                <>
                    <p style={{ textAlign: 'center', fontSize: '1.6rem', color: 'rgb(34, 34, 34)', marginTop: '-10px', marginBottom: '10px' }}>
                        Preencha os dados abaixo e<br /> qualquer dúvida fale conosco.{' '}
                        <TooltipHelp
                            illustration="chatting"
                            illustrationSize={150}
                            title={supportModalTitleRegister}
                            body={supportModalBodyRegister}
                            iconColor="#2D9CDB"
                            iconSize={20}
                            supportButton
                        />
                    </p>

                    <div style={{ textAlign: 'center', padding: '0px 0px 20px' }}>
                        <label
                            style={{
                                fontFamily: fontTitle,
                                textTransform: 'uppercase',
                                fontWeight: 'bold',
                            }}
                        >
                            Dados básicos
            </label>
                    </div>

                    <GetCnpj cnpj={cnpj} setState={setState} baseCnpj={suppliers} setCnpjValid={setCnpjValid} validCnaes={validCnaes} customValidation={customValidation} />
                    <Form
                        buttonName="Avançar"
                        validations={validations}
                        sendToBackend={() => setStep(step + 1)}
                        inputs={[
                            <FormInput
                                name="reason"
                                label="Razão Social"
                                input={<InputText value={reason} onChange={({ target: { value } }) => setReason(value.toUpperCase())} placeholder="ALMEIDA MODAS LTDA" />}
                            />,
                            <FormInput
                                name="fantasia"
                                label="Nome Fantasia"
                                input={<InputText value={fantasia} onChange={({ target: { value } }) => setFantasia(value.toUpperCase())} placeholder="ATELIE DE ROUPAS" />}
                            />,
                            <FormInput
                                name="cep"
                                label="CEP"
                                input={<InputText value={cep} disabled={searchingCep} submitting={searchingCep} onChange={e => cepHandleChange(e)} placeholder="00000-111" inputMode="numeric" />}
                            />,
                            <FormInput name="street" label="Rua" input={<InputText value={street} onChange={({ target: { value } }) => setStreet(value.toUpperCase())} placeholder="R HERMELINO CARDOSO" />} />,
                            <FormInput
                                name="number"
                                label="Número"
                                input={<InputText value={number} onChange={({ target: { value } }) => setNumber(maskInput(value.toUpperCase(), '######', true))} placeholder="1283" inputMode="numeric" />}
                            />,
                            <FormInput
                                name="complement"
                                label="Complemento"
                                input={<InputText value={complement} onChange={({ target: { value } }) => setComplement(value.toUpperCase())} placeholder="BLOCO K" />}
                            />,
                            <FormInput
                                name="neighborhood"
                                label="Bairro"
                                input={<InputText value={neighborhood} onChange={({ target: { value } }) => setNeighborhood(value.toUpperCase())} placeholder="COHAB" />}
                            />,
                            <FormInput name="city" label="Cidade" input={<InputText value={city} onChange={({ target: { value } }) => setCity(value.toUpperCase())} placeholder="SÃO PAULO" />} />,
                            <FormInput
                                name="cityState"
                                label="Estado"
                                input={<InputText value={cityState} onChange={({ target: { value } }) => setCityState(maskInput(value.toUpperCase(), '##', false))} placeholder="SP" />}
                            />,
                            <FormInput name="fone" label="Telefone (opcional)" input={<InputPhone value={fone} setValue={setFone} />} />,
                            <FormInput
                                name="category"
                                label="Categoria"
                                input={
                                    <Dropdown
                                        value={categoryName}
                                        onChange={({ target: { value } }) => {
                                            setCategoryName(value);
                                            setCategory(allCategories[value]);
                                        }}
                                        onChangeKeyboard={element => {
                                            if (element) {
                                                setCategoryName(element.value);
                                                setCategory(allCategories[element.value]);
                                            }
                                        }}
                                        list={categoryList}
                                        placeholder="Vestuário"
                                    />
                                }
                            />,
                            <FormInput name="cnpjValid" label="" input={<></>} />,
                        ]}
                    />
                    <div style={{ paddingTop: '15px' }}>
                        <Button type="button" cta="Voltar" template="light" click={() => setStep(step - 1)} />
                    </div>
                </>
            )}
            {typeOfRegistration === 'Completo' && step === 2 && formToggle === true && (
                <>
                    <p style={{ textAlign: 'center', fontSize: '1.6rem', color: 'rgb(34, 34, 34)', marginTop: '-10px', marginBottom: '10px' }}>
                        Preencha os dados abaixo e<br /> qualquer dúvida fale conosco.{' '}
                        <TooltipHelp
                            illustration="chatting"
                            illustrationSize={150}
                            title={supportModalTitleRegister}
                            body={supportModalBodyRegister}
                            iconColor="#2D9CDB"
                            iconSize={20}
                            supportButton
                        />
                    </p>

                    <div style={{ textAlign: 'center', padding: '0px 0px 20px' }}>
                        <label
                            style={{
                                fontFamily: fontTitle,
                                textTransform: 'uppercase',
                                fontWeight: 'bold',
                            }}
                        >
                            Dados Pessoais
            </label>
                    </div>

                    <Form
                        buttonName="Avançar"
                        validations={validations}
                        sendToBackend={() => {
                            console.log(step);
                            setStep(step + 1);
                        }}
                        inputs={[
                            <FormInput name="fname" label="Nome" input={<InputText value={fname} onChange={({ target: { value } }) => setFName(capitalize(value))} placeholder="Seu nome" />} />,
                            <FormInput name="lname" label="Sobrenome" input={<InputText value={lname} onChange={({ target: { value } }) => setLName(capitalize(value))} placeholder="Seu sobrenome" />} />,
                            <FormInput
                                name="cpf"
                                label="CPF"
                                input={<InputText value={cpf} onChange={({ target: { value } }) => setCpf(maskInput(value, '###.###.###-##', true))} placeholder="000.000.000-00" inputMode="numeric" />}
                            />,
                            <FormInput
                                name="birthdate"
                                label="Data de Nascimento"
                                input={<InputText value={birthdate} onChange={({ target: { value } }) => setBirthdate(maskInput(value, '##/##/####', true))} placeholder="01/01/2000" inputMode="numeric" />}
                            />,
                            <FormInput
                                name="whatsApp"
                                label="WhatsApp"
                                input={
                                    // <InputText
                                    //     value={whatsApp}
                                    //     onChange={({ target: { value } }) => setWhatsApp(maskInput(value, '(##) #####-####', true))}
                                    //     placeholder='(11) 99999-9999'
                                    //     inputMode='numeric'
                                    // />
                                    <InputPhone value={whatsApp} setValue={setWhatsApp} />
                                }
                            />,
                            <FormInput name="email" label="Email" input={<InputEmail value={email} setValue={setEmail} />} />,
                            <FormInput name="pass" label="Senha" input={<InputText value={pass} onChange={({ target: { value } }) => setPass(value)} placeholder="Mínimo 6 caracteres" type="password" />} />,
                            <FormInput
                                name="confirmPass"
                                label="Confirme a senha"
                                input={<InputText value={confirmPass} onChange={({ target: { value } }) => setConfirmPass(value)} placeholder="Igual ao campo anterior" type="password" />}
                            />,
                        ]}
                    />
                    <div style={{ paddingTop: '15px' }}>
                        <Button type="button" cta="Voltar" template="light" click={() => setStep(step - 1)} />
                    </div>
                </>
            )}
            {typeOfRegistration === 'Completo' && step === 3 && formToggle === true && (
                <>
                    <p style={{ textAlign: 'center', fontSize: '1.6rem', color: 'rgb(34, 34, 34)', marginTop: '-10px', marginBottom: '10px' }}>
                        Preencha os dados abaixo e<br /> qualquer dúvida fale conosco.{' '}
                        <TooltipHelp illustration="chatting" illustrationSize={150} title={supportModalTitleRegister} body={supportModalBodyRegister} iconColor="#2D9CDB" iconSize={20} supportButton />
                    </p>

                    <div style={{ textAlign: 'center', padding: '0px 0px 20px' }}>
                        <label
                            style={{
                                fontFamily: fontTitle,
                                textTransform: 'uppercase',
                                fontWeight: 'bold',
                            }}
                        >
                            Documentos
            </label>
                    </div>

                    <Form
                        buttonName="Avançar"
                        validations={validations}
                        sendToBackend={() => {
                            console.log(step);
                            setStep(step + 1);
                        }}
                        inputs={[
                            <FormInput name="idDoc" label="" LabelComponent={<DocText />} input={<SingleImageUpload setFile={setFileDoc} persistFilename={fileDoc.name} indexOfFile={0} />} />,
                            <FormInput name="idAtv" label="" LabelComponent={<AtvdText />} input={<SingleImageUpload setFile={setFileAtv} persistFilename={fileAtv.name} indexOfFile={1} />} />,
                            <FormInput name="idRes" label="" LabelComponent={<HomeText />} input={<SingleImageUpload setFile={setFileRes} persistFilename={fileRes.name} indexOfFile={2} />} />,
                            <FormInput name="idCnpj" label="" LabelComponent={<CnpjText />} input={<SingleImageUpload setFile={setFileCnpj} persistFilename={fileCnpj.name} indexOfFile={3} />} />,
                        ]}
                    />
                    <div style={{ paddingTop: '15px' }}>
                        <Button type="button" cta="Voltar" template="light" click={() => setStep(step - 1)} />
                    </div>
                </>
            )}
            {typeOfRegistration === 'Completo' && step === 4 && formToggle === true && (
                <>
                    <p style={{ textAlign: 'center', fontSize: '1.6rem', color: 'rgb(34, 34, 34)', marginTop: '-10px', marginBottom: '10px' }}>
                        Preencha os dados abaixo e<br /> qualquer dúvida fale conosco.{' '}
                        <TooltipHelp illustration="chatting" title={supportModalTitleRegister} body={supportModalBodyRegister} iconColor="#2D9CDB" iconSize={20} supportButton />
                    </p>

                    <div style={{ textAlign: 'center', padding: '0px 0px 20px' }}>
                        <label
                            style={{
                                fontFamily: fontTitle,
                                textTransform: 'uppercase',
                                fontWeight: 'bold',
                            }}
                        >
                            Dados Bancários
            </label>
                    </div>

                    <Form
                        buttonName="Cadastrar"
                        validations={validations}
                        sendToBackend={completeRegistration ? completeRegistration(state) : () => null}
                        inputs={[
                            <FormInput
                                name="accountType"
                                label="Tipo da Conta"
                                input={
                                    <Dropdown
                                        value={accountTypeViewName}
                                        onChange={({ target: { value } }) => {
                                            setAccountTypeViewName(value);
                                            if (value === 'Conta Poupança') setAccountType('savings');
                                            else if (value === 'Conta Corrente') setAccountType('checking');
                                            else setAccountType('');
                                        }}
                                        onChangeKeyboard={element => {
                                            if (element) {
                                                setAccountTypeViewName(element.value);
                                                if (element.value === 'Conta Poupança') setAccountType('savings');
                                                else if (element.value === 'Conta Corrente') setAccountType('checking');
                                                else setAccountType('');
                                            }
                                        }}
                                        list={accountTypeList}
                                        placeholder="Corrente"
                                        readOnly={true}
                                    />
                                }
                            />,
                            <FormInput
                                name="bankNumber"
                                label="Banco"
                                input={
                                    <Dropdown
                                        value={bankName}
                                        onChange={({ target: { value } }) => {
                                            setBankName(value);
                                            if (value.indexOf(' - ')) {
                                                value.split(' - ')[0] ? setBankNumber(value.split(' - ')[0]) : null;
                                            }
                                        }}
                                        onChangeKeyboard={element => {
                                            if (element) {
                                                setBankName(element.value);
                                                if (element.value.indexOf(' - ')) {
                                                    element.value.split(' - ')[0] ? setBankNumber(element.value.split(' - ')[0]) : null;
                                                }
                                            }
                                        }}
                                        list={banksList}
                                        placeholder="Nubank"
                                    />
                                }
                            />,
                            <FormInput
                                name="agency"
                                label="Agência sem DV"
                                input={<InputText value={agency} onChange={({ target: { value } }) => setAgency(maskInput(value, '####', true))} placeholder="Ex.: 0001" inputMode="numeric" />}
                            />,
                            <FormInput
                                name="accountNumber"
                                label="Número da Conta com DV"
                                input={<InputText value={accountNumber} onChange={({ target: { value } }) => setAccountNumber(value)} placeholder="Ex.: 9472156-8" inputMode="numeric" />}
                            />,
                            <FormInput name="holderName" label="" LabelComponent={<HolderText />} input={<InputText value={reason} onChange={() => { }} disabled={true} />} />,
                            <FormInput name="cnpjValid" label="CNPJ" input={<InputText value={cnpj} onChange={() => { }} disabled={true} />} />,
                        ]}
                    />
                    <div style={{ paddingTop: '15px' }}>
                        <Button type="button" cta="Voltar" template="light" click={() => setStep(step - 1)} />
                    </div>
                </>
            )}
            {typeOfRegistration && step >= 1 && (
                <p style={{ textAlign: 'center', fontWeight: 'bold', paddingTop: '20px', fontSize: '15px' }}>
                    Página {step === 0 ? step + 1 : step} de {typeOfRegistration === 'Completo' ? 4 : 1}.
                </p>
            )}
        </div>
    );
};

export default memo(Register);
