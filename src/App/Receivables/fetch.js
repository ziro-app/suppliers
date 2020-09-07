import React from 'react';
import axios, { post } from 'axios';
import md5 from 'md5';
import Icon from '@bit/vitorbarbosa19.ziro.icon';
import currencyFormat from '@ziro/currency-format';
import { round } from '../Transactions/utils';

const reducerTotal = (accumulator, currentValue) => parseInt(accumulator) + parseInt(currentValue);

const getFinalDate = (today, days) => {
    let newDate = new Date(today);
    newDate.setDate(today.getDate() + days);
    return newDate;
};

const formatDate = date => `${date.getFullYear()}-${date.getMonth() + 1 <= 9 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}-${date.getDate()}`;

const splitedArray = array => {
    let item = {};
    array.map(it => {
        const { id } = it;
        if (Object.keys(item).includes(id)) {
            const { amount, fees, net } = it;
            item[id]['amount'] = `${parseInt(item[id]['amount']) + parseInt(amount)}`;
            item[id]['fees'] = `${parseInt(item[id]['fees']) + parseInt(fees)}`;
            item[id]['net'] = `${(parseInt(item[id]['net']) + parseInt(net))}`;
            item[id]['split_rule'] = true;
        } else item[id] = { ...it };
    });
    let normalizedArray = Object.keys(item).map(it => item[it]);
    return normalizedArray;
}

const config = {
    headers: {
        Authorization: `${process.env.PAY_TOKEN}`,
    }
};

const fetch = (zoopId, initDate, totalAmount, totalTransactions, dataTable, days, receivables, { setIsLoading, setErrorLoading, setReceivables, setData, setLocation, setFinalDate, setHasMore, setLoadingMore, setTotalAmount, setDays, setCustomError, setTotalTransactions }) => {
    const source = axios.CancelToken.source();
    const fnDate = getFinalDate(initDate, 30);
    setFinalDate(fnDate);
    const parsedToday = formatDate(initDate);
    const parsedFnDay = formatDate(fnDate);
    const recDocs = [];
    const run = async () => {
        try {
            let hasMore = true;
            let offset = 0;
            let arrayItems = {};
            while (hasMore) {
                let url = `${process.env.PAY_URL}sellers-future-releases?seller_id=${zoopId}&expected_on_range[gte]=${parsedToday}&expected_on_range[lte]=${parsedFnDay}&offset=${offset}`;
                const { data } = await post(url, {}, config);
                const { items, has_more } = data;
                const keys = Object.keys(items);
                if (offset !== 0) {
                    keys.map(key => {
                        if (key in arrayItems) arrayItems[key].items = [...arrayItems[key].items, ...items[key].items];
                        else arrayItems[key] = items[key];
                    });
                }
                else arrayItems = { ...arrayItems, ...items };
                if (items.length === 0) setHasMore(false);
                if (!(items.length === 0) && offset === 0) setDays(days + 30);
                hasMore = has_more;
                offset += 100;
            }
            let totalAmountFetch = 0;
            let totalTransactionsFetch = 0;
            const rows = [];
            const rowsClicks = [];
            const keys = Object.keys(arrayItems);
            if (keys.length === 0 && receivables.length === 0) throw { customError: true };
            keys.map(key => {
                let [ano, mes, dia] = key.split('-');
                let date = [dia, mes, ano.substring(2)].join('/');
                let id = md5(date).substring(10);
                let total;
                // Array com tratamento para os splits
                let normalizedArray = splitedArray(arrayItems[key].items);
                let vendas = normalizedArray.length;
                // Total do recebível -> Soma do valor líquido de todas as transações do dia
                let val = parseFloat(normalizedArray.map(it => it.net).reduce((a, b) => reducerTotal(a, b)) / 100).toFixed(2);
                totalAmountFetch += parseFloat(val);
                totalTransactionsFetch += vendas;

                total = currencyFormat(`${val}`.replace('.', '')).replace('R$', '');

                rows.push([date, total, vendas, <Icon type="chevronRight" size={14} />]);
                rowsClicks.push(() => setLocation(`/recebiveis/${id}`));
                recDocs.push({
                    charge: currencyFormat(`${val}`.replace('.', '')),
                    date,
                    completeDate: [dia, mes, ano].join('/'),
                    items: normalizedArray,
                    id
                });
            });
            const updatedTotalTransactions = totalTransactions + totalTransactionsFetch;
            const rounded = parseFloat(round(totalAmount + totalAmountFetch, 2).toFixed(2));
            const currency = currencyFormat(rounded.toFixed(2).replace('.', ''));
            setTotalAmount(rounded);
            setTotalTransactions(updatedTotalTransactions);

            setData([{
                title: 'Valores à receber',
                header: ['Data', 'Valor(R$)', 'Qntd vendas', ''],
                rows: dataTable[0] && dataTable[0].rows ? [...dataTable[0].rows, ...rows] : rows,
                rowsClicks: dataTable[0] && dataTable[0].rowsClicks ? [...dataTable[0].rowsClicks, ...rowsClicks] : rowsClicks,
                totals: ['-', currency.replace('R$', ''), updatedTotalTransactions, '-']
            }]);
            setReceivables([...receivables, ...recDocs]);
            setIsLoading(false);
            setLoadingMore(false);
        } catch (error) {
            if (error.response) console.log(error.response);
            else console.log(error);
            if (error.customError) {
                setErrorLoading(false);
                setIsLoading(false);
                setLoadingMore(false);
                setCustomError(true);
            } else {
                setErrorLoading(true);
                setIsLoading(false);
                setLoadingMore(false);
                setCustomError(false);
            }
        }
    }
    run();
    return () => source.cancel('Canceled fetch request. Component unmounted')
};

export default fetch;
