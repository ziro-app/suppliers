import React, { useContext, useEffect, useState } from 'react';
import { createBrowserHistory } from 'history';
import { motion } from 'framer-motion';
import Error from '@bit/vitorbarbosa19.ziro.error';
import Spinner from '@bit/vitorbarbosa19.ziro.spinner';
import { userContext } from '../appContext';
import ReceivableDetails from './ReceivableDetails/index';
import TransactionDetails from './TransactionDetails/index';
import TransactionsList from './TransactionsList/index';
import getDoc from './getDoc';
import fetch from './fetch';
import { spinner } from './styles';

const Transactions = ({ transactionId, receivableId, setTransactionId }) => {
    const [transaction, setTransaction] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [errorLoading, setErrorLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [payments, setPayments] = useState([]);
    const [totalTransactions, setTotalTransactions] = useState(-1);
    const [lastDoc, setLastDoc] = useState(null);
    const snap = { payments, totalTransactions, lastDoc };
    const { zoopId, docId, role } = useContext(userContext);
    const history = createBrowserHistory();

    useEffect(() => {
        const { state } = history.location;

        const useTransactionsMemo = async transactionsMemo => {
            const { payments, totalTransactions, lastDoc } = transactionsMemo;
            const ref = await getDoc(lastDoc);
            setPayments(payments);
            setTotalTransactions(totalTransactions);
            setLastDoc(ref);
            setIsLoading(false);
        };

        if (state && state.transactionsMemo) useTransactionsMemo(state.transactionsMemo);
        else fetch(setIsLoading, setErrorLoading, payments, setPayments, zoopId, 10, lastDoc, setLastDoc, setTotalTransactions, setLoadingMore, docId, role !== '');
    }, []);

    if (isLoading)
        return (
            <div style={spinner}>
                <Spinner size="5rem" />
            </div>
        );

    if (errorLoading) return <Error />;
    if (transactionId && receivableId)
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <ReceivableDetails transactions={payments} transactionId={transactionId} receivableId={receivableId} transaction={transaction} setTransaction={setTransaction} />
            </motion.div>
        );
    if (transactionId) setTransactionId(transactionId);
    if (transactionId)
        return (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <TransactionDetails transactions={payments} transactionId={transactionId} transaction={transaction} setTransaction={setTransaction} setPayments={setPayments} transactionsMemo={snap} />
            </motion.div>
        );
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <TransactionsList
                transactions={payments}
                btnMoreClick={() => {
                    setLoadingMore(true);
                    fetch(setIsLoading, setErrorLoading, payments, setPayments, zoopId, 10, lastDoc, setLastDoc, setTotalTransactions, setLoadingMore, docId, role !== '');
                }}
                hasMore={!(payments.length === totalTransactions)}
                loadingMore={loadingMore}
                setTransaction={setTransaction}
            />
        </motion.div>
    );
};

export default Transactions;
