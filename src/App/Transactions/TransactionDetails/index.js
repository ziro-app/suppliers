/* eslint-disable no-useless-escape */
/* eslint-disable no-nested-ternary */
/* eslint-disable prefer-const */
import React, { useContext, useEffect, useRef, useState } from 'react';
import { alertColor, containerWithPadding, successColor } from '@ziro/theme';
import { btn, btnRed, buttonContainer, custom, illustrationContainer, modalContainer, modalLabel, spinner } from './styles';
import { dateFormat, parcelFormat, round, stringToFloat } from '../utils';

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
import { db } from '../../../Firebase/index';
import fetch from './fetch';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { userContext } from '../../appContext';

const TransactionDetails = ({ transactions, transactionId, transaction, setTransaction }) => {
  const [receipt_id, setReceipt_id] = useState('');
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [blocks, setBlocks] = useState([]);
  const [, setLocation] = useLocation();
  const [copyResultText, setCopyResultText] = useState('');
  const [copyResultStatus, setCopyResultStatus] = useState(true);
  const [cancelModal, setCancelModal] = useState(false);
  const [backRoute, setBackRoute] = useState('');
  const [snapshotMemo, setSnapshotMemo] = useState({});
  const { role } = useContext(userContext);
  const textAreaRef = useRef(null);
  const history = createBrowserHistory();
  const [olderTransaction, setOlderTransaction] = useState(false);
  const paymentLink = process.env.HOMOLOG ? `http://localhost:8080/pagamento/${transactionId}/escolher-cartao?doc` : `https://ziro.app/pagamento/${transactionId}/escolher-cartao?doc`;
  let insuranceValueFormatted = '-';
  let markupValueFormatted = '-';
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
    setTransaction({});
  }, []);
  async function getTransaction(transactionId, setTransaction, setError, transaction) {
    await fetch(transactionId, setTransaction, setError, transaction);
    if (Object.prototype.hasOwnProperty.call(transaction, 'splitPaymentPlan')) {
      if (transaction.splitPaymentPlan === '' || (transaction.splitPaymentPlan.markup.percentage === 0 && transaction.splitPaymentPlan.markup.amount === 0)) setOlderTransaction(true);
      else setOlderTransaction(false);
    } else setOlderTransaction(false);
  }
  function handleInsurance(transaction) {
    if (transaction.insurance === true && transaction.splitPaymentPlan) {
      return `- ${parseFloat(transaction.splitPaymentPlan.antiFraud.receivable_amount).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' }).replace(/\s/g, '')}`;
    }
  }
  function handleMarkup(transaction) {
    return `- ${parseFloat(transaction.splitPaymentPlan.markup.receivable_amount).toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })}`;
  }

  useEffect(() => {
    getTransaction(transactionId, setTransaction, setError, transaction).then(r => {
      if (Object.prototype.hasOwnProperty.call(transaction, 'dateLinkCreated')) {
        let block;
        let dataTable;
        let feesFormatted =
          transaction.status !== 'Cancelado' && transaction.fees
            ? ` ${
                transaction.splitPaymentPlan && (transaction.splitPaymentPlan.markup.amount || transaction.splitPaymentPlan.markup.percentage)
                  ? '- '.concat(
                      parseFloat(parseFloat(transaction.splitPaymentPlan.markup.receivable_gross_amount) + parseFloat(transaction.fees))
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
        insuranceValueFormatted =
          transaction.status !== 'Cancelado' &&
          Object.prototype.hasOwnProperty.call(transaction, 'receivables') &&
          feesFormatted !== '-' &&
          transaction.splitPaymentPlan &&
          (transaction.splitPaymentPlan.antiFraud.amount || transaction.splitPaymentPlan.antiFraud.percentage)
            ? handleInsurance(transaction)
            : '- R$0,00';
        markupValueFormatted =
          Object.prototype.hasOwnProperty.call(transaction, 'receivables') &&
          feesFormatted !== '-' &&
          transaction.splitPaymentPlan &&
          (transaction.splitPaymentPlan.markup.amount || transaction.splitPaymentPlan.markup.percentage)
            ? handleMarkup(transaction)
            : '-';
        let liquidFormatted =
          transaction.status !== 'Cancelado' && markupValueFormatted !== '-'
            ? currencyFormat(
                parseFloat(
                  `${(
                    stringToFloat(transaction.charge) -
                    (markupValueFormatted !== '-' ? stringToFloat(markupValueFormatted.replace(/[R$\.,]/g, '').replace('-', '')) : 0) -
                    parseFloat(transaction.fees) -
                    (insuranceValueFormatted !== '-' ? stringToFloat(insuranceValueFormatted.replace(/[R$\.,]/g, '').replace('-', '')) : 0)
                  ).toFixed(2)}`.replace(/[R$\.,]/g, ''),
                ),
              )
            : transaction.fees
            ? currencyFormat(parseFloat(`${(stringToFloat(transaction.charge) - transaction.fees).toFixed(2)}`.replace(/[R$\.,]/g, '')))
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
                content: transaction.status !== 'Cancelado' ? liquidFormatted : '-',
              },
              {
                title: 'Parcela máxima',
                content: `${transaction.maxInstallments}x`,
              },
              {
                title: 'Parcela escolhida',
                content: transaction.installments ? `${transaction.installments}x` : '-',
              },
              {
                title: 'Data de pagamento',
                content: transaction.date ? `${transaction.date}` : '-',
              },
              {
                title: 'Data de criação do link',
                content: transaction.dateLinkCreated ? `${dateFormat(transaction.dateLinkCreated)}` : '-',
              },
              {
                title: 'Status',
                content: transaction.status,
                color: transaction.statusColor,
              },
            ],
          },
        ];
        if (transaction.collaboratorName) {
          block[0].body.splice(8, 0, {
            title: 'Link criado por',
            content: transaction.collaboratorName,
          });
        }
        if (transaction.observations) {
          block[0].body.splice(transaction.collaboratorName ? 9 : 8, 0, {
            title: 'Observações',
            content: transaction.observations,
          });
        }
        if (transaction.onBehalfOfBrand && transaction.seller.includes('Ziro')) {
          block[0].body.splice(1, 0, {
            title: 'Marca',
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
          const sumReceivablesSplitZoop =
            sortedSplitAmount.length > 0
              ? sortedSplitAmount.filter(item => item.split_rule === transaction.splitPaymentPlan.antiFraud.id).reduce((acc, { gross_amount }) => acc + parseFloat(gross_amount), 0)
              : [];
          const sumReceivablesSplitZiro =
            sortedSplitAmount.length > 0
              ? sortedSplitAmount.filter(item => item.split_rule === transaction.splitPaymentPlan.markup.id).reduce((acc, { gross_amount }) => acc + parseFloat(gross_amount), 0)
              : [];
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
            /* antigo if com problema de soma
          if (!transaction.paid_at) {
            let upAm = round(parseFloat(transaction.gross_amount) + (sortedSplitAmount.length > 0 ? sumSplit : 0), 2);
            let index = arrayReceivablesSplitZiro.findIndex(receivable => receivable.installment === transaction.installment);
            let upAmw = olderTransaction ? round(parseFloat(transaction.gross_amount), 2) : round(parseFloat(transaction.amount), 2);
            unpaidRows.push([`${transaction.installment}`, `${parcelFormat(upAm)}`, `${parcelFormat(upAmw)}`, `${dateFormat(transaction.expected_on)}`, <Icon type="chevronRight" size={14} />]);
            if (backRouteEffect) unpaidClicks.push(() => history.push(`/transacoes/${transactionId}/${transaction.receivableZoopId}`, { backRoute: backRouteEffect, snapshot: snapshotEffect }));
            else unpaidClicks.push(() => setLocation(`/transacoes/${transactionId}/${transaction.receivableZoopId}`));
            unpaidAmount += parseFloat(upAm);
            unpaidAmountWithoutFees += parseFloat(upAmw);
          }*/
            if (!transaction.paid_at) {
              let upAm = round(parseFloat(transaction.gross_amount) + (sortedSplitAmount.length > 0 ? sumSplit : 0), 2);
              let upAmw = round(parseFloat(transaction.amount), 2);
              unpaidRows.push([`${transaction.installment}`, `${parcelFormat(upAm)}`, `${parcelFormat(upAmw)}`, `${dateFormat(transaction.expected_on)}`, <Icon type="chevronRight" size={14} />]);
              if (backRouteEffect) unpaidClicks.push(() => history.push(`/transacoes/${transactionId}/${transaction.receivableZoopId}`, { backRoute: backRouteEffect, snapshot: snapshotEffect }));
              else unpaidClicks.push(() => setLocation(`/transacoes/${transactionId}/${transaction.receivableZoopId}`));
              unpaidAmount += parseFloat(upAm);
              unpaidAmountWithoutFees += parseFloat(upAmw);
              /*let upAm = round(parseFloat(transaction.gross_amount) + (sortedSplitAmount.length > 0 ? sumSplit : 0), 2);
            let upAmw = olderTransaction ? round(parseFloat(transaction.amount), 2) : round(parseFloat(transaction.gross_amount), 2);
            unpaidRows.push([`${transaction.installment}`, `${parcelFormat(upAm)}`, `${parcelFormat(upAmw)}`, `${dateFormat(transaction.expected_on)}`, <Icon type="chevronRight" size={14} />]);
            unpaidClicks.push(() => setLocation(`/transacoes/${transactionId}/${transaction.receivableZoopId}`));
            unpaidAmount += parseFloat(upAm);
            unpaidAmountWithoutFees += parseFloat(upAmw);*/
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
        setData(dataTable ? dataTable : []);
      }
    });
    if (transaction.hasOwnProperty('receiptId')) {
      setReceipt_id(transaction.receiptId);
    }
  }, [transaction]);

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
  const isApproved = transaction.status === 'Aprovado' || transaction.status === 'Pago' || transaction.status === 'Pré Autorizado';
  const isCanceled = transaction.status === 'Cancelado' || transaction.status === 'Falhado';
  const isWaiting = transaction.status === 'Aguardando Pagamento' || transaction.status === 'Aprovação Pendente';
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={containerWithPadding}>
      <input type="text" style={{ position: 'absolute', left: '-9999px' }} value={paymentLink} ref={textAreaRef} readOnly />
      <Header type="icon" title="Detalhes da venda" setIsOpen={backRoute ? () => history.push(backRoute, { snapshot: snapshotMemo }) : () => setLocation('/transacoes')} icon="back" />
      <div style={{ display: 'grid', gridRowGap: isApproved ? '20px' : '0' }}>
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
            <span style={{ marginTop: '20px', fontFamily: 'Rubik', fontSize: '12px' }}>* Valores arredondados para a segunda casa decimal</span>
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
              type="link"
              cta="Gerar comprovante"
              template="regular"
              navigate={
                backRoute
                  ? () => history.push(`/comprovante/${transaction.transactionId}/${receipt_id}`, { backRoute, snapshot: snapshotMemo })
                  : () => setLocation(`/comprovante/${transaction.transactionId}/${receipt_id}`)
              }
            />
          </div>
        ) : null}
      </div>
    </motion.div>
  );
};

export default TransactionDetails;
