// @ts-nocheck
import React, { useState, useEffect, useContext, useMemo } from 'react';
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
import { db,fs } from '../../../Firebase/index';
import createTransaction from './utils/createTransaction';
import prepareDataToPay from './utils/prepareDataToPay';
import { HeaderWithoutModal } from './components/Header';
import { installmentOptions, installmentCharge } from './utils/installmentUtils';
import { prompt, redePrompt } from "ziro-messages/dist/src/zoop";
import writeReceivablesToSheet from './utils/writeReceivablesToSheet'
import writeTransactionToSheet from './utils/writeTransactionToSheet'
import {dbAndSheet} from './utils/dbSheet'
import { useFirestore } from 'reactfire';
import {
    createPayment,
    getReceivables,
} from './utils/functionsZoop'
import { useCancelToken } from '@bit/vitorbarbosa19.ziro.utils.axios';


type RedeMessage = typeof redePrompt[keyof typeof redePrompt];
type ZoopMessage = typeof prompt[keyof typeof prompt];
type GenericMessage = ZiroPromptMessage<string, string, any>;

const redeMessageFinder = (error: any) => ({ additionalData }: RedeMessage) => error.response_code === additionalData.response_code;

const zoopMessageFinder = (error: any) => ({ additionalData: { status, category, type } }: ZoopMessage) =>
    status === error.status_code && category === error.category && type === error.type;

function getRightMessage(error) {
    let data = error?.response?.data ?? {};
    let innerError = data.error || {};
    //console.log('data inside getRightMessage',data)
    //console.log('innerError inside getRightMessage',innerError)
    //console.log('error inside getRightMessage',error)
    let redeMessage: GenericMessage = Object.values(redePrompt).find(redeMessageFinder(innerError));
    let zoopMessage: GenericMessage = Object.values(prompt).find(zoopMessageFinder(innerError));
    let unknown: GenericMessage = prompt.UNKNOWN_ERROR;
    return (redeMessage || zoopMessage || unknown).withAdditionalData({ data });
}

const getInfo = async docId => {
    const doc = await db.collection('suppliers').doc(docId).get();
    if (doc.exists) {
        const { backgroundCheckRequestsAvailablePaid } = doc.data();
        return backgroundCheckRequestsAvailablePaid;
    } else return null;
};
//console.log('payMessages',payMessages)
const parseCard = ({ cardholder: holder_name, number, cvv: security_code, expiry }) => {
    const [expiration_month, expiration_year] = expiry.replace('/', '/20').split('/');
    const card_number = number.replace(/ /g, '');
    return {
      holder_name,
      security_code,
      expiration_month,
      expiration_year,
      card_number,
    };
  };
  const createPaymentBuyer = async (dbData/* setPaymentId,valueForZoop,card,type,buyer,transactionState */) => {
    const nowDate = fs.FieldValue.serverTimestamp()
    await db
        .collection('payments-sellers-ziro')
        .add(dbData/* {
            dateLinkCreated: nowDate,
    dateLastUpdated: nowDate,
    datePaid: nowDate,
    sellerName: 'Ziro',
    sellerZoopId: process.env.SELLER_ID_ZIRO,
    status: 'Aprovado',
    buyerZoopId:buyer.zoopId,
    buyerReason:buyer.reason,
    buyerDocId:buyer.docId,
	cardBrand: type,
    cardFirstFour: card.card_number.substring(0,4),
    cardLastFour: card.card_number.substring(card.card_number.length-4),
    cardholder: card.holder_name.toLowerCase(),
    charge: Number(valueForZoop),
    fees: transactionState.fees,
    fee_details: transactionState.fee_details,
    totalFees: '',
    receivables: {},
    transactionZoopId: transactionState.transactionZoopId,

        } */)
        .catch(e => {
            console.log('error firebase', e);
        })
        .finally(() => console.log('pagamento criado'));
};

const BuyCreditBackgroundCheck = ({setPaidRequests}) => {
    const source = useCancelToken();
    const header = useMemo(() => <HeaderWithoutModal title="Finalizar" leftButton={{ icon: 'close', onClick: close }} />, [close]);
    const { docId, zoopId, ownerId, role, fantasy,reason} = useContext(userContext);
    const timestamp = useFirestore.FieldValue.serverTimestamp;
    const [paymentId, setPaymentId] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [customError, setCustomError] = useState(false);
    const [errorLoading, setErrorLoading] = useState(false);
    const [apiError, setApiError] = useState(false);
    const [valueCreditBackgroundCheck, setValueCreditBackgroundCheck] = useState(0);
    const [totalValueCreditBackgroundCheck, setTotalValueCreditBackgroundCheck] = useState(0);
    const valueForZoop = totalValueCreditBackgroundCheck * 100
    const isCollaborator = role !== '';
    const [_, setLocation] = useLocation();
    const [match, params] = useRoute('/comprar-consulta/cartao/:quantity');
    const { quantity } = params;
    if (!quantity) setLocation('comprar-consulta');
    const quantityNumber = Number(quantity)
    const buyer = {zoopId, docId,fantasy, reason,quantityNumber}
    console.log(buyer)
    const { cardholder, expiry, cvv, validations, prettyNumber, prettyNumberWithAsterisks, type, code, cvvPlaceholder, cvvPlaceholderWithAsterisk, onChange } = useCreditCard();
    const state = { cardholder, expiry, prettyNumber, cvv, totalValueCreditBackgroundCheck, docId, isCollaborator, ownerId, document, quantity, setApiError };
    const card = parseCard({cardholder, expiry, number:prettyNumber, cvv})
    //console.log('card',card)
    useEffect(() => fetch(setIsLoading, setErrorLoading, setCustomError, setValueCreditBackgroundCheck), []);
    useEffect(() => {
        setTotalValueCreditBackgroundCheck(Number(quantity) * valueCreditBackgroundCheck);
    }, [quantity, valueCreditBackgroundCheck]);
    const setPromiseMessage = useMessagePromise();
    const setMessage = useMessage();
    //const [onClick] = usePayment(() => {}, paymentId, supplierId, zoopId,'1',type,card);
    //console.log(setPaidRequests)
    const PromptMessage = new ZiroPromptMessage({
        name: 'promptReceivingPolicy',
        type: 'neutral',
        code: '402',
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
        userResolution: '',
        internalDescription: 'prompt de sucesso',
        illustration: 'paymentSuccess',
        additionalData: undefined,
    }).withButtons([
        {
            title: "ok",
            action: () => setLocation('/comprar-consulta'),
        },
    ]);
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
                    Você escolheu {quantity} {Number(quantity) > 1 ? 'consultas' : 'consulta'} por{' '}
                    {parseFloat(`${totalValueCreditBackgroundCheck}`).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }).replace(/\s/g, '') || '-'}
                </strong>
            </div>
            <CreditCard number={prettyNumberWithAsterisks} brand={type} cvvName={code?.name} cvv={cvvPlaceholderWithAsterisk} cardholder={cardholder} expiry={expiry} />
            <Form
                buttonOnTop
                buttonName="Comprar"
                validations={validations}
                sendToBackend={/*{() =>
                    createPaymentBuyer(setPaymentId,valueForZoop,card,type).then(() => {
                        onClick;
                    })
                }*/  async () => {
                    //await setPromiseMessage(PromptMessage);
                    const promise: any = new Promise(async resolve => {
                        try {
                            //console.log('entrou');
                            const paymentData = prepareDataToPay(state, process.env.SELLER_ID_ZIRO, valueForZoop, 'Ziro');
                            //console.log('paymentData', paymentData);
                            const transaction = await createTransaction(paymentData);
                            //console.log('transaction',transaction);
                            const {id:transactionZoopId,fee_details,sales_receipt:receiptId,fees} = transaction

                            const transactionState = {transactionZoopId, fee_details,receiptId,fees}
                            const backgroundCheckRequestsAvailablePaid = await getInfo(docId);
                            if (typeof backgroundCheckRequestsAvailablePaid !== 'undefined') {
                                const sum = Number(backgroundCheckRequestsAvailablePaid) + Number(quantity);
                               await db.collection('suppliers').doc(docId).update({
                                    backgroundCheckRequestsAvailablePaid: sum,
                                });
                            }
                            transaction.valueCreditBackgroundCheck = valueCreditBackgroundCheck
                            const receivables = await getReceivables(transaction.id, source.token);
                            const [dbData, sheetData, receivablesData] = dbAndSheet(
                                transaction,
                                buyer,
                                receivables,
                                timestamp,
                            );
                            //await writeTransactionToSheet(sheetData);
                            if (receivablesData.length > 0) await writeReceivablesToSheet(receivablesData);
                            //await payment.ref.update(dbData).catch(errorThrowers.saveFirestore("registered-payment"));

                            createPaymentBuyer(dbData/* setPaymentId,valueForZoop,card,type,buyer,transactionState */)
                            setPaidRequests(Number(backgroundCheckRequestsAvailablePaid) + Number(quantity))
                            setLocation('/comprar-consulta')
                            resolve('resolved');
                        } catch (error) {
                            resolve(null);
                            //console.log('error',error)
                            //console.log('getRightMessage',getRightMessage(error))
                            setMessage(getRightMessage(error))
                        }
                    });
                    setMessage(WaitingMessage.withPromise(promise));
                    const result = await promise;
                    //console.log('result',result)
                    if(result)setMessage(SuccessMessage);
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
