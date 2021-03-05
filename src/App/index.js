import React, { Suspense, useState, useEffect } from 'react';
import { post } from 'axios';
import { auth, db } from '../Firebase/index';
import { userContext } from './appContext';
import InitialLoader from '@bit/vitorbarbosa19.ziro.initial-loader';
import Error from '@bit/vitorbarbosa19.ziro.error';
import ErrorBoundary from '@bit/vitorbarbosa19.ziro.error-boundary';
import MessageModal from '@bit/vitorbarbosa19.ziro.message-modal';
import Router from './Router';

export const App = () => {
    const [loading, setLoading] = useState(true);
    const [errorLoading, setErrorLoading] = useState(false);
    const [uid, setUid] = useState(null);
    const [zoopId, setZoopId] = useState(null);
    const [fname, setFName] = useState(null);
    const [lname, setLName] = useState(null);
    const [cpf, setCpf] = useState(null);
    const [cnpj, setCnpj] = useState(null);
    const [birthdate, setBirthdate] = useState(null);
    const [whatsApp, setWhatsApp] = useState(null);
    const [phone, setPhone] = useState(null);
    const [address, setAddress] = useState(null);
    const [neighborhood, setNeighborhood] = useState(null);
    const [cep, setCep] = useState(null);
    const [city, setCity] = useState(null);
    const [cityState, setCityState] = useState(null);
    const [email, setEmail] = useState(null);
    const [reason, setReason] = useState(null);
    const [fantasy, setFantasy] = useState(null);
    const [codBank, setCodBank] = useState(null);
    const [holderName, setHolderName] = useState(null);
    const [accountType, setAccountType] = useState(null);
    const [accountNumber, setAccountNumber] = useState(null);
    const [agency, setAgency] = useState(null);
    const [userPos, setUserPos] = useState(null);
    const [docId, setDocId] = useState(null);
    const [typeRegister, setTypeRegister] = useState(null);
    const [ownerId, setOwnerId] = useState(null);
    const [role, setRole] = useState(null);
    const [brand, setBrand] = useState(null);
    const [maxInstallments, setMaxInstallments] = useState(null);
    const [payoutAutomatic, setPayoutAutomatic] = useState(null);
    const [zoopBankAccountId, setZoopBankAccountId] = useState(null);
    const [backgroundCheckRequests, setBackgroundCheckRequests] = useState(null);
    const [backgroundCheckRequestsPaid, setBackgroundCheckRequestsPaid] = useState(null);
    const [paymentsInsurance, setPaymentsInsurance] = useState(null);
    const url = process.env.SHEET_URL;
    const config = {
        headers: {
            'Content-type': 'application/json',
            Authorization: process.env.SHEET_TOKEN,
        },
    };

    const findStoreownerRow = async cnpj => {
        const body = {
            apiResource: 'values',
            apiMethod: 'get',
            range: 'Base!E:E',
            spreadsheetId: process.env.SHEET_SUPPLIERS_ID,
        };
        let pos = 0;
        const {
            data: { values },
        } = await post(url, body, config);
        values.map((user, index) => {
            if (user[0] === cnpj) {
                pos = index + 1;
            }
        });
        return pos;
    };

    const findCollaboratorRow = async email => {
        const body = {
            apiResource: 'values',
            apiMethod: 'get',
            range: 'Colaboradores',
            spreadsheetId: process.env.SHEET_SUPPLIERS_ID,
            // spreadsheetId: "1YlNSmVrawtxeKyy-tDdmI9B0bgSIIQswBnl3CEgdRRo"
        };
        let pos = 0;
        const {
            data: { values },
        } = await post(url, body, config);
        values.map((user, index) => {
            if (user[2] === email) {
                pos = index + 1;
            }
        });
        return pos;
    };

    const fillObject = data => {
        const { cnpj, endereco, bairro, cep, cidade, estado, codBanco, titular, tipoConta, numConta, agencia, fantasia, razao, zoopId, maxParcelas, payoutAutomatic, zoopBankAccountId } = data;
        setCnpj(cnpj ? cnpj : '');
        setAddress(endereco ? endereco : '');
        setNeighborhood(bairro ? bairro : '');
        setCep(cep ? cep : '');
        setCityState(estado ? estado : '');
        setCity(cidade ? cidade : '');
        setCodBank(codBanco ? codBanco : '');
        setHolderName(titular ? titular : '');
        setAccountType(tipoConta ? tipoConta : '');
        setAccountNumber(numConta ? numConta : '');
        setAgency(agencia ? agencia : '');
        setFantasy(fantasia ? fantasia : '');
        setReason(razao ? razao : '');
        setZoopId(zoopId ? zoopId : '');
        setMaxInstallments(maxParcelas ? maxParcelas : '10');
        setPayoutAutomatic(payoutAutomatic !== null ? payoutAutomatic : true);
        setZoopBankAccountId(zoopBankAccountId ? zoopBankAccountId : '');
    };

    const clearObject = () => {
        setUid('');
        setDocId('');
        setFName('');
        setLName('');
        setCpf('');
        setCnpj('');
        setBirthdate('');
        setWhatsApp('');
        setPhone('');
        setAddress('');
        setNeighborhood('');
        setCep('');
        setCity('');
        setCityState('');
        setEmail('');
        setCodBank('');
        setHolderName('');
        setAccountType('');
        setAccountNumber('');
        setAgency('');
        setFantasy('');
        setReason('');
        setZoopId('');
        setTypeRegister('');
        setOwnerId('');
        setRole('');
        setBrand('');
        setMaxInstallments('');
        setPayoutAutomatic('');
        setZoopBankAccountId('');
        setBackgroundCheckRequests('');
        setBackgroundCheckRequestsPaid('');
        setPaymentsInsurance('');
    };

    useEffect(() => {
        let unsubscribe = () => null;
        return auth.onAuthStateChanged(async user => {
            if (user && user.emailVerified) {
                setUid(user.uid);
                // Adding event listener
                unsubscribe = db
                    .collection('suppliers')
                    .where('uid', '==', user.uid)
                    .onSnapshot(snapshot => {
                        if (!snapshot.empty) {
                            const { nome, sobrenome, cpf, nascimento, telefone, email, tipoCadastro } = snapshot.docs[0].data();

                            setDocId(snapshot.docs[0].id);
                            setFName(nome ? nome : '');
                            setLName(sobrenome ? sobrenome : '');
                            setCpf(cpf ? cpf : '');
                            setBirthdate(nascimento ? nascimento : '');
                            setPhone(telefone ? telefone : '');
                            setEmail(email ? email : '');
                            setTypeRegister(tipoCadastro ? tipoCadastro : '');
                            setOwnerId('');
                            setRole('');
                            setBrand('');
                            fillObject(snapshot.docs[0].data());
                        } else {
                            unsubscribe();
                            unsubscribe = db
                                .collection('collaborators')
                                .where('uid', '==', user.uid)
                                .onSnapshot(async snapshot => {
                                    if (!snapshot.empty) {
                                        const { email, fname, lname, ownerId, role, brand } = snapshot.docs[0].data();
                                        const supplierInfo = await db.collection('suppliers').doc(ownerId).get();
                                        setDocId(snapshot.docs[0].id);
                                        setBrand(brand);
                                        setFName(fname ? fname : '');
                                        setLName(lname ? lname : '');
                                        setCpf('');
                                        setBirthdate('');
                                        setPhone('');
                                        setTypeRegister('');
                                        setOwnerId(ownerId);
                                        setRole(role);
                                        setEmail(email);
                                        fillObject(supplierInfo.data());
                                    }
                                });
                        }
                    });
            } else {
                unsubscribe();
                clearObject();
            }
        });
    }, []);
    useEffect(() => {
        const getUserData = async () => {
            if (uid) {
                try {
                    const docRef = await db.collection('suppliers').where('uid', '==', uid).get();
                    if (!docRef.empty) {
                        docRef.forEach(async doc => {
                            const {
                                nome,
                                sobrenome,
                                cpf,
                                cnpj,
                                nascimento,
                                whatsapp,
                                telefone,
                                email,
                                tipoCadastro,
                                backgroundCheckRequestsAvailable,
                                backgroundCheckRequestsAvailablePaid,
                                alwaysInsured,
                            } = doc.data();

                            setDocId(doc.id);
                            setFName(nome ? nome : '');
                            setLName(sobrenome ? sobrenome : '');
                            setCpf(cpf ? cpf : '');
                            setBirthdate(nascimento ? nascimento : '');
                            setWhatsApp(whatsapp ? whatsapp : '');
                            setPhone(telefone ? telefone : '');
                            setEmail(email ? email : '');
                            setTypeRegister(tipoCadastro ? tipoCadastro : '');
                            setOwnerId('');
                            setRole('');
                            setBrand('');
                            setBackgroundCheckRequests(backgroundCheckRequestsAvailable ? backgroundCheckRequestsAvailable : '');
                            setBackgroundCheckRequestsPaid(backgroundCheckRequestsAvailablePaid ? backgroundCheckRequestsAvailablePaid : '');
                            setPaymentsInsurance(alwaysInsured);
                            fillObject(doc.data());
                            if (userPos === null || userPos === '') setUserPos(await findStoreownerRow(cnpj));
                        });
                    } else {
                        const docCollaboratorRef = await db.collection('collaborators').where('uid', '==', uid).get();
                        if (!docCollaboratorRef.empty) {
                            const { email, fname, lname, ownerId, role, brand } = docCollaboratorRef.docs[0].data();
                            const supplierInfo = await db.collection('suppliers').doc(ownerId).get();
                            setDocId(docCollaboratorRef.docs[0].id);
                            setBrand(brand);
                            setFName(fname ? fname : '');
                            setLName(lname ? lname : '');
                            setCpf('');
                            setBirthdate('');
                            setWhatsApp('');
                            setPhone('');
                            setTypeRegister('');
                            setOwnerId(ownerId);
                            setRole(role);
                            setEmail(email);
                            fillObject(supplierInfo.data());
                            if (userPos === null || userPos === '') setUserPos(await findCollaboratorRow(email));
                        }
                    }
                } catch (error) {
                    if (error.response) console.log(error.response);
                    else console.log(error);
                    setErrorLoading(true);
                }
            }
            if (uid !== null) setLoading(false); // wait uid to be set to either a value or null
        };
        getUserData();
    }, [uid]);
    const userData = {
        uid,
        fname,
        lname,
        cpf,
        cnpj,
        birthdate,
        phone,
        address,
        neighborhood,
        cep,
        city,
        cityState,
        email,
        userPos,
        codBank,
        holderName,
        accountType,
        accountNumber,
        agency,
        fantasy,
        reason,
        zoopId,
        docId,
        typeRegister,
        ownerId,
        role,
        brand,
        maxInstallments,
        payoutAutomatic,
        zoopBankAccountId,
        whatsApp,
        backgroundCheckRequests,
        backgroundCheckRequestsPaid,
        paymentsInsurance,
    };
    if (loading) return <InitialLoader />;
    if (errorLoading) return <Error />;
    return (
        <ErrorBoundary>
            <Suspense fallback={<InitialLoader />}>
                <MessageModal>
                    <userContext.Provider value={userData}>
                        <Router isLogged={!!uid} />
                    </userContext.Provider>
                </MessageModal>
            </Suspense>
        </ErrorBoundary>
    );
};
