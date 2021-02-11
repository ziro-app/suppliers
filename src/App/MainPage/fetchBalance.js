import axios from 'axios';
import { round } from '../Transactions/utils';
import fetchTransactionsOfDay from '../utils/fetchTransactionsOfDay';

const fetchBalance = (zoopId, { setBalance, setPaidBalance, setIsErrorBalance }) => {
    const source = axios.CancelToken.source();
    const run = async () => {
        try {
            const transactions = await fetchTransactionsOfDay(zoopId);
            const unpaidAmount = transactions.filter(({ confirmed }) => confirmed == 0).map(({ amount }) => parseFloat(amount)).reduce((a, b) => a + b, 0);
            const paidAmount = transactions.filter(({ confirmed }) => confirmed == 1).map(({ amount }) => parseFloat(amount)).reduce((a, b) => a + b, 0);
            console.log('unpaidAmount: ', parseFloat(round(unpaidAmount, 2).toFixed(2)));
            console.log('paidAmount: ', parseFloat(round(paidAmount, 2).toFixed(2)));
            setBalance(unpaidAmount);
            setPaidBalance(paidAmount);
        } catch (error) {
            setIsErrorBalance(true)
            if (error.response) console.log(error.response);
            else console.log(error);
        }
    }
    run();
    return () => source.cancel('Canceled fetch request. Component unmounted')
};

export default fetchBalance;
