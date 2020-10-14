import axios, { post } from 'axios';
import { round } from '../Transactions/utils';

const config = {
    headers: {
        Authorization: `${process.env.PAY_TOKEN}`,
    }
};


const formatDate = date => `${date.getFullYear()}-${date.getMonth() + 1 <= 9 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}-${date.getDate() <= 9 ? `0${date.getDate()}` : date.getDate()}`;

const fetchBalance = (zoopId, { setBalance }) => {
    const source = axios.CancelToken.source();
    const run = async () => {
        try {
            const balanceUrl = `${process.env.PAY_URL}account-balance-by-seller?seller_id=${zoopId}`;
            const { data: { items: { current_balance } } } = await post(balanceUrl, {}, config);
            const parts = current_balance.split('.');
            const parsed = parseFloat(parts[0]) / 100;
            if (parsed !== 0) {
                const rounded = (parseFloat(round(parsed, 2).toFixed(2)));
                setBalance(rounded);
            } else {
                const formatted = formatDate(new Date());
                const historyUrl = `${process.env.PAY_URL}account-history-all?seller_id=${zoopId}&created_date_range[gte]=${formatted}&created_date_range[lte]=${formatted}`;
                const { data: { items } } = await post(historyUrl, {}, config);
                if (Object.prototype.hasOwnProperty.call(items, formatted)) {
                    const floatValue = items[formatted]['items'].map(it => parseFloat(it.amount) < 0 ? -parseFloat(it.amount) : parseFloat(it.amount)).reduce((a, b) => a + b);
                    const rounded = parseFloat(round(floatValue, 2).toFixed(2));
                    setBalance(rounded);
                }
            }
        } catch (error) {
            if (error.response) console.log(error.response);
            else console.log(error);
        }
    }
    run();
    return () => source.cancel('Canceled fetch request. Component unmounted')
};

export default fetchBalance;
