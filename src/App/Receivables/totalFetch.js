import axios, { post } from 'axios';

const fetch = (setIsLoading, setErrorLoading, zoopId, setTotal) => {
    const source = axios.CancelToken.source()
    const url = `${process.env.PAY_URL}sellers-future-releases?seller_id=${zoopId}`;
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
            const { total } = data;
            setTotal(total);
        } catch (error) {
            if (error.response) console.log(error.response);
            else console.log(error);
            setErrorLoading(true);
            setIsLoading(false);
        }
    }
    run();
    return () => source.cancel('Canceled fetch request. Component unmounted')
};

export default fetch;
