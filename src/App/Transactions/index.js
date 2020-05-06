import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import Spinner from '@bit/vitorbarbosa19.ziro.spinner';
import Error from '@bit/vitorbarbosa19.ziro.error';
import Timeline from '@bit/vitorbarbosa19.ziro.timeline';
import TransactionDetails from '../TransactionDetails/index';
import currencyFormat from '@ziro/currency-format';
import { spinner } from './styles';
import fetch from './fetch';
import { userContext } from '../appContext';

const Transactions = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [errorLoading, setErrorLoading] = useState(false);
    const [payments, setPayments] = useState([]);
    const [blocks, setBlocks] = useState([]);
    const [data, setData] = useState([]);
    const [showDetails, setShowDetails] = useState(false)
    const [detailsStatus, setDetailsStatus] = useState(false)
    const { docId } = useContext(userContext);

    const round = (num, places) => {
        if (!("" + num).includes("e")) {
            return +(Math.round(num + "e+" + places) + "e-" + places);
        } else {
            let arr = ("" + num).split("e");
            let sig = ""
            if (+arr[1] + places > 0) {
                sig = "+";
            }
            return +(Math.round(+arr[0] + "e" + sig + (+arr[1] + places)) + "e-" + places);
        }
    }

    const dateFormat = (date, plusMonth) => {
        const monthNumber = (parseInt(date.split('/')[1]) + plusMonth) > 12 ? (parseInt(date.split('/')[1]) + plusMonth) % 12 : (parseInt(date.split('/')[1]) + plusMonth)
        if (monthNumber >= 10) return `${date.split('/')[0]}/${monthNumber}`
        return `${date.split('/')[0]}/0${monthNumber}`
    }

    const numberFormat = (number) => {
        if (number) return number.replace(/[R$\.,]/g, '')
    }

    const parcelFormat = (number) => {
        const formatted = currencyFormat(('' + number).replace('.', ''));
        return formatted.replace('R$', '');
    }

    const mountObject = (transaction) => {
        const { charge, date, expectedDate, fees, installment, installments, seller,
            status, statusColor } = transaction;
        let dataTable;
        let block;
        if (status === 'Aprovada') {
            const installmentsNumber = parseInt(installments);
            const installmentNumber = parseInt(installment);

            if (installmentNumber <= installmentsNumber && installmentsNumber > 0) {
                const chargeNumber = parseFloat(parseInt(numberFormat(charge)) / 100);
                const feesNumber = parseFloat(parseInt(numberFormat(fees)) / 100);
                const chargeWithoutFees = chargeNumber - feesNumber;
                const parcelWithFees = round((chargeNumber / installmentsNumber), 2);
                const parcelWithoutFees = round((chargeWithoutFees / installmentsNumber), 2);
                const paidRows = [];
                const unpaidRows = [];
                for (let i = 1; i <= installmentsNumber; i++) {
                    if (i < installmentNumber) {
                        paidRows.push([`${i}`, `${parcelFormat(parcelWithFees * 100)}`, `${parcelFormat(parcelWithoutFees * 100)}`, `${dateFormat(date, i)}`])
                    } else if (i > installmentNumber) {
                        unpaidRows.push([`${i}`, `${parcelFormat(parcelWithFees * 100)}`, `${parcelFormat(parcelWithoutFees * 100)}`, `${dateFormat(date, i)}`])
                    } else unpaidRows.push([`${i}`, `${parcelFormat(parcelWithFees * 100)}`, `${parcelFormat(parcelWithoutFees * 100)}`, `${expectedDate}`])
                }

                dataTable = [
                    {
                        title: 'Lançamentos Pagos',
                        header: ['Parc.', '(R$) Bruto', '(R$) Líquido', 'Data'],
                        rows: paidRows,
                        totals: ['-', `${parcelFormat(round(paidRows.length * parcelWithFees, 2) * 100)}`, `${parcelFormat(round(paidRows.length * parcelWithoutFees, 2) * 100)}`, '-']
                    },
                    {
                        title: 'Lançamentos Futuros',
                        header: ['Parc.', '(R$) Bruto', '(R$) Líquido', 'Data'],
                        rows: unpaidRows,
                        totals: ['-', `${parcelFormat(round(unpaidRows.length * parcelWithFees, 2) * 100)}`, `${parcelFormat(round(unpaidRows.length * parcelWithoutFees, 2) * 100)}`, '-']
                    }
                ]

                block = [
                    {
                        header: 'Compra',
                        body: [
                            {
                                title: 'Marca',
                                content: seller
                            },
                            {
                                title: 'Valor',
                                content: charge
                            },
                            {
                                title: 'Forma',
                                content: `Crédito ${installmentsNumber}x`
                            },
                            {
                                title: 'Data',
                                content: `${date}/20`
                            },
                            {
                                title: 'Status',
                                content: status,
                                color: statusColor
                            },
                        ]
                    }
                ]
            }
        } else {
            block = [
                {
                    header: 'Compra',
                    body: [
                        {
                            title: 'Marca',
                            content: seller
                        },
                        {
                            title: 'Valor',
                            content: charge
                        },
                        {
                            title: 'Forma',
                            content: `-`
                        },
                        {
                            title: 'Data',
                            content: `-`
                        },
                        {
                            title: 'Status',
                            content: status,
                            color: statusColor
                        },
                    ]
                }
            ]
        }

        setDetailsStatus(status)
        setBlocks(block)
        setData(dataTable ? dataTable : [])
        setShowDetails(true)
    }

    useEffect(() => fetch(setIsLoading, setErrorLoading, setPayments, docId), []);

    if (isLoading)
        return (
            <div style={spinner}>
                <Spinner size="5.5rem" />
            </div>
        );
    if (errorLoading) return <Error />;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {!showDetails && <Timeline transactions={payments} onClick={({ transaction }) => mountObject(transaction)} />}
            {showDetails && <TransactionDetails status={detailsStatus} data={data} blocks={blocks} onclick={() => setShowDetails(false)} />}
        </motion.div>
    );

};

export default Transactions;
