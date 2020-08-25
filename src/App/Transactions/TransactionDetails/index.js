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
  async function getTransaction(transactionId, setTransaction, setError, transaction) {
    await fetch(transactionId, setTransaction, setError, transaction);
  }
  function handleInsurance(transaction) {
    if (transaction.insurance === true) {
      if (transaction.zoopPlan.percentage !== 0) {
        return `- ${currencyFormat(
          parseFloat(transaction.charge.replace('R$', '').replace(',', '').replace('.', '')) / transaction.zoopPlan.percentage - (transaction.zoopPlan.amount ? -transaction.zoopPlan.amount : 0),
        )}`;
      }
      return `- ${currencyFormat(parseFloat(transaction.charge.replace('R$', '').replace(',', '').replace('.', '')) - transaction.zoopPlan.amount)}`;
    }
    return '-';
  }

  useEffect(() => {
    getTransaction(transactionId, setTransaction, setError, transaction); /*.then(r => {*/

    if (Object.prototype.hasOwnProperty.call(transaction, 'dateLinkCreated')) {
      let block;
      let dataTable;
      let feesFormatted = transaction.fees ? `- ${currencyFormat(parseFloat(transaction.fees.replace('.', '')))}` : '-';

      let insuranceValueFormatted = Object.prototype.hasOwnProperty.call(transaction, 'receivables') && feesFormatted !== '-' ? handleInsurance(transaction) : '-';

      let liquidFormatted = transaction.fees
        ? currencyFormat(
            parseFloat(
              `${(
                stringToFloat(transaction.charge) -
                parseFloat(transaction.fees) -
                (insuranceValueFormatted !== '-' ? stringToFloat(insuranceValueFormatted.replace(/[R$\.,]/g, '').replace('-', '')) : 0)
              ).toFixed(2)}`.replace(/[R$\.,]/g, ''),
            ),
          )
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
              content: liquidFormatted,
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
            let upAm = round(parseFloat(transaction.gross_amount) + (sortedSplitAmount.length > 0 ? parseFloat(sortedSplitAmount[transaction.installment - 1].gross_amount) : 0), 2);
            let upAmw = round(parseFloat(transaction.amount), 2);
            unpaidRows.push([`${transaction.installment}`, `${parcelFormat(upAm)}`, `${parcelFormat(upAmw)}`, `${dateFormat(transaction.expected_on)}`, <Icon type="chevronRight" size={14} />]);
            if (backRouteEffect) unpaidClicks.push(() => history.push(`/transacoes/${transactionId}/${transaction.receivableZoopId}`, { backRoute: backRouteEffect, snapshot: snapshotEffect }));
            else unpaidClicks.push(() => setLocation(`/transacoes/${transactionId}/${transaction.receivableZoopId}`));
            unpaidAmount += parseFloat(upAm);
            unpaidAmountWithoutFees += parseFloat(upAmw);
          } else {
            let upAm = round(parseFloat(transaction.gross_amount) + (sortedSplitAmount.length > 0 ? parseFloat(sortedSplitAmount[transaction.installment - 1].gross_amount) : 0), 2);
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
    /*});*/
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
