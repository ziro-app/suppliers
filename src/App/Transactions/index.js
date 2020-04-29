import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import Spinner from '@bit/vitorbarbosa19.ziro.spinner';
import Error from '@bit/vitorbarbosa19.ziro.error';
import Timeline from '@bit/vitorbarbosa19.ziro.timeline';
import { spinner } from './styles';
import fetch from './fetch';
import { userContext } from '../appContext';

const Transfers = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [errorLoading, setErrorLoading] = useState(false);
    const [payments, setPayments] = useState([]);
    const { zoopId } = useContext(userContext)

    useEffect(() => fetch(setIsLoading, setErrorLoading, setPayments, zoopId), []);

    if (isLoading)
        return (
            <div style={spinner}>
                <Spinner size="5.5rem" />
            </div>
        );
    if (errorLoading) return <Error />;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Timeline transactions={payments} />
        </motion.div>
    );
};

export default Transfers;
