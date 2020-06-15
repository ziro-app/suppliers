import React from 'react';
import Illustration from '@bit/vitorbarbosa19.ziro.illustration';

const ReceiptError = () => {
  return (
    <div style={{ display: 'grid', maxWidth: '350px', margin: '0 auto', justifyItems: 'center' }}>
      <Illustration type="timelineStart" size={150} />
      <label style={{ textAlign: 'center' }}>Ocorreu um erro ao buscar o recibo, por favor tente novamente!</label>
    </div>
  );
};

export default ReceiptError;
