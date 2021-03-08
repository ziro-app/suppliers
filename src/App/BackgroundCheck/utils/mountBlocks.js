import React from 'react';
import TooltipHelp from '@bit/vitorbarbosa19.ziro.tooltip-help';
import { alertColor, successColor } from '@ziro/theme';
import capitalize from '@ziro/capitalize';
import maskInput from '@ziro/mask-input';
import { details, tooltipContainer, tooltipCursor } from '../styles';
import { cadastralSituationBody, ccfBody, pefinBody, protestsBody, refinBody } from './tooltipBody';

const mountBlockPF = (data, setPendency) => {
    const { nome, nomeMae, dataNascimento, bairro, cep, cidade,
        endereco, estado, falecido, idade, situacaoCpf, dataSituacaoCpf } = data;
        console.log(data)
    const { cheque, dividas_vencidas, protestos, pefin, refin, ccf } = data;
    return [
        {
            header: 'Informações Pessoais',
            body: [
                {
                    title: 'Nome',
                    content: nome || 'Nome não encontrado'
                },
                {
                    title: 'Nascimento',
                    content: dataNascimento
                },
                {
                    title: 'Idade',
                    content: (idade && idade > 0) ? `${idade} anos` : 'Não informado'
                },
                {
                    title: 'Falecido',
                    content: falecido ? 'Sim' : 'Não'
                },
                {
                    title: 'Nome da mãe',
                    content: nomeMae ? nomeMae : 'Não informado'
                },
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
                    title: <div style={tooltipContainer}>Situação Cadastral&nbsp;<div style={tooltipCursor}><TooltipHelp iconSize={14} illustration="cardAnalysis" title="Situação Cadastral" body={cadastralSituationBody} /></div></div>,
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
                    title: <div style={tooltipContainer}>Protestos&nbsp;<div style={tooltipCursor}><TooltipHelp iconSize={14} illustration="cardAnalysis" title="Protestos" body={protestsBody} /></div></div>,
                    content: (protestos && protestos.count > 0) ? <div style={details} onClick={() => setPendency({ ...protestos, nome: 'Protestos' })}>Pendências</div> : 'Nada consta'
                },
                {
                    title: <div style={tooltipContainer}>PEFIN&nbsp;<div style={tooltipCursor}><TooltipHelp iconSize={14} illustration="cardAnalysis" title="PEFIN" body={pefinBody} /></div></div>,
                    content: (pefin && pefin.count > 0) ? <div style={details} onClick={() => setPendency({ ...pefin, nome: 'PEFIN' })}>Pendências</div> : 'Nada consta'
                },
                {
                    title: <div style={tooltipContainer}>REFIN&nbsp;<div style={tooltipCursor}><TooltipHelp iconSize={14} illustration="cardAnalysis" title="REFIN" body={refinBody} /></div></div>,
                    content: (refin && refin.count > 0) ? <div style={details} onClick={() => setPendency({ ...refin, nome: 'REFIN' })}>Pendências</div> : 'Nada consta'
                },
                {
                    title: <div style={tooltipContainer}>CCF&nbsp;<div style={tooltipCursor}><TooltipHelp iconSize={14} illustration="cardAnalysis" title="CCF" body={ccfBody} /></div></div>,
                    content: (ccf && ccf.count > 0) ? <div style={details} onClick={() => setPendency({ ...ccf, nome: 'CCF' })}>Pendências</div> : 'Nada consta'
                }
            ]
        }
    ];
};

const mountBlockPJ = (data, setPendency, setPartner) => {
    const { razao, dataFundacao, situacaoCadastral, dataSituacaoCnpj,
        ramoAtv, naturezaJuridica, tipoSociedade, dividas_vencidas,
        protestos, pefin, refin, ccf, socios } = data;
        console.log(data)
    const principal = ramoAtv.data ? ramoAtv.data.filter(it => it.atvdPrimaria)[0]['descricao'] : '';
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
                    content: principal || 'Não informado'
                },
                {
                    title: 'Natureza jurídica',
                    content: naturezaJuridica?.descricao ? naturezaJuridica.descricao : 'Não informado'
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
                    title: <div style={tooltipContainer}>Situação Cadastral&nbsp;<div style={tooltipCursor}><TooltipHelp iconSize={14} illustration="cardAnalysis" title="Situação Cadastral" body={cadastralSituationBody} /></div></div>,
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
                    title: <div style={tooltipContainer}>Protestos&nbsp;<div style={tooltipCursor}><TooltipHelp iconSize={14} illustration="cardAnalysis" title="Protestos" body={protestsBody} /></div></div>,
                    content: (protestos && protestos.count > 0) ? <div style={details} onClick={() => setPendency({ ...protestos, nome: 'Protestos' })}>Pendências</div> : 'Nada consta'
                },
                {
                    title: <div style={tooltipContainer}>PEFIN&nbsp;<div style={tooltipCursor}><TooltipHelp iconSize={14} illustration="cardAnalysis" title="PEFIN" body={pefinBody} /></div></div>,
                    content: (pefin && pefin.count > 0) ? <div style={details} onClick={() => setPendency({ ...pefin, nome: 'PEFIN' })}>Pendências</div> : 'Nada consta'
                },
                {
                    title: <div style={tooltipContainer}>REFIN&nbsp;<div style={tooltipCursor}><TooltipHelp iconSize={14} illustration="cardAnalysis" title="REFIN" body={refinBody} /></div></div>,
                    content: (refin && refin.count > 0) ? <div style={details} onClick={() => setPendency({ ...refin, nome: 'REFIN' })}>Pendências</div> : 'Nada consta'
                },
                {
                    title: <div style={tooltipContainer}>CCF&nbsp;<div style={tooltipCursor}><TooltipHelp iconSize={14} illustration="cardAnalysis" title="CCF" body={ccfBody} /></div></div>,
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
