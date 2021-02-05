import axios, { post } from 'axios';
import { round } from '../Transactions/utils';

const config = {
    headers: {
        Authorization: `${process.env.PAY_TOKEN}`,
    }
};


const formatDate = strDate => {
    const date = new Date(strDate);
    date.setHours(date.getHours() + 3);
    return date;
};

const fetchBalance = (zoopId, { setBalance, setPaidBalance, setIsErrorBalance }) => {
    const source = axios.CancelToken.source();
    const run = async () => {
        try {
            let hasMore = true;
            let offset = 0;
            let arrayItems = [];
            const now = new Date();
            now.setHours(0, 0, 0, 0);
            while (hasMore) {
                let url = `${process.env.PAY_URL}sellers-transfers?seller_id=${zoopId}&offset=${offset}&limit=40`;
                const { data } = await post(url, {}, config);
                const { items, has_more } = data;
                arrayItems = [...arrayItems, ...items];
                const finalItem = items[items.length - 1];
                const finalDate = formatDate(finalItem['transfer_date']);
                if (has_more && now.getTime() === finalDate.getTime()) {
                    offset += 40;
                } else hasMore = false;
            }
            const interest = arrayItems.filter(({ transfer_date }) => now.getTime() === formatDate(transfer_date).getTime());
            const unpaidAmount = interest.filter(({ confirmed }) => confirmed == 0).map(({ amount }) => parseFloat(amount)).reduce((a, b) => a + b, 0);
            const paidAmount = interest.filter(({ confirmed }) => confirmed == 1).map(({ amount }) => parseFloat(amount)).reduce((a, b) => a + b, 0);
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
