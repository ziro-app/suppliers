import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRoute } from 'wouter';
import Table from '@bit/vitorbarbosa19.ziro.table';
import Details from '@bit/vitorbarbosa19.ziro.details';
import Illustration from '@bit/vitorbarbosa19.ziro.illustration';
import Header from '@bit/vitorbarbosa19.ziro.header';
import { containerWithPadding } from '@ziro/theme';
import currencyFormat from '@ziro/currency-format';
import { custom, illustrationContainer } from './styles';

const TransactionDetails = () => {
    const [data, setData] = useState([])
    const [blocks, setBlocks] = useState([])
    const { charge, date, expectedDate, fees, installment, installments, seller,
        status, statusColor } = useRoute('/transacoes/:charge/:date/:expectedDate/:fees/:installment/:installments/:seller/:status/:statusColor')[1]

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
                        paidRows.push([`${i}`, `${parcelFormat(parcelWithFees)}`, `${parcelFormat(parcelWithoutFees)}`, `${dateFormat(date.replace('-', '/'), i)}`])
                    } else if (i > installmentNumber) {
                        unpaidRows.push([`${i}`, `${parcelFormat(parcelWithFees)}`, `${parcelFormat(parcelWithoutFees)}`, `${dateFormat(date.replace('-', '/'), i)}`])
                    } else unpaidRows.push([`${i}`, `${parcelFormat(parcelWithFees)}`, `${parcelFormat(parcelWithoutFees)}`, `${expectedDate.replace('-', '/')}`])
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
                                content: seller.split('_').join(' ')
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
                                content: `${date.replace('-', '/')}/20`
                            },
                            {
                                title: 'Status',
                                content: status.split('_').join(' '),
                                color: `#${statusColor}`
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
                            content: seller.split('_').join(' ')
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
                            content: status.split('_').join(' '),
                            color: `#${statusColor}`
                        },
                    ]
                }
            ]
        }
        setBlocks(block)
        setData(dataTable ? dataTable : [])
    }, [])

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={containerWithPadding}>
            <Header type='icon-link' title='Detalhes' navigateTo='transacoes' icon='back' />
            <div style={{ display: 'grid', gridRowGap: '12px' }}>
                <Details blocks={blocks} />
                {
                    status === 'Aprovada' &&
                    <>
                        <Table data={data} customGrid={{
                            gridTemplateColumns: 'auto 1fr 1fr 1fr',
                            gridRowGap: '15px'
                        }} />
                        <span style={{ fontFamily: 'Rubik', fontSize: '12px' }}>* Os valores das parcelas foram arredondados para a segunda casa decimal</span>
                    </>
                }
                {
                    status === 'Cancelado' &&
                    <div style={illustrationContainer}>
                        <div style={{ display: 'grid', justifyItems: 'center' }}>
                            <Illustration type="paymentError" size={175} />
                            <span style={custom(15, `#${statusColor}`)}>Pagamento cancelado.</span>
                        </div>
                    </div>
                }
                {
                    status.split('_').join(' ') === 'Aguardando Pagamento' &&
                    <div style={illustrationContainer}>
                        <div style={{ display: 'grid', justifyItems: 'center' }}>
                            <Illustration type="waiting" size={175} />
                            <span style={custom(15, `#${statusColor}`)}>Pagamento não realizado.</span>
                        </div>
                    </div>
                }
            </div>
        </motion.div>
    );
}

export default TransactionDetails