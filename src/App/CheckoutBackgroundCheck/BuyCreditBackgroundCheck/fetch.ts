import { db } from '../../../Firebase/index';

const fetch = (setIsLoading, setErrorLoading, setCustomError, setValueCreditBackgroundCheck) => {
    const run = async () => {
        try {
            const fetchedStandardPlan = db.collection('utilities').doc(process.env.DOCUMENT_ID_FOR_UTILITIES_MAIN);
            const docUtils = await fetchedStandardPlan.get();
            const valueOfStandardValueBackgroundCheck = docUtils.data().main.standardValueBackgroundCheck;
            setValueCreditBackgroundCheck(valueOfStandardValueBackgroundCheck);
            setIsLoading(false);
            setErrorLoading(false);
        } catch (error) {
            console.log(error);
            if (error.customError) setCustomError(true);
            else setErrorLoading(true);
            setIsLoading(false);
        }
    };
    run();
};

export default fetch;
