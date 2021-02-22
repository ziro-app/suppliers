import { post } from 'axios';

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

// Returns an array of all transactions provisioned for the day
const fetchTransactionsOfDay = async zoopId => {
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
            if(finalItem){
                const finalDate = formatDate(finalItem['transfer_date']);
                if (has_more && now.getTime() === finalDate.getTime()) {
                    offset += 40;
                } else hasMore = false;
            }else hasMore = false;
        };
        if(arrayItems.length){
            return arrayItems.filter(({ transfer_date }) => now.getTime() === formatDate(transfer_date).getTime());
        }else{
            return [];
        };
    } catch (error) {
        throw error;
    }
};

export default fetchTransactionsOfDay;
