import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'wouter'
import { motion } from 'framer-motion';
import Spinner from '@bit/vitorbarbosa19.ziro.spinner';
import Error from '@bit/vitorbarbosa19.ziro.error';
import Timeline from '@bit/vitorbarbosa19.ziro.timeline';
import { spinner } from './styles';
import fetch from './fetch';
import { userContext } from '../appContext';

const Transactions = () => {
    const [, setLocation] = useLocation();
    const [isLoading, setIsLoading] = useState(true);
    const [errorLoading, setErrorLoading] = useState(false);
    const [payments, setPayments] = useState([]);
    const { docId } = useContext(userContext);

    const mountLink = (transaction) => {
        const { charge, date, expectedDate, fees, installment, installments, seller,
            status, statusColor } = transaction;
        setLocation(`/transacoes/${charge}/${date.replace('/', '-')}/${expectedDate.replace('/', '-')}/${fees}/${installment}/${installments}/${seller.split(' ').join('_')}/${status.split(' ').join('_')}/${statusColor.replace('#', '')}`)
        return
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
            <Timeline transactions={payments} onClick={({ transaction }) => mountLink(transaction)} />
        </motion.div>
    );

};

export default Transactions;
