import axios from 'axios';
import { useEffect, useState } from 'react';
import { createBrowserHistory } from 'history';
import { db } from '../../Firebase/index';

export default (receipt_id, setLoading, location, setReceipt, installmentsDoc, setTransaction, setBackRoute, setSnapshot) => {
    const [installmentDoc, setInstallmentDoc] = useState('');
    const [status, setStatus] = useState('');
    const [error, setError] = useState(false);
    const history = createBrowserHistory();
    useEffect(() => {
        const { state } = history.location;
        if (state && state.backRoute) setBackRoute(state.backRoute);
        if (state && state.snapshot) setSnapshot(state.snapshot);
        if (installmentDoc) setLoading(false);
        if (!installmentsDoc) {
            const paymentsRef = db.collection('credit-card-payments');
            paymentsRef
                .where('receiptId', '==', receipt_id)
                .get()
                .then(snapshot => {
                    if (snapshot.empty) {
                        console.log('No matching documents.');
                        return;
                    }

                    snapshot.forEach(doc => {
                        const { installments, status } = doc.data();
                        setTransaction(doc.data());
                        setStatus(status);
                        setInstallmentDoc(installments);
                    });
                })
                .catch(err => {
                    console.log('Error getting documents', err);
                    setLoading(false);
                    setError(true);
                });
        }
        if (receipt_id) {
            const getReceipt = async () => {
                setLoading(true);
                try {
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
                            data.location = location;
                            data.installments = installmentDoc;
                            data.statusZiro = status;
                            setReceipt(data);
                            if (installmentDoc) setLoading(false);
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
    }, [receipt_id, installmentDoc]);
    return { installmentDoc, error };
};
