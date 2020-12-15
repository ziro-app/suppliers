import React, { useState } from 'react';
import { createBrowserHistory } from 'history';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import Header from '@bit/vitorbarbosa19.ziro.header';
import Details from '@bit/vitorbarbosa19.ziro.details';
import SpinnerWithDiv from '@bit/vitorbarbosa19.ziro.spinner-with-div';
import Logo from '@bit/vitorbarbosa19.ziro.logo';
import { containerWithPadding } from '@ziro/theme';
import { formatDateUTC3 } from '@ziro/format-date-utc3';
import currencyFormat from '@ziro/currency-format';
import matchStatusColor from '../Transactions/matchStatusColor';
import ReceiptError from './ReceiptError/index';
import useFetch from './useFetch';
import { container, header, body, footer, footerText } from './styles';

export default ({ receiptId, receipt, setReceipt, installments, transactionId }) => {
    const [location, setLocation] = useLocation();
    const [transaction, setTransaction] = useState('');
    const [backRoute, setBackRoute] = useState('');
    const [snapshot, setSnapshot] = useState({});
    const [transactionsMemo, setTransactionsMemo] = useState([]);
    const [loading, setLoading] = useState(false);
    const history = createBrowserHistory();
    let block;
    const { error } = useFetch(receiptId, setLoading, location, setReceipt, setTransaction, setBackRoute, setSnapshot, setTransactionsMemo);
    if (!receiptId) setLocation('/pagamentos');
    else {
        if (!loading && receipt) {
            let headerReceipt = 'pagamento';
            if (receipt.statusZiro === 'Cancelado') {
                headerReceipt = 'estorno';
            }
            block = [
                {
                    header: `Comprovante de ${headerReceipt}`,
                    body: [
                        {
                            title: 'Data',
                            content: `${formatDateUTC3(new Date(receipt.created_at))}`,
                        },
                        {
                            title: 'Vendedor',
                            content: receipt.business_name.toUpperCase(),
                        },
                        {
                            title: 'Total',
                            content: currencyFormat(Math.round(receipt.amount * 100)),
                        },
                        {
                            title: 'Parcelas',
                            content: receipt.installments,
                        },
                        {
                            title: 'Número',
                            content: `${receipt.card.first6_digits}...( ${receipt.card.card_brand} )`,
                        },
                        {
                            title: 'NSU',
                            content: receipt.auth_nsu,
                        },
                        {
                            title: 'Autorização',
                            content: receipt.auth_number.toUpperCase(),
                        },
                        {
                            title: 'Status',
                            content: receipt.statusZiro,
                            color: matchStatusColor(receipt.statusZiro),
                        },
                    ],
                },
            ];

            if (transaction.onBehalfOfBrand && transaction.seller === 'Ziro') {
                block[0].body.splice(2, 0, {
                    title: 'Marca',
                    content: transaction.onBehalfOfBrand,
                });
            }
        }
    }
    const backPath = `/transacoes/${transactionId}`;
    return (
        <>
            {/* eslint-disable-next-line no-nested-ternary */}
            <div style={containerWithPadding}>
                <Header type="icon" title="Comprovante" setIsOpen={backRoute ? () => history.push(backPath, { backRoute, snapshot }) : () => history.push(backPath, { transactionsMemo })} icon="back" />
                {loading ? (
                    <SpinnerWithDiv />
                ) : error ? (
                    <ReceiptError />
                ) : (
                            <motion.div style={container} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <label style={header}>
                                    <Logo size={38} />
                                    Via do Fabricante
            </label>
                                <div style={body}> {receipt && block ? <Details centerTitle blocks={block} /> : null}</div>
                                <div style={footer}>
                                    <label style={footerText}>Ziro Marketplace</label>
                                    <label style={footerText}>CNPJ: 28.026.371/0001-61</label>
                                </div>
                            </motion.div>
                        )}
            </div>
        </>
    );
};
