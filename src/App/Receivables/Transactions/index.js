import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { createBrowserHistory } from 'history';
import Details from '@bit/vitorbarbosa19.ziro.details';
import Header from '@bit/vitorbarbosa19.ziro.header';
import Error from '@bit/vitorbarbosa19.ziro.error';
import Button from '@bit/vitorbarbosa19.ziro.button';
import Spinner from '@bit/vitorbarbosa19.ziro.spinner';
import { containerWithPadding } from '@ziro/theme';
import { spinner, btn } from './styles';
import fetch from './fetch';

const Transactions = ({ receivables, receivableId, snapshot }) => {
    const [isError, setIsError] = useState(false);
    const [customError, setCustomError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [blocks, setBlocks] = useState([]);
    const [date, setDate] = useState('xxx');
    const [, setLocation] = useLocation();
    const history = createBrowserHistory();
    const setState = { setIsError, setCustomError, setIsLoading, setBlocks, setDate };

    useEffect(() => {
        localStorage.setItem('snapshot', JSON.stringify(snapshot));
        fetch(receivables, receivableId, setState);
    }, []);

    if (isLoading)
        return (
            <div style={spinner}>
                <Spinner size="5.5rem" />
            </div>
        );

    if (isError) return <Error />;

    if (customError)
        return (
            <Error
                message="Recebível inválido ou não encontrado, retorne e tente novamente."
                type="noData"
                title="Erro ao buscar transações do recebível"
                backRoute="/recebiveis"
                backRouteFunction={route => setLocation(route)}
            />
        );

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={containerWithPadding}>
            <Header
                type="icon"
                title={date}
                setIsOpen={() => {
                    localStorage.removeItem('snapshot');
                    setLocation('/recebiveis');
                }}
                icon="back"
            />
            <div style={{ display: 'grid', gridRowGap: '40px' }}>
                {blocks.map((block, index) => {
                    return (
                        <div key={index} style={{ display: 'grid', gridRowGap: '10px' }}>
                            <Details blocks={[block]} />
                            <Button style={btn} cta='Ver detalhes' type='button' click={() => history.push(`/transacoes/${block.docId}`, { backRoute: `/recebiveis/${receivableId}`, snapshot })} />
                        </div>
                    );
                })}
            </div>
        </motion.div>
    );
};

export default Transactions;
