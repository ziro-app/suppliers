import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import Spinner from '@bit/vitorbarbosa19.ziro.spinner';
import Error from '@bit/vitorbarbosa19.ziro.error';
import Timeline from '@bit/vitorbarbosa19.ziro.timeline';
import TransactionDetails from './TransactionDetails/index';
import { successColor, warningColor } from '@ziro/theme';
import { spinner } from './styles';
import fetch from './fetch';
import { userContext } from '../appContext';



const data = [
    {
        title: 'Lançamentos Pagos',
        header: ['Parc.', '(R$) Bruto', '(R$) Líquido', 'Data'],
        rows: [
            ['1', '1.000,11', '950,00', '23/03'],
            ['2', '1.000,11', '950,00', '23/04']
        ],
        totals: ['-', '2.000,22', '1.900,00', '-']
    },
    {
        title: 'Lançamentos Futuros',
        header: ['Parc.', '(R$) Bruto', '(R$) Líquido', 'Data'],
        rows: [
            ['3', '1.000,11', '950,00', '23/05']
        ],
        totals: ['-', '1.000,11', '950,00', '-']
    }
]

const Transfers = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [errorLoading, setErrorLoading] = useState(false);
    const [payments, setPayments] = useState([]);
    const [payment, setPayment] = useState([]);
    const [blocks, setBlocks] = useState([]);
    const [data, setData] = useState([]);
    const [showDetails, setShowDetails] = useState(false)
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

    const mountObject = (transaction) => {
        const { cardHolder, cardNumber, charge, date, expectedDate, fees, installment,
            installments, maxInstallments, seller, sellerZoopId, status } = transaction;
        let block = [
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
                        content: `Crédito ${installments}x`
                    },
                    {
                        title: 'Data',
                        content: `${date}/20`
                    },
                    {
                        title: 'Status',
                        content: status,
                        color: status === 'Pago' ? successColor : warningColor
                    },
                ]
            }
        ]
        if (installment <= installments && installments > 0) {
            const chargeWithoutFees = charge - fees;
            const parcelWithFees = round(charge / installments, 2);
            const parcelWithoutFees = round(chargeWithoutFees / installments, 2);
            // Acrescentar a lógica da criação dos vetores corretos
            let paidRows, unpaidRows;

            let date = [
                {
                    title: 'Lançamentos Pagos',
                    header: ['Parc.', '(R$) Bruto', '(R$) Líquido', 'Data'],
                    rows: [
                        ['1', '1.000,11', '950,00', '23/03'],
                        ['2', '1.000,11', '950,00', '23/04']
                    ],
                    totals: ['-', '2.000,22', '1.900,00', '-']
                },
                {
                    title: 'Lançamentos Futuros',
                    header: ['Parc.', '(R$) Bruto', '(R$) Líquido', 'Data'],
                    rows: [
                        ['3', '1.000,11', '950,00', '23/05']
                    ],
                    totals: ['-', '1.000,11', '950,00', '-']
                }
            ]
            setShowDetails(true)
        }
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
            {showDetails && <TransactionDetails onclick={() => setShowDetails(false)} />}
        </motion.div>
    );

};

export default Transfers;
