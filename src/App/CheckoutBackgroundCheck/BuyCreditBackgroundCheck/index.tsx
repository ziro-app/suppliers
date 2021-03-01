import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useRoute } from 'wouter';
import { motion } from 'framer-motion';
import Form from '@bit/vitorbarbosa19.ziro.form';
import FormInput from '@bit/vitorbarbosa19.ziro.form-input';
import InputText from '@bit/vitorbarbosa19.ziro.input-text';
import InputValue from '@bit/vitorbarbosa19.ziro.input-text';
import CreditCard from './components/CreditCard';
import Spinner from '@bit/vitorbarbosa19.ziro.spinner';
import Error from '@bit/vitorbarbosa19.ziro.error';
import Button from '@bit/vitorbarbosa19.ziro.button';
import Illustration from '@bit/vitorbarbosa19.ziro.illustration';
import { userContext } from '../../appContext';
import fetch from './fetch';
import sendToBackend from './sendToBackend';
import { alertColor } from '@ziro/theme';
import { useCreditCard } from './hooks/useCreditCard';
import { dual } from './styles';
import { useMessage, useMessagePromise } from '@bit/vitorbarbosa19.ziro.message-modal';
import { ZiroPromptMessage, ZiroWaitingMessage } from 'ziro-messages';
//import ChooseCard from './ChooseCard';
import { db } from '../../../Firebase/index';
import createTransaction from './utils/createTransaction';
import prepareDataToPay from './utils/prepareDataToPay';

const getInfo = async docId => {
    const doc = await db.collection('suppliers').doc(docId).get();
    if (doc.exists) {
        const { backgroundCheckRequestsAvailablePaid } = doc.data();
        return backgroundCheckRequestsAvailablePaid;
    } else return null;
};

const BuyCreditBackgroundCheck = () => {
    const { docId, role, ownerId } = useContext(userContext);
    const [isLoading, setIsLoading] = useState(true);
    const [customError, setCustomError] = useState(false);
    const [errorLoading, setErrorLoading] = useState(false);
    const [apiError, setApiError] = useState(false);
    const [freeRequests, setFreeRequests] = useState(0);
    const [paidRequests, setPaidRequests] = useState(0);
    const [valueCreditBackgroundCheck, setValueCreditBackgroundCheck] = useState(0);
    const [totalValueCreditBackgroundCheck, setTotalValueCreditBackgroundCheck] = useState(0);
    const isCollaborator = role !== '';
    const [_, setLocation] = useLocation();
    const [match, params] = useRoute('/comprar-consulta/cartao/:quantity');
    const { quantity } = params;
    if (!quantity) setLocation('comprar-consulta');
    const { cardholder, expiry, cvv, validations, prettyNumber, prettyNumberWithAsterisks, type, code, cvvPlaceholder, cvvPlaceholderWithAsterisk, onChange } = useCreditCard();
    const state = { cardholder, expiry, prettyNumber, cvv, totalValueCreditBackgroundCheck, docId, isCollaborator, ownerId, document, quantity, setApiError };
    useEffect(() => fetch(setIsLoading, setErrorLoading, setCustomError, setValueCreditBackgroundCheck), []);
    useEffect(() => {
        setTotalValueCreditBackgroundCheck(Number(quantity) * valueCreditBackgroundCheck);
    }, [quantity, valueCreditBackgroundCheck]);
    const setPromiseMessage = useMessagePromise();
    const setMessage = useMessage();

    const PromptMessage = new ZiroPromptMessage({
        name: 'promptReceivingPolicy',
        type: 'neutral',
        code: '201',
        title: 'Aprovação manual',
        userDescription: `A pessoa poderá realizar pagamentos após a aprovação.`,
        userResolution: 'Deseja continuar?',
        internalDescription: 'prompt política de recebimento',
        illustration: 'profileData',
        additionalData: undefined,
    });
    const WaitingMessage = new ZiroWaitingMessage({
        name: 'waitingReceivingPolicy',
        type: 'neutral',
        code: '202',
        title: 'Comprar Crédito',
        userDescription: 'Efetuando a mudança. Aguarde enquanto finalizamos.',
        internalDescription: 'waiting política de recebimento',
        illustration: 'waiting',
        additionalData: undefined,
    });

    const SuccessMessage = new ZiroPromptMessage({
        name: 'successReceivingPolicy',
        type: 'success',
        code: '203',
        title: 'Sucesso',
        userDescription: 'Pronto! Você já pode usar seus créditos!',
        userResolution: 'Clique em ok para sair.',
        internalDescription: 'prompt de sucesso',
        illustration: 'paymentSuccess',
        additionalData: undefined,
    });
    const FailureMessage = new ZiroPromptMessage({
        name: 'failureReceivingPolicy',
        type: 'destructive',
        code: '204',
        title: 'Falha',
        userDescription: 'Falha na compra, tente novamente.',
        userResolution: 'Clique em ok para sair.',
        internalDescription: 'prompt de falha',
        illustration: 'errorLoading',
        additionalData: undefined,
    });
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ display: 'grid', textAlign: 'center', justifyContent: 'center', paddingBottom: '20px' }}>
                <strong style={{ fontSize: '1.5rem', fontFamily: 'Rubik', color: '#000' }}>
                    Você irá comprar {quantity} {Number(quantity) > 1 ? 'consultas' : 'consulta'} e irá pagar{' '}
                    {parseFloat(`${totalValueCreditBackgroundCheck}`).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }).replace(/\s/g, '') || '-'}
                </strong>
            </div>
            <CreditCard number={prettyNumberWithAsterisks} brand={type} cvvName={code?.name} cvv={cvvPlaceholderWithAsterisk} cardholder={cardholder} expiry={expiry} />
            <Form
                buttonOnTop
                buttonName="Comprar"
                validations={validations}
                sendToBackend={async () => {
                    //await setPromiseMessage(PromptMessage);
                    const promise: any = new Promise(async resolve => {
                        try {
                            console.log('entrou');
                            const paymentData = prepareDataToPay(state, process.env.SELLER_ID_ZIRO, totalValueCreditBackgroundCheck, 'Ziro');
                            console.log('paymentData', paymentData);
                            const transaction = await createTransaction(paymentData);
                            console.log(transaction);
                            const backgroundCheckRequestsAvailablePaid = await getInfo(docId);
                            if (typeof backgroundCheckRequestsAvailablePaid !== 'undefined') {
                                const sum = Number(backgroundCheckRequestsAvailablePaid) + Number(quantity);
                                await db.collection('suppliers').doc(docId).update({
                                    backgroundCheckRequestsAvailablePaid: sum,
                                });
                            }
                            resolve('resolved');
                        } catch (error) {
                            if (error.response) {
                                console.log(error.response);
                                if (error.response.data.customError) {
                                    console.log(error.response.data.error);
                                    resolve(null);
                                } else {
                                    // Caso ocorra algum erro não previsto na API
                                    setApiError(true);
                                }
                            } else resolve(null);
                        }
                    });
                    setMessage(WaitingMessage.withPromise(promise));
                    const result = await promise;
                    setMessage(result ? SuccessMessage : FailureMessage);
                }}
                inputs={[
                    <FormInput name="number" label="Número do cartão" input={<InputText value={prettyNumber} onChange={onChange.number} placeholder="1234 1234 1234 1234" inputMode="numeric" />} />,
                    <FormInput name="cardholder" label="Titular do cartão" input={<InputText value={cardholder} onChange={onChange.cardholder} placeholder="Fernando(a) da Silva" />} />,
                    <div style={dual}>
                        <FormInput name="expiry" label="Validade" input={<InputText value={expiry} onChange={onChange.expiry} placeholder="01/24" inputMode="numeric" />} />
                        <FormInput name="cvv" label={code?.name || 'CVV'} input={<InputText value={cvv} onChange={onChange.cvv} placeholder={cvvPlaceholder} inputMode="numeric" />} />
                    </div>,
                ]}
            />
        </motion.div>
    );
};

export default BuyCreditBackgroundCheck;
