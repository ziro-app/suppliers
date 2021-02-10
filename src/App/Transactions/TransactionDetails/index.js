/* eslint-disable no-useless-escape */
/* eslint-disable no-nested-ternary */
/* eslint-disable prefer-const */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { alertColor, containerWithPadding, successColor } from '@ziro/theme';

import Button from '@bit/vitorbarbosa19.ziro.button';
import Details from '@bit/vitorbarbosa19.ziro.details';
import Error from '@bit/vitorbarbosa19.ziro.error';
import Header from '@bit/vitorbarbosa19.ziro.header';
import Icon from '@bit/vitorbarbosa19.ziro.icon';
import Illustration from '@bit/vitorbarbosa19.ziro.illustration';
import Modal from '@bit/vitorbarbosa19.ziro.modal';
import Spinner from '@bit/vitorbarbosa19.ziro.spinner';
import Table from '@bit/vitorbarbosa19.ziro.table';
import { createBrowserHistory } from 'history';
import currencyFormat from '@ziro/currency-format';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { db } from '../../../Firebase/index';
import fetch from './fetch';
import { dateFormat, parcelFormat, round, stringToFloat } from '../utils';
import { btn, btnRed, buttonContainer, custom, illustrationContainer, modalContainer, modalLabel, spinner } from './styles';
import { userContext } from '../../appContext';
import linkMessage from '../../CreatePayment/utils/linkMessage';

const TransactionDetails = ({ transactions, transactionId, transaction, setTransaction, setPayments, transactionsMemo }) => {
    const [receipt_id, setReceipt_id] = useState('');
    const [error, setError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [nothing, setNothing] = useState(true)
    const [isDeleting, setIsDeleting] = useState(false)
    const [data, setData] = useState([]);
    const [blocks, setBlocks] = useState([]);
    const [, setLocation] = useLocation();
    const [copyResultText, setCopyResultText] = useState('');
    const [copyResultStatus, setCopyResultStatus] = useState(true);
    const [cancelModal, setCancelModal] = useState(false);
    const [backRoute, setBackRoute] = useState('');
    const [snapshotMemo, setSnapshotMemo] = useState({});
    const { role, fantasy, docId } = useContext(userContext);
    const textAreaRef = useRef(null);
    const history = createBrowserHistory();
    const [olderTransaction, setOlderTransaction] = useState(false);
    let markupTransaction = {};
    let antiFraudTransaction = {};
    const showTransaction = role === ''
        ? true
        : (docId === transaction.collaboratorId ? true : false)

    const baseUrl = process.env.HOMOLOG ? 'http://localhost:8080/pagamento/' : 'https://ziro.app/pagamento/';
    const seller = (transaction && transaction.seller) || '';
    const charge = (transaction && transaction.charge) || '';
    const installmentsMax = (transaction && transaction.installmentsMax) || '';
    const checkoutWithoutRegister = (transaction && transaction.checkoutWithoutRegister) || false;
    const messageLink = linkMessage(baseUrl, transactionId, seller, charge, installmentsMax, checkoutWithoutRegister);

    let insuranceValueFormatted = '-';
    let markupValueFormatted = '-';

    const deleteTransaction = async () => {
        setIsLoading(true);
        setIsDeleting(true)

        try {
            await db.collection('credit-card-payments').doc(transactionId).delete();
            setLocation('/transacoes');
            setIsLoading(false);
        } catch (error) {
            console.log(error);
            if (error.response) console.log(error.response);
            setCopyResultStatus(false);
            setCopyResultText('Erro ao excluir transação!');
            setIsLoading(false);
        }
    };

    const copyToClipboard = e => {
        e.preventDefault();
        if (document.queryCommandSupported('copy')) {
            try {
                textAreaRef.current.select();
                document.execCommand('copy');
                setCopyResultStatus(true);
                setCopyResultText('Copiado !');
                setTimeout(() => {
                    setCopyResultText('');
                }, 2500);
            } catch (error) {
                console.log(error);
                setCopyResultStatus(false);
                setCopyResultText('Erro ao copiar.');
                setTimeout(() => {
                    setCopyResultText('');
                }, 2500);
            }
        } else {
            setCopyResultStatus(false);
            setCopyResultText('Sem suporte para cópia.');
            setTimeout(() => {
                setCopyResultText('');
            }, 2500);
        }
    };

    useEffect(() => {
        setTransaction({});
    }, []);

    async function getTransaction(transactionId, setTransaction, setError, transaction, transactions, setPayments, setIsLoading, setNothing) {
        await fetch(transactionId, setTransaction, setError, transaction, transactions, setPayments, setIsLoading, setNothing);
        if (Object.prototype.hasOwnProperty.call(transaction, 'sellerZoopPlan')) {
            if (transaction.sellerZoopPlan === '' || (markupTransaction.percentage === 0 && markupTransaction.amount === 0)) setOlderTransaction(true);
            else setOlderTransaction(false);
        } else setOlderTransaction(false);
    }
    function handleInsurance(transaction) {
        if (transaction.insurance === true && transaction.sellerZoopPlan) {
            return `- ${parseFloat(antiFraudTransaction.receivable_amount).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }).replace(/\s/g, '')}`;
        }
    }
    function handleMarkup(transaction) {
        return markupTransaction ? `- ${parseFloat(markupTransaction.receivable_amount).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}` : '-';
    }

    useEffect(() => {
        getTransaction(transactionId, setTransaction, setError, transaction, transactions, setPayments, setIsLoading, setNothing).then(r => {
            if (Object.prototype.hasOwnProperty.call(transaction, 'dateLinkCreated')) {
                markupTransaction = transaction.splitTransaction?.markup ?? transaction.sellerZoopPlan.markup;
                antiFraudTransaction = transaction.splitTransaction?.antiFraud ?? transaction.sellerZoopPlan.antiFraud;

                let block;
                let dataTable;
                let feesFormatted =
                    transaction.status !== 'Cancelado' && transaction.fees
                        ? ` ${(Object.prototype.hasOwnProperty.call(transaction, 'sellerZoopPlan') && Object.prototype.hasOwnProperty.call(transaction.sellerZoopPlan, 'activePlan') && transaction.splitTransaction ? transaction.splitTransaction : transaction.sellerZoopPlan) && markupTransaction?.amount
                            ? '- '.concat(
                                parseFloat(parseFloat(markupTransaction.receivable_gross_amount) + parseFloat(transaction.fees))
                                    .toLocaleString('pt-br', {
                                        style: 'currency',
                                        currency: 'BRL',
                                    })
                                    .replace(/\s/g, ''),
                            )
                            : '- '.concat(
                                parseFloat(transaction.fees)
                                    .toLocaleString('pt-br', {
                                        style: 'currency',
                                        currency: 'BRL',
                                    })
                                    .replace(/\s/g, ''),
                            )
                        }`
                        : '-';
                let insuranceValueFormatted =
                    transaction.status !== 'Cancelado' &&
                        transaction.insurance === true &&
                        Object.prototype.hasOwnProperty.call(transaction, 'receivables') &&
                        Object.prototype.hasOwnProperty.call(transaction, 'splitTransaction') &&
                        Object.prototype.hasOwnProperty.call(transaction, 'sellerZoopPlan') &&
                        Object.prototype.hasOwnProperty.call(transaction.sellerZoopPlan, 'activePlan') &&
                        Object.prototype.hasOwnProperty.call(Object.prototype.hasOwnProperty.call(transaction.sellerZoopPlan, 'activePlan') ? transaction.splitTransaction : transaction.sellerZoopPlan, 'antiFraud') &&
                        feesFormatted !== '-' &&
                        (antiFraudTransaction.amount || antiFraudTransaction.percentage)
                        ? handleInsurance(transaction)
                        : '-';
                markupValueFormatted =
                    Object.prototype.hasOwnProperty.call(transaction, 'receivables') && feesFormatted !== '-' && (Object.prototype.hasOwnProperty.call(transaction.sellerZoopPlan, 'activePlan')? transaction.splitTransaction : transaction.sellerZoopPlan)
                        ? handleMarkup(transaction)
                        : '-';
                let sumOfFees = 0;
                if (transaction.status === 'Aprovado') {
                    sumOfFees = transaction.fee_details.reduce(function (sum, item) {
                        return (sum += parseFloat(item.amount));
                    }, 0);
                }
                let liquidFormatted =
                    transaction.status !== 'Cancelado' && transaction.status !== 'Pré Autorizado' && transaction.status !== 'Atualizando' && transaction.totalFees !== '-'
                        ? parseFloat(`${stringToFloat(transaction.charge) - parseFloat(transaction.totalFees)}`)
                            .toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
                            .replace(/\s/g, '')
                        : transaction.fees
                            ? currencyFormat(
                                parseFloat(
                                    `${(stringToFloat(transaction.charge) - stringToFloat(feesFormatted.replace('- R$', '')) - stringToFloat(insuranceValueFormatted.replace('- R$', ''))).toFixed(2)}`.replace(
                                        /[R$\.,]/g,
                                        '',
                                    ),
                                ),
                            )
                            : '-';

                const { state } = history.location;
                const backRouteEffect = state && state.backRoute ? state.backRoute : '';
                const snapshotEffect = state && state.snapshot ? state.snapshot : '';
                setBackRoute(backRouteEffect);
                setSnapshotMemo(snapshotEffect);
                localStorage.removeItem('snapshot');

                block = [
                    {
                        header: 'Venda',
                        body: [
                            {
                                title: 'Lojista',
                                content: transaction.buyerRazao ? transaction.buyerRazao : '-',
                            },
                            {
                                title: 'Valor',
                                content: transaction.charge,
                            },
                            {
                                title: 'Tarifa Ziro Pay',
                                content: feesFormatted,
                            },
                            {
                                title: 'Tarifa Ziro Seguro Antifraude',
                                content: insuranceValueFormatted,
                            },
                            {
                                title: 'Valor líquido',
                                content: transaction.status !== 'Cancelado' && transaction.status !== 'Aguardando Pagamento' ? liquidFormatted : '-',
                            },
                            {
                                title: 'Transação com seguro',
                                content: transaction.insurance ? 'Sim' : 'Não',
                            },
                            {
                                title: 'Transação com cadastro',
                                content: transaction.checkoutWithoutRegister ? 'Não' : 'Sim',
                            },
                            {
                                title: 'Parcela máxima',
                                content: `${transaction.installmentsMax}`.startsWith('0') ? `${parseInt(transaction.installmentsMax)}x` : `${transaction.installmentsMax}x`,
                            },
                            {
                                title: 'Parcela escolhida',
                                content: transaction.installments ? `${transaction.installments}x` : '-',
                            },
                            {
                                title: 'Data de pagamento',
                                content: transaction.datePaid ? `${transaction.datePaid}` : '-',
                            },
                            {
                                title: 'Data de criação do link',
                                content: transaction.dateLinkCreated ? `${dateFormat(transaction.dateLinkCreated)}` : '-',
                            },
                            {
                                title: 'Link criado por',
                                content: transaction.collaboratorName ? `${transaction.collaboratorName}` : 'Admin',
                            },
                            {
                                title: 'Observações',
                                content: transaction.observations ? `${transaction.observations}` : '-',
                            },
                            {
                                title: 'Status',
                                content: transaction.status,
                                color: transaction.statusColor,
                            },
                        ],
                    },
                ];

                if (transaction.onBehalfOfBrand && transaction.seller && transaction.seller.includes('Ziro')) {
                    block[0].body.splice(1, 0, {
                        title: 'Fabricante',
                        content: transaction.onBehalfOfBrand,
                    });
                }
                if (Object.prototype.hasOwnProperty.call(transaction, 'receivables') && transaction.receivables.length > 0) {
                    const sortedTransactions = Object.prototype.hasOwnProperty.call(transaction.receivables[0], 'split_rule')
                        ? transaction.receivables.sort((a, b) => b.installment - a.installment).filter(item => item.split_rule === null)
                        : transaction.receivables.sort((a, b) => b.installment - a.installment);
                    const sortedSplitAmount = Object.prototype.hasOwnProperty.call(transaction.receivables[0], 'split_rule')
                        ? transaction.receivables
                            .sort((a, b) => b.installment - a.installment)
                            .filter(item => item.split_rule !== null)
                            .reverse()
                        : [];
                    /* const sumReceivablesSplitZoop =
                                                              sortedSplitAmount.length > 0
                                                                ? sortedSplitAmount.filter(item => item.split_rule === transaction.sellerZoopPlan.antiFraud.id).reduce((acc, { gross_amount }) => acc + parseFloat(gross_amount), 0)
                                                                : [];
                                                            const sumReceivablesSplitZiro =
                                                              sortedSplitAmount.length > 0
                                                                ? sortedSplitAmount.filter(item => item.split_rule === transaction.sellerZoopPlan.markup.id).reduce((acc, { gross_amount }) => acc + parseFloat(gross_amount), 0)
                                                                : []; */
                    const paidRows = [];
                    const paidClicks = [];
                    let paidAmount = 0;
                    let paidAmountWithoutFees = 0;
                    const unpaidRows = [];
                    const unpaidClicks = [];
                    let unpaidAmount = 0;
                    let unpaidAmountWithoutFees = 0;
                    sortedTransactions.map(transaction => {
                        const sumSplit =
                            sortedSplitAmount.length > 0
                                ? sortedSplitAmount
                                    .filter(item => item.installment === transaction.installment)
                                    .reduce((acc, val) => {
                                        return parseFloat(acc) + parseFloat(val.gross_amount);
                                    }, 0)
                                : 0;
                        if (!transaction.paid_at) {
                            let upAm = round(parseFloat(transaction.gross_amount) + (sortedSplitAmount.length > 0 ? sumSplit : 0), 2);
                            let upAmw = round(parseFloat(transaction.amount), 2);
                            unpaidRows.push([`${transaction.installment}`, `${parcelFormat(upAm)}`, `${parcelFormat(upAmw)}`, `${dateFormat(transaction.expected_on)}`, <Icon type="chevronRight" size={14} />]);
                            if (backRouteEffect) unpaidClicks.push(() => history.push(`/transacoes/${transactionId}/${transaction.receivableZoopId}`, { backRoute: backRouteEffect, snapshot: snapshotEffect }));
                            else unpaidClicks.push(() => setLocation(`/transacoes/${transactionId}/${transaction.receivableZoopId}`));
                            unpaidAmount += parseFloat(upAm);
                            unpaidAmountWithoutFees += parseFloat(upAmw);
                        } else {
                            let upAm = round(parseFloat(transaction.gross_amount) + (sortedSplitAmount.length > 0 ? sumSplit : 0), 2);
                            let upAmw = round(parseFloat(transaction.amount), 2);
                            paidRows.push([`${transaction.installment}`, `${parcelFormat(upAm)}`, `${parcelFormat(upAmw)}`, `${dateFormat(transaction.paid_at)}`, <Icon type="chevronRight" size={14} />]);
                            if (backRouteEffect) paidClicks.push(() => history.push(`/transacoes/${transactionId}/${transaction.receivableZoopId}`, { backRoute: backRouteEffect, snapshot: snapshotEffect }));
                            else paidClicks.push(() => setLocation(`/transacoes/${transactionId}/${transaction.receivableZoopId}`));
                            paidAmount += parseFloat(upAm);
                            paidAmountWithoutFees += parseFloat(upAmw);
                        }
                    });
                    dataTable = [
                        {
                            title: 'Lançamentos Pagos',
                            header: ['Parc.', 'Bruto', 'Líquido', 'Data', ''],
                            rows: paidRows.reverse(),
                            rowsClicks: paidClicks.reverse(),
                            totals: ['-', `${parcelFormat(round(paidAmount, 2))}`, `${parcelFormat(round(paidAmountWithoutFees, 2))}`, '-', ''],
                        },
                        {
                            title: 'Lançamentos Futuros',
                            header: ['Parc.', 'Bruto', 'Líquido', 'Data', ''],
                            rows: unpaidRows.reverse(),
                            rowsClicks: unpaidClicks.reverse(),
                            totals: ['-', `${parcelFormat(round(unpaidAmount, 2))}`, `${parcelFormat(round(unpaidAmountWithoutFees, 2))}`, '-', ''],
                        },
                    ];
                }

                setBlocks(block);
                setData(dataTable || []);
            }
        });
        if (transaction.hasOwnProperty('receiptId')) {
            setReceipt_id(transaction.receiptId);
        }
    }, [transaction]);

    if (isLoading) {
        return (
            <div style={spinner}>
                <Spinner size="5.5rem" />
            </div>
        );
    }

    if ((nothing && !isLoading && !isDeleting) || !showTransaction) {
        return (
            <Error
                message="Transação inválida ou não encontrada, retorne e tente novamente."
                type="noData"
                title="Erro ao buscar detalhes da transação"
                backRoute="/transacoes"
                backRouteFunction={route => setLocation(route)}
            />
        );
    }

    const isApproved = transaction.status === 'Aprovado' || transaction.status === 'Pago' || transaction.status === 'Pré Autorizado';
    const isCanceled = transaction.status === 'Cancelado' || transaction.status === 'Falhado';
    const isWaiting = transaction.status === 'Aguardando Pagamento' || transaction.status === 'Aprovação Pendente';
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={containerWithPadding}>
            <textarea type="text" style={{ position: 'absolute', left: '-9999px' }} value={messageLink} ref={textAreaRef} readOnly />
            <Header type="icon" title="Detalhes da venda" setIsOpen={backRoute ? () => history.push(backRoute, { snapshot: snapshotMemo }) : () => setLocation('/transacoes')} icon="back" />

            <div style={{ display: 'grid', gridRowGap: '20px' }}>
                {isWaiting && (
                  <>
                    <div style={{...buttonContainer, marginTop: '-25px'}}>
                      <div>
                        {copyResultText ? (
                          <div
                            style={{
                                padding: '0 0 5px',
                                height: '24px',
                                fontSize: '1.6rem',
                                color: copyResultStatus ? successColor : alertColor,
                                textAlign: 'center',
                            }}
                          >
                            <span>{copyResultText}</span>
                          </div>
                        ) : (<div style={{ padding: '0 0 5px', height: '24px' }}>&nbsp;</div>)
                        }

                        <Button style={btn} type="button" cta="Copiar link" click={copyToClipboard} template="regular" />
                      </div>

                      <div>
                        <Modal boxStyle={modalContainer} isOpen={cancelModal} setIsOpen={() => setCancelModal(false)}>
                          <div style={{ display: 'grid', gridTemplateRows: '1fr auto', gridRowGap: '20px' }}>
                            <label style={modalLabel}>Deseja realmente cancelar o link ?</label>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridColumnGap: '20px' }}>
                              <Button type="button" cta="Sim" click={deleteTransaction} template="regular" />
                              <Button type="button" cta="Não" click={() => setCancelModal(false)} template="light" />
                            </div>
                          </div>
                        </Modal>

                        <Button style={btnRed} type="button" cta="Cancelar link" click={() => setCancelModal(true)} template="destructive" />
                      </div>
                    </div>
                  </>
                )}

                {receipt_id ? (
                  <div style={{ marginTop: isCanceled || transaction.status === 'Atualizando' ? '20px' : '0' }}>
                    <Button
                      type="button"
                      cta="Gerar comprovante"
                      template="regular"
                      click={
                          backRoute
                              ? () => history.push(`/comprovante/${transaction.transactionId}/${receipt_id}`, { backRoute, snapshot: snapshotMemo })
                              : () => history.push(`/comprovante/${transaction.transactionId}/${receipt_id}`, { transactionsMemo: { ...transactionsMemo } })
                      }
                    />
                  </div>
                ) : null}

                <Details blocks={blocks} />
                {isApproved && role === '' && (
                    <>
                        <Table
                            data={data}
                            customGrid={{
                                gridTemplateColumns: 'auto 1fr 1fr 1fr 20px',
                                gridRowGap: '15px',
                            }}
                        />
                        <span style={{ fontFamily: 'Rubik', fontSize: '12px' }}>* Valores arredondados para a segunda casa decimal</span>
                    </>
                )}
                {isCanceled && (
                    <div style={illustrationContainer}>
                        <div style={{ display: 'grid', justifyItems: 'center' }}>
                            <Illustration type="paymentError" size={175} />
                            <span style={custom(15, transaction.statusColor)}>Pagamento cancelado.</span>
                        </div>
                    </div>
                )}
                {isWaiting && (
                    <>
                        <div style={illustrationContainer}>
                            <div style={{ display: 'grid', justifyItems: 'center' }}>
                                <Illustration type="waiting" size={200} />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </motion.div>
    );
};

export default TransactionDetails;
