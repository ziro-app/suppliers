import { db } from '../../Firebase/index';

const decrypt = (encrypted) => atob(encrypted);

const fetch = (setIsLoading, setErrorLoading, setCustomError, encrypted, { setFName, setLName, setEmail, setDocId, setSupplierId, setRole }) => {
    const run = async () => {
        try {
            try {
                const docId = decrypt(encrypted);
                const collaborator = await db.collection('collaborators').doc(docId).get();
                if (collaborator.exists) {
                    const { email, fname, lname, ownerId, role, status } = collaborator.data();
                    if (status !== 'Pendente') throw { msg: 'Link inválido', customError: true };
                    setEmail(email || '');
                    setFName(fname || '');
                    setLName(lname || '');
                    setSupplierId(ownerId || '');
                    setRole(role || '');
                    setDocId(docId);
                    setIsLoading(false);
                    setErrorLoading(false);
                    setCustomError(false);
                } else throw { msg: 'Colaborador inexistente', customError: true };
            } catch (error) {
                if (error.customError) throw error;
                else throw { msg: 'Link inválido', customError: true };
            }
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
