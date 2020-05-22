import React, { useState, useEffect, useContext } from 'react';
import Spinner from '@bit/vitorbarbosa19.ziro.spinner';
import Error from '@bit/vitorbarbosa19.ziro.error';
import TransactionsList from './TransactionsList/index';
import TransactionDetails from './TransactionDetails/index';
import { spinner } from './styles';
import fetch from './fetch';
import { userContext } from '../appContext';

const Transactions = ({ transactionId }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [errorLoading, setErrorLoading] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [payments, setPayments] = useState([]);
    const [totalTransactions, setTotalTransactions] = useState(-1);
    const [lastDoc, setLastDoc] = useState(null);
    const { zoopId } = useContext(userContext);

    useEffect(() => fetch(setIsLoading, setErrorLoading, payments, setPayments, zoopId, 10, lastDoc, setLastDoc, setTotalTransactions, setLoadingMore), []);

    if (isLoading)
        return (
            <div style={spinner}>
                <Spinner size="5.5rem" />
            </div>
        );

    if (errorLoading) return <Error />;
    if (transactionId) return <TransactionDetails transactions={payments} transactionId={transactionId} />;
    return <TransactionsList
        transactions={payments}
        btnMoreClick={() => {
            setLoadingMore(true)
            fetch(setIsLoading, setErrorLoading, payments, setPayments, zoopId, 10, lastDoc, setLastDoc, setTotalTransactions, setLoadingMore)
        }}
        hasMore={!(payments.length === totalTransactions)}
        loadingMore={loadingMore}
    />;

};

export default Transactions;