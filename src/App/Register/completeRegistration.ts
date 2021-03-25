import { auth, db } from '../../Firebase/index';
import axios from 'axios';
import capitalize from '@ziro/capitalize';
//import IRollbackData,{IZoopData} from '../utils/useRollback/IRollbackData'

const { formatDateUTC3 } = require('@ziro/format-date-utc3');

const url = process.env.SHEET_URL;
const config = {
    headers: {
        'Content-type': 'application/json',
        Authorization: process.env.SHEET_TOKEN,
    },
};

const completeRegistration = state => () => {
    const {
        cnpjValid,
        cnpj,
        reason,
        fantasia,
        category,
        cep,
        bankName,
        street,
        number,
        complement,
        neighborhood,
        city,
        cityState,
        fname,
        lname,
        whatsApp,
        cpf,
        email,
        birthdate,
        fone,
        pass,
        bankNumber,
        accountNumber,
        agency,
        accountType,
        fileDoc,
        fileAtv,
        fileRes,
        fileCnpj,
        categoryName,
        accountTypeViewName,
        fantasias,
        createRollbackItem,
        cleanRollback,
        startRollback,
    } = state;
    const nomeCompleto = fname && lname ? `${fname.trim()} ${lname.trim()}` : '';
    const endereco = complement ? `${street}, ${number}, ${complement}` : `${street}, ${number}`;
    const telefone = fone ? `55 ${fone.trim()}` : '';
    const whats = whatsApp ? `55 ${whatsApp.trim()}` : '';
    const fantasiaSheet = fantasias.filter(item => item.cnpj === Number(cnpj.replace('.', '').replace('.', '').replace('/', '').replace('-', '')));
    const resultFantasia = fantasiaSheet[0] ? fantasiaSheet[0].fantasia : fantasia;
    const normalizeFantasia = resultFantasia || reason;
    let cepSplit = cep.split('');
    cepSplit.splice(2, 0, '.');
    const dotCep = cepSplit.join('');
    const today = new Date();
    const body = {
        apiResource: 'values',
        apiMethod: 'append',
        spreadsheetId: process.env.SHEET_SUPPLIERS_ID,
        range: 'Base!A1',
        resource: {
            values: [
                [
                    formatDateUTC3(today),
                    nomeCompleto,
                    whats,
                    email,
                    cnpj,
                    reason,
                    normalizeFantasia,
                    dotCep,
                    endereco,
                    neighborhood,
                    city,
                    cityState,
                    telefone,
                    cpf,
                    birthdate,
                    categoryName,
                    accountTypeViewName,
                    bankNumber.startsWith('0') ? `'${bankNumber}` : bankNumber,
                    reason,
                    agency.startsWith('0') ? `'${agency}` : agency,
                    accountNumber.startsWith('0') ? `'${accountNumber}` : accountNumber,
                ],
            ],
        },
        valueInputOption: 'user_entered',
    };

    return new Promise(async (resolve, reject) => {
        try {
            if (cnpjValid) {
                try {
                    // Cadastrando no Firebase Auth
                    const { user } = await auth.createUserWithEmailAndPassword(email, pass);
                    const userData: IUserData = { origin: 'auth', pass };
                    createRollbackItem(userData);
                    try {
                        // Cadastrando usuário na planilha
                        await axios.post(url, body, config);
                        const sheetData: ISheetsData = {
                            origin: 'sheets',
                            id: cnpj,
                            rangeToSearch: 'Base!E:E',
                            rangeToUpdate: `Base!A`,
                            values: [
                                'Excluído',
                                'Excluído',
                                'Excluído',
                                'Excluído',
                                'Excluído',
                                'Excluído',
                                'Excluído',
                                'Excluído',
                                'Excluído',
                                'Excluído',
                                'Excluído',
                                'Excluído',
                                'Excluído',
                                'Excluído',
                                'Excluído',
                                'Excluído',
                                'Excluído',
                                'Excluído',
                                'Excluído',
                                'Excluído',
                                'Excluído',
                            ],
                            spreadsheetId: '1yWKhB94GmEvmmwfWYbRFCmz1G-ir7Aq_BrFLfNDDC3g',
                        };
                        createRollbackItem(sheetData);
                        try {
                            try {
                                // Criando vendedor na Zoop
                                const {
                                    data: { id },
                                } = await axios.post(
                                    `${process.env.PAY_URL}sellers-create`,
                                    {
                                        ein: cnpj,
                                        owner: {
                                            first_name: fname ? fname.trim() : '',
                                            last_name: lname ? lname.trim() : '',
                                            email,
                                            phone_number: telefone,
                                            taxpayer_id: cpf,
                                            birthdate: birthdate.split('/').reverse().join('-'),
                                        },
                                        business_name: reason,
                                        business_address: {
                                            line1: street,
                                            line2: number,
                                            line3: complement,
                                            neighborhood,
                                            city,
                                            state: cityState,
                                            postal_code: cep.replace('-', ''),
                                            country_code: 'BR',
                                        },
                                        mcc: category,
                                        statementDescriptor: capitalize(normalizeFantasia)
                                    },
                                    {
                                        headers: {
                                            Authorization: `${process.env.PAY_TOKEN}`,
                                        },
                                    },
                                );
                                const zoopData: IZoopData = { origin: 'zoop', zoopId: id };
                                createRollbackItem(zoopData);
                                try {
                                    // Criando token da conta
                                    const responseAccount = await axios.post(
                                        `${process.env.PAY_URL}token-bank-create`,
                                        {
                                            ein: cnpj,
                                            bank_code: bankNumber,
                                            holder_name: reason,
                                            routing_number: agency,
                                            account_number: accountNumber,
                                            type: accountType,
                                        },
                                        {
                                            headers: {
                                                Authorization: `${process.env.PAY_TOKEN}`,
                                            },
                                        },
                                    );
                                    // Associando conta ao vendedor
                                    const responseAssociating = await axios.post(
                                        `${process.env.PAY_URL}bank-associate`,
                                        {
                                            customer: id,
                                            token: responseAccount.data.id,
                                        },
                                        {
                                            headers: {
                                                Authorization: `${process.env.PAY_TOKEN}`,
                                            },
                                        },
                                    );
                                    try {
                                        // Upload das imagens
                                        await Promise.all(
                                            [fileDoc, fileAtv, fileRes, fileCnpj].map(async (file, index) => {
                                                try {
                                                    if (file.size === 0) throw 'Empty sized image';
                                                    let category;
                                                    if (index === 0) category = 'identificacao';
                                                    else if (index === 1) category = 'atividade';
                                                    else if (index === 2) category = 'residencia';
                                                    else category = 'cnpj';
                                                    const formData = new FormData();
                                                    formData.append('file', file);
                                                    formData.append('category', category);
                                                    //uploadConfig.data = formData
                                                    await axios({
                                                        url: `${process.env.DOC_URL}${id}/documents`,
                                                        method: 'post',
                                                        params: {},
                                                        headers: {
                                                            'Content-Type': 'multipart/form-data',
                                                            Accept: 'application/json',
                                                            Authorization: `${process.env.ZOOP_AUTH}`,
                                                        },
                                                        data: formData,
                                                    });
                                                } catch (error) {
                                                    console.log('Erro no upload interno');
                                                    console.log(error);
                                                    if (error.customError) throw error;
                                                    throw { msg: `Erro no upload da imagem ${index + 1}, fale com seu assessor.`, customError: true };
                                                }
                                            }),
                                        );
                                        try {
                                            let sellerZoopPlan = { activePlan: '' };
                                            const fetchedStandardPlan = db.collection('utilities').doc(process.env.DOCUMENT_ID_FOR_UTILITIES_MAIN);
                                            const doc = await fetchedStandardPlan.get();
                                            sellerZoopPlan = doc.data().main.standardPlans;
                                            sellerZoopPlan.activePlan = 'standard';
                                            // Adicionando registro ao Firestore
                                            await db
                                                .collection('suppliers')
                                                .doc(user.uid)
                                                .set({
                                                    cadastro: today,
                                                    uid: user.uid,
                                                    zoopId: id,
                                                    nome: fname ? fname.trim() : '',
                                                    sobrenome: lname ? lname.trim() : '',
                                                    whatsapp: whats,
                                                    cpf,
                                                    nascimento: birthdate,
                                                    telefone: telefone,
                                                    email,
                                                    cnpj,
                                                    razao: reason,
                                                    fantasia: normalizeFantasia,
                                                    categoria: categoryName,
                                                    cep: dotCep,
                                                    endereco,
                                                    bairro: neighborhood,
                                                    cidade: city,
                                                    estado: cityState,
                                                    nomeBanco: bankName.includes(' - ') ? bankName.split(' - ')[1] : bankName,
                                                    codBanco: bankNumber,
                                                    tipoConta: accountTypeViewName,
                                                    titular: reason,
                                                    numConta: accountNumber,
                                                    agencia: agency,
                                                    tipoCadastro: 'Completo',
                                                    sellerZoopPlan,
                                                    maxParcelas: '10',
                                                    payoutAutomatic: true,
                                                    zoopBankAccountId: responseAssociating.data.id,
                                                    backgroundCheckRequestsAvailable: 10,
                                                    backgroundCheckRequestsAvailablePaid: 0,
                                                    backgroundCheckCurrentMonth: today.getMonth(),
                                                    backgroundCheckCurrentYear: today.getFullYear(),
                                                    alwaysInsured: false
                                                });

                                            const sellerFirebaseData: IFirebaseData = { origin: 'firebase', collection: 'suppliers', field: 'uid', identifier: user.uid };
                                            createRollbackItem(sellerFirebaseData);

                                            await db.collection('users').add({ email, app: 'suppliers' });

                                            const usersFirebaseData: IFirebaseData = { origin: 'firebase', collection: 'users', field: 'email', identifier: email };
                                            createRollbackItem(usersFirebaseData);
                                            try {
                                                // Enviando email de verificação
                                                await auth.currentUser.sendEmailVerification({ url: `${process.env.CONTINUE_URL}` });
                                                await auth.signOut(); // user needs to validate email before signing in to app
                                            } catch (error) {
                                                console.log('Erro no signOut');
                                                console.log(error);
                                                if (error.response) console.log(error.response);
                                                throw 'Erro ao fazer signOut';
                                            }
                                        } catch (error) {
                                            console.log('Erro no firestore');
                                            console.log(error);
                                            if (error.customError) throw error;
                                            if (error.response) console.log(error.response);
                                            throw 'Erro ao salvar na Firestore';
                                        }
                                    } catch (error) {
                                        console.log('Erro no upload externo');
                                        console.log(error);
                                        if (error.customError) throw error;
                                        else throw { msg: 'Erro no upload das imagens. Fale com seu assessor', customError: true };
                                    }
                                } catch (error) {
                                    console.log('Erro na criação da conta');
                                    console.log(error);
                                    if (error.customError) throw error;
                                    throw { msg: 'Erro ao criar conta bancária. Fale com seu assessor', customError: true };
                                }
                            } catch (error) {
                                console.log('Erro na criação Zoop');
                                console.log(error);
                                if (error.customError) throw error;
                                throw { msg: 'Erro ao criar usuário. Tente novamente', customError: true };
                            }
                        } catch (error) {
                            console.log('Erro na email verificação');
                            console.log(error);
                            if (error.customError) throw error;
                            if (error.response) console.log(error.response);
                            throw 'Erro ao enviar email de verificação';
                        }
                    } catch (error) {
                        console.log('Erro na planilha');
                        console.log(error);
                        if (error.customError) throw error;
                        throw { msg: 'Erro ao salvar usuário. Tente novamente.', customError: true };
                    }
                } catch (error) {
                    if (error.customError) throw error;
                    if (error.code) {
                        switch (error.code) {
                            case 'auth/network-request-failed':
                                throw { msg: 'Sem conexão com a rede', customError: true };
                            case 'auth/invalid-email':
                                throw { msg: 'Email inválido', customError: true };
                            case 'auth/email-already-in-use':
                                throw { msg: 'Email já cadastrado', customError: true };
                            case 'auth/operation-not-allowed':
                                throw { msg: 'Operação não permitida', customError: true };
                            case 'auth/weak-password':
                                throw { msg: 'Senha fraca. Mínimo 6 caracteres', customError: true };
                        }
                    }
                    throw 'Erro ao criar usuário';
                }
                window.location.assign('/confirmar-email');
            } else {
                throw { msg: 'Cnpj inválido', customError: true };
            }
        } catch (error) {
            startRollback();
            if (error.customError) reject(error);
            else {
                console.log(error);
                if (error.response) console.log(error.response);
                reject(error);
            }
        }
    });
};

export default completeRegistration;
