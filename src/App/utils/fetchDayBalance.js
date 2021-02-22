import { post } from 'axios';

const config = {
    headers: {
        Authorization: `${process.env.PAY_TOKEN}`,
    }
};

// Returns the current balance in the account
const fetchDayBalance = async zoopId => {
    try {
        const balanceUrl = `${process.env.PAY_URL}account-balance-by-seller?seller_id=${zoopId}`;
        const { data: { items: { current_balance } } } = await post(balanceUrl, {}, config);
        const parts = current_balance ? current_balance.split('.') : [0];
        return parseFloat(parts[0]) / 100;
    } catch (error) {
        throw error;
    }
};

export default fetchDayBalance;
