import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import Header from '@bit/vitorbarbosa19.ziro.header';
import Error from '@bit/vitorbarbosa19.ziro.error';
import Details from '@bit/vitorbarbosa19.ziro.details';
import currencyFormat from '@ziro/currency-format';
import { containerWithPadding } from '@ziro/theme';
import matchStatusColor from '../matchStatusColor';
import { dateFormat, parcelFormat, round } from '../utils';

const ReceivableDetails = ({ transactions, transactionId, receivableId }) => {
    const [blocks, setBlocks] = useState([]);
    const [transaction, setTransaction] = useState({});
    const [receivable, setReceivable] = useState({});
    const [, setLocation] = useLocation();

    useEffect(() => {
        const effectTransaction = transactions.filter(transaction => transaction.transactionId === transactionId)[0];
        setTransaction(effectTransaction);
        let block = [];
        if (effectTransaction) {
            const effectReceivable = effectTransaction.receivables.filter(receivable => receivable.receivableZoopId === receivableId)[0];
            setReceivable(effectReceivable);
            if (effectReceivable) {
                let feesFormatted = (effectReceivable.gross_amount && effectReceivable.amount) ?
                    `- ${currencyFormat(parseFloat(`${round(parseFloat(effectReceivable.gross_amount) - parseFloat(effectReceivable.amount), 2)}`.replace(/[R$\.,]/g, '')))}` : '-';
                block = [
                    {
                        header: 'Informações adicionais',
                        body: [
                            {
                                title: 'Parcela',
                                content: effectReceivable.installment
                            },
                            {
                                title: 'Valor da parcela',
                                content: `R$${parcelFormat(round(effectReceivable.gross_amount, 2))}`
                            },
                            {
                                title: 'Tarifa Ziro Pay',
                                content: feesFormatted
                            },
                            {
                                title: 'Valor líquido',
                                content: `R$${parcelFormat(round(effectReceivable.amount, 2))}`
                            },
                            {
                                title: 'Recebimento',
                                content: effectTransaction.receivement ? effectTransaction.receivement : 'D+30'
                            },
                            {
                                title: 'Data recebimento',
                                content: effectReceivable.paid_at ? dateFormat(effectReceivable.paid_at) : dateFormat(effectReceivable.expected_on)
                            },
                            {
                                title: 'Status',
                                content: effectReceivable.status === 'paid' ? 'Pago' : 'Pendente',
                                color: matchStatusColor(effectReceivable.status)
                            },
                        ]
                    }
                ];
            }
        }
        setBlocks(block);
    }, []);

    if (!transaction || !receivable) return <Error message='Lançamento inválido ou não encontrado, retorne e tente novamente.' type='noData' title='Erro ao buscar detalhes do lançamento' backRoute={`/transacoes/${transactionId}`} backRouteFunction={(route) => setLocation(route)} />;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={containerWithPadding}>
            <Header type='icon-link' title='Detalhes do lançamento' navigateTo={`transacoes/${transactionId}`} icon='back' />
            <div style={{ display: 'grid' }}>
                <Details blocks={blocks} />
            </div>
        </motion.div>
    );
}

export default ReceivableDetails