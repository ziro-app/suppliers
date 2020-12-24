import React from 'react';
import Icon from '@bit/vitorbarbosa19.ziro.icon';
import { alertColor, successColor } from '@ziro/theme';
import capitalize from '@ziro/capitalize';
import maskInput from '@ziro/mask-input';

const mountBlockPF = (data, setPendency) => {
    const { nome, nomeMae, dataNascimento, bairro, cep, cidade,
        endereco, estado, falecido, idade, situacaoCpf, dataSituacaoCpf } = data;
    const { cheque, dividas_vencidas, protestos, pefin, refin, ccf } = data;
    return [
        {
            header: 'Informações Pessoais',
            body: [
                {
                    title: 'Nome',
                    content: nome
                },
                {
                    title: 'Nascimento',
                    content: dataNascimento
                },
                // {
                //     title: 'Idade',
                //     content: idade > 0 ? `${idade} anos` : 'Não informado'
                // },
                // {
                //     title: 'Falecido',
                //     content: falecido ? 'Sim' : 'Não'
                // },
                // {
                //     title: 'Nome da mãe',
                //     content: nomeMae
                // },
                // {
                //     title: 'Endereço',
                //     content: endereco
                // },
                // {
                //     title: 'Bairro',
                //     content: bairro
                // },
                // {
                //     title: 'CEP',
                //     content: cep
                // },
                // {
                //     title: 'Cidade',
                //     content: cidade
                // },
                // {
                //     title: 'Estado',
                //     content: estado
                // },
                {
                    title: 'Situação Cadastral',
                    content: situacaoCpf,
                    color: situacaoCpf.toUpperCase() === 'REGULAR' ? successColor : alertColor
                },
                {
                    title: 'Atualizado em',
                    content: dataSituacaoCpf
                }
            ]
        },
        {
            header: 'Transparência',
            body: [
                {
                    title: 'Dívidas vencidas',
                    content: (dividas_vencidas && dividas_vencidas.count > 0) ? <div style={{ cursor: 'pointer' }} onClick={() => setPendency({ ...dividas_vencidas, nome: 'Dividas Vencidas' })}>Pendências <Icon type="chevronRight" size={14} /></div> : 'Nada consta'
                },
                {
                    title: 'Cheque',
                    content: (cheque && cheque.count > 0) ? <div style={{ cursor: 'pointer' }} onClick={() => setPendency({ ...dividas_vencidas, nome: 'Cheque' })}>Pendências <Icon type="chevronRight" size={14} /></div> : 'Nada consta'
                },
                {
                    title: 'Protestos',
                    content: (protestos && protestos.count > 0) ? <div style={{ cursor: 'pointer' }} onClick={() => setPendency({ ...protestos, nome: 'Protestos' })}>Pendências <Icon type="chevronRight" size={14} /></div> : 'Nada consta'
                },
                {
                    title: 'PEFIN',
                    content: (pefin && pefin.count > 0) ? <div style={{ cursor: 'pointer' }} onClick={() => setPendency({ ...pefin, nome: 'PEFIN' })}>Pendências <Icon type="chevronRight" size={14} /></div> : 'Nada consta'
                },
                {
                    title: 'REFIN',
                    content: (refin && refin.count > 0) ? <div style={{ cursor: 'pointer' }} onClick={() => setPendency({ ...refin, nome: 'REFIN' })}>Pendências <Icon type="chevronRight" size={14} /></div> : 'Nada consta'
                },
                {
                    title: 'CCF',
                    content: (ccf && ccf.count > 0) ? <div style={{ cursor: 'pointer' }} onClick={() => setPendency({ ...ccf, nome: 'CCF' })}>Pendências <Icon type="chevronRight" size={14} /></div> : 'Nada consta'
                }
            ]
        }
    ];
};

const mountBlockPJ = (data, setPendency, setPartner) => {
    const { razao, dataFundacao, situacaoCadastral, dataSituacaoCnpj,
        ramoAtv, opcaoTributaria, tipoSociedade, dividas_vencidas,
        protestos, pefin, refin, ccf, socios } = data;
    return [
        {
            header: 'Informações do Documento',
            body: [
                {
                    title: 'Razão',
                    content: razao
                },
                {
                    title: 'Fundação',
                    content: dataFundacao
                },
                {
                    title: 'Ramo de Atividade',
                    content: ramoAtv
                },
                {
                    title: 'Opção Tributária',
                    content: opcaoTributaria
                },
                {
                    title: 'Sócios',
                    content: (socios && socios.count > 0) ? <div style={{ cursor: 'pointer' }} onClick={() => setPartner({ ...socios, nome: 'Quadro de Sócios' })}>Informações Societárias <Icon type="chevronRight" size={14} /></div> : 'Nada consta'
                },
                {
                    title: 'Tipo de Sociedade',
                    content: tipoSociedade
                },
                {
                    title: 'Situação Cadastral',
                    content: situacaoCadastral,
                    color: situacaoCadastral === 'ATIVA' ? successColor : alertColor
                },
                {
                    title: 'Atualizado em',
                    content: dataSituacaoCnpj
                }
            ]
        },
        {
            header: 'Transparência',
            body: [
                {
                    title: 'Dívidas vencidas',
                    content: (dividas_vencidas && dividas_vencidas.count > 0) ? <div style={{ cursor: 'pointer' }} onClick={() => setPendency({ ...dividas_vencidas, nome: 'Dividas Vencidas' })}>Pendências <Icon type="chevronRight" size={14} /></div> : 'Nada consta'
                },
                {
                    title: 'Protestos',
                    content: (protestos && protestos.count > 0) ? <div style={{ cursor: 'pointer' }} onClick={() => setPendency({ ...protestos, nome: 'Protestos' })}>Pendências <Icon type="chevronRight" size={14} /></div> : 'Nada consta'
                },
                {
                    title: 'PEFIN',
                    content: (pefin && pefin.count > 0) ? <div style={{ cursor: 'pointer' }} onClick={() => setPendency({ ...pefin, nome: 'PEFIN' })}>Pendências <Icon type="chevronRight" size={14} /></div> : 'Nada consta'
                },
                {
                    title: 'REFIN',
                    content: (refin && refin.count > 0) ? <div style={{ cursor: 'pointer' }} onClick={() => setPendency({ ...refin, nome: 'REFIN' })}>Pendências <Icon type="chevronRight" size={14} /></div> : 'Nada consta'
                },
                {
                    title: 'CCF',
                    content: (ccf && ccf.count > 0) ? <div style={{ cursor: 'pointer' }} onClick={() => setPendency({ ...ccf, nome: 'CCF' })}>Pendências <Icon type="chevronRight" size={14} /></div> : 'Nada consta'
                }
            ]
        }
    ];
}

const mountBlock = (document, data, setPendency, setPartner) => {
    if (document.length <= 14) return mountBlockPF(data, setPendency);
    else return mountBlockPJ(data, setPendency, setPartner);
};

export default mountBlock;
