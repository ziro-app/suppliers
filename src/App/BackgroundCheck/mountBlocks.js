import currencyFormat from '@ziro/currency-format';
import { alertColor, successColor } from '@ziro/theme';

const verifyTransparency = value => (value === true || value === 0) ? 'Nada consta' : 'Pendências';

const mountBlockPF = (data) => {
    const { nome, dataNascimento, nomeMae, endereco, bairro, cep, cidade, estado, situacaoCpf, falecido, idade } = data;
    const { transparencia: { bancoCentral, ceis, cheque: { totalDevolvidos }, cnep, pendencias, trabalhoEscravo } } = data;
    return [
        {
            header: 'Informações Pessoais',
            body: [
                {
                    title: 'Nome',
                    content: nome
                },
                {
                    title: 'Data de Nascimento',
                    content: dataNascimento
                },
                {
                    title: 'Idade',
                    content: `${idade} anos`
                },
                {
                    title: 'Falecido',
                    content: falecido ? 'Sim' : 'Não'
                },
                {
                    title: 'Nome da mãe',
                    content: nomeMae
                },
                {
                    title: 'Endereço',
                    content: endereco
                },
                {
                    title: 'Bairro',
                    content: bairro
                },
                {
                    title: 'CEP',
                    content: cep
                },
                {
                    title: 'Cidade',
                    content: cidade
                },
                {
                    title: 'Estado',
                    content: estado
                },
                {
                    title: 'Situação - CPF',
                    content: situacaoCpf,
                    color: situacaoCpf.toUpperCase() === 'REGULAR' ? successColor : alertColor
                }
            ]
        },
        {
            header: 'Transparência Financeira',
            body: [
                {
                    title: 'Banco Central',
                    content: verifyTransparency(bancoCentral)
                },
                {
                    title: 'CEIS',
                    content: verifyTransparency(ceis)
                },
                {
                    title: 'CNEP',
                    content: verifyTransparency(cnep)
                },
                {
                    title: 'MTE - Trabalho Escravo',
                    content: verifyTransparency(trabalhoEscravo)
                },
                {
                    title: 'Cheques devolvidos',
                    content: totalDevolvidos
                },
                {
                    title: 'Pendências Financeiras',
                    content: pendencias
                }
            ]
        },
        ...mountBlockLawsuits(data)
    ];
}

const mountBlockPJ = (data) => {
    const { razao, fantasia, situacaoCadastral } = data;
    const { transparencia: { bancoCentral, ceis, cnep, trabalhoEscravo } } = data;
    return [
        {
            header: 'Informações do Documento',
            body: [
                {
                    title: 'Razão',
                    content: razao
                },
                {
                    title: 'Fantasia',
                    content: fantasia
                },
                {
                    title: 'Situação Cadastral',
                    content: situacaoCadastral,
                    color: situacaoCadastral === 'ATIVA' ? successColor : alertColor
                }
            ]
        },
        {
            header: 'Transparência',
            body: [
                {
                    title: 'Banco Central',
                    content: bancoCentral ? 'Nada consta' : 'Pendências'
                },
                {
                    title: 'CEIS',
                    content: ceis ? 'Nada consta' : 'Pendências'
                },
                {
                    title: 'CNEP',
                    content: cnep ? 'Nada consta' : 'Pendências'
                },
                {
                    title: 'MTE - Trabalho Escravo',
                    content: trabalhoEscravo ? 'Nada consta' : 'Pendências'
                }
            ]
        },
        ...mountBlockLawsuits(data)
    ];
}

const mountBlockFinancialTransparencyCPF = ({ anotacoesNegativas: { chequeSemFundo, dividasVencidas, falenciaConcordataRecuperacao, pefin, refin, spc } }) => [
    {
        header: 'Transparência - Financeira',
        body: [
            {
                title: 'Pendências Comerciais',
                content: verifyTransparency(pefin)
            },
            {
                title: 'Pendências Bancárias',
                content: verifyTransparency(refin)
            },
            {
                title: 'SPC',
                content: verifyTransparency(spc)
            },
            {
                title: 'Cheques sem fundos',
                content: verifyTransparency(chequeSemFundo)
            },
            {
                title: 'Falência/Concordata/Recuperação',
                content: verifyTransparency(falenciaConcordataRecuperacao)
            },
            {
                title: 'Dívidas Vencidas',
                content: verifyTransparency(dividasVencidas)
            }
        ]
    }
];

const mountBlockJudicialTransparencyCPF = ({ anotacoesNegativas: { acoesDetalhadas, acoesJudiciais, pendenciasInternas, protestos } }) => [
    {
        header: 'Transparência - Judicial',
        body: [
            {
                title: 'Ações Judiciais',
                content: verifyTransparency(acoesJudiciais)
            },
            {
                title: 'Protestos',
                content: verifyTransparency(protestos)
            },
            {
                title: 'Ações Detalhadas',
                content: verifyTransparency(acoesDetalhadas)
            },
            {
                title: 'Pendências Internas',
                content: verifyTransparency(pendenciasInternas)
            }
        ]
    }
];

const mountBlockDocumentCNPJ = ({ razao, fantasia, situacaoCadastral }) => [
    {
        header: 'Informações do Documento',
        body: [
            {
                title: 'Razão',
                content: razao
            },
            {
                title: 'Fantasia',
                content: fantasia
            },
            {
                title: 'Situação Cadastral',
                content: situacaoCadastral,
                color: situacaoCadastral === 'ATIVA' ? successColor : alertColor
            }
        ]
    }
];

// Os valores true indicam que não há pendências
// false, caso contrário
const mountBlockTransparencyCNPJ = ({ transparencia: { bancoCentral, ceis, cnep, trabalhoEscravo } }) => [
    {
        header: 'Transparência',
        body: [
            {
                title: 'Banco Central',
                content: bancoCentral ? 'Nada consta' : 'Pendências'
            },
            {
                title: 'CEIS',
                content: ceis ? 'Nada consta' : 'Pendências'
            },
            {
                title: 'CNEP',
                content: cnep ? 'Nada consta' : 'Pendências'
            },
            {
                title: 'MTE - Trabalho Escravo',
                content: trabalhoEscravo ? 'Nada consta' : 'Pendências'
            }
        ]
    }
];

const mountBlockLawsuits = ({ protestosEstaduais, processosJudiciais: { totalProcessos, criminal, tributario, trabalhista, eleitoral, militar, civel, valorTotal, valorTotalAtiva, valorTotalOutrasPartes, valorTotalPassiva } }) => [
    {
        header: 'Processos Judiciais',
        body: [
            {
                title: 'Criminais',
                content: criminal
            },
            {
                title: 'Tributários',
                content: tributario
            },
            {
                title: 'Trabalhistas',
                content: trabalhista
            },
            {
                title: 'Eleitorais',
                content: eleitoral
            },
            {
                title: 'Militares',
                content: militar
            },
            {
                title: 'Cíveis/Administrativos',
                content: civel
            },
            {
                title: 'Protestos Estaduais',
                content: protestosEstaduais ? protestosEstaduais : 0
            },
            {
                title: 'Total',
                content: protestosEstaduais ? totalProcessos + protestosEstaduais : totalProcessos
            },
            {
                title: 'Valor total',
                content: currencyFormat(valorTotal) ? currencyFormat(valorTotal) : 'R$0,00'
            }
        ]
    }
];

const mountBlocks = (document, data) => {
    if (document.length <= 14) return mountBlockPF(data);
    else return mountBlockPJ(data);
};

export default mountBlocks;
