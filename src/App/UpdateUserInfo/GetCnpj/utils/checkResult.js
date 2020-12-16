const checkResult = (status, result, ignoreDb) => {
    if (status) {
        const objResult = {};
        // validations
        const cnaes = [...result.atividades_secundarias, result.atividade_principal].map(({ code }) => code);
        // const cnaeIsValid = !!cnaes.filter(code => validCnaes.includes(code)).pop();
        const isActive = result.situacao === 'ATIVA';
        if (!isActive) {
            throw { msg: 'CNPJ não está ativo', finally: true };
        }
        // if(!cnaeIsValid){
        //     throw { msg: 'CNAE inválido', finally: true }; 
        // }
        objResult.reason = result.nome;
        objResult.fantasia = result.fantasia;
        objResult.street = result.logradouro;
        objResult.number = result.numero;
        objResult.complement = result.complemento;
        objResult.neighborhood = result.bairro;
        objResult.cep = result.cep.replace('.', '');
        objResult.city = result.municipio;
        objResult.cityState = result.uf;
        objResult.fone = result.telefone;
        return objResult;
    } throw { msg: 'CNPJ inválido na Receita', customError: true };
};

export default checkResult;