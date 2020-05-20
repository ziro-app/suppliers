import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import Table from '@bit/vitorbarbosa19.ziro.table';
import Details from '@bit/vitorbarbosa19.ziro.details';
import Illustration from '@bit/vitorbarbosa19.ziro.illustration';
import Header from '@bit/vitorbarbosa19.ziro.header';
import Error from '@bit/vitorbarbosa19.ziro.error';
import Button from '@bit/vitorbarbosa19.ziro.button';
import Modal from '@bit/vitorbarbosa19.ziro.modal';
import { alertColor, containerWithPadding, successColor } from '@ziro/theme';
import currencyFormat from '@ziro/currency-format';
import { db } from '../../../Firebase/index';
import { custom, illustrationContainer, buttonContainer, modalContainer, modalLabel } from './styles';

const TransactionDetails = ({ transactions, transactionId, setIsLoading }) => {
    const [data, setData] = useState([]);
    const [blocks, setBlocks] = useState([]);
    const [transaction, setTransaction] = useState({});
    const [, setLocation] = useLocation();
    const [copyResultText, setCopyResultText] = useState('');
    const [copyResultStatus, setCopyResultStatus] = useState(true);
    const [cancelModal, setCancelModal] = useState(false);
    const textAreaRef = useRef(null);
    const paymentLink = `https://catalogo.ziro.app/transacao?doc=${transactionId}`;

    const deleteTransaction = async () => {
        setIsLoading(true);
        try {
            await db.collection('credit-card-payments').doc(transactionId).delete();
            setLocation('/transacoes');
        } catch (error) {
            console.log(error);
            if (error.response) console.log(error.response);
            throw error;
        } finally {
            setIsLoading(false);
        }

    };

    const copyToClipboard = (e) => {
        e.preventDefault()
        if (document.queryCommandSupported('copy')) {
            try {
                textAreaRef.current.select()
                document.execCommand('copy')
                setCopyResultStatus(true)
                setCopyResultText('Copiado !')
                setTimeout(() => {
                    setCopyResultText('')
                }, 2500)
            } catch (error) {
                console.log(error)
                setCopyResultStatus(false)
                setCopyResultText('Erro ao copiar.')
                setTimeout(() => {
                    setCopyResultText('')
                }, 2500)
            }
        } else {
            setCopyResultStatus(false)
            setCopyResultText('Sem suporte para cópia.')
            setTimeout(() => {
                setCopyResultText('')
            }, 2500)
        }

    }

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

    const dateFormat = (date) => {
        if (date) {
            return new Date(date.seconds * 1000)
                .toLocaleDateString('pt-br', {
                    day: '2-digit',
                    month: '2-digit',
                    year: '2-digit'
                })
                .replace(' de ', '/');
        } else return '-';
    }

    const parcelFormat = (number) => {
        if (number === 0) return number;
        let numSplit = ('' + number).split('.');
        if (numSplit.length === 1) return number;
        let num = numSplit[1].length === 1 ? `${number}0` : `${number}`
        const formatted = currencyFormat((num).replace('.', ''));
        return formatted.replace('R$', '');
    }

    useEffect(() => {
        const effectTransaction = transactions.filter(transaction => transaction.transactionId === transactionId);
        setTransaction(effectTransaction[0]);
        if (effectTransaction[0]) {
            let block;
            let dataTable;

            block = [
                {
                    header: 'Compra',
                    body: [
                        {
                            title: 'Lojista',
                            content: effectTransaction[0].buyerRazao ? effectTransaction[0].buyerRazao : '-'
                        },
                        {
                            title: 'Valor',
                            content: effectTransaction[0].charge
                        },
                        {
                            title: 'Parcela máxima',
                            content: `${effectTransaction[0].maxInstallments}x`
                        },
                        {
                            title: 'Parcela escolhida',
                            content: effectTransaction[0].installments ? `${effectTransaction[0].installments}x` : '-'
                        },
                        {
                            title: 'Data',
                            content: effectTransaction[0].date ? `${effectTransaction[0].date}` : '-'
                        },
                        {
                            title: 'Status',
                            content: effectTransaction[0].status,
                            color: effectTransaction[0].statusColor
                        },
                    ]
                }
            ];

            if (effectTransaction[0].receivables.length) {
                const sortedTransactions = effectTransaction[0].receivables.sort((a, b) => b.installment - a.installment);
                const paidRows = [];
                let paidAmount = 0;
                let paidAmountWithoutFees = 0;
                const unpaidRows = [];
                let unpaidAmount = 0;
                let unpaidAmountWithoutFees = 0;
                sortedTransactions.map(transaction => {
                    if (!transaction.paid_at) {
                        let upAm = round(parseFloat(transaction.gross_amount), 2);
                        let upAmw = round(parseFloat(transaction.amount), 2);
                        unpaidRows.push([`${transaction.installment}`, `${parcelFormat(upAm)}`, `${parcelFormat(upAmw)}`, `${dateFormat(transaction.expected_on)}`]);
                        unpaidAmount += parseFloat(upAm);
                        unpaidAmountWithoutFees += parseFloat(upAmw);
                    } else {
                        let upAm = round(parseFloat(transaction.gross_amount), 2);
                        let upAmw = round(parseFloat(transaction.amount), 2);
                        paidRows.push([`${transaction.installment}`, `${parcelFormat(upAm)}`, `${parcelFormat(upAmw)}`, `${dateFormat(transaction.paid_at)}`]);
                        paidAmount += parseFloat(upAm);
                        paidAmountWithoutFees += parseFloat(upAmw);
                    }
                });
                dataTable = [
                    {
                        title: 'Lançamentos Pagos',
                        header: ['Parc.', '(R$) Bruto', '(R$) Líquido', 'Data'],
                        rows: paidRows,
                        totals: ['-', `${parcelFormat(paidAmount)}`, `${parcelFormat(paidAmountWithoutFees)}`, '-']
                    },
                    {
                        title: 'Lançamentos Futuros',
                        header: ['Parc.', '(R$) Bruto', '(R$) Líquido', 'Data'],
                        rows: unpaidRows,
                        totals: ['-', `${parcelFormat(unpaidAmount)}`, `${parcelFormat(unpaidAmountWithoutFees)}`, '-']
                    }
                ]
            }

            setBlocks(block);
            setData(dataTable ? dataTable : []);
        }
    }, []);

    if (!transaction) return <Error message='Transação inválida ou não encontrada, retorne e tente novamente.' type='noData' title='Erro ao buscar detalhes da transação' backRoute='/transacoes' backRouteFunction={(route) => setLocation(route)} />;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={containerWithPadding}>
            <input type="text" style={{ position: 'absolute', left: '-9999px' }} value={paymentLink} ref={textAreaRef} readOnly />
            <Header type='icon-link' title='Detalhes' navigateTo='transacoes' icon='back' />
            <div style={{ display: 'grid', gridRowGap: '12px' }}>
                <Details blocks={blocks} />
                {
                    (transaction.status === 'Aprovado' || transaction.status === 'Pago' || transaction.status === 'Pré Autorizado') &&
                    <>
                        <Table data={data} customGrid={{
                            gridTemplateColumns: 'auto 1fr 1fr 1fr',
                            gridRowGap: '15px'
                        }} />
                        <span style={{ fontFamily: 'Rubik', fontSize: '12px' }}>* Os valores das parcelas foram arredondados para a segunda casa decimal</span>
                    </>
                }
                {
                    (transaction.status === 'Cancelado' || transaction.status === 'Falhado') &&
                    <div style={illustrationContainer}>
                        <div style={{ display: 'grid', justifyItems: 'center' }}>
                            <Illustration type="paymentError" size={175} />
                            <span style={custom(15, transaction.statusColor)}>Pagamento cancelado.</span>
                        </div>
                    </div>
                }
                {
                    (transaction.status === 'Aguardando Pagamento' || transaction.status === 'Aprovação Pendente') &&
                    <>
                        <div style={illustrationContainer}>
                            <div style={{ display: 'grid', justifyItems: 'center' }}>
                                <Illustration type="waiting" size={200} />
                            </div>
                        </div>
                        <div style={buttonContainer}>
                            <div>
                                {copyResultText ?
                                    <div style={{ padding: '0 0 5px', height: '24px', fontSize: '1.6rem', color: copyResultStatus ? successColor : alertColor, textAlign: 'center' }} >
                                        <span>{copyResultText}</span>
                                    </div>
                                    : <div style={{ padding: '0 0 5px', height: '24px' }}>&nbsp;</div>
                                }
                                <Button
                                    type="button"
                                    cta="Copiar link"
                                    click={copyToClipboard}
                                    template='regular'
                                />
                            </div>
                            <div>
                                <Modal boxStyle={modalContainer} isOpen={cancelModal} setIsOpen={() => setCancelModal(false)}>
                                    <div style={{ display: 'grid', gridTemplateRows: '1fr auto', gridRowGap: '20px' }} >
                                        <label style={modalLabel}>Deseja realmente cancelar o link ?</label>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridColumnGap: '20px' }} >
                                            <Button
                                                type="button"
                                                cta="Sim"
                                                click={deleteTransaction}
                                                template='regular'
                                            />
                                            <Button
                                                type="button"
                                                cta="Não"
                                                click={() => setCancelModal(false)}
                                                template='light'
                                            />
                                        </div>
                                    </div>
                                </Modal>
                                <Button
                                    type="button"
                                    cta="Cancelar link"
                                    click={() => setCancelModal(true)}
                                    template='destructive'
                                />
                            </div>
                        </div>
                    </>
                }
            </div>
        </motion.div>
    );
}

export default TransactionDetails