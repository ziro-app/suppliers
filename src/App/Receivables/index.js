import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import Spinner from '@bit/vitorbarbosa19.ziro.spinner';
import Error from '@bit/vitorbarbosa19.ziro.error';
import BankInfo from './BankInfo/index';
import Transactions from './Transactions/index';
import Table from '@bit/vitorbarbosa19.ziro.table';
import Button from '@bit/vitorbarbosa19.ziro.button';
import { Menu } from '../Menu/index';
import { cellStyle, contentStyle, customGrid, info, spinner, titleStyle } from './styles';
import fetch from './fetch';
import totalFetch from './totalFetch';
import { userContext } from '../appContext';


const Receivables = ({ receivableId }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [errorLoading, setErrorLoading] = useState(false);
    const [receivables, setReceivables] = useState([]);
    const [data, setData] = useState([]);
    const [total, setTotal] = useState(-1);
    const [currencyTotal, setCurrencyTotal] = useState('');
    const [, setLocation] = useLocation();
    const setState = { setIsLoading, setErrorLoading, setReceivables, setData, setTotal, setCurrencyTotal, setLocation };
    const { zoopId } = useContext(userContext);

    useEffect(() => totalFetch(setIsLoading, setErrorLoading, zoopId, setTotal), []);

    useEffect(() => fetch(zoopId, total, setState), [total]);

    if (isLoading)
        return (
            <div style={spinner}>
                <Spinner size="5rem" />
            </div>
        );

    if (errorLoading) return <Error />;

    if (total === 0) return (
        <Error
            message="Nenhum recebível cadastrado até o momento"
            type="noData"
            title="Recebíveis"
            backRoute="/transacoes"
            backRouteFunction={route => setLocation(route)}
        />
    );

    if (receivableId && receivableId === 'dados-bancarios') return <BankInfo />

    if (receivableId && receivableId !== 'dados-bancarios') return <Transactions receivableId={receivableId} receivables={receivables} />

    return (
        <Menu title='Recebíveis'>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={{ display: 'grid', gridRowGap: '20px' }}>
                    <Button cta="Configurar Dados Dancários" navigate={() => setLocation('recebiveis/dados-bancarios')} type="link" />

                    <div style={info}>
                        <label style={titleStyle}>VALOR À RECEBER</label>
                        <label style={contentStyle}>{currencyTotal}</label>
                    </div>

                    <Table
                        data={data}
                        cellStyle={cellStyle}
                        customGrid={customGrid}
                    />

                </div>

            </motion.div>
        </Menu>
    );
};

export default Receivables;
