import axios, { post } from 'axios';
import { round } from '../Transactions/utils';

const config = {
    headers: {
        Authorization: `${process.env.PAY_TOKEN}`,
    }
};


const formatDate = date => `${date.getFullYear()}-${date.getMonth() + 1 <= 9 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}-${date.getDate()}`;

const fetchBalance = (zoopId, { setBalance }) => {
    const source = axios.CancelToken.source();
    const run = async () => {
        try {
            const formatted = formatDate(new Date());
            const url = `${process.env.PAY_URL}account-history-all?seller_id=${zoopId}&created_date_range[gte]=${formatted}&created_date_range[lte]=${formatted}`;
            const { data: { items } } = await post(url, {}, config);
            if (Object.prototype.hasOwnProperty.call(items, formatted)) {
                const { amount } = items[formatted]['items'][0];
                const val = parseFloat(amount.replace('.', '')) / 100;
                const rounded = val < 0 ? -(parseFloat(round(val, 2).toFixed(2))) : parseFloat(round(val, 2).toFixed(2));
                setBalance(rounded);
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
