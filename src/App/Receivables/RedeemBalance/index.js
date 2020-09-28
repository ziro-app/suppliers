import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import Form from '@bit/vitorbarbosa19.ziro.form';
import FormInput from '@bit/vitorbarbosa19.ziro.form-input';
import InputMoney from '@bit/vitorbarbosa19.ziro.input-money';
import Header from '@bit/vitorbarbosa19.ziro.header';
import Spinner from '@bit/vitorbarbosa19.ziro.spinner';
import Error from '@bit/vitorbarbosa19.ziro.error';
import Details from '@bit/vitorbarbosa19.ziro.details';
import Button from '@bit/vitorbarbosa19.ziro.button';
import { containerWithPadding } from '@ziro/theme';
import currencyFormat from '@ziro/currency-format';
import { userContext } from '../../appContext';
import { round } from '../../Transactions/utils';
import sendToBackend from './sendToBackend';
import fetch from './fetch';
import { btn, info, titleStyle, contentStyle } from '../styles';

const RedeemBalance = () => {
    const { zoopId, accountId, codBank, holderName, accountType, accountNumber, agency } = useContext(userContext);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [currentBalance, setCurrentBalance] = useState('');
    const [unformattedCurrent, setUnformattedCurrent] = useState('');
    const [redeemBalance, setRedeemBalance] = useState('');
    const [blocks, setBlocks] = useState([]);
    const setState = { setCurrentBalance, setRedeemBalance, setUnformattedCurrent, setBlocks };
    const state = { zoopId, accountId, codBank, holderName, accountType, accountNumber, agency, currentBalance, unformattedCurrent, redeemBalance, blocks, ...setState };

    const validations = [
        {
            name: 'redeemBalance',
            validation: value => parseFloat(value) / 100 >= 100 && parseFloat(value) / 100 <= parseFloat(currentBalance),
            value: redeemBalance,
            message: parseFloat(redeemBalance) / 100 < 100 ? 'Saque mínimo é de R$100,00' : 'Saque não pode ultrapassar o valor do seu saldo'
        }
    ];

    useEffect(() => fetch(setIsLoading, setIsError, state), [zoopId]);

    if (isLoading)
        return (
            <div style={{ display: 'grid', justifyItems: 'center' }}>
                <Spinner size="5.5rem" />
            </div>
        );

    if (isError) return <Error />;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={containerWithPadding}>
            <Header type="icon-link" title="Resgatar saldo" navigateTo="recebiveis" icon="back" />
            <div style={{ display: 'grid', gridRowGap: '25px' }}>
                <Details blocks={blocks} />

                <div style={info}>
                    <label style={titleStyle}>SALDO DISPONÍVEL</label>
                    <label style={contentStyle}>{currentBalance ? currencyFormat(round(currentBalance, 2).toFixed(2).replace('.', '')) : 'R$ 0,00'}</label>
                </div>

                <Button cta="Saque total" style={btn} click={() => setRedeemBalance(unformattedCurrent)} type="button" />

                <Form
                    validations={validations}
                    sendToBackend={sendToBackend ? sendToBackend(state) : () => null}
                    inputs={[
                        <FormInput name='redeemBalance' label='Valor do saque' input={
                            <InputMoney
                                value={redeemBalance}
                                setValue={setRedeemBalance}
                            />
                        } />
                    ]}
                />

            </div>
        </motion.div>
    );
};

export default RedeemBalance;
