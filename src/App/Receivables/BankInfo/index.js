import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { createBrowserHistory } from 'history';
import Form from '@bit/vitorbarbosa19.ziro.form';
import FormInput from '@bit/vitorbarbosa19.ziro.form-input';
import InputText from '@bit/vitorbarbosa19.ziro.input-text';
import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown';
import Details from '@bit/vitorbarbosa19.ziro.details';
import Header from '@bit/vitorbarbosa19.ziro.header';
import Error from '@bit/vitorbarbosa19.ziro.error';
import Button from '@bit/vitorbarbosa19.ziro.button';
import Spinner from '@bit/vitorbarbosa19.ziro.spinner';
import { containerWithPadding } from '@ziro/theme';
import { userContext } from '../../appContext';
import banksList from '../../Register/banks';

const BankInfo = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [blocks, setBlocks] = useState([]);
    const [, setLocation] = useLocation();
    const history = createBrowserHistory();
    const { zoopId, codBank, holderName, accountType, accountNumber, agency } = useContext(userContext);
    const setState = { setIsLoading, setBlocks };

    useEffect(() => {
        let bank = banksList.find(bank => bank.split(' - ')[0] == codBank);
        let bankName = bank ? bank.split(' - ')[1] : '';
        setBlocks(
            [
                {
                    header: 'Conta Atual',
                    body: [
                        {
                            title: 'Titular',
                            content: holderName
                        },
                        {
                            title: 'Banco',
                            content: bankName
                        },
                        {
                            title: 'Agência',
                            content: agency
                        },
                        {
                            title: 'Conta',
                            content: accountNumber
                        },
                        {
                            title: 'Tipo',
                            content: accountType
                        }
                    ]
                }
            ]
        );
        setIsLoading(false);
    }, []);

    if (isLoading)
        return (
            <div style={{ display: 'grid', justifyItems: 'center' }}>
                <Spinner size="5.5rem" />
            </div>
        );

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={containerWithPadding}>
            <Header type="icon-link" title="Dados Bancários" navigateTo="recebiveis" icon="back" />
            <div style={{ display: 'grid', gridRowGap: '20px' }}>

                <Details blocks={blocks} />

            </div>
        </motion.div>
    );
};

export default BankInfo;

/*

const [holderName, setHolderName] = useState('')
    const [bankName, setBankName] = useState('')
    const [bankNumber, setBankNumber] = useState('')
    const [agency, setAgency] = useState('')
    const [accountNumber, setAccountNumber] = useState('')
    const [accountTypeViewName, setAccountTypeViewName] = useState('')
    const [accountType, setAccountType] = useState('')
    const accountTypeList = ['Conta Corrente', 'Conta Poupança']
    const validations = [
        {
            name: 'bankNumber',
            validation: value => banksList.includes(bankName),
            value: bankNumber,
            message: 'Campo obrigatório'
        }, {
            name: 'agency',
            validation: value => !!value,
            value: agency,
            message: 'Campo obrigatório'
        }, {
            name: 'accountNumber',
            validation: value => !!value,
            value: accountNumber,
            message: 'Campo obrigatório'
        }, {
            name: 'accountType',
            validation: value => ['savings', 'checking'].includes(value),
            value: accountType,
            message: 'Campo obrigatório'
        }
    ];

<Form
                    validations={validations}
                    sendToBackend={() => null}
                    inputs={[
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
                        <FormInput name='agency' label='Agência sem DV' input={
                            <InputText
                                value={agency}
                                onChange={({ target: { value } }) => setAgency(maskInput(value, '####', true))}
                                placeholder='Ex.: 0001'
                                inputMode='numeric'
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
                        <FormInput name='holderName' label='Titular' input={
                            <InputText
                                value={}
                                onChange={() => { }}
                                disabled={true}
                            />
                        } />
                    ]}
                />

*/
