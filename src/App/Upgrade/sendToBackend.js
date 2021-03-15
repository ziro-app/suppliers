import capitalize from '@ziro/capitalize';
import updateSheets from './updateSheets';
import updateSellerZoop from './updateSellerZoop';
import createToken from './createToken';
import uploadDocuments from './uploadDocuments';
import updateFirestore from './updateFirestore';

const sendToBackend = (state) => () => {
    const { category, categoryName, cpf, dayOfBirth, phone, accountType, accountTypeViewName, bankName, bankNumber, agency, accountNumber, zoopId, docId, cnpj, reason, userPos, idDoc, idAtv, idRes, idCnpj, fantasia } = state;

    const nascimento = dayOfBirth;
    const fone = phone ? `55 ${phone.trim()}` : '';
    const categoria = categoryName;
    const tipoConta = accountTypeViewName;
    const codBanco = bankNumber;
    const agencia = agency;
    const numConta = accountNumber;
    const titular = reason;
    const statementDescriptor = capitalize(fantasia);

    return new Promise(async (resolve, reject) => {
        try {

            // Atualizando planilha Google Sheets
            try {
                await updateSheets(userPos, cpf, nascimento, categoria, tipoConta, codBanco, titular, agencia, numConta);
            } catch (error) {
                if (error.customError) throw error
                throw { msg: 'Erro ao atualizar planilha.', customError: true }
            };

            // Atualizando registro na Zoop
            try {
                await updateSellerZoop(zoopId, cpf, dayOfBirth, phone, category, statementDescriptor);
            } catch (error) {
                if (error.customError) throw error
                throw { msg: 'Erro ao atualizar na Zoop.', customError: true }
            };

            // Criação Token Conta Bancária
            try {
                await createToken(cnpj, bankNumber, reason, agency, accountNumber, accountType, zoopId);
            } catch (error) {
                if (error.customError) throw error
                throw { msg: 'Erro na criação/associação do Token.', customError: true }
            };

            // Upload das imagens
            try {
                await uploadDocuments(zoopId, idDoc, idAtv, idRes, idCnpj);
            } catch (error) {
                if (error.customError) throw error
                throw { msg: 'Erro ao enviar documentos.', customError: true }
            };

            // Atualizando na collection suppliers no Firestore
            try {
                await updateFirestore(docId, categoryName, bankName, bankNumber, tipoConta, reason, accountNumber, agency, cpf, nascimento);

                window.location.assign('/upgrade');

                resolve("Conta atualizada com sucesso!");
            } catch (error) {
                if (error.customError) throw error
                throw { msg: 'Erro ao atualizar no Firestore.', customError: true }
            }
        } catch (error) {
            reject("Erro ao atualizar cadastro, fale com seu acessor");
            if (error.customError) throw error
            throw { msg: 'Erro ao atualizar cadastro, fale com seu acessor.', customError: true }
        }
    });
};

export default sendToBackend;
