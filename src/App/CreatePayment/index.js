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
import ToggleButton from '@bit/vitorbarbosa19.ziro.toggle-button';
import { inline, center } from './styles';

const CreatePayment = () => {
  const { fantasy, zoopId, docId, role, fname, brand, maxInstallments } = useContext(userContext);
  const [charge, setCharge] = useState('');
  const [installmentsMax, setInstallmentsMax] = useState('');
  const [observations, setObservations] = useState('');
  const [checkoutWithoutRegister, setCheckoutWithoutRegister] = useState(false);
  const [insurance, setInsurance] = useState(null);
  const [insurenceDropdownValue, setInsurenceDropdownValue] = useState('');
  const [hasSellerZoopPlan, setHasSellerZoopPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const options = ['Com seguro', 'Sem seguro'];
  const state = {
    seller: capitalize(fantasy),
    sellerId: zoopId,
    charge,
    installmentsMax,
    isCollaborator: role !== '',
    docId,
    fname,
    brand,
    setCharge,
    setInstallmentsMax,
    observations,
    setObservations,
    insurance,
    setInsurance,
    setInsurenceDropdownValue,
    hasSellerZoopPlan,
    checkoutWithoutRegister,
    setCheckoutWithoutRegister,
  };
  useEffect(() => {
    async function getSellerZoopPlan() {
      await db
        .collection('suppliers')
        .where('fantasia', '==', fantasy.toUpperCase())
        .onSnapshot(snap => {
          if (!snap.empty) {
            snap.forEach(doc => {
              setHasSellerZoopPlan(doc.data().sellerZoopPlan || null);
            });
            setLoading(false);
          }
        });
    }
    getSellerZoopPlan();
  }, []);
  const validations = [
    {
      name: 'insurance',
      validation: value => (hasSellerZoopPlan && (hasSellerZoopPlan.antiFraud.amount || hasSellerZoopPlan.antiFraud.percentage) ? value !== '' : true),
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
      name: 'installmentsMax',
      validation: value => parseInt(value) > 0 && parseInt(value) <= parseInt(maxInstallments),
      value: installmentsMax,
      message: `Deve ser entre 1 e ${maxInstallments}`,
    },
  ];
  if (loading) return <Spinner size="5.5rem" />;

  return hasSellerZoopPlan && (Object.prototype.hasOwnProperty.call(hasSellerZoopPlan.antiFraud, 'amount') || Object.prototype.hasOwnProperty.call(hasSellerZoopPlan.antiFraud, 'percentage')) ? (
    insurance === null || insurance ? (
      <Form
        buttonName="Criar Link"
        validations={validations}
        sendToBackend={sendToBackend ? sendToBackend(state) : () => null}
        inputs={[
          <FormInput name="charge" label="Valor a cobrar" input={<InputMoney value={charge} setValue={setCharge} />} />,
          <FormInput
            name="installmentsMax"
            label="Parcelamento máximo"
            input={
              <InputText
                value={installmentsMax}
                onChange={({ target: { value } }) => {
                  const toInteger = parseInt(value, 10);
                  setInstallmentsMax(maskInput(toInteger, '##', true));
                }}
                placeholder={parseInt(maxInstallments)}
                inputMode="numeric"
              />
            }
          />,
          <FormInput
            name="insurance"
            label="Seguro antifraude na transação"
            input={
              <Dropdown
                disabled={!hasSellerZoopPlan || checkoutWithoutRegister}
                value={insurenceDropdownValue}
                onChange={({ target: { value } }) => {
                  if (value === 'Com seguro') {
                    setInsurance(true);
                    setInsurenceDropdownValue('Com seguro');
                  } else if (value === 'Sem seguro') {
                    setInsurance(false);
                    setInsurenceDropdownValue('Sem seguro');
                  } else if (checkoutWithoutRegister === true) {
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
        buttonName="Criar Link"
        validations={validations}
        sendToBackend={sendToBackend ? sendToBackend(state) : () => null}
        inputs={[
          <FormInput name="charge" label="Valor a cobrar" input={<InputMoney value={charge} setValue={setCharge} />} />,
          <FormInput
            name="installmentsMax"
            label="Parcelamento máximo"
            input={
              <InputText
                value={installmentsMax}
                onChange={({ target: { value } }) => {
                  const toInteger = parseInt(value, 10);
                  setInstallmentsMax(maskInput(toInteger, '##', true));
                }}
                placeholder={parseInt(maxInstallments)}
                inputMode="numeric"
              />
            }
          />,
          <FormInput
            name="insurance"
            label="Seguro antifraude na transação"
            input={
              <Dropdown
                disabled={!hasSellerZoopPlan || checkoutWithoutRegister}
                value={insurenceDropdownValue}
                onChange={({ target: { value } }) => {
                  if (value === 'Com seguro') {
                    setInsurance(true);
                    setInsurenceDropdownValue('Com seguro');
                  } else if (value === 'Sem seguro') {
                    setInsurance(false);
                    setInsurenceDropdownValue('Sem seguro');
                  } else if (checkoutWithoutRegister === true) {
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
          <FormInput
            name="checkoutWithoutRegister"
            label="Deseja pagamento sem cadastro?"
            input={
              <div style={center}>
                <div style={inline}>Não</div>
                <ToggleButton
                  size={30}
                  template="primary"
                  active={checkoutWithoutRegister}
                  onClick={() => {
                    setCheckoutWithoutRegister(!checkoutWithoutRegister);
                    if (!checkoutWithoutRegister) {
                      setInsurance(false);
                      setInsurenceDropdownValue('Sem seguro');
                    }
                  }}
                />
                <div style={inline}>Sim</div>
              </div>
            }
          />,
        ]}
      />
    )
  ) : (
    <Form
      buttonName="Criar Link"
      validations={validations}
      sendToBackend={sendToBackend ? sendToBackend(state) : () => null}
      inputs={[
        <FormInput name="charge" label="Valor a cobrar" input={<InputMoney value={charge} setValue={setCharge} />} />,
        <FormInput
          name="installmentsMax"
          label="Parcelamento máximo"
          input={
            <InputText
              value={installmentsMax}
              onChange={({ target: { value } }) => {
                const toInteger = parseInt(value, 10);
                setInstallmentsMax(maskInput(toInteger, '##', true));
              }}
              placeholder={parseInt(maxInstallments)}
              inputMode="numeric"
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
  );
};

export default CreatePayment;
