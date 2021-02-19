import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'wouter'
import { motion } from 'framer-motion';
import { post } from 'axios';
import { createBrowserHistory } from 'history';
import Button from '@bit/vitorbarbosa19.ziro.button';
import Form from '@bit/vitorbarbosa19.ziro.form';
import FormInput from '@bit/vitorbarbosa19.ziro.form-input';
import Illustration from '@bit/vitorbarbosa19.ziro.illustration';
import InputText from '@bit/vitorbarbosa19.ziro.input-text';
import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown';
import Details from '@bit/vitorbarbosa19.ziro.details';
import Header from '@bit/vitorbarbosa19.ziro.header';
import Spinner from '@bit/vitorbarbosa19.ziro.spinner';
import { useMessage, useMessagePromise } from '@bit/vitorbarbosa19.ziro.message-modal';
import { ZiroPromptMessage, ZiroWaitingMessage } from "ziro-messages";
import { containerWithPadding, container, fontBody } from '@ziro/theme';
import maskInput from '@ziro/mask-input';
import { userContext } from '../appContext';
import banksList from '../Register/banks';
import { db } from '../../Firebase/index';
import sendToBackend from './sendToBackend';
import mountBankInfo from './mountBankInfo';
import { dot, headerStyle, infoBlock } from './styles';

const BankInfo = () => {
    const { zoopId, userPos, docId, cnpj, codBank, holderName, accountType, accountNumber, agency, payoutAutomatic, typeRegister } = useContext(userContext);
    const [activate, setActivate] = useState((payoutAutomatic != undefined && payoutAutomatic != null && payoutAutomatic === false) ? false : true);
    const [isLoading, setIsLoading] = useState(true);
    const [blocks, setBlocks] = useState([]);
    const [bankName, setBankName] = useState('');
    const [bankNumber, setBankNumber] = useState('');
    const [newAgency, setNewAgency] = useState('');
    const [newAccountNumber, setNewAccountNumber] = useState('');
    const [accountTypeViewName, setAccountTypeViewName] = useState('');
    const [newAccountType, setNewAccountType] = useState('');
    const [backRoute, setBackRoute] = useState('');
    const history = createBrowserHistory();
    const accountTypeList = ['Conta Corrente', 'Conta Poupança'];
    const setPromiseMessage = useMessagePromise();
    const setMessage = useMessage();
	const [, setLocation] = useLocation();
    const setState = {
        setIsLoading, setBlocks, setBankName, setBankNumber,
        setNewAgency, setNewAccountNumber, setAccountTypeViewName, setNewAccountType
    };
    const state = {
        holderName, bankName, bankNumber, newAgency, newAccountNumber,
        accountTypeViewName, newAccountType, zoopId, userPos, docId, cnpj, ...setState
    };
    const validations = [
        {
            name: 'bankNumber',
            validation: value => banksList.includes(bankName),
            value: bankNumber,
            message: 'Campo obrigatório'
        }, {
            name: 'agency',
            validation: value => !!value,
            value: newAgency,
            message: 'Campo obrigatório'
        }, {
            name: 'accountNumber',
            validation: value => !!value,
            value: newAccountNumber,
            message: 'Campo obrigatório'
        }, {
            name: 'accountType',
            validation: value => ['savings', 'checking'].includes(value),
            value: newAccountType,
            message: 'Campo obrigatório'
        }
    ];

    const PromptMessage = new ZiroPromptMessage({
        name: "promptReceivingPolicy",
        type: "neutral",
        code: "201",
        title: "Política de recebimento",
        userDescription: `Seu recebimento passará de ${activate ? 'depósito automático' : 'resgate manual'} para ${!activate ? 'depósito automático' : 'resgate manual'}.`,
        userResolution: "Deseja continuar?",
        internalDescription: "prompt política de recebimento",
        illustration: "profileData",
        additionalData: undefined,
    });
    const WaitingMessage = new ZiroWaitingMessage({
        name: "waitingReceivingPolicy",
        type: "neutral",
        code: "202",
        title: "Política de recebimento",
        userDescription: "Efetuando a mudança. Aguarde enquanto finalizamos.",
        internalDescription: "waiting política de recebimento",
        illustration: "waiting",
        additionalData: undefined,
    });

    const SuccessMessage = new ZiroPromptMessage({
        name: "successReceivingPolicy",
        type: "success",
        code: "203",
        title: "Sucesso",
        userDescription: !activate ? "Agora você receberá depósitos automáticos em sua conta bancária." : "Agora você precisará fazer resgates manuais para receber seu dinheiro.",
        userResolution: "Clique em ok para sair.",
        internalDescription: "prompt de sucesso",
        illustration: "paymentSuccess",
        additionalData: undefined,
    });

    const FailureMessage = new ZiroPromptMessage({
        name: "failureReceivingPolicy",
        type: "destructive",
        code: "204",
        title: "Falha",
        userDescription: "Falha ao atualizar de política de recebimento, tente novamente.",
        userResolution: "Clique em ok para sair.",
        internalDescription: "prompt de falha",
        illustration: "errorLoading",
        additionalData: undefined,
    });

    const asyncClick = async () => {
        try {
            await setPromiseMessage(PromptMessage);
            const promise = new Promise(async (resolve) => {
                try {
                    const url = `${process.env.PAY_URL}receiving-policy-update?seller_id=${zoopId}`;
                    const config = {
                        headers: {
                            'Content-type': 'application/json',
                            Authorization: process.env.PAY_TOKEN,
                        },
                    };
                    let body;
                    if (activate) {
                        // Desativando recebimento automático
                        body = {
                            transfer_enabled: false,
                            minimum_transfer_value: "100.0000"
                        }
                    } else {
                        // Ativando recebimento automático
                        body = {
                            transfer_enabled: true,
                            minimum_transfer_value: "100.0000",
                            transfer_interval: "daily"
                        }
                    }
                    await post(url, body, config);
                    await db.collection('suppliers').doc(docId).update({ payoutAutomatic: !activate });
                    resolve('Ok');
                } catch (error) {
                    resolve(null);
                }
            });
            setMessage(WaitingMessage.withPromise(promise));
            const result = await promise;
            setMessage(result ? SuccessMessage : FailureMessage);
            setActivate(result ? !activate : activate);
        } catch (error) { }
    };
    const bankData = { codBank, holderName, accountType, accountNumber, agency, activate, asyncClick };

    useEffect(() => {
        const { state } = history.location;
        const backRouteEffect = state && state.backRoute ? state.backRoute : '';
        setBackRoute(backRouteEffect);
        mountBankInfo(setIsLoading, setBlocks, bankData);
    }, [codBank, holderName, accountType, accountNumber, agency, activate]);

    if (isLoading)
        return (
            <div style={{ display: 'grid', justifyItems: 'center' }}>
                <Spinner size="5.5rem" />
            </div>
        );

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={container}>
            {/* <Header type="icon" title="Dados Bancários" setIsOpen={backRoute && !activate ? () => history.push('/recebiveis/resgate') : () => history.push('/recebiveis')} icon="back" /> */}
            {typeRegister === 'Completo' ? 
                <div style={{ display: 'grid', gridRowGap: '25px' }}>
                    <Details blocks={blocks} />

                    <div style={infoBlock}>
                        <label style={headerStyle}>Receber em outra conta
                        <label style={dot}>&nbsp;.</label>
                        </label>
                    </div>

                    <Form
                        validations={validations}
                        sendToBackend={sendToBackend ? sendToBackend(state) : () => null}
                        inputs={[
                            <FormInput name='newHolderName' label='Titular' input={
                                <InputText
                                    value={holderName}
                                    onChange={() => null}
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
                            <FormInput name='agency' label='Agência sem DV' input={
                                <InputText
                                    value={newAgency}
                                    onChange={({ target: { value } }) => setNewAgency(maskInput(value, '####', true))}
                                    placeholder='Ex.: 0001'
                                    inputMode='numeric'
                                />
                            } />,
                            <FormInput name='accountNumber' label='Número da Conta com DV' input={
                                <InputText
                                    value={newAccountNumber}
                                    onChange={({ target: { value } }) => setNewAccountNumber(value)}
                                    placeholder='Ex.: 9472156-8'
                                    inputMode='numeric'
                                />
                            } />,
                            <FormInput name='accountType' label='Tipo da Conta' input={
                                <Dropdown
                                    value={accountTypeViewName}
                                    onChange={({ target: { value } }) => {
                                        setAccountTypeViewName(value)
                                        if (value === 'Conta Poupança') setNewAccountType('savings')
                                        else if (value === 'Conta Corrente') setNewAccountType('checking')
                                        else setNewAccountType('')
                                    }}
                                    onChangeKeyboard={element => {
                                        if (element) {
                                            setAccountTypeViewName(element.value)
                                            if (element.value === 'Conta Poupança') setNewAccountType('savings')
                                            else if (element.value === 'Conta Corrente') setNewAccountType('checking')
                                            else setNewAccountType('')
                                        }
                                    }}
                                    list={accountTypeList}
                                    placeholder="Corrente"
                                    readOnly={true}
                                />
                            } />
                        ]}
                    />

                </div>
                :
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '25px' }}>
                    <Illustration type="upgradePlan" size={200} />
                    <label style={{ fontFamily: fontBody, textAlign: 'center' }}>Você não possui dados bancários pois não está habilitado a transacionar. Habilite agora!</label>
                    <Button
                        type='link'
                        cta='Fazer upgrade'
                        template='regular'
                        navigate={() => { setLocation('/upgrade') }}
                    />
                </div>
            }
        </motion.div>
    );
};

export default BankInfo;
