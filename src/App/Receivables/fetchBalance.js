import axios from 'axios';
import { round } from '../Transactions/utils';
import fetchTransactionsOfDay from '../utils/fetchTransactionsOfDay';
import fetchDayBalance from '../utils/fetchDayBalance';

// payoutAutomatic -> Search all transactions for the day and add the amount
// !payoutAutomatic -> Fetch the current account balance
const fetchBalance = (zoopId, payoutAutomatic, { setBalance }) => {
    const source = axios.CancelToken.source();
    const run = async () => {
        try {
            if (payoutAutomatic) {
                const transactions = await fetchTransactionsOfDay(zoopId);
                const unpaidAmount = transactions.filter(({ confirmed }) => confirmed == 0).map(({ amount }) => parseFloat(amount)).reduce((a, b) => a + b, 0);
                setBalance(unpaidAmount);
            } else {
                const balance = await fetchDayBalance(zoopId);
                const rounded = (parseFloat(round(balance, 2).toFixed(2)));
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
