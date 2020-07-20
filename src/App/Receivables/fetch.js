import React from 'react';
import axios, { post } from 'axios';
import md5 from 'md5';
import Icon from '@bit/vitorbarbosa19.ziro.icon';
import currencyFormat from '@ziro/currency-format';

const fetch = (setIsLoading, setErrorLoading, setReceivables, zoopId, total, setData) => {
    const source = axios.CancelToken.source();
    const url = `${process.env.PAY_URL}sellers-future-releases?seller_id=${zoopId}&limit=${total}`;
    const recDocs = [];
    const run = async () => {
        if (total > 0) {
            try {
                const { data } = await post(
                    url,
                    {},
                    {
                        headers: {
                            Authorization: `${process.env.PAY_TOKEN}`,
                        },
                    });
                const { has_more, items, total_amount } = data;
                const rows = [];
                // console.log(total);
                // console.log(items);
                // console.log(has_more);
                // setHasMore(has_more);
                const keys = Object.keys(items);
                keys.map(key => {
                    console.log(items[key]);
                    let [ano, mes, dia] = key.split('-');
                    let date = [dia, mes, ano.substring(2)].join('/');
                    rows.push([date, currencyFormat(items[key].total_amount.replace('.', '')).replace('R$', ''), 'Pendente', <Icon type="chevronRight" size={14} />]);
                    recDocs.push({
                        status: 'Aguardando Pagamento',
                        statusColor: '#F7BA00',
                        charge: currencyFormat(items[key].total_amount.replace('.', '')), //Começar aqui, montando o objeto
                        date,
                        items: items[key].items,
                        id: md5(date).substring(10)
                    });
                });
                // console.log(rows);
                // console.log(recDocs);
                setData([{
                    title: 'Recebíveis',
                    header: ['Data', 'Valor(R$)', 'Status', ''],
                    rows,
                    rowsClicks: [],
                    totals: ['-', currencyFormat(`${total_amount}`.replace('.', '')).replace('R$', ''), '-', '-']
                }]);
                setReceivables(recDocs);
                setIsLoading(false);
            } catch (error) {
                if (error.response) console.log(error.response);
                else console.log(error);
                setErrorLoading(true);
                setIsLoading(false);
            }
        }
    }
    run();
    return () => source.cancel('Canceled fetch request. Component unmounted')
};

export default fetch;
