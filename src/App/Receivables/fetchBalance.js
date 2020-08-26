import axios, { post } from 'axios';
import { round } from '../Transactions/utils';

const config = {
    headers: {
        Authorization: `${process.env.PAY_TOKEN}`,
    }
};

// Logic to make this request only once a day
// -> Think better if it covers all cases

const isNextDay = day => {
    const lastDay = localStorage.getItem('@suppliers/balanceDay') ? new Date(JSON.parse(localStorage.getItem('@suppliers/balanceDay'))) : '';
    const nextDay = new Date(`${lastDay.getMonth() + 1}-${lastDay.getDate() + 1}-${lastDay.getFullYear()}`);
    const currentDay = new Date(`${day.getMonth() + 1}-${day.getDate()}-${day.getFullYear()}`);
    if (lastDay && currentDay < nextDay) return false;
    else {
        localStorage.setItem('@suppliers/balanceDay', JSON.stringify(day));
        return true;
    }
}

const fetch = (zoopId, { setBalance }) => {
    const source = axios.CancelToken.source();
    const run = async () => {
        try {
            const isNext = isNextDay(new Date());
            if (isNext) {
                const url = `${process.env.PAY_URL}account-balance-by-seller?seller_id=${zoopId}`;
                const { data: { items: { current_balance } } } = await post(url, {}, config);
                const val = parseFloat(current_balance.split('.')[0]) / 100;
                const rounded = parseFloat(round(val, 2).toFixed(2));
                localStorage.setItem('@suppliers/balanceValue', JSON.stringify(rounded));
                setBalance(rounded);
            } else {
                const rounded = localStorage.getItem('@suppliers/balanceValue') ? JSON.parse(localStorage.getItem('@suppliers/balanceValue')) : '';
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

export default fetch;
