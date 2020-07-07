import React, { useState, useContext, useEffect } from 'react';
import currencyFormat from '@ziro/currency-format';
import maskInput from '@ziro/mask-input';
import sendToBackend from './sendToBackend';
import capitalize from '@ziro/capitalize';
import Form from '@bit/vitorbarbosa19.ziro.form';
import FormInput from '@bit/vitorbarbosa19.ziro.form-input';
import InputText from '@bit/vitorbarbosa19.ziro.input-text';
import { userContext } from '../appContext';

const CreatePayment = () => {
  const { fantasy, zoopId, docId, role, fname, brand } = useContext(userContext);
  const [charge, setCharge] = useState('');
  const [maxInstallments, setMaxInstallments] = useState('');
  const state = { seller: capitalize(fantasy), sellerId: zoopId, charge, maxInstallments, isCollaborator: role !== '', docId, fname, brand, setCharge, setMaxInstallments };

  const validations = [
    {
      name: 'charge',
      validation: value => value > 9 && value <= 3000000,
      value: charge,
      message: 'Deve ser entre 0,10 e 30mil',
    },
    {
      name: 'maxInstallments',
      validation: value => parseInt(value) > 0 && parseInt(value) <= 10,
      value: maxInstallments,
      message: 'Deve ser entre 1 e 10',
    },
  ];
  useEffect(() => {
    if (brand) setMaxInstallments('4');
  }, []);
  return (
    <>
      {brand ? (
        <Form
          validations={validations}
          sendToBackend={sendToBackend ? sendToBackend(state) : () => null}
          inputs={[
            <FormInput
              name="charge"
              label="Valor a cobrar"
              input={
                <InputText
                  value={currencyFormat(charge)}
                  onChange={({ target: { value } }) => {
                    const toInteger = parseInt(value.replace(/[R$\.,]/g, ''), 10);
                    return setCharge(maskInput(toInteger, '#######', true));
                  }}
                  placeholder="R$1.299,99"
                />
              }
            />,
            <FormInput name="maxInstallments" label="Parcelamento máximo" input={<InputText disabled={true} value={maxInstallments} />} />,
          ]}
        />
      ) : (
        <Form
          validations={validations}
          sendToBackend={sendToBackend ? sendToBackend(state) : () => null}
          inputs={[
            <FormInput
              name="charge"
              label="Valor a cobrar"
              input={
                <InputText
                  value={currencyFormat(charge)}
                  onChange={({ target: { value } }) => {
                    const toInteger = parseInt(value.replace(/[R$\.,]/g, ''), 10);
                    return setCharge(maskInput(toInteger, '#######', true));
                  }}
                  placeholder="R$1.299,99"
                />
              }
            />,
            <FormInput
              name="maxInstallments"
              label="Parcelamento máximo"
              input={<InputText value={maxInstallments} onChange={({ target: { value } }) => setMaxInstallments(maskInput(value, '##', true))} placeholder="10" />}
            />,
          ]}
        />
      )}
    </>
  );
};

export default CreatePayment;
