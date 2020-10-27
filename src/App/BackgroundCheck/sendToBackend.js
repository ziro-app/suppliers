import { get } from 'axios';
import NextCode from '@bit/vitorbarbosa19.ziro.pay.next-code';
import capitalize from '@ziro/capitalize';
import maskInput from '@ziro/mask-input';
import { db } from '../../Firebase/index';
import mountBlocks from './mountBlocks';

const getInfo = async (docId) => {
    const doc = await db.collection('suppliers').doc(docId).get();
    if (doc.exists) {
        const { freeRequests, currentFreeMonth } = doc.data();
        const now = new Date();
        if (now.getMonth() <= currentFreeMonth) return [freeRequests, currentFreeMonth];
        else return [10, now.getMonth()];
    } else return [null, null];
};

const fillAddress = (addressBack, addressScore) => {
    let neighborhood, cep, city, address, cityState;
    if (addressBack) {
        neighborhood = addressBack?.bairro;
        cep = addressBack?.cep && maskInput(addressBack.cep, '##.###-###', true);
        city = addressBack?.municipio.toUpperCase();
        address = addressBack?.complemento ? `${addressBack.logradouro}, ${addressBack.numero}, ${addressBack.complemento}` : `${addressBack.logradouro}, ${addressBack.numero}`;
        cityState = addressBack?.uf.toUpperCase();
    } else if (!addressBack && addressScore?.length > 0) {
        let index = addressScore.length - 1;
        neighborhood = (addressScore[index]?.district && addressScore[index].district !== 'NULL') && addressScore[index].district;
        cep = addressScore[index]?.zipCode && maskInput(addressScore[index].zipCode, '##.###-###', true);
        city = addressScore[index]?.city.toUpperCase();
        address = addressScore[index]?.address;
        cityState = addressScore[index]?.state.toUpperCase();
    }
    return {
        neighborhood: neighborhood || 'Não informado',
        cep: cep || 'Não informado',
        city: city || 'Não informado',
        address: address || 'Não informado',
        cityState: cityState || 'Não informado'
    };
};

const mountLawsuits = courtLawsuits => {
    const { quantidades, valorTotal, valorTotalAtiva, valorTotalOutrasPartes, valorTotalPassiva } = courtLawsuits;
    let qntd, criminal, tributario, trabalhista, eleitoral, militar, civel;
    if (quantidades?.length > 0) {
        quantidades.map(it => {
            if (it.tipo === 'NUMERO DE PROCESSOS') qntd = it.qtdTotal;
            else if (it.tipo === 'CRIMINAL') criminal = it.qtdTotal;
            else if (it.tipo === 'TRIBUTARIO') tributario = it.qtdTotal;
            else if (it.tipo === 'TRABALHISTA') trabalhista = it.qtdTotal;
            else if (it.tipo === 'ELEITORAL') eleitoral = it.qtdTotal;
            else if (it.tipo === 'MILITAR') militar = it.qtdTotal;
            else if (it.tipo === 'CIVEL / ADMINISTRATIVO') civel = it.qtdTotal;
        });
    }
    return {
        totalProcessos: qntd || 0,
        criminal: criminal || 0,
        tributario: tributario || 0,
        trabalhista: trabalhista || 0,
        eleitoral: eleitoral || 0,
        militar: militar || 0,
        civel: civel || 0,
        valorTotal: valorTotal || 0,
        valorTotalAtiva: valorTotalAtiva || 0,
        valorTotalOutrasPartes: valorTotalOutrasPartes || 0,
        valorTotalPassiva: valorTotalPassiva || 0
    };
};

const sendToBackend = state => () => {
    const { docId, document, setScoreValue, setFreeRequests, setBlockPF, setBlockPJ, clearInfo } = state;
    const field = document.length === 14 ? 'cpf' : 'cnpj';
    const onlyNumbers = document.replace(/[\D]*/g, '');
    const url = (field === 'cpf') ? `https://api-homolog.nxcd.app/background-check/natural-person/${onlyNumbers}` : `https://api-homolog.nxcd.app/background-check/legal-entity/${onlyNumbers}`;
    const config = {
        headers: {
            Authorization: `${process.env.NEXTCODE_AUTH}`
        }
    };
    // const url = `https://id.nxcd.com.br/v1.0/background-check/by-${field}/${onlyNumbers}`;
    return new Promise(async (resolve, reject) => {
        try {
            // BUSCANDO DOCUMENTO NA BASE
            const query = await db.collection('backgroundCheck').where(field, '==', document).get();
            if (query.empty) {
                const [freeRequests, currentFreeMonth] = await getInfo(docId);
                if (freeRequests > 0) {
                    let obj = {};
                    const { data: { data: backgroundCheck } } = await get(url, config);
                    console.log('backgroundCheck: ', backgroundCheck);
                    if (field === 'cpf') {
                        let scoreUrl = `https://api-homolog.nxcd.app/credit-score?federalRevenueNumber=${onlyNumbers}`;
                        const { data: { data: scoreResponse } } = await get(scoreUrl, config);
                        console.log('scoreResponse: ', scoreResponse);
                        const { creditScoreData, checkData, pendingRecords, stateProtest, documentsAlert, locationData } = scoreResponse;
                        const { nome, nomeMae, dataNascimento, endereco, falecido, falecidoConfirmado, idade, processoJudicialTotalizadores, situacaoCpf, _metadata } = backgroundCheck;
                        const formatted = dataNascimento?.split('T')[1] ? dataNascimento.split('T')[0].split('-').reverse().join('/') : 'Não informado';
                        const { address, cep, city, cityState, neighborhood } = fillAddress(endereco, locationData);
                        const lawsuits = mountLawsuits(processoJudicialTotalizadores);

                        obj = {
                            alerta: documentsAlert,
                            nome: capitalize(nome),
                            nomeMae: capitalize(nomeMae),
                            dataNascimento: formatted,
                            cpf: document,
                            bairro: neighborhood,
                            cep,
                            cidade: city,
                            endereco: address,
                            estado: cityState,
                            falecido: falecido && falecidoConfirmado,
                            idade,
                            situacaoCpf,
                            scoreInfo: {
                                score: creditScoreData?.score,
                                description: creditScoreData?.scoreClass?.financialDefaultProbability?.description
                            },
                            transparencia: {
                                cheque: {
                                    retornados: checkData?.returnedChecks ? checkData.returnedChecks.length : 0,
                                    parados21: checkData?.stoppedChecksForReason21 ? checkData.stoppedChecksForReason21.length : 0,
                                    parados: checkData?.stoppedChecks ? checkData.stoppedChecks.length : 0,
                                    totalDevolvidos: checkData?.brazilianRegistryOfBouncedCheckIssuers?.bouncedChecks?.count ? parseInt(checkData.brazilianRegistryOfBouncedCheckIssuers.bouncedChecks.count) : 0,
                                    totalEmitidos: checkData?.brazilianRegistryOfBouncedCheckIssuers?.checks?.count ? parseInt(checkData.brazilianRegistryOfBouncedCheckIssuers.checks.count) : 0
                                },
                                pendencias: pendingRecords?.length ? pendingRecords.length : 0,
                                bancoCentral: _metadata['pessoa-banco-central']['noMatchFound'] || false,
                                ceis: _metadata['pessoa-ceis']['noMatchFound'] || false,
                                cnep: _metadata['pessoa-cnep']['noMatchFound'] || false,
                                trabalhoEscravo: _metadata['pessoa-mte-trabalho-escravo']['noMatchFound'] || false
                            },
                            protestosEstaduais: stateProtest?.latestProtests ? stateProtest.latestProtests.length : 0,
                            processosJudiciais: { ...lawsuits }
                        };
                        // console.log(data)


                        // obj['scoreInfo'] = {
                        //     score: creditScoreData?.score,
                        //     description: creditScoreData?.scoreClass?.financialDefaultProbability?.description
                        // };
                        // obj['financeiro'] = {
                        //     cheque: {
                        //         retornados: checkData?.returnedChecks ? checkData.returnedChecks.length : 0,
                        //         parados21: checkData?.stoppedChecksForReason21 ? checkData.stoppedChecksForReason21.length : 0,
                        //         parados: checkData?.stoppedChecks ? checkData.stoppedChecks.length : 0,
                        //         totalDevolvidos: checkData?.brazilianRegistryOfBouncedCheckIssuers?.bouncedChecks?.count ? parseInt(checkData.brazilianRegistryOfBouncedCheckIssuers.bouncedChecks.count) : 0,
                        //         totalEmitidos: checkData?.brazilianRegistryOfBouncedCheckIssuers?.checks?.count ? parseInt(checkData.brazilianRegistryOfBouncedCheckIssuers.checks.count) : 0
                        //     },
                        //     debitos: debitRecords?.length? debitRecords.length : 0,
                        //     pendencias: pendingRecords?.length? pendingRecords.length : 0
                        // };
                        // obj['judicial'] = {
                        //     protestosEstaduais: stateProtest?.latestProtests? stateProtest.latestProtests.length : 0
                        // };
                    } else {
                        const { empresa, processoJudicialTotalizadores, _metadata } = backgroundCheck;
                        const lawsuits = mountLawsuits(processoJudicialTotalizadores);

                        obj = {
                            cnpj: document,
                            razao: empresa?.razaoSocial || 'Não informado',
                            fantasia: empresa?.nomeFantasia || 'Não informado',
                            situacaoCadastral: empresa?.situacaoCadastral?.status,
                            transparencia: {
                                bancoCentral: _metadata['empresa-banco-central']['noMatchFound'] || false,
                                ceis: _metadata['empresa-ceis']['noMatchFound'] || false,
                                cnep: _metadata['empresa-cnep']['noMatchFound'] || false,
                                trabalhoEscravo: _metadata['empresa-mte-trabalho-escravo']['noMatchFound'] || false
                            },
                            processosJudiciais: { ...lawsuits }
                        };
                    }
                    console.log(obj);
                    await db.collection('backgroundCheck').add({ date: new Date(), ...obj });
                    await db.collection('suppliers').doc(docId).update({ freeRequests: freeRequests - 1, currentFreeMonth });
                    setFreeRequests(freeRequests - 1);
                    const block = mountBlocks(document, obj);
                    if (field === 'cpf') {
                        setScoreValue(obj?.scoreInfo?.score || 0);
                        setBlockPF(block);
                        setBlockPJ([]);
                    } else {
                        setBlockPJ(block);
                        setBlockPF([]);
                    }
                    resolve('Pesquisa na base NextCode');
                } else if (freeRequests === 0) {
                    clearInfo();
                    throw { msg: 'Consultas grátis esgotadas. Recarregue seu saldo', customError: true };
                } else {
                    clearInfo();
                    throw { msg: 'Usuário não encontrado, recarregue a página', customError: true };
                }
                // CÓDIGO USADO QUANDO O DOCUMENTO ESTÁ NA BASE
            } else {
                const data = query.docs[0].data();
                console.log('data: ', data);
                const block = mountBlocks(document, data);
                console.log('block: ', block);
                if (field === 'cpf') {
                    const { scoreInfo: { score } } = data;
                    setScoreValue(score);
                    setBlockPF(block);
                    setBlockPJ([]);
                } else {
                    setBlockPJ(block);
                    setBlockPF([]);
                }
                resolve('Resultado na base');
            }

            // CÓDIGO USADO QUANDO BUSCAVA CPF
            // } else {
            //     console.log(document, field);
            //     const query = await db.collection('backgroundCheckMock').where(field, '==', document).get();
            //     if (!query.empty) {
            //         const data = query.docs[0].data();
            //         setScoreValue(data.score);
            //         setBlockIdentification(mountBlockIdentificationCPF(data));
            //         setBlockFinancialTransparency(mountBlockFinancialTransparencyCPF(data));
            //         setBlockJudicialTransparency(mountBlockJudicialTransparencyCPF(data));
            //         console.log(data);
            //         resolve('Teste sucedido');
            //     } else {
            //         console.log('Deu ruim');
            //         resolve('Teste do ruim');
            //     }
            //     // clearInfo();
            //     // reject({ msg: 'Disponível apenas para CNPJ no momento', customError: true });
            // }
        } catch (error) {
            clearInfo();
            if (error.customError) reject(error);
            else {
                console.log(error);
                if (error.response) console.log(error.response);
                reject('Erro ao buscar documento');
            }
        }
    });
};

export default sendToBackend;
