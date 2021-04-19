import React, { useState, useEffect, useContext } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { createBrowserHistory } from 'history';
import Spinner from '@bit/vitorbarbosa19.ziro.spinner';
import Error from '@bit/vitorbarbosa19.ziro.error';
import Table from '@bit/vitorbarbosa19.ziro.table';
import Button from '@bit/vitorbarbosa19.ziro.button';
import Icon from '@bit/vitorbarbosa19.ziro.icon';
import Illustration from '@bit/vitorbarbosa19.ziro.illustration';
import currencyFormat from '@ziro/currency-format';
import { alertColor } from '@ziro/theme';
import { Menu } from '../Menu/index';
import { round } from '../Transactions/utils';
import { userContext } from '../appContext';
import BankInfo from '../BankInfo/index';
import RedeemBalance from './RedeemBalance/index';
import Transactions from './Transactions/index';
import { btn, cellStyle, contentStyle, customGrid, illustrationContainer, illustrationTitle, info, spinner, titleStyle } from './styles';
import fetch from './fetch';
import fetchBalance from './fetchBalance';
import fetchPaidReceivables from './fetchPaidReceivables';
import convertCsv from './utils/convertCsv';
import convertCsv2 from './utils/convertCsv2';

const Receivables = ({ receivableId }) => {
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [errorLoading, setErrorLoading] = useState(false);
    const [receivables, setReceivables] = useState([]);
    const [data, setData] = useState([]);
    const [hasMore, setHasMore] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [initDate, setInitDate] = useState(new Date());
    const [finalDate, setFinalDate] = useState();
    const [totalAmount, setTotalAmount] = useState(0);
    const [totalTransactions, setTotalTransactions] = useState(0);
    const [days, setDays] = useState(0);
    const [balance, setBalance] = useState('');
    const [, setLocation] = useLocation();
    const history = createBrowserHistory();
    const setState = {
        setIsLoading, setErrorLoading, setReceivables, setData, setLocation,
        setHasMore, setLoadingMore, setInitDate, setFinalDate, setTotalAmount,
        setDays, setTotalTransactions, setBalance
    };
    const state = { receivables, hasMore, loadingMore, initDate, finalDate, totalAmount, days, totalTransactions, balance };
    const { zoopId, payoutAutomatic, fantasy } = useContext(userContext);

    const runFetchPaidReceivables = async () => {
        try {
            const paidReceivables = await fetchPaidReceivables(zoopId, setIsError)
            convertCsv2(paidReceivables, 'Recebiveis Pagos.csv')
            return setIsError(false)
        } catch (error) {
            setIsError(true)
            console.log("Erro ao rodar função de buscar recebíveis.", error)
        }
    };

    const handleClick = () => {
        setLoadingMore(true);
        const day = new Date(finalDate);
        day.setDate(finalDate.getDate() + 1);
        setInitDate(day);
        fetch(zoopId, day, totalAmount, totalTransactions, data, days, receivables, setState);
    };

    const moneyFormat = value => value ? currencyFormat(round(value, 2).toFixed(2).replace('.', '')) : 'R$ 0,00';

    const mountTable = (tableRows, totalAmount, totalTransactions) => {
        const rows = [];
        const rowsClicks = [];
        tableRows.map(tableRow => {
            const { charge, date, id, items } = tableRow;
            rows.push([date, charge.replace('R$', ''), items.length, <Icon type="chevronRight" size={14} />]);
            rowsClicks.push(() => setLocation(`/recebiveis/${id}`));
        });
        setData([{
            title: 'Valores à receber',
            header: ['Data', 'Valor(R$)', 'Qntd vendas', ''],
            rows,
            rowsClicks,
            totals: ['-', currencyFormat(round(totalAmount, 2).toFixed(2).replace('.', '')), totalTransactions, '-']
        }]);
    };

    const useSnapshot = snapshot => {
        const { receivables, hasMore, loadingMore, initDate, finalDate, totalAmount, days, totalTransactions, balance } = snapshot;
        setReceivables(receivables);
        setHasMore(hasMore);
        setLoadingMore(loadingMore);
        setInitDate(new Date(initDate));
        setFinalDate(new Date(finalDate));
        setTotalAmount(totalAmount);
        setTotalTransactions(totalTransactions);
        setDays(days);
        setBalance(balance);
        mountTable(receivables, totalAmount, totalTransactions);
        localStorage.removeItem('snapshot');
        setIsLoading(false);
    };

    useEffect(() => {
        const { state } = history.location;
        const localSnapshot = localStorage.getItem('snapshot') ? JSON.parse(localStorage.getItem('snapshot')) : '';
        const snapshotMemo = (state && state.snapshot) ? state.snapshot : '';
        if (snapshotMemo) useSnapshot(snapshotMemo);
        else if (localSnapshot) useSnapshot(localSnapshot);
        else {
            fetchBalance(zoopId, payoutAutomatic, setState);
            fetch(zoopId, initDate, totalAmount, totalTransactions, data, days, receivables, setState);
        }
    }, []);

    if (isLoading)
        return (
            <div style={spinner}>
                <Spinner size="5rem" />
            </div>
        );

    if (errorLoading) return <Error />;

    if (receivableId && receivableId === 'dados-bancarios') return <BankInfo />

    if (receivableId && receivableId === 'resgate') return <RedeemBalance />

    if (receivableId && receivableId !== 'dados-bancarios') return <Transactions receivableId={receivableId} receivables={receivables} snapshot={state} />

    return (
        <Menu title='Recebíveis'>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={{ display: 'grid', gridRowGap: '20px' }}>
                    <Button cta="Configurar dados bancários" style={btn} navigate={() => setLocation('/dados-bancarios')} type="link" />

                    {payoutAutomatic != undefined && payoutAutomatic != null && payoutAutomatic === false && <Button cta="Resgatar saldo" style={btn} navigate={() => setLocation('recebiveis/resgate')} type="link" />}

                    {(receivables.length > 0 && totalAmount > 0 && totalTransactions > 0) && <Button cta="Exportar recebíveis futuros" style={btn} click={() => convertCsv(receivables, totalAmount, totalTransactions, 'Recebiveis Futuros.csv')} type="button" />}

                    <Button cta="Exportar recebíveis pagos" style={btn} click={() => runFetchPaidReceivables()} type="button" />

                    {isError &&
                        <div style={{ textAlign: 'center', marginTop: '20px' }}>
                            <label style={{ color: alertColor }}>Erro ao gerar planilha.</label>
                        </div>
                    }

                    <div style={{ marginTop: '10px' }} />
                    <div style={info}>
                        <label style={titleStyle}>À RECEBER HOJE</label>
                        <label style={contentStyle}>{moneyFormat(balance)}</label>
                    </div>

                    {data.length > 0 &&
                        <div style={info}>
                            <label style={titleStyle}>À RECEBER EM {days} DIAS</label>
                            <label style={contentStyle}>{moneyFormat(totalAmount)}</label>
                        </div>
                    }

                    {data.length === 0 &&
                        <div style={illustrationContainer}>
                            <div style={{ justifySelf: 'center' }}>
                                <Illustration type="noData" />
                            </div>
                            <label style={illustrationTitle}>Sem recebíveis futuros</label>
                            <label>Nenhum recebível cadastrado para datas posteriores até o momento.</label>
                        </div>
                    }

                    <Table
                        data={data}
                        cellStyle={cellStyle}
                        customGrid={customGrid}
                    />

                    {hasMore && !loadingMore && <Button cta="Carregar mais" click={handleClick} type="button" />}
                    {hasMore && loadingMore && <Spinner size="4rem" />}
                </div>

            </motion.div>
        </Menu>
    );
};

export default Receivables;
