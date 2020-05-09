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
    const [payments, setPayments] = useState([]);
    const { docId } = useContext(userContext);

    useEffect(() => fetch(setIsLoading, setErrorLoading, setPayments, docId), []);

    if (isLoading)
        return (
            <div style={spinner}>
                <Spinner size="5.5rem" />
            </div>
        );
    if (errorLoading) return <Error />;

    if (transactionId) return <TransactionDetails transactions={payments} transactionId={transactionId} />
    return <TransactionsList transactions={payments} />

};

export default Transactions;