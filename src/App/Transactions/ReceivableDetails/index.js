import React, { useEffect, useState } from 'react';
import { dateFormat, parcelFormat, round, stringToFloat } from '../utils';

import Details from '@bit/vitorbarbosa19.ziro.details';
import Error from '@bit/vitorbarbosa19.ziro.error';
import Header from '@bit/vitorbarbosa19.ziro.header';
import { containerWithPadding } from '@ziro/theme';
import { createBrowserHistory } from 'history';
import matchStatusColor from '../matchStatusColor';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';

const ReceivableDetails = ({ transactions, transactionId, receivableId, transaction, setTransaction }) => {
    const [blocks, setBlocks] = useState([]);
    const [error, setError] = useState();
    const [receivable, setReceivable] = useState({});
    const [backRoute, setBackRoute] = useState('');
    const [snapshotMemo, setSnapshotMemo] = useState({});
    const history = createBrowserHistory();
    const [, setLocation] = useLocation();
    const matchPlan = {
        'standard': 'Fluxo',
        'financed30': 'D+30',
        'financed14': 'D+14'
    }
    let markupTransaction = {};
    let antiFraudTransaction = {};
    async function getTransaction(transactionId, setTransaction, setError, transaction) {
        //await fetch(transactionId, setTransaction, setError, transaction);
    }

    useEffect(() => {
        const transaction = transactions.filter(transaction => transaction.transactionId === transactionId)[0];
        setTransaction(transaction);
        getTransaction(transactionId, setTransaction, setError, transaction).then(r => {
            let block = [];
            if (transaction) {
                markupTransaction = transaction.splitTransaction?.markup ?? transaction.sellerZoopPlan.markup;
                antiFraudTransaction = transaction.splitTransaction?.antiFraud ?? transaction.sellerZoopPlan.antiFraud;
                const effectReceivable = transaction.receivables.filter(receivable => receivable.receivableZoopId === receivableId)[0];
                const sortedSplitAmount = transaction.receivables[0].split_rule
                    ? transaction.receivables
                        .sort((a, b) => b.installment - a.installment)
                        .filter(item => item.split_rule !== null)
                        .reverse()
                    : [];
                setReceivable(effectReceivable);
                const sumReceivablesSplitAntiFraud =
                    sortedSplitAmount.length > 0
                        ? sortedSplitAmount
                            .filter(item => item.split_rule === antiFraudTransaction.id)
                            .filter(item => item.installment === effectReceivable.installment)
                            .reduce((acc, { gross_amount }) => acc + parseFloat(gross_amount), 0)
                        : 0;
                //console.log('sumReceivablesSplitAntiFraud', sumReceivablesSplitAntiFraud);
                const sumReceivablesSplitZiro =
                    sortedSplitAmount.length > 0
                        ? sortedSplitAmount
                            .filter(item => item.split_rule === markupTransaction.id)
                            .filter(item => item.installment === effectReceivable.installment)
                            .reduce((acc, { gross_amount }) => acc + parseFloat(gross_amount), 0)
                        : 0;
                //console.log('sumReceivablesSplitZiro', sumReceivablesSplitZiro);
                if (effectReceivable) {
                    let feesFormatted =
                        effectReceivable.gross_amount && effectReceivable.amount
                            ? `- ${round(parseFloat(effectReceivable.gross_amount) + parseFloat(sumReceivablesSplitZiro) - parseFloat(effectReceivable.amount), 2)
                                .toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
                                .replace(/\s/g, '')}`
                            : '-';
                    let zoopSplitFormatted =
                        sortedSplitAmount.length > 0 && transaction.insurance === true
                            ? `- ${parseFloat(`${round(parseFloat(sumReceivablesSplitAntiFraud), 2)}`)
                                .toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
                                .replace(/\s/g, '')}`
                            : '-';
                    let zoopSplitValue = zoopSplitFormatted !== '-' ? stringToFloat(zoopSplitFormatted.replace(/[R$\.,]/g, '').replace('-', '')) : 0;
                    const { sellerZoopPlan: { activePlan } } = transaction;
                    block = [
                        {
                            header: 'Informações adicionais',
                            body: [
                                {
                                    title: 'Parcela',
                                    content: effectReceivable.installment,
                                },
                                {
                                    title: 'Valor da parcela',
                                    content: `R$${parcelFormat(round(parseFloat(effectReceivable.gross_amount) + sumReceivablesSplitZiro + sumReceivablesSplitAntiFraud, 2))}`,
                                },
                                {
                                    title: 'Tarifa Ziro Pay',
                                    content: feesFormatted,
                                },
                                {
                                    title: 'Tarifa Ziro Seguro Antifraude',
                                    content: zoopSplitFormatted,
                                },
                                {
                                    title: 'Valor líquido',
                                    content: `R$${parcelFormat(round(effectReceivable.amount, 2))}`,
                                },
                                {
                                    title: 'Recebimento',
                                    content: matchPlan[activePlan] ?? 'Fluxo',
                                },
                                {
                                    title: 'Data recebimento',
                                    content: effectReceivable.paid_at ? dateFormat(effectReceivable.paid_at) : dateFormat(effectReceivable.expected_on),
                                },
                                {
                                    title: 'Status',
                                    content: effectReceivable.status === 'paid' ? 'Pago' : 'Pendente',
                                    color: matchStatusColor(effectReceivable.status),
                                },
                            ],
                        },
                    ];
                }
            }
            setBlocks(block);
        });
        const { state } = history.location;
        if (state && state.backRoute) setBackRoute(state.backRoute);
        if (state && state.snapshot) setSnapshotMemo(state.snapshot);
    }, [transaction]);

    if (!transaction || !receivable)
        return (
            <Error
                message="Lançamento inválido ou não encontrado, retorne e tente novamente."
                type="noData"
                title="Erro ao buscar detalhes do lançamento"
                backRoute={`/transacoes/${transactionId}`}
                backRouteFunction={route => setLocation(route)}
            />
        );

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={containerWithPadding}>
            <Header
                type="icon"
                title="Detalhes do lançamento"
                setIsOpen={backRoute ? () => history.push(`transacoes/${transactionId}`, { backRoute, snapshot: snapshotMemo }) : () => setLocation(`transacoes/${transactionId}`)}
                icon="back"
            />
            <div style={{ display: 'grid' }}>
                <Details blocks={blocks} />
            </div>
        </motion.div>
    );
};

export default ReceivableDetails;
