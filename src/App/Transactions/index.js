import React, { useContext, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Error from '@bit/vitorbarbosa19.ziro.error';
import Spinner from '@bit/vitorbarbosa19.ziro.spinner-with-div'
import { userContext } from '../appContext';
import ReceivableDetails from './ReceivableDetails/index';
import TransactionDetails from './TransactionDetails/index';
import TransactionsList from './TransactionsList/index';
import fetch from './fetch';
import fetchList from './fetchList'

const Transactions = ({ transactionId, receivableId, setTransactionId }) => {
    const storageFilterStatus = localStorage.getItem('statusFilter')
    const storageFilterMonth = localStorage.getItem('monthFilter')
    const storageFilterClient = localStorage.getItem('clientFilter')
    const [statusFilter, setStatusFilter] = useState(storageFilterStatus || '');
    const [monthFilter, setMonthFilter] = useState(storageFilterMonth || '');
    const [clientFilter, setClientFilter] = useState(storageFilterClient || '')
    const [clientList, setClientList] = useState([])
    const [listStatus, setListStatus] = useState([])
    const [limitFetch, setLimitFetch] = useState(20);
    const [transaction, setTransaction] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [errorLoading, setErrorLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [payments, setPayments] = useState([]);
    const [firstDate, setFirstDate] = useState(new Date())
    const [isLoadingResults, setIsLoadingResults] = useState(false)
    const [totalTransactions, setTotalTransactions] = useState(-1);
    const snap = { payments, totalTransactions };
    const { zoopId, docId, role } = useContext(userContext);
    const isCollaborator = role !== ''
    const state = { listStatus, setListStatus, limitFetch, setLimitFetch, isLoadingResults, setIsLoadingResults, setFirstDate, setClientList, setIsLoading, setErrorLoading, payments, setPayments, zoopId, setTotalTransactions, setLoadingMore, docId, isCollaborator, firstDate, clientList, clientFilter, setClientFilter, statusFilter, setStatusFilter, monthFilter, setMonthFilter, loadingMore, setTransaction }

    useEffect(() => {
        fetchList(state)
    },[])

    useEffect(() => {
        fetch(state);
    }, [isLoadingResults]);

    if (isLoading)
        return (
            <Spinner size="5rem" />
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
                btnMoreClick={() => {
                    setLoadingMore(true);
                    setLimitFetch(limitFetch + 20)
                    fetch({ ...state, limitFetch: limitFetch + 20 });
                }}
                hasMore={!(payments.length === totalTransactions)}
                state={state}
            />
        </motion.div>
    );
};

export default Transactions;
