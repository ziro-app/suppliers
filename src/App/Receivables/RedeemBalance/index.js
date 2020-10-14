import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { createBrowserHistory } from 'history';
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
    const { zoopId, zoopBankAccountId, codBank, holderName, accountType, accountNumber, agency } = useContext(userContext);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [currentBalance, setCurrentBalance] = useState('');
    const [redeemBalance, setRedeemBalance] = useState('');
    const [blocks, setBlocks] = useState([]);
    const history = createBrowserHistory();
    const setState = { setCurrentBalance, setRedeemBalance, setBlocks };
    const state = { zoopId, zoopBankAccountId, codBank, holderName, accountType, accountNumber, agency, currentBalance, redeemBalance, blocks, ...setState };

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
            <div style={{ display: 'grid', gridRowGap: '35px' }}>
                <div style={{ display: 'grid', gridRowGap: '15px' }}>
                    <Details blocks={blocks} />
                    <Button cta="Trocar conta" style={btn} navigate={() => history.push('/recebiveis/dados-bancarios', { backRoute: '/recebiveis/resgate' })} type="link" />
                </div>

                <div style={{ display: 'grid', gridRowGap: '15px' }}>
                    <div style={info}>
                        <label style={titleStyle}>SALDO DISPONÍVEL</label>
                        <label style={contentStyle}>{currentBalance ? currencyFormat(round(currentBalance, 2).toFixed(2).replace('.', '')) : 'R$ 0,00'}</label>
                    </div>

                    <Form
                        buttonName="Efetuar saque"
                        buttonOnTop
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
            </div>
        </motion.div>
    );
};

export default RedeemBalance;
