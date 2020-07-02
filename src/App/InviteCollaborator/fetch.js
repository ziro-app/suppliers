import { db } from '../../Firebase/index';

const fetch = (setIsLoading, setErrorLoading, { setEmails }) => {
    const emails = [];
    const run = async () => {
        try {
            const collaborators = await db.collection('collaborators').get();
            if (!collaborators.empty) {
                collaborators.forEach(doc => {
                    const { email } = doc.data();
                    if (email !== '') emails.push(email);
                });
                setEmails(emails);
                setIsLoading(false);
            } else {
                setEmails([]);
                setIsLoading(false);
            }
        } catch (error) {
            console.log(error);
            setErrorLoading(true);
            setIsLoading(false);
        }
    }
    run();
};

export default fetch;
