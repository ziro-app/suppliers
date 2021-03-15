import React, { useState, useEffect, useContext } from 'react'
import { useLocation } from 'wouter'
import { container, fontTitle } from '@ziro/theme';
import Form from '@bit/vitorbarbosa19.ziro.form';
import FormInput from '@bit/vitorbarbosa19.ziro.form-input';
import Icon from '@bit/vitorbarbosa19.ziro.icon';
import InputText from '@bit/vitorbarbosa19.ziro.input-text';
import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown';
import Button from '@bit/vitorbarbosa19.ziro.button';
import TooltipHelp from '@bit/vitorbarbosa19.ziro.tooltip-help';
import Illustration from '@bit/vitorbarbosa19.ziro.illustration';
import maskInput from '@ziro/mask-input';
import SingleImageUpload from './SingleImageUpload/index';
import fetchFantasia from './fetchFantasia';
import fetch from './fetch';
import banksList from './banks';
import sendToBackend from './sendToBackend';
import { AtvdText, CnpjText, DocText, HomeText } from './modals';
import { userContext } from '../appContext';
import { getSteps } from './getSteps';
import { advantagesDiv, advantagesLabel, innerAdvantagesDiv, advantagesContainer } from './styles';
import validateDocuments from '../utils/validateDocuments';
import { allCategories } from '../utils/allCategories';

const supportNumber = require('./supportNumber');

function Upgrade() {
    const { zoopId, docId, cnpj, reason, userPos, typeRegister, fantasy } = useContext(userContext);

    // STATE - Categoria
    const [categoryName, setCategoryName] = useState('');
    const [category, setCategory] = useState('');
    const listImported = Object.keys(allCategories);

    // STATE - Dados Pessoais
    const [cpf, setCpf] = useState('');
    const [dayOfBirth, setDayOfBirth] = useState('');
    const [phone, setPhone] = useState('');

    // STATE - Documentos Pessoais
    const [idDoc, setIdDoc] = useState('');
    const [idAtv, setIdAtv] = useState('');
    const [idRes, setIdRes] = useState('');
    const [idCnpj, setIdCnpj] = useState('');

    // STATE - Dados Bancários
    const [accountType, setAccountType] = useState('');
    const [accountTypeViewName, setAccountTypeViewName] = useState('');
    const [bankName, setBankName] = useState('');
    const [bankNumber, setBankNumber] = useState('');
    const [agency, setAgency] = useState('');
    const [accountNumber, setAccountNumber] = useState('');

    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [suppliers, setSuppliers] = useState([]);
    const [fantasias, setFantasias] = useState([]);
    const [cnpjValid, setCnpjValid] = useState(false);

    const [, setLocation] = useLocation();

    const accountTypeList = ['Conta Corrente', 'Conta Poupança'];
    const cnpjUrl = process.env.CNPJ_URL || '';
    const cnpjToken = process.env.CNPJ_TOKEN || '';

    // Step - Renderização Condicional de Forms
    const [step, setStep] = useState(0);

    const state = { category, categoryName, cpf, dayOfBirth, phone, accountType, accountTypeViewName, bankName, bankNumber, agency, accountNumber, zoopId, docId, cnpj, reason, userPos, idDoc, idAtv, idRes, idCnpj, fantasia: fantasy };

    const setState = {
        setCategory, setCategoryName, setCpf, setDayOfBirth, setPhone, setIdDoc, setIdAtv, setIdRes, setIdCnpj, zoopId, setAccountType, setAccountTypeViewName, setBankName, setBankNumber, setAgency, setAccountNumber, cnpjUrl, cnpjToken
    };

    const validationsPersonalInfo = [
        {
            name: 'categoryName',
            validation: value => listImported.includes(value) ? true : false,
            value: categoryName,
            message: 'Campo obrigatório'
        },
        {
            name: 'cpf',
            validation: value => /(^\d{3}\.\d{3}\.\d{3}\-\d{2}$)/.test(value) && validateDocuments(value),
            value: cpf,
            message: 'CPF inválido'
        },
        {
            name: 'dayOfBirth',
            validation: value => (/^(?:(?:31(\/)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/.test(value)),
            value: dayOfBirth,
            message: 'Data inválida'
        },
        // {
        //   name: 'phone',
        //   validation: value => /(^\(\d{2}\) \d{5}\-\d{4}$)/.test(value),
        //   value: phone,
        //   message: 'Telefone inválido'
        // },
    ];

    const validationsBankAccountInfo = [
        {
            name: 'accountType',
            validation: value => ['savings', 'checking'].includes(value),
            value: accountType,
            message: 'Campo obrigatório'
        },
        {
            name: 'bankNumber',
            validation: value => banksList.includes(bankName),
            value: bankNumber,
            message: 'Campo obrigatório'
        },
        {
            name: 'agency',
            validation: value => value ? true : false,
            value: agency,
            message: 'Campo obrigatório'
        },
        {
            name: 'accountNumber',
            validation: value => value ? true : false,
            value: accountNumber,
            message: 'Campo obrigatório'
        },
    ];

    const validationsDocuments = [
        {
            name: 'idDoc',
            validation: value => /(\.jpg|\.jpeg|\.png|\.pdf)$/.test(value.name),
            value: idDoc,
            message: 'Formatos válidos: .png, .jpg, .jpeg e .pdf'
        },
        {
            name: 'idAtv',
            validation: value => /(\.jpg|\.jpeg|\.png|\.pdf)$/.test(value.name),
            value: idAtv,
            message: 'Formatos válidos: .png, .jpg, .jpeg e .pdf'
        },
        {
            name: 'idRes',
            validation: value => /(\.jpg|\.jpeg|\.png|\.pdf)$/.test(value.name),
            value: idRes,
            message: 'Formatos válidos: .png, .jpg, .jpeg e .pdf'
        },
        {
            name: 'idCnpj',
            validation: value => /(\.jpg|\.jpeg|\.png|\.pdf)$/.test(value.name),
            value: idCnpj,
            message: 'Formatos válidos: .png, .jpg, .jpeg e .pdf'
        },
    ];

    useEffect(() => fetch(setIsLoading, setIsError, setSuppliers), []);
    useEffect(() => fetchFantasia(setFantasias, setIsLoading, setIsError), []);

    const backend = sendToBackend ? sendToBackend(state) : () => console.log("Erro ao enviar para o backend.");

    const supportModalTitle = (
        <div>
            <p style={{ color: '#323232' }}>Precisa de suporte?</p>
        </div>
    );

    const supportModalBody = (
        <div>
            <p style={{ paddingTop: '0px', paddingBottom: '10px' }}>Qualquer dúvida acerca do cadastro, basta falar conosco via WhatsApp que vamos te ajudar!</p>
        </div>
    );

    return (
        <div style={container}>
            {typeRegister === "Completo" ?
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <Illustration type="paymentSuccess" size={200} />
                    <h1 style={{ fontFamily: 'Rubik', textTransform: 'uppercase', color: 'rgb(45, 156, 219)', textAlign: 'center' }}>UPGRADE FOI REALIZADO</h1>

                    <label style={{ textAlign: 'center', fontSize: '1.6rem', color: 'rgb(34, 34, 34)', marginTop: '10px' }}>
                        O upgrade foi realizado na sua conta e você já pode gerar links para vender online.
          </label>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', marginTop: '20px', opacity: '1' }}>
                        <Button
                            type='link'
                            cta='Começar'
                            template='regular'
                            navigate={() => {
                                setLocation('/criar-cobranca')
                            }}
                        />
                    </div>
                </div>
                : undefined}

            {typeRegister === "Simplificado" && step === 0 ?
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <Illustration type="upgradePlan" size={180} />
                    <h1 style={{ fontFamily: 'Rubik', fontSize: '16px', textTransform: 'uppercase', color: '#323232', textAlign: 'center' }}>Deseja fazer upgrade gratuito?</h1>

                    <label style={{ textAlign: 'center', fontSize: '1.6rem', color: 'rgb(34, 34, 34)', marginTop: '-5px' }}>
                        O upgrade permite a você criar links de pagamento para vender online. Veja as vantagens:
          </label>

                    <div style={advantagesContainer}>
                        <div style={advantagesDiv}>
                            <div style={innerAdvantagesDiv}>
                                <Icon type='whats' size={15} strokeWidth={2} style={{ background: 'white' }} />
                            </div>
                            <label style={advantagesLabel}>Links compartilháveis via WhatsApp;</label>
                        </div>

                        <div style={advantagesDiv}>
                            <div style={innerAdvantagesDiv}>
                                <Icon type='check' size={15} strokeWidth={2} style={{ background: 'white' }} />
                            </div>
                            <label style={advantagesLabel}>Transação aprovada em tempo real;</label>
                        </div>

                        <div style={advantagesDiv}>
                            <div style={innerAdvantagesDiv}>
                                <Icon type='lock' size={15} strokeWidth={2} style={{ background: 'white' }} />
                            </div>
                            <label style={advantagesLabel}>Seguro integral contra fraudes;</label>
                        </div>

                        <div style={advantagesDiv}>
                            <div style={innerAdvantagesDiv}>
                                <Icon type='card' size={15} strokeWidth={2} style={{ background: 'white' }} />
                            </div>
                            <label style={advantagesLabel}>Antecipação de recebíveis D+14;</label>
                        </div>

                        <div style={advantagesDiv}>
                            <div style={innerAdvantagesDiv}>
                                <Icon type='money' size={15} strokeWidth={2} style={{ background: 'white' }} />
                            </div>
                            <label style={advantagesLabel}>Seu dinheiro cai direto na sua conta sem passar por nós.</label>
                        </div>
                    </div>

                    <div style={{ display: 'grid', width: '100%', marginTop: '20px', opacity: '1', gap: '10px' }}>
                        <Button
                            type='button'
                            cta='Fazer upgrade gratuito'
                            template='regular'
                            click={() => setStep(step + 1)}
                        />

                        <Button
                            type='button'
                            cta='Falar com vendas'
                            template='light'
                            click={() => window.open(`https://api.whatsapp.com/send?phone=${supportNumber.supportPhoneNumber.replace(/\+|\s|\(|\)|-/g, "")}`, "_blank")}
                        />
                    </div>
                </div>
                : undefined}

            {typeRegister === "Simplificado" && step === 1 &&
                <>
                    <p style={{ textAlign: 'center', fontSize: '1.6rem', color: 'rgb(34, 34, 34)', marginTop: '-10px' }}>Preencha os dados abaixo e<br /> qualquer dúvida fale conosco. <TooltipHelp illustration='chatting' title={supportModalTitle} body={supportModalBody} iconColor='#2D9CDB' iconSize={20} supportButton /></p>

                    <div style={{ textAlign: 'center', padding: '20px 0px 15px' }}>
                        <label style={{
                            fontFamily: fontTitle,
                            textTransform: 'uppercase',
                            fontWeight: 'bold'
                        }}>Dados básicos</label>
                    </div>
                    <Form
                        buttonName="Avançar"
                        validations={validationsPersonalInfo}
                        sendToBackend={() => setStep(step + 1)}
                        inputs={[
                            <FormInput
                                name="cpf"
                                label="CPF"
                                input={
                                    <InputText
                                        value={cpf}
                                        onChange={({ target: { value } }) => setCpf(maskInput(value, '###.###.###-##', true))}
                                        placeholder='000.000.000-00'
                                        inputMode="numeric"
                                    />
                                }
                            />,
                            <FormInput
                                name="dayOfBirth"
                                label="Data de Nascimento"
                                input={
                                    <InputText
                                        value={dayOfBirth}
                                        onChange={({ target: { value } }) => setDayOfBirth(maskInput(value, '##/##/####', true))}
                                        placeholder="01/01/1990"
                                        inputMode="numeric"
                                    />
                                }
                            />,
                            // <FormInput
                            //   name="phone"
                            //   label="Telefone"
                            //   input={
                            //     <InputText
                            //       value={phone}
                            //       onChange={({ target: { value }}) => setPhone(maskInput(value, '(##) #####-####', true))}
                            //       placeholder='(11) 99999-9999'
                            //       inputMode='numeric'
                            //     />
                            //   }
                            // />,
                            <FormInput
                                name="categoryName"
                                label="Categoria do negócio"
                                input={
                                    <Dropdown
                                        value={categoryName}
                                        onChange={({ target: { value } }) => {
                                            setCategoryName(value)
                                            setCategory(allCategories[value])
                                        }}
                                        onChangeKeyboard={element => {
                                            if (element) {
                                                setCategoryName(element.value)
                                                setCategory(allCategories[element.value])
                                            }
                                        }}
                                        list={listImported}
                                        placeholder="Vestuário"
                                        readOnly={true}
                                    />
                                }
                            />,
                        ]}
                    />
                    <div style={{ paddingTop: '15px' }} >
                        <Button
                            type="button"
                            cta="Voltar"
                            template="light"
                            click={() => setStep(step - 1)}
                        />
                    </div>
                </>
            }
            {step === 2 &&
                <>
                    <p style={{ textAlign: 'center', fontSize: '1.6rem', color: 'rgb(34, 34, 34)', marginTop: '-10px' }}>Preencha os dados abaixo e<br /> qualquer dúvida fale conosco. <TooltipHelp illustration='chatting' title={supportModalTitle} body={supportModalBody} iconColor='#2D9CDB' iconSize={20} supportButton /></p>

                    <div style={{ textAlign: 'center', padding: '20px 0px 15px' }}>
                        <label style={{
                            fontFamily: fontTitle,
                            textTransform: 'uppercase',
                            fontWeight: 'bold'
                        }}>Dados bancários</label>
                    </div>

                    <Form
                        buttonName="Avançar"
                        validations={validationsBankAccountInfo}
                        sendToBackend={() => setStep(step + 1)}
                        inputs={[
                            <FormInput
                                name="accountType"
                                label="Tipo da Conta"
                                input={
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
                                }
                            />,
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
                            }
                            />,
                            <FormInput name='agency' label='Agência sem DV' input={
                                <InputText
                                    value={agency}
                                    onChange={({ target: { value } }) => setAgency(maskInput(value, '####', true))}
                                    placeholder='Ex.: 0001'
                                    inputMode='numeric'
                                />
                            }
                            />,
                            <FormInput name='accountNumber' label='Número da Conta com DV' input={
                                <InputText
                                    value={accountNumber}
                                    onChange={({ target: { value } }) => setAccountNumber(value)}
                                    placeholder='Ex.: 9472156-8'
                                    inputMode='numeric'
                                />
                            }
                            />,
                        ]}
                    />
                    <div style={{ paddingTop: '15px' }} >
                        <Button
                            type="button"
                            cta="Voltar"
                            template="light"
                            click={() => setStep(step - 1)}
                        />
                    </div>
                </>
            }
            {step === 3 &&
                <>
                    <p style={{ textAlign: 'center', fontSize: '1.6rem', color: 'rgb(34, 34, 34)', marginTop: '-10px' }}>Preencha os dados abaixo e<br /> qualquer dúvida fale conosco. <TooltipHelp illustration='chatting' title={supportModalTitle} body={supportModalBody} iconColor='#2D9CDB' iconSize={20} supportButton /></p>

                    <div style={{ textAlign: 'center', padding: '20px 0px 15px' }}>
                        <label style={{
                            fontFamily: fontTitle,
                            textTransform: 'uppercase',
                            fontWeight: 'bold'
                        }}>Documentos</label>
                    </div>

                    <Form
                        buttonName="Finalizar"
                        buttonOnTop={false}
                        validations={validationsDocuments}
                        sendToBackend={backend}
                        inputs={[
                            <FormInput name='idDoc' label='' LabelComponent={<DocText />} input={
                                <SingleImageUpload
                                    setFile={setIdDoc}
                                    persistFilename={idDoc.name}
                                    indexOfFile={0}
                                />
                            } />,
                            <FormInput name='idAtv' label='' LabelComponent={<AtvdText />} input={
                                <SingleImageUpload
                                    setFile={setIdAtv}
                                    persistFilename={idAtv.name}
                                    indexOfFile={1}
                                />
                            } />,
                            <FormInput name='idRes' label='' LabelComponent={<HomeText />} input={
                                <SingleImageUpload
                                    setFile={setIdRes}
                                    persistFilename={idRes.name}
                                    indexOfFile={2}
                                />
                            } />,
                            <FormInput name='idCnpj' label='' LabelComponent={<CnpjText />} input={
                                <SingleImageUpload
                                    setFile={setIdCnpj}
                                    persistFilename={idCnpj.name}
                                    indexOfFile={3}
                                />
                            } />
                        ]}
                    />
                    <div style={{ paddingTop: '15px' }} >
                        <Button
                            type="button"
                            cta="Voltar"
                            template="light"
                            click={() => setStep(step - 1)}
                        />
                    </div>
                </>
            }
            {typeRegister === "Simplificado" && step !== 0 ? <p style={{ textAlign: "center", fontWeight: "bold", paddingTop: "20px", fontSize: "15px" }}>Página
      {getSteps(step)} de {3}.</p> : undefined}
        </div>
    )
}

export default Upgrade;
