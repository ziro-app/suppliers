import { db } from '../../Firebase/index';

const fetch = (setIsLoading, setErrorLoading, docId, { setFreeRequests }) => {
    const run = async () => {
        try {
            const doc = await db.collection('suppliers').doc(docId).get();
            let reqFree = 0;
            if (doc.exists) {
                const { backgroundCheckRequestsAvailable, backgroundCheckCurrentMonth, backgroundCheckCurrentYear } = doc.data();
                const now = new Date();
                // Requisição no mês corrente ainda
                if (now.getMonth() <= backgroundCheckCurrentMonth && now.getFullYear() <= backgroundCheckCurrentYear) {
                    reqFree = backgroundCheckRequestsAvailable;
                }
                // Requisição no mês diferente do corrente
                else {
                    await db.collection('suppliers').doc(docId).update({ backgroundCheckRequestsAvailable: 10, backgroundCheckCurrentMonth: now.getMonth(), backgroundCheckCurrentYear: now.getFullYear() });
                    reqFree = 10;
                }
            }
            setFreeRequests(reqFree);
            setIsLoading(false);
            setErrorLoading(false);
        } catch (error) {
            console.log(error);
            if (error.customError) setCustomError(true);
            else setErrorLoading(true);
            setIsLoading(false);
        }
    }
    run();
};

export default fetch;
