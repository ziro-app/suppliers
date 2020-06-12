import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import Table from '@bit/vitorbarbosa19.ziro.table';
import Details from '@bit/vitorbarbosa19.ziro.details';
import Icon from '@bit/vitorbarbosa19.ziro.icon';
import Illustration from '@bit/vitorbarbosa19.ziro.illustration';
import Header from '@bit/vitorbarbosa19.ziro.header';
import Error from '@bit/vitorbarbosa19.ziro.error';
import Button from '@bit/vitorbarbosa19.ziro.button';
import Modal from '@bit/vitorbarbosa19.ziro.modal';
import Spinner from '@bit/vitorbarbosa19.ziro.spinner';
import currencyFormat from '@ziro/currency-format';
import { alertColor, containerWithPadding, successColor } from '@ziro/theme';
import { db } from '../../../Firebase/index';
import { dateFormat, parcelFormat, round, stringToFloat } from '../utils';
import { custom, illustrationContainer, buttonContainer, modalContainer, modalLabel, spinner } from './styles';

const TransactionDetails = ({ transactions, transactionId }) => {
  const [receipt_id, setReceipt_id] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [transaction, setTransaction] = useState({});
  const [, setLocation] = useLocation();
  const [copyResultText, setCopyResultText] = useState('');
  const [copyResultStatus, setCopyResultStatus] = useState(true);
  const [cancelModal, setCancelModal] = useState(false);
  const textAreaRef = useRef(null);
  const paymentLink = `https://ziro.app/pagamento/${transactionId}/escolher-cartao?doc`;

  const deleteTransaction = async () => {
    setIsLoading(true);
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
    const effectTransaction = transactions.filter(transaction => transaction.transactionId === transactionId)[0];
    setTransaction(effectTransaction);
    setReceipt_id(effectTransaction.receiptId);
    if (effectTransaction) {
      let block;
      let dataTable;
      let feesFormatted = effectTransaction.fees ? `- ${currencyFormat(parseFloat(effectTransaction.fees.replace('.', '')))}` : '-';
      let liquidFormatted = effectTransaction.fees
        ? currencyFormat(
            parseFloat(`${(stringToFloat(effectTransaction.charge) - parseFloat(effectTransaction.fees)).toFixed(2)}`.replace(/[R$\.,]/g, '')),
          )
        : '-';

      block = [
        {
          header: 'Venda',
          body: [
            {
              title: 'Lojista',
              content: effectTransaction.buyerRazao ? effectTransaction.buyerRazao : '-',
            },
            {
              title: 'Valor',
              content: effectTransaction.charge,
            },
            {
              title: 'Tarifa Ziro Pay',
              content: feesFormatted,
            },
            {
              title: 'Valor líquido',
              content: liquidFormatted,
            },
            {
              title: 'Parcela máxima',
              content: `${effectTransaction.maxInstallments}x`,
            },
            {
              title: 'Parcela escolhida',
              content: effectTransaction.installments ? `${effectTransaction.installments}x` : '-',
            },
            {
              title: 'Data de pagamento',
              content: effectTransaction.date ? `${effectTransaction.date}` : '-',
            },
            {
              title: 'Data de criação do link',
              content: effectTransaction.dateLinkCreated ? `${dateFormat(effectTransaction.dateLinkCreated)}` : '-',
            },
            {
              title: 'Status',
              content: effectTransaction.status,
              color: effectTransaction.statusColor,
            },
          ],
        },
      ];

      if (effectTransaction.receivables.length) {
        const sortedTransactions = effectTransaction.receivables.sort((a, b) => b.installment - a.installment);
        const paidRows = [];
        const paidClicks = [];
        let paidAmount = 0;
        let paidAmountWithoutFees = 0;
        const unpaidRows = [];
        const unpaidClicks = [];
        let unpaidAmount = 0;
        let unpaidAmountWithoutFees = 0;
        sortedTransactions.map(transaction => {
          if (!transaction.paid_at) {
            let upAm = round(parseFloat(transaction.gross_amount), 2);
            let upAmw = round(parseFloat(transaction.amount), 2);
            unpaidRows.push([
              `${transaction.installment}`,
              `${parcelFormat(upAm)}`,
              `${parcelFormat(upAmw)}`,
              `${dateFormat(transaction.expected_on)}`,
              <Icon type="chevronRight" size={14} />,
            ]);
            unpaidClicks.push(() => setLocation(`/transacoes/${transactionId}/${transaction.receivableZoopId}`));
            unpaidAmount += parseFloat(upAm);
            unpaidAmountWithoutFees += parseFloat(upAmw);
          } else {
            let upAm = round(parseFloat(transaction.gross_amount), 2);
            let upAmw = round(parseFloat(transaction.amount), 2);
            paidRows.push([
              `${transaction.installment}`,
              `${parcelFormat(upAm)}`,
              `${parcelFormat(upAmw)}`,
              `${dateFormat(transaction.paid_at)}`,
              <Icon type="chevronRight" size={14} />,
            ]);
            paidClicks.push(() => setLocation(`/transacoes/${transactionId}/${transaction.receivableZoopId}`));
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
      setData(dataTable ? dataTable : []);
    }
  }, []);

  if (isLoading)
    return (
      <div style={spinner}>
        <Spinner size="5.5rem" />
      </div>
    );
  if (!transaction)
    return (
      <Error
        message="Transação inválida ou não encontrada, retorne e tente novamente."
        type="noData"
        title="Erro ao buscar detalhes da transação"
        backRoute="/transacoes"
        backRouteFunction={route => setLocation(route)}
      />
    );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={containerWithPadding}>
      <input type="text" style={{ position: 'absolute', left: '-9999px' }} value={paymentLink} ref={textAreaRef} readOnly />
      <Header type="icon-link" title="Detalhes da venda" navigateTo="transacoes" icon="back" />
      <div style={{ display: 'grid', gridRowGap: '40px' }}>
        <Details blocks={blocks} />
        {receipt_id ? (
          <div style={{ marginTop: '40px' }}>
            <Button type="link" cta="Gerar comprovante" template="regular" navigate={() => setLocation(`/comprovante/${receipt_id}`)} />
          </div>
        ) : null}
        {(transaction.status === 'Aprovado' || transaction.status === 'Pago' || transaction.status === 'Pré Autorizado') && (
          <>
            <Table
              data={data}
              customGrid={{
                gridTemplateColumns: 'auto 1fr 1fr 1fr 20px',
                gridRowGap: '15px',
              }}
            />
            <span style={{ fontFamily: 'Rubik', fontSize: '12px' }}>* Os valores das parcelas foram arredondados para a segunda casa decimal</span>
          </>
        )}
        {(transaction.status === 'Cancelado' || transaction.status === 'Falhado') && (
          <div style={illustrationContainer}>
            <div style={{ display: 'grid', justifyItems: 'center' }}>
              <Illustration type="paymentError" size={175} />
              <span style={custom(15, transaction.statusColor)}>Pagamento cancelado.</span>
            </div>
          </div>
        )}
        {(transaction.status === 'Aguardando Pagamento' || transaction.status === 'Aprovação Pendente') && (
          <>
            <div style={illustrationContainer}>
              <div style={{ display: 'grid', justifyItems: 'center' }}>
                <Illustration type="waiting" size={200} />
              </div>
            </div>
            <div style={buttonContainer}>
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
                ) : (
                  <div style={{ padding: '0 0 5px', height: '24px' }}>&nbsp;</div>
                )}
                <Button type="button" cta="Copiar link" click={copyToClipboard} template="regular" />
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
                <Button type="button" cta="Cancelar link" click={() => setCancelModal(true)} template="destructive" />
              </div>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default TransactionDetails;
