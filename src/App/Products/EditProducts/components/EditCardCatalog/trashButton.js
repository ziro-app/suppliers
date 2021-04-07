import React from 'react';
import Icon from '@bit/vitorbarbosa19.ziro.icon';
import { alertColor } from '@ziro/theme'

export default ({ onClick, shadow = false, strokeWidth }) => (
  <div
    style={{
      position: 'absolute',
      display: 'grid',
      top: 10,
      right: 16,
      background: 'white',
      borderRadius: '50%',
      justifyContent: shadow ? 'center' : 'end',
      alignItems: 'center',
      width: shadow ? '40px' : '0px',
      height: shadow ? '40px' : '0px',
      boxShadow: shadow ? 'rgba(34, 34, 34, 0.3) 0px 5px 10px -1px' : 'none'
    }}
    onClick={onClick}
  >
    <Icon type="trash" size={20} strokeWidth={strokeWidth} color={alertColor} />
  </div>
);
