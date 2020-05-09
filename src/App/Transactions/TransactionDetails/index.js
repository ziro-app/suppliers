import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Table from '@bit/vitorbarbosa19.ziro.table';
import Details from '@bit/vitorbarbosa19.ziro.details';
import Illustration from '@bit/vitorbarbosa19.ziro.illustration';
import Header from '@bit/vitorbarbosa19.ziro.header';
import Error from '@bit/vitorbarbosa19.ziro.error';
import { containerWithPadding } from '@ziro/theme';
import currencyFormat from '@ziro/currency-format';
import { custom, illustrationContainer } from './styles';

const TransactionDetails = ({ transactions, transactionId }) => {
    const [data, setData] = useState([])
    const [blocks, setBlocks] = useState([])
    const [transaction, setTransaction] = useState({})

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
        const formatted = currencyFormat(('' + number * 100).replace('.', ''));
        return formatted.replace('R$', '');
    }

    useEffect(() => {
        const effectTransaction = transactions.filter(transaction => transaction.transactionId === transactionId);
        setTransaction(effectTransaction[0]);
        if (effectTransaction[0]) {
            let block;
            let dataTable;
            if (effectTransaction[0].status === 'Aprovada') {
                const installmentsNumber = parseInt(effectTransaction[0].installments);
                const installmentNumber = parseInt(effectTransaction[0].installment);

                if (installmentNumber <= installmentsNumber && installmentsNumber > 0) {
                    const chargeNumber = parseFloat(parseInt(numberFormat(effectTransaction[0].charge)) / 100);
                    const feesNumber = parseFloat(parseInt(numberFormat(effectTransaction[0].fees)) / 100);
                    const chargeWithoutFees = chargeNumber - feesNumber;
                    const parcelWithFees = round((chargeNumber / installmentsNumber), 2);
                    const parcelWithoutFees = round((chargeWithoutFees / installmentsNumber), 2);
                    const paidRows = [];
                    const unpaidRows = [];
                    for (let i = 1; i <= installmentsNumber; i++) {
                        if (i < installmentNumber) {
                            paidRows.push([`${i}`, `${parcelFormat(parcelWithFees)}`, `${parcelFormat(parcelWithoutFees)}`, `${dateFormat(effectTransaction[0].date, i)}`])
                        } else if (i > installmentNumber) {
                            unpaidRows.push([`${i}`, `${parcelFormat(parcelWithFees)}`, `${parcelFormat(parcelWithoutFees)}`, `${dateFormat(effectTransaction[0].date, i)}`])
                        } else unpaidRows.push([`${i}`, `${parcelFormat(parcelWithFees)}`, `${parcelFormat(parcelWithoutFees)}`, `${effectTransaction[0].expectedDate}`])
                    }

                    dataTable = [
                        {
                            title: 'Lançamentos Pagos',
                            header: ['Parc.', '(R$) Bruto', '(R$) Líquido', 'Data'],
                            rows: paidRows,
                            totals: ['-', `${parcelFormat(round(paidRows.length * parcelWithFees, 2))}`, `${parcelFormat(round(paidRows.length * parcelWithoutFees, 2))}`, '-']
                        },
                        {
                            title: 'Lançamentos Futuros',
                            header: ['Parc.', '(R$) Bruto', '(R$) Líquido', 'Data'],
                            rows: unpaidRows,
                            totals: ['-', `${parcelFormat(round(unpaidRows.length * parcelWithFees, 2))}`, `${parcelFormat(round(unpaidRows.length * parcelWithoutFees, 2))}`, '-']
                        }
                    ]

                    block = [
                        {
                            header: 'Compra',
                            body: [
                                {
                                    title: 'Marca',
                                    content: effectTransaction[0].seller
                                },
                                {
                                    title: 'Valor',
                                    content: effectTransaction[0].charge
                                },
                                {
                                    title: 'Forma',
                                    content: `Crédito ${installmentsNumber}x`
                                },
                                {
                                    title: 'Data',
                                    content: `${effectTransaction[0].date}/20`
                                },
                                {
                                    title: 'Status',
                                    content: effectTransaction[0].status,
                                    color: effectTransaction[0].statusColor
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
                                content: effectTransaction[0].seller
                            },
                            {
                                title: 'Valor',
                                content: effectTransaction[0].charge
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
                                content: effectTransaction[0].status,
                                color: effectTransaction[0].statusColor
                            },
                        ]
                    }
                ]
            }
            setBlocks(block)
            setData(dataTable ? dataTable : [])
        }
        /**/
    }, [])

    if (!transaction) return <Error />;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={containerWithPadding}>
            <Header type='icon-link' title='Detalhes' navigateTo='transacoes' icon='back' />
            <div style={{ display: 'grid', gridRowGap: '12px' }}>
                <Details blocks={blocks} />
                {
                    transaction.status === 'Aprovada' &&
                    <>
                        <Table data={data} customGrid={{
                            gridTemplateColumns: 'auto 1fr 1fr 1fr',
                            gridRowGap: '15px'
                        }} />
                        <span style={{ fontFamily: 'Rubik', fontSize: '12px' }}>* Os valores das parcelas foram arredondados para a segunda casa decimal</span>
                    </>
                }
                {
                    transaction.status === 'Cancelado' &&
                    <div style={illustrationContainer}>
                        <div style={{ display: 'grid', justifyItems: 'center' }}>
                            <Illustration type="paymentError" size={175} />
                            <span style={custom(15, transaction.statusColor)}>Pagamento cancelado.</span>
                        </div>
                    </div>
                }
                {
                    transaction.status === 'Aguardando Pagamento' &&
                    <div style={illustrationContainer}>
                        <div style={{ display: 'grid', justifyItems: 'center' }}>
                            <Illustration type="waiting" size={175} />
                            <span style={custom(15, transaction.statusColor)}>Pagamento não realizado.</span>
                        </div>
                    </div>
                }
            </div>
        </motion.div>
    );
}

export default TransactionDetails