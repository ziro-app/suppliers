import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import Form from '@bit/vitorbarbosa19.ziro.form';
import FormInput from '@bit/vitorbarbosa19.ziro.form-input';
import InputText from '@bit/vitorbarbosa19.ziro.input-text';
import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown';
import Details from '@bit/vitorbarbosa19.ziro.details';
import Header from '@bit/vitorbarbosa19.ziro.header';
import Spinner from '@bit/vitorbarbosa19.ziro.spinner';
import { containerWithPadding } from '@ziro/theme';
import maskInput from '@ziro/mask-input';
import { userContext } from '../../appContext';
import banksList from '../../Register/banks';
import sendToBackend from './sendToBackend';
import mountBankInfo from './mountBankInfo';
import { dot, headerStyle, infoBlock } from './styles';

const BankInfo = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [blocks, setBlocks] = useState([]);
    const [bankName, setBankName] = useState('')
    const [bankNumber, setBankNumber] = useState('')
    const [newAgency, setNewAgency] = useState('')
    const [newAccountNumber, setNewAccountNumber] = useState('')
    const [accountTypeViewName, setAccountTypeViewName] = useState('')
    const [newAccountType, setNewAccountType] = useState('')
    const accountTypeList = ['Conta Corrente', 'Conta Poupança']
    const { zoopId, userPos, docId, cnpj, codBank, holderName, accountType, accountNumber, agency } = useContext(userContext);
    const bankData = { codBank, holderName, accountType, accountNumber, agency };
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

    useEffect(() => mountBankInfo(setIsLoading, setBlocks, bankData), [codBank, holderName, accountType, accountNumber, agency]);

    if (isLoading)
        return (
            <div style={{ display: 'grid', justifyItems: 'center' }}>
                <Spinner size="5.5rem" />
            </div>
        );

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={containerWithPadding}>
            <Header type="icon-link" title="Dados Bancários" navigateTo="recebiveis" icon="back" />
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
                                        if (element.value === 'Conta Poupança') setAccountType('savings')
                                        else if (element.value === 'Conta Corrente') setAccountType('checking')
                                        else setAccountType('')
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
        </motion.div>
    );
};

export default BankInfo;
