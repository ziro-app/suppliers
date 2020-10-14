import axios from 'axios';
import { useEffect, useState } from 'react';
import { createBrowserHistory } from 'history';
import { db } from '../../Firebase/index';

export default (receipt_id, setLoading, location, setReceipt, setTransaction, setBackRoute, setSnapshot, setTransactionsMemo) => {
    const [error, setError] = useState(false);
    const history = createBrowserHistory();
    useEffect(() => {
        const { state } = history.location;
        if (state && state.backRoute) setBackRoute(state.backRoute);
        if (state && state.snapshot) setSnapshot(state.snapshot);
        if (state && state.transactionsMemo) setTransactionsMemo(state.transactionsMemo);
        if (receipt_id) {
            const getReceipt = async () => {
                setLoading(true);
                try {
                    const doc = await db.collection('credit-card-payments').where('receiptId', '==', receipt_id).get();
                    await axios
                        .get(
                            `${process.env.PAY_URL}payments-receipt?receipt_id=${receipt_id}`,

                            {
                                headers: {
                                    Authorization: `${process.env.PAY_TOKEN}`,
                                },
                            },
                        )
                        .then(result => {
                            const { data } = result;
                            if (!doc.empty) {
                                const { installments, status } = doc.docs[0].data();
                                setTransaction(doc.docs[0].data());
                                data.location = location;
                                data.installments = installments;
                                data.statusZiro = status;
                                setReceipt(data);
                                if (installments) setLoading(false);
                            } else {
                                console.log('Document not found');
                                setLoading(false);
                                setError(true);
                            }
                            // setError(true);
                            // setLocation('/recibo');
                        });
                } catch (e) {
                    // console.log(e.response);
                    console.log('erro na requisição para o recibo da zoop');
                    setLoading(false);
                    console.log(e.response.status);
                    setError(true);
                }
            };
            getReceipt();
        }
    }, [receipt_id]);
    return { error };
};
