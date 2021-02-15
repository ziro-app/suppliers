import React from 'react';

export const tituloSeguro = (
  <div>
    <p style={{ color: '#323232' }}>Forçar seguro em todas as transações</p>
  </div>
);

export const tituloParcelamento = (
  <div>
    <p style={{ color: '#323232' }}>Parcelamento máximo para o cliente</p>
  </div>
);

export const tooltipSeguro = (
  <div style={{ marginTop: '20px' }}>
    <label style={{ fontSize: '1.4rem' }}>
      Ao ativar essa opção, todos os links de pagamento criados passarão a ser sempre com seguro, eliminando a opção de escolha no momento da criação do link. Apenas a conta admin pode alterar essa
      configuração.
    </label>
  </div>
);

export const tooltipParcelamento = (
  <div style={{ marginTop: '20px' }}>
    <label style={{ fontSize: '1.4rem' }}>
      Escolha o parcelamento máximo disponível na tela de criação de links de pagamento. Se você escolher, por exemplo, 6 parcelas, então nenhum link poderá ser criado aceitando mais que 6 parcelas
      para o cliente.
    </label>
  </div>
);