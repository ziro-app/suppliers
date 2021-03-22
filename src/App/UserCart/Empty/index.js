import React from 'react';
import Illustration from '@bit/vitorbarbosa19.ziro.illustration';
import { Menu } from '../../Menu';

const Empty = () => {
  return (
    <Menu title="Pedidos">
      <div style={{ display: 'grid', maxWidth: '350px', margin: '0 auto', padding: '20px', gridGap: '20px', justifyItems: 'center' }}>
        <Illustration type="timelineStart" size={150} />
        <label style={{ textAlign: 'center' }}>Ainda sem pedidos, nada a ver por aqui!</label>
      </div>
    </Menu>
  );
};

export default Empty;
