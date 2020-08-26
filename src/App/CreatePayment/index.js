import React, { useContext, useEffect, useState } from 'react';
import { db, fs } from '../../Firebase/index';

import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown';
import Form from '@bit/vitorbarbosa19.ziro.form';
import FormInput from '@bit/vitorbarbosa19.ziro.form-input';
import InputMoney from '@bit/vitorbarbosa19.ziro.input-money';
import InputText from '@bit/vitorbarbosa19.ziro.input-text';
import Spinner from '@bit/vitorbarbosa19.ziro.spinner-with-div';
import capitalize from '@ziro/capitalize';
import maskInput from '@ziro/mask-input';
import sendToBackend from './sendToBackend';
import { userContext } from '../appContext';

const CreatePayment = () => {
  const { fantasy, zoopId, docId, role, fname, brand } = useContext(userContext);
  const [charge, setCharge] = useState('');
  const [maxInstallments, setMaxInstallments] = useState('');
  const [observations, setObservations] = useState('');
  const [insurance, setInsurance] = useState(null);
  const [insurenceDropdownValue, setInsurenceDropdownValue] = useState('');
  const [hasZoopPlan, setHasZoopPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const options = ['Com seguro', 'Sem seguro'];
  const state = {
    seller: capitalize(fantasy),
    sellerId: zoopId,
    charge,
    maxInstallments,
    isCollaborator: role !== '',
    docId,
    fname,
    brand,
    setCharge,
    setMaxInstallments,
    observations,
    setObservations,
    insurance,
    setInsurance,
    setInsurenceDropdownValue,
    hasZoopPlan,
  };
  useEffect(() => {
    async function getZoopPlan() {
      const getSupplierData = await db.collection('suppliers').where('fantasia', '==', fantasy.toUpperCase()).get();
      getSupplierData.forEach(doc => {
        setHasZoopPlan(doc.data().zoopPlan || null);
      });
      setLoading(false);
    }
    getZoopPlan();
  }, []);
  const validations = [
    {
      name: 'insurance',
      validation: value => (hasZoopPlan ? value !== '' : true),
      value: insurenceDropdownValue,
      message: 'Opção inválida',
    },
    {
      name: 'charge',
      validation: value => value > 9 && value <= 3000000,
      value: charge,
      message: 'Deve ser entre 0,10 e 30mil',
    },
    {
      name: 'maxInstallments',
      validation: value => (fantasy === 'ZIRO' ? parseInt(value) > 0 && parseInt(value) < 5 : parseInt(value) > 0 && parseInt(value) <= 10),
      value: maxInstallments,
      message: fantasy === 'ZIRO' ? 'Deve ser entre 1 e 4' : 'Deve ser entre 1 e 10',
    },
  ];
  if (loading) return <Spinner size="5.5rem" />;

  return hasZoopPlan ? (
    <Form
      validations={validations}
      sendToBackend={sendToBackend ? sendToBackend(state) : () => null}
      inputs={[
        <FormInput name="charge" label="Valor a cobrar" input={<InputMoney value={charge} setValue={setCharge} />} />,
        <FormInput
          name="maxInstallments"
          label="Parcelamento máximo"
          input={<InputText value={maxInstallments} onChange={({ target: { value } }) => setMaxInstallments(maskInput(value, '##', true))} placeholder="10" />}
        />,
        <FormInput
          name="insurance"
          label="Seguro antifraude na transação"
          input={
            <Dropdown
              disabled={!hasZoopPlan}
              value={insurenceDropdownValue}
              onChange={({ target: { value } }) => {
                if (value === 'Com seguro') {
                  setInsurance(true);
                  setInsurenceDropdownValue('Com seguro');
                } else if (value === 'Sem seguro') {
                  setInsurance(false);
                  setInsurenceDropdownValue('Sem seguro');
                } else {
                  setInsurance(null);
                  setInsurenceDropdownValue('');
                }
              }}
              onChangeKeyboard={element => {
                if (element.value === 'Com seguro') {
                  setInsurance(true);
                  setInsurenceDropdownValue('Com seguro');
                } else if (element.value === 'Sem seguro') {
                  setInsurance(false);
                  setInsurenceDropdownValue('Sem seguro');
                } else {
                  setInsurance(false);
                  setInsurenceDropdownValue('');
                }
              }}
              list={options}
              placeholder="Escolha com ou sem seguro"
              readOnly
            />
          }
        />,
        <FormInput
          name="observation"
          label="Observações (opcional)"
          input={<InputText value={observations} onChange={({ target: { value } }) => setObservations(value)} placeholder="Romaneio, nome do cliente, etc" />}
        />,
      ]}
    />
  ) : (
    <Form
      validations={validations}
      sendToBackend={sendToBackend ? sendToBackend(state) : () => null}
      inputs={[
        <FormInput name="charge" label="Valor a cobrar" input={<InputMoney value={charge} setValue={setCharge} />} />,
        <FormInput
          name="maxInstallments"
          label="Parcelamento máximo"
          input={<InputText value={maxInstallments} onChange={({ target: { value } }) => setMaxInstallments(maskInput(value, '##', true))} placeholder="10" />}
        />,
        <FormInput
          name="observation"
          label="Observações (opcional)"
          input={<InputText value={observations} onChange={({ target: { value } }) => setObservations(value)} placeholder="Romaneio, nome do cliente, etc" />}
        />,
      ]}
    />
  );
};

export default CreatePayment;
