import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import Button from '@bit/vitorbarbosa19.ziro.button';
import Table from '@bit/vitorbarbosa19.ziro.table';
import Error from '@bit/vitorbarbosa19.ziro.error';
import Spinner from '@bit/vitorbarbosa19.ziro.spinner';
import { containerWithPadding } from '@ziro/theme';
import { userContext } from '../appContext';
import fetch from './fetch';

const Collaborators = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [errorLoading, setErrorLoading] = useState(false);
    const [collaborators, setCollaborators] = useState([]);
    const [dataTable, setDataTable] = useState([]);
    const { docId } = useContext(userContext);
    const setState = { setCollaborators, setDataTable };
    const state = { collaborators, dataTable, ...setState };
    const [, setLocation] = useLocation();

    const deleteTransaction = async (setIsLoading) => {
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

    useEffect(() => fetch(setIsLoading, setErrorLoading, docId, setState), []);
    // useEffect(() => {

    // }, [collaborators]);

    if (isLoading)
        return (
            <div style={{ display: 'grid', justifyItems: 'center' }}>
                <Spinner size="5.5rem" />
            </div>
        );
    if (errorLoading) return <Error />;

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'grid', gridTemplateRows: '1fr auto', gridRowGap: '15px' }}>
            <Button type="button" cta="Convidar colaborador" click={() => setLocation('/convidar-colaborador')} template="regular" />
            <Table
                data={dataTable}
                customGrid={{
                    gridTemplateColumns: '1fr 1fr 1fr 20px',
                    gridRowGap: '15px',
                    gridColumnGap: '10px'
                }}
                cellStyle={{
                    width: '100%',
                    height: '100%',
                    fontSize: '1.4rem',
                    textAlign: 'center',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap',
                    cursor: 'pointer'
                }}
            />
        </motion.div>
    );
};

export default Collaborators;
