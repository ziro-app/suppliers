import React from 'react';
import TooltipHelp from '@bit/vitorbarbosa19.ziro.tooltip-help';
import { alertColor, successColor } from '@ziro/theme';
import capitalize from '@ziro/capitalize';
import currencyFormat from '@ziro/currency-format';
import { details, tooltipContainer, tooltipCursor } from '../styles';
import {
    addressBody, cadastralSituationBody, ccfBody, economicClassBody,
    emailsBody, familySalaryBody, individualSalaryBody, pefinBody, phonesBody,
    protestsBody, refinBody, fieldsOfActivityBody, legalNatureBody, simpleNationalBody,
    shareCapital
} from './tooltipBody';

const formatCurrency = value => currencyFormat(value.replace('.', '')) || 'Não informado';

const mountBlockPF = (data, setPages) => {
    const { nome, dataNascimento, socios,
        falecido, idade, situacaoCpf, dataSituacaoCpf, nacionalidade, numDependentes,
        genero, pessoaPolitica, rendaPresumida, telefones, emails, enderecos, parentescos } = data;
    const { cheque, dividas_vencidas, protestos, pefin, refin, ccf } = data;
    const { setPendency, setDefaultData } = setPages;
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
                    title: 'Nacionalidade',
                    content: nacionalidade || 'Não informado'
                },
                {
                    title: 'Gênero',
                    content: genero || 'Não informado'
                },
                {
                    title: 'Nº dependentes',
                    content: numDependentes
                },
                {
                    title: 'Pessoa política',
                    content: pessoaPolitica ? 'Sim' : 'Não'
                },
                {
                    title: 'Falecido',
                    content: falecido ? 'Sim' : 'Não'
                },
                {
                    title: 'Parentescos',
                    content: (parentescos && parentescos.count > 0) ? <div style={details} onClick={() => setDefaultData({ ...parentescos, nome: 'Parentescos', sortedFields: ["nome", "cpf", "parentesco", "genero"] })}>Visualizar</div> : 'Não informado'
                },
                {
                    title: <div style={tooltipContainer}>Endereços&nbsp;<div style={tooltipCursor}><TooltipHelp iconSize={14} illustration="cardAnalysis" title="Endereços" body={addressBody} /></div></div>,
                    content: (enderecos && enderecos.count > 0) ? <div style={details} onClick={() => setDefaultData({ ...enderecos, nome: 'Endereços', sortedFields: ["cep", "rua", "numero", "complemento", "bairro", "cidade", "estado"] })}>Visualizar</div> : 'Não informado'
                },
                {
                    title: 'Part. societárias',
                    content: (socios && socios.count > 0) ? <div style={details} onClick={() => setDefaultData({ ...socios, nome: 'Participações societárias', sortedFields: ["capital"] })}>Visualizar</div> : 'Não informado'
                },
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
            header: 'Contatos',
            body: [
                {
                    title: <div style={tooltipContainer}>Telefones&nbsp;<div style={tooltipCursor}><TooltipHelp iconSize={14} illustration="cardAnalysis" title="Telefones" body={phonesBody} /></div></div>,
                    content: (telefones && telefones.count > 0) ? <div style={details} onClick={() => setDefaultData({ ...telefones, nome: 'Telefones', sortedFields: ["ddd", "numero"], blockTitle: 'Telefone' })}>Visualizar</div> : 'Não informado'
                },
                {
                    title: <div style={tooltipContainer}>Emails&nbsp;<div style={tooltipCursor}><TooltipHelp iconSize={14} illustration="cardAnalysis" title="Emails" body={emailsBody} /></div></div>,
                    content: (emails && emails.count > 0) ? <div style={details} onClick={() => setDefaultData({ ...emails, nome: 'Emails', sortedFields: ["email"], blockTitle: 'Email' })}>Visualizar</div> : 'Não informado'
                }
            ]
        },
        {
            header: 'Renda Presumida',
            body: [
                {
                    title: <div style={tooltipContainer}>Classe I&nbsp;<div style={tooltipCursor}><TooltipHelp iconSize={14} illustration="cardAnalysis" title="Classe individual" body={economicClassBody(rendaPresumida?.descricaoIndividual || 'Descrição não informada')} /></div></div>,
                    content: rendaPresumida?.classeIndividual || 'Não informado'
                },
                {
                    title: <div style={tooltipContainer}>Salário I&nbsp;<div style={tooltipCursor}><TooltipHelp iconSize={14} illustration="cardAnalysis" title="Salário individual" body={individualSalaryBody} /></div></div>,
                    content: formatCurrency(rendaPresumida?.salary || '')
                },
                {
                    title: <div style={tooltipContainer}>Classe F&nbsp;<div style={tooltipCursor}><TooltipHelp iconSize={14} illustration="cardAnalysis" title="Classe familiar" body={economicClassBody(rendaPresumida?.descricaoFamilia || 'Descrição não informada')} /></div></div>,
                    content: rendaPresumida?.classeFamilia || 'Não informado'
                },
                {
                    title: <div style={tooltipContainer}>Salário F&nbsp;<div style={tooltipCursor}><TooltipHelp iconSize={14} illustration="cardAnalysis" title="Salário familiar" body={familySalaryBody} /></div></div>,
                    content: formatCurrency(rendaPresumida?.salarioFamiliar || '')
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

const mountBlockPJ = (data, setPages) => {
    const { razao, dataFundacao, situacaoCadastral, dataSituacaoCnpj, telefones,
        ramoAtv, naturezaJuridica, tipo, dividas_vencidas, rendimentos, emails, enderecos,
        protestos, pefin, refin, ccf, simplesNacional, porte, administradores } = data;
    const { setPendency, setDefaultData } = setPages;
    const normalized = porte && capitalize(porte.split('_').join(' ').trim()) || 'Não informado';
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
                    title: <div style={tooltipContainer}>N. Jurídica&nbsp;<div style={tooltipCursor}><TooltipHelp iconSize={14} illustration="cardAnalysis" title="Natureza Jurídica" body={legalNatureBody} /></div></div>,
                    content: naturezaJuridica?.descricao || 'Não informado'
                },
                {
                    title: 'Tipo',
                    content: tipo || 'Não informado'
                },
                {
                    title: 'Porte',
                    content: normalized
                },
                {
                    title: <div style={tooltipContainer}>Simples N.&nbsp;<div style={tooltipCursor}><TooltipHelp iconSize={14} illustration="cardAnalysis" title="Simples Nacional" body={simpleNationalBody} /></div></div>,
                    content: simplesNacional ? simplesNacional === 'N' ? 'Não' : 'Sim' : 'Não informado'
                },
                {
                    title: <div style={tooltipContainer}>Endereços&nbsp;<div style={tooltipCursor}><TooltipHelp iconSize={14} illustration="cardAnalysis" title="Endereços" body={addressBody} /></div></div>,
                    content: (enderecos && enderecos.count > 0) ? <div style={details} onClick={() => setDefaultData({ ...enderecos, nome: 'Endereços', sortedFields: ["cep", "rua", "numero", "complemento", "bairro", "cidade", "estado"], pj: true })}>Visualizar</div> : 'Não informado'
                },
                {
                    title: <div style={tooltipContainer}>Ramos de Atvd&nbsp;<div style={tooltipCursor}><TooltipHelp iconSize={14} illustration="cardAnalysis" title="Ramos de Atividade" body={fieldsOfActivityBody} /></div></div>,
                    content: (ramoAtv && ramoAtv.count > 0) ? <div style={details} onClick={() => setDefaultData({ ...ramoAtv, nome: 'Ramos de Atividade', sortedFields: ["atvdPrimaria", "cnae", "descricao"] })}>Visualizar</div> : 'Não informado'
                },
                {
                    title: 'Sócios',
                    content: (administradores && administradores.count > 0) ? <div style={details} onClick={() => setDefaultData({ ...administradores, nome: 'Sócios Administradores', sortedFields: ["cpf"], blockTitle: 'Sócio' })}>Visualizar</div> : 'Não informado'
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
            header: 'Contatos',
            body: [
                {
                    title: <div style={tooltipContainer}>Telefones&nbsp;<div style={tooltipCursor}><TooltipHelp iconSize={14} illustration="cardAnalysis" title="Telefones" body={phonesBody} /></div></div>,
                    content: (telefones && telefones.count > 0) ? <div style={details} onClick={() => setDefaultData({ ...telefones, nome: 'Telefones', sortedFields: ["ddd", "numero"], blockTitle: 'Telefone' })}>Visualizar</div> : 'Não informado'
                },
                {
                    title: <div style={tooltipContainer}>Emails&nbsp;<div style={tooltipCursor}><TooltipHelp iconSize={14} illustration="cardAnalysis" title="Emails" body={emailsBody} /></div></div>,
                    content: (emails && emails.count > 0) ? <div style={details} onClick={() => setDefaultData({ ...emails, nome: 'Emails', sortedFields: ["email"], blockTitle: 'Email', pj: true })}>Visualizar</div> : 'Não informado'
                }
            ]
        },
        {
            header: 'Rendimentos',
            body: [
                {
                    title: <div style={tooltipContainer}>Capital S.&nbsp;<div style={tooltipCursor}><TooltipHelp iconSize={14} illustration="cardAnalysis" title="Capital Social" body={shareCapital} /></div></div>,
                    content: formatCurrency(rendimentos?.capitalSocial || '')
                },
                {
                    title: 'Balanço Min.',
                    content: formatCurrency(rendimentos?.balancoMinimo || '')
                },
                {
                    title: 'Faturamento Min.',
                    content: formatCurrency(rendimentos?.faturamentoMinimo || '')
                },
                {
                    title: 'Balanço Max.',
                    content: formatCurrency(rendimentos?.balancoMaximo || '')
                },
                {
                    title: 'Faturamento Max.',
                    content: formatCurrency(rendimentos?.faturamentoMaximo || '')
                },
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

const mountBlock = (document, data, setPages) => {
    if (document.length <= 14) return mountBlockPF(data, setPages);
    else return mountBlockPJ(data, setPages);
};

export default mountBlock;
