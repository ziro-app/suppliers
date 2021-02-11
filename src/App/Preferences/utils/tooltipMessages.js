import React from 'react';

export const tooltipSeguro = (
  <div>
    <label>
      Ao ativar essa opção, todos os links de pagamento criados passarão a ser sempre com seguro, eliminando a opção de escolha no momento da criação do link. Apenas a conta admin pode alterar essa
      configuração.
    </label>
  </div>
);

export const tooltipParcelamento = (
  <div>
    <label>
      Escolha o parcelamento máximo disponível na tela de criação de links de pagamento. Se você escolher, por exemplo, 6 parcelas, então nenhum link poderá ser criado aceitando mais que 6 parcelas
      para o cliente.
    </label>
  </div>
);