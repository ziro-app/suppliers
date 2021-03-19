/* eslint-disable no-useless-escape */
/* eslint-disable react/self-closing-comp */
/* eslint-disable no-nested-ternary */
import React from 'react';
import { useForm } from 'react-hook-form';
import FormInput from '@bit/vitorbarbosa19.ziro.form-input';
import currencyFormat from '@ziro/currency-format';
import maskInput from '@ziro/mask-input';
import Icon from '@bit/vitorbarbosa19.ziro.icon';
import InputText from '@bit/vitorbarbosa19.ziro.input-text';// './InputText';
import { centerInline, checkbox, gapBetweenFlexItems, quantitiesStyle, radioButtonContainer } from './styles';

export default (states, identifierOfPicture, dispatch, defaultQuantityValue, device, isSubmitting) => {
  const descriptionInput = (
    <FormInput
      name="description"
      label="Descrição"
      input={
        <InputText
        name="description"
        // register={register}
        identifier={identifierOfPicture}
          disabled={isSubmitting}
          value={'' || states[`description${identifierOfPicture}`]}
          onChange={({ target: { value } }) => {
            const payload = { userValue: value, identifierOfPicture, inputType: 'description' };
            dispatch(payload);
          }}
          placeholder="Descrição"
        />
      }
    />
  );
  const priceInput = (
    <FormInput
      name="price"
      label="Preço"
      input={
        <InputText
          disabled={isSubmitting}
          value={'' || currencyFormat(states[`price${identifierOfPicture}`])}
          onChange={({ target: { value } }) => {
            const toInteger = parseInt(value.replace(/[R$\.,]/g, ''), 10);
            const payload = {
              userValue: maskInput(toInteger, '#######', true),
              identifierOfPicture,
              inputType: 'price',
            };
            dispatch(payload);
          }}
          placeholder="R$ 100,00"
          inputMode="numeric"
        />
      }
    />
  );

  const discountPercentage = (
    <FormInput
      name="discount"
      label="Desconto"
      input={
        <InputText
          disabled={isSubmitting}
          value={!states[`discount${identifierOfPicture}`] ? '' : `% ${currencyFormat(states[`discount${identifierOfPicture}`]).replace(/[R$]/g, '')}`}
          onChange={({ target: { value } }) => {
            const toInteger = parseInt(value.replace(/[\.,\s%]/g, ''), 10);

            const payload = {
              userValue: toInteger <= 10000 ? maskInput(toInteger, '#######', true) : maskInput(10000, '#######', true),
              identifierOfPicture,
              inputType: 'discount',
            };
            dispatch(payload);
          }}
          placeholder="% 20"
          inputMode="numeric"
        />
      }
    />
  );
  const typeSizeRadio = (
    <FormInput
      name="typeSize"
      label=""
      input={
        <div style={radioButtonContainer}>
          <div style={centerInline}>
            {states[`typeSize${identifierOfPicture}`] === 'number' ? (
              <Icon
                style={checkbox}
                type="check"
                size={15}
                strokeWidth={3}
                onClick={() => {
                  let payload = {
                    userValue: 'number',
                    identifierOfPicture,
                    inputType: 'typeSize',
                  };
                  dispatch(payload);
                  payload = {
                    userValue: states[`colors${identifierOfPicture}`],
                    identifierOfPicture,
                    inputType: 'colors',
                  };
                  dispatch(payload);
                  payload = {
                    userValue: '36,38,40,42,44'.split(','),
                    identifierOfPicture,
                    inputType: 'sizes',
                  };
                  dispatch(payload);
                }}
              />
            ) : (
              <div
                style={checkbox}
                onClick={() => {
                  let payload = {
                    userValue: 'number',
                    identifierOfPicture,
                    inputType: 'typeSize',
                  };
                  dispatch(payload);
                  payload = {
                    userValue: states[`colors${identifierOfPicture}`],
                    identifierOfPicture,
                    inputType: 'colors',
                  };
                  dispatch(payload);
                  payload = {
                    userValue: '36,38,40,42,44'.split(','),
                    identifierOfPicture,
                    inputType: 'sizes',
                  };
                  dispatch(payload);
                }}
              ></div>
            )}
            <label style={gapBetweenFlexItems}>Numero</label>
          </div>
          <div style={centerInline}>
            {states[`typeSize${identifierOfPicture}`] === 'letter' ? (
              <Icon
                style={checkbox}
                type="check"
                size={15}
                strokeWidth={3}
                onClick={() => {
                  let payload = {
                    userValue: 'letter',
                    identifierOfPicture,
                    inputType: 'typeSize',
                  };
                  dispatch(payload);
                  payload = {
                    userValue: states[`colors${identifierOfPicture}`],
                    identifierOfPicture,
                    inputType: 'colors',
                  };
                  dispatch(payload);
                  payload = {
                    userValue: 'P,M,G'.split(','),
                    identifierOfPicture,
                    inputType: 'sizes',
                  };
                  dispatch(payload);
                }}
              />
            ) : (
              <div
                style={checkbox}
                onClick={() => {
                  let payload = {
                    userValue: 'letter',
                    identifierOfPicture,
                    inputType: 'typeSize',
                  };
                  dispatch(payload);
                  payload = {
                    userValue: states[`colors${identifierOfPicture}`],
                    identifierOfPicture,
                    inputType: 'colors',
                  };
                  dispatch(payload);
                  payload = {
                    userValue: 'P,M,G'.split(','),
                    identifierOfPicture,
                    inputType: 'sizes',
                  };
                  dispatch(payload);
                }}
              ></div>
            )}
            <label style={gapBetweenFlexItems}>Letra</label>
          </div>
        </div>
      }
    />
  );

  const sizesInput = (
    <FormInput
      name="sizes"
      label="Tamanhos"
      input={
        <InputText
          disabled={isSubmitting}
          placeholder="P,M,G"
          value={'' || (states[`sizes${identifierOfPicture}`] && states[`sizes${identifierOfPicture}`].join(','))}
          onChange={({ target: { value } }) => {
            const payload = {
              userValue: value ? value.split(',') : '',
              identifierOfPicture,
              inputType: 'sizes',
            };
            dispatch(payload);
          }}
        />
      }
    />
  );

  const colorsInput = (
    <FormInput
      name="colors"
      label="Cores"
      input={
        <InputText
          disabled={isSubmitting}
          placeholder="Azul,Amarelo"
          value={'' || (states[`colors${identifierOfPicture}`].join(',') || (states[`colors${identifierOfPicture}`] && states[`colors${identifierOfPicture}`].join('')))}
          onChange={({ target: { value } }) => {
            const newColors = value ? value.split(',') : [''];
            const payload = {
              userValue: newColors,
              identifierOfPicture,
              inputType: 'colors',
            };
            dispatch(payload);
          }}
        />
      }
    />
  );

  const referenceIdInput = (
    <FormInput
      name="referenceId"
      label="Referência"
      input={
        <InputText
          value={'' || states[`referenceId${identifierOfPicture}`]}
          onChange={({ target: { value } }) => {
            const payload = {
              userValue: value.toUpperCase(),
              identifierOfPicture,
              inputType: 'referenceId',
            };
            dispatch(payload);
          }}
          placeholder="Referência da loja"
        />
      }
    />
  );

  const quantitiesInput = (states[`sizes${identifierOfPicture}`] !== '' || states[`colors${identifierOfPicture}`][0] !== '') && (
    <FormInput
      name="quantities"
      label="Quantidades"
      input={
        <div style={quantitiesStyle}>
          {states[`colors${identifierOfPicture}`].map(color =>
            (states[`sizes${identifierOfPicture}`] ? (states[`sizes${identifierOfPicture}`].length ? states[`sizes${identifierOfPicture}`] : ['']) : ['']).map(size => (
              <div
                key={`${color}-${size}`}
                style={{
                  display: 'grid',
                  gridTemplateColumns: device === 'smallMobile' ? '2fr 1fr 2fr' : '3fr 1fr 2fr',
                  alignItems: 'center',
                }}
              >
                <label>{color}</label>
                <label>{size}</label>
                <InputText
                  disabled={isSubmitting||!color}
                  placeholder= {color ? "1": "Sem cor!"}
                  // defaultValue={defaultQuantityValue}
                  value={'' || (states[`availableQuantities${identifierOfPicture}`] && states[`availableQuantities${identifierOfPicture}`][`${color}-${size}`])}
                  onChange={({ target: { value } }) => {
                    if (/^[0-9]*$/gm.test(value)) {
                      const result = old => {
                        const newQuantities = { ...(states[`availableQuantities${identifierOfPicture}`] || {}) };
                        newQuantities[`${color}-${size}`] = maskInput(value, '##', true);
                        return { ...old, availableQuantities: newQuantities };
                      };
                      const payload = {
                        userValue: result().availableQuantities,
                        identifierOfPicture,
                        inputType: 'availableQuantities',
                      };
                      dispatch(payload);
                    }
                  }}
                  inputMode="numeric"
                />
              </div>
            )),
          )}
        </div>
      }
    />
  );
  const arrayInputs = [descriptionInput, referenceIdInput, priceInput, discountPercentage, colorsInput, sizesInput, typeSizeRadio, quantitiesInput];
  return arrayInputs;
};
