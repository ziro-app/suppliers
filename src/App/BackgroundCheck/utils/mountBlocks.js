import React from 'react';
import TooltipHelp from '@bit/vitorbarbosa19.ziro.tooltip-help';
import { alertColor, successColor } from '@ziro/theme';
import capitalize from '@ziro/capitalize';
import maskInput from '@ziro/mask-input';
import { details } from '../styles';
import { tooltipBody } from './tooltipBody';

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
                    title: <>Situação Cadastral&nbsp;<TooltipHelp iconSize={14} illustration="cardAnalysis" title="Situação Cadastral" body={tooltipBody} /></>,
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
                    content: (dividas_vencidas && dividas_vencidas.count > 0) ? <div style={details} onClick={() => setPendency({ ...dividas_vencidas, nome: 'Dividas Vencidas' })}>Pendências</div> : 'Nada consta'
                },
                {
                    title: 'Cheque',
                    content: (cheque && cheque.count > 0) ? <div style={details} onClick={() => setPendency({ ...dividas_vencidas, nome: 'Cheque' })}>Pendências</div> : 'Nada consta'
                },
                {
                    title: <>Protestos&nbsp;<TooltipHelp iconSize={14} illustration="cardAnalysis" title="Protestos" body={tooltipBody} /></>,
                    content: (protestos && protestos.count > 0) ? <div style={details} onClick={() => setPendency({ ...protestos, nome: 'Protestos' })}>Pendências</div> : 'Nada consta'
                },
                {
                    title: <>PEFIN&nbsp;<TooltipHelp iconSize={14} illustration="cardAnalysis" title="PEFIN" body={tooltipBody} /></>,
                    content: (pefin && pefin.count > 0) ? <div style={details} onClick={() => setPendency({ ...pefin, nome: 'PEFIN' })}>Pendências</div> : 'Nada consta'
                },
                {
                    title: <>REFIN&nbsp;<TooltipHelp iconSize={14} illustration="cardAnalysis" title="REFIN" body={tooltipBody} /></>,
                    content: (refin && refin.count > 0) ? <div style={details} onClick={() => setPendency({ ...refin, nome: 'REFIN' })}>Pendências</div> : 'Nada consta'
                },
                {
                    title: <>CCF&nbsp;<TooltipHelp iconSize={14} illustration="cardAnalysis" title="CCF" body={tooltipBody} /></>,
                    content: (ccf && ccf.count > 0) ? <div style={details} onClick={() => setPendency({ ...ccf, nome: 'CCF' })}>Pendências</div> : 'Nada consta'
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
                    content: (socios && socios.count > 0) ? <div style={details} onClick={() => setPartner({ ...socios, nome: 'Quadro de Sócios' })}>Detalhes</div> : 'Não informado'
                },
                {
                    title: 'Tipo de Sociedade',
                    content: tipoSociedade
                },
                {
                    title: <>Situação Cadastral&nbsp;<TooltipHelp iconSize={14} illustration="cardAnalysis" title="Situação Cadastral" body={tooltipBody} /></>,
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
                    content: (dividas_vencidas && dividas_vencidas.count > 0) ? <div style={details} onClick={() => setPendency({ ...dividas_vencidas, nome: 'Dividas Vencidas' })}>Pendências</div> : 'Nada consta'
                },
                {
                    title: <>Protestos&nbsp;<TooltipHelp iconSize={14} illustration="cardAnalysis" title="Protestos" body={tooltipBody} /></>,
                    content: (protestos && protestos.count > 0) ? <div style={details} onClick={() => setPendency({ ...protestos, nome: 'Protestos' })}>Pendências</div> : 'Nada consta'
                },
                {
                    title: <>PEFIN&nbsp;<TooltipHelp iconSize={14} illustration="cardAnalysis" title="PEFIN" body={tooltipBody} /></>,
                    content: (pefin && pefin.count > 0) ? <div style={details} onClick={() => setPendency({ ...pefin, nome: 'PEFIN' })}>Pendências</div> : 'Nada consta'
                },
                {
                    title: <>REFIN&nbsp;<TooltipHelp iconSize={14} illustration="cardAnalysis" title="REFIN" body={tooltipBody} /></>,
                    content: (refin && refin.count > 0) ? <div style={details} onClick={() => setPendency({ ...refin, nome: 'REFIN' })}>Pendências</div> : 'Nada consta'
                },
                {
                    title: <>CCF&nbsp;<TooltipHelp iconSize={14} illustration="cardAnalysis" title="CCF" body={tooltipBody} /></>,
                    content: (ccf && ccf.count > 0) ? <div style={details} onClick={() => setPendency({ ...ccf, nome: 'CCF' })}>Pendências</div> : 'Nada consta'
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
