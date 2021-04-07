import React, { useState, useMemo, useCallback } from 'react';
import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown';
import Button from '@bit/vitorbarbosa19.ziro.button';
import currencyFormat from '@ziro/currency-format';
import {
  editCardContainer,
  editCardInfo,
  priceBlock,
  priceLabel,
  description,
  stock,
  stockGrid,
  stockLabel,
  stockQty,
  editCardInputs,
  button,
} from './styles';

export default ({ product, update, setEditing }) => {
    //console.log('product, update, setEditing',product, update, setEditing)
  const [requestedQuantities, setRequestedQuantities] = useState(
    Object.entries(product.requestedQuantities || {}).filter(([, value]) => parseInt(value) > 0),
  );

  const [reallyAvailableQuantities, arrays] = useMemo(
    () =>
      Object.keys(product.availableQuantities).reduce(
        (prev, cur) => {
          const r = (product.requestedQuantities || {})[cur];
          const a = product.availableQuantities[cur];
          const ia = parseInt(a);
          const ra = r ? parseInt(r) + ia : ia;
          if (ra > 0) {
            const _array = Array.from(Array(ra).keys()).map(v => (v + 1).toString());
            return [
              { ...prev[0], [cur]: `${ra}` },
              { ...prev[1], [cur]: _array },
            ];
          }
          return prev;
        },
        [{}, {}],
      ),
    [product.availableQuantities],
  );

  const setKeyQuantity = useCallback(
    (value, index) => {
      setRequestedQuantities(old => {
        let newQtys = Array.from(old);
        newQtys[index] = [value, ''];
        newQtys = newQtys.filter(([s]) => s !== '');
        return newQtys;
      });
    },
    [setRequestedQuantities],
  );

  const setValueQuantity = useCallback(
    (value, index) => {
      setRequestedQuantities(old => {
        const newQtys = Array.from(old);
        newQtys[index][1] = value;
        return newQtys;
      });
    },
    [setRequestedQuantities],
  );

  return (
    <div style={{...editCardContainer, marginTop:'20px'}}>
        <div style={{textAlign:'center'}}>
<label style={priceLabel}>Editar Produto no Pedido</label>
</div>
      <div style={editCardInfo}>
        <div style={priceBlock}>
          <label style={priceLabel}>Descrição</label>
          <label style={description}>{product.description}</label>
        </div>
        <div style={priceBlock}>
          <label style={priceLabel}>Preço</label>
          <label>{currencyFormat(product.price)}</label>
        </div>
        <div>
          <label style={priceLabel}>Variações disponíveis</label>
          <div style={stock}>
            {Object.entries(reallyAvailableQuantities)
              .sort()
              .map(
                ([key, value]) =>
                  parseInt(value) > 0 && (
                    <div key={key} style={stockGrid}>
                      <label style={stockLabel}>{`${key}`}</label>
                      <label style={stockQty}>{value}</label>
                    </div>
                  ),
              )}
          </div>
        </div>
        <div>
          <label style={priceLabel}>Escolher variações</label>
          <div style={editCardInputs}>
            {[...requestedQuantities, ['', '']].map(([key, qty], index) => {
              const keys = Object.keys(reallyAvailableQuantities).sort();
              if (index >= keys.length) return null;
              return (
                <div key={key === '' ? 'empty' : key} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gridGap: '10px' }}>
                  <Dropdown
                    readOnly
                    list={keys.filter(_key => !requestedQuantities.map(([s]) => s).includes(_key))}
                    value={key}
                    onChange={({ target: { value } }) => setKeyQuantity(value, index)}
                    onChangeKeyboard={element => (element ? setKeyQuantity(element.value, index) : null)}
                    placeholder="Variações"
                  />
                  <Dropdown
                    readOnly
                    list={key !== '' ? arrays[key] : []}
                    value={qty}
                    onChange={({ target: { value } }) => setValueQuantity(value, index)}
                    onChangeKeyboard={element => (element ? setValueQuantity(element.value, index) : null)}
                    submitting={key === ''}
                    placeholder="Qtde"
                  />
                </div>
              );
            })}
          </div>
        </div>
        <Button
          style={button}
          type="button"
          cta="Atualizar Pedido"
          click={async () => {
            await update(requestedQuantities);
            setEditing(false);
          }}
        />
      </div>
    </div>
  );
};
