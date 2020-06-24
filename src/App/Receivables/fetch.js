import axios, { post } from 'axios';
import md5 from 'md5';
import currencyFormat from '@ziro/currency-format';

const fetch = (setIsLoading, setErrorLoading, receivables, setReceivables, zoopId, limit, offset, setHasMore, setLoadingMore) => {
    const source = axios.CancelToken.source()
    const url = `${process.env.PAY_URL}sellers-future-releases?seller_id=${zoopId}&limit=${limit}&offset=${offset}`;
    const recDocs = [];
    const run = async () => {
        try {
            const { data } = await post(
                url,
                {},
                {
                    headers: {
                        Authorization: `${process.env.PAY_TOKEN}`,
                    },
                });
            const { has_more, items } = data;
            setHasMore(has_more);
            const keys = Object.keys(items);
            keys.map(key => {
                let [ano, mes, dia] = key.split('-');
                let date = [dia, mes, ano.substring(2)].join('/');
                recDocs.push({
                    status: 'Aguardando Pagamento',
                    statusColor: '#F7BA00',
                    charge: currencyFormat(items[key].total_amount.replace('.', '')), //Começar aqui, montando o objeto
                    date,
                    items: items[key].items,
                    id: md5(date).substring(10)
                });
            });
            setReceivables([...receivables, ...recDocs]);
            setIsLoading(false);
            setLoadingMore(false);
        } catch (error) {
            if (error.response) console.log(error.response);
            else console.log(error);
            setErrorLoading(true);
            setIsLoading(false);
            setLoadingMore(false);
        }
    }
    run();
    return () => source.cancel('Canceled fetch request. Component unmounted')
};

export default fetch;
