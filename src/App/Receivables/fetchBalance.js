import axios from 'axios';
import fetchTransactionsOfDay from '../utils/fetchTransactionsOfDay';

const fetchBalance = (zoopId, { setBalance }) => {
    const source = axios.CancelToken.source();
    const run = async () => {
        try {
            const transactions = await fetchTransactionsOfDay(zoopId);
            const unpaidAmount = transactions.filter(({ confirmed }) => confirmed == 0).map(({ amount }) => parseFloat(amount)).reduce((a, b) => a + b, 0);
            setBalance(unpaidAmount);
        } catch (error) {
            if (error.response) console.log(error.response);
            else console.log(error);
        }
    }
    run();
    return () => source.cancel('Canceled fetch request. Component unmounted')
};

export default fetchBalance;
