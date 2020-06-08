import React, { useState, useMemo, useEffect } from 'react';
import { fontTitle } from '@ziro/theme';
import { useHeader, useHistory } from '@bit/vitorbarbosa19.ziro.flow-manager';
import Header from '@bit/vitorbarbosa19.ziro.header';
import Details from '@bit/vitorbarbosa19.ziro.details';
import Logo from '@bit/vitorbarbosa19.ziro.logo';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import currencyFormat from '@ziro/currency-format';
import translateStatus from './translateStatus';
import matchStatusColor from '../Transactions/matchStatusColor';
import SpinnerWithDiv from '@bit/vitorbarbosa19.ziro.spinner-with-div';
import useFetch from './useFetch';
import { container, header, body, footer, footerText } from './styles';
import ReceiptError from './ReceiptError/index';
import { Menu } from '../Menu/index';
import { formatDateUTC3 } from '@ziro/format-date-utc3'

export default ({ receiptId, receipt, setReceipt, installments, transactionId }) => {
  const [location, setLocation] = useLocation();

  const history = useHistory();

  try {
    if (typeof history[history.length - 1].pathname === 'undefined') {
      setLocation('/transacoes');
    }
  } catch {
    setLocation('/transacoes');
  }

  const backPath = useMemo(() => {
    return `transacoes/${transactionId}`;
    // if (history[history.length - 1].pathname === location) return '/transacoes';

    //return history[history.length - 1].pathname;
  }, [history]);

  const [loading, setLoading] = useState(false);

  let block;
  const { installmentDoc, error } = useFetch(receiptId, setLoading, location, setReceipt, installments, receipt);

  if (!receiptId) setLocation('/pagamentos');
  else {
    if (!loading && receipt) {
      let headerReceipt = '';
      if (receipt.statusZiro === 'Cancelado') {
        headerReceipt = 'Estornado';
      }
      //if (receipt.original_receipt.sales_receipt_cardholder.includes('ESTORNO')) headerReceipt = 'Estornado';
      block = [
        {
          header: `Comprovante de Pagamento${headerReceipt ? ` ${headerReceipt}` : ''}`,
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
              content: currencyFormat(receipt.amount * 100),
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
              title: 'Status',
              content: receipt.statusZiro,
              color: matchStatusColor(receipt.statusZiro),
            },
            {
              title: 'NSU',
              content: receipt.auth_nsu,
            },
            {
              title: 'Autorização',
              content: receipt.auth_number.toUpperCase(),
            },
          ],
        },
      ];
    }
  }
  //if (loading) return <SpinnerWithDiv />;
  //useHeader(<Header title="Comprovante" navigateTo={backPath} />);
  return (
    <>
      <Header type="icon-link" title="Comprovante" navigateTo={backPath} icon="back" />
      {/* eslint-disable-next-line no-nested-ternary */}
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
    </>
  );
};
