import React from 'react';

export const cadastralSituationBody = (
    <div style={{ display: 'grid', gap: 10 }}>
        <label style={{ marginTop: 10 }}>
            Situação do CPF ou CNPJ junto à Receita Federal
        </label>
    </div>
),
    protestsBody = (
        <div style={{ display: 'grid', gap: 10 }}>
            <label style={{ marginTop: 10 }}>
                Um protesto é quando uma pessoa ou empresa deixa de pagar algum título e o credor registra essa dívida em cartório
            </label>
        </div>
    ),
    pefinBody = (
        <div style={{ display: 'grid', gap: 10 }}>
            <label style={{ marginTop: 10 }}>
                O PEFIN é um serviço da Serasa Experian onde empresas podem consultar e incluir informações sobre pendências financeiras de um cliente pessoa física ou jurídica.
            </label>
            <label>
                Os dados visualizados são fornecidos por instituições de diferentes segmentos da economia, como varejo, indústria, prestação de serviço, entre outros.
            </label>
        </div>
    ),
    refinBody = (
        <div style={{ display: 'grid', gap: 10 }}>
            <label style={{ marginTop: 10 }}>
                O REFIN é um sistema semelhante ao PEFIN. Enquanto o PEFIN envolve a inclusão e consulta a informações sobre dívidas que pessoas físicas ou jurídicas possam ter em diferentes setores da economia, o REFIN está relacionado a débitos com bancos e outras instituições financeiras.
            </label>
        </div>
    ),
    ccfBody = (
        <div style={{ display: 'grid', gap: 10 }}>
            <label style={{ marginTop: 10 }}>
                Se você passar um cheque sem ter dinheiro na conta para o pagamento, seu nome vai para o CCF. A sigla significa Cadastro de Emitentes de Cheque sem Fundo.
            </label>
            <label>
                É um registro do Banco Central que pode ser consultado por qualquer banco e empresas que concedem crédito.
            </label>
        </div>
    ),
    economicClassBody = message => (
        <div style={{ display: 'grid', gap: 10 }}>
            <label style={{ marginTop: 10 }}>
                {message}
            </label>
        </div>
    ),
    individualSalaryBody = (
        <div style={{ display: 'grid', gap: 10 }}>
            <label style={{ marginTop: 10 }}>
                Trata-se do último salário informado junto à Receita Federal, podendo trazer divergências com a atual classe econômica por falta de atualizações nesse valor.
            </label>
        </div>
    ),
    familySalaryBody = (
        <div style={{ display: 'grid', gap: 10 }}>
            <label style={{ marginTop: 10 }}>
                Trata-se da soma aproximada de todos os salários individuais do quadro familiar junto à Receita Federal, podendo trazer divergências com a atual classe econômica familiar por falta de atualizações no salário individual de algum participante.
            </label>
        </div>
    ),
    addressBody = (
        <div style={{ display: 'grid', gap: 10 }}>
            <label style={{ marginTop: 10 }}>
                Trata-se de todos os endereços informados junto à Receita Federal para o documento. A existência dos registros não implicam diretamente que será possível encontrar atualmente o(s) responsável(eis) pelo documento no endereço mostrado.
            </label>
        </div>
    ),
    phonesBody = (
        <div style={{ display: 'grid', gap: 10 }}>
            <label style={{ marginTop: 10 }}>
                Trata-se de todos os telefones informados junto à Receita Federal para o documento.
            </label>
        </div>
    ),
    emailsBody = (
        <div style={{ display: 'grid', gap: 10 }}>
            <label style={{ marginTop: 10 }}>
                Trata-se de todos os emails informados junto à Receita Federal para o documento.
            </label>
        </div>
    ),
    fieldsOfActivityBody = (
        <div style={{ display: 'grid', gap: 10 }}>
            <label style={{ marginTop: 10 }}>
                O ramo de atividade é o que define a área em que a sua empresa irá atuar. Nada impede que uma empresa tenha mais de um código de atividade, mesmo que sejam em diferentes setores da economia, mas uma delas deve ser a principal, ou seja, a mais representativa, as demais serão secundárias.
            </label>
        </div>
    ),
    legalNatureBody = (
        <div style={{ display: 'grid', gap: 10 }}>
            <label style={{ marginTop: 10 }}>
                Refere-se ao regime jurídico em que a empresa se enquadra, isto é, a relação da pessoa jurídica pública ou privada com o exame que será feito pela fiscalização no respectivo empreendimento, somado ao que consta dos dados da empresa nos cadastros da administração pública.
            </label>
        </div>
    ),
    // fonte: http://www8.receita.fazenda.gov.br/SimplesNacional/Documentos/Pagina.aspx?id=3
    simpleNationalBody = (
        <div style={{ display: 'grid', gap: 10 }}>
            <label style={{ marginTop: 10 }}>
                O Simples Nacional é um regime compartilhado de arrecadação, cobrança e fiscalização de tributos aplicável às Microempresas e Empresas de Pequeno Porte, previsto na Lei Complementar nº 123, de 14 de dezembro de 2006.
            </label>
            <label>
                Abrange a participação de todos os entes federados (União, Estados, Distrito Federal e Municípios).
            </label>
        </div>
    ),
    // fonte: https://conube.com.br/blog/o-que-e-capital-social/
    shareCapital = (
        <div style={{ display: 'grid', gap: 10 }}>
            <label style={{ marginTop: 10 }}>
                Refere-se ao valor que os sócios ou acionistas estabelecem para sua empresa no momento da abertura. É a quantia bruta que é investida, o montante necessário para iniciar as atividades de uma nova empresa, considerando o tempo em que ela ainda não vai gerar lucro suficiente para se sustentar.
            </label>
        </div>
    )
