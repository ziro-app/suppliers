import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { db, fs } from '../../Firebase/index';

import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown';
import Form from '@bit/vitorbarbosa19.ziro.form';
import FormInput from '@bit/vitorbarbosa19.ziro.form-input';
import Icon from '@bit/vitorbarbosa19.ziro.icon';
import InputMoney from '@bit/vitorbarbosa19.ziro.input-money';
import InputText from '@bit/vitorbarbosa19.ziro.input-text';
import Spinner from '@bit/vitorbarbosa19.ziro.spinner-with-div';
import capitalize from '@ziro/capitalize';
import maskInput from '@ziro/mask-input';
import sendToBackend from './sendToBackend';
import { userContext } from '../appContext';
import ToggleButton from '@bit/vitorbarbosa19.ziro.toggle-button';
import { inline, center } from './styles';
import { primaryColor, shadow, fontTitle, fontSizeNormal } from '@ziro/theme';

const CreatePayment = () => {
  const { fantasy, zoopId, docId, role, fname, brand, maxInstallments } = useContext(userContext);
  const [afterBackend, setAfterBackend] = useState(false);
  const [, setLocation] = useLocation();
  const [charge, setCharge] = useState('');
  const [installmentsMax, setInstallmentsMax] = useState('');
  const [observations, setObservations] = useState('');
  const [checkoutWithoutRegister, setCheckoutWithoutRegister] = useState(false);
  const [insurance, setInsurance] = useState(null);
  const [insurenceDropdownValue, setInsurenceDropdownValue] = useState('');
  const [hasSellerZoopPlan, setHasSellerZoopPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [alwaysInsuredToggle, setAlwaysInsuredToggle] = useState();
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
    setAfterBackend,
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
    async function getPaymentsInsuranceOption() {
      await db
        .collection('suppliers')
        .where('fantasia', '==', fantasy.toUpperCase())
        .onSnapshot(snap => {
          if (!snap.empty) {
            snap.forEach(doc => {
                setAlwaysInsuredToggle(doc.data().alwaysInsured || null);
            });
            setLoading(false);
          }
        });
    }
    getSellerZoopPlan();
    getPaymentsInsuranceOption();
  }, []);

  useEffect(() => {
    if(alwaysInsuredToggle === true && afterBackend === true){
      setInsurance(true),
      setInsurenceDropdownValue('Com seguro')
      setAfterBackend(false);
    }else{

    }
  }, [afterBackend]);

  const validations = [
    {
      name: 'insurance',
      validation: value => (hasSellerZoopPlan ? value !== '' : true) || alwaysInsuredToggle === true,
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

  return hasSellerZoopPlan &&
    (Object.prototype.hasOwnProperty.call(hasSellerZoopPlan, 'activePlan') ? true : Object.prototype.hasOwnProperty.call(hasSellerZoopPlan.antiFraud, 'amount') || Object.prototype.hasOwnProperty.call(hasSellerZoopPlan.antiFraud, 'percentage')) ? (
    insurance === null || insurance ? (
      <div>  
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
                    const checkValue = toInteger >= 1 && toInteger <= 12 && toInteger
                    setInstallmentsMax(maskInput(checkValue, '##', true));
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
                  disabled={!hasSellerZoopPlan || checkoutWithoutRegister || alwaysInsuredToggle === true}
                  value={insurenceDropdownValue || (alwaysInsuredToggle === true && afterBackend === false ? 'Com seguro' : '')}
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
                    } else if (alwaysInsuredToggle === true) {
                      setInsurance(true);
                      setInsurenceDropdownValue('Com seguro');
                    } else {
                      setInsurance(null);
                      setInsurenceDropdownValue('');
                    }
                  }}
                  onChangeKeyboard={element => {
                    if(element === null){
                      return
                    }else{
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
                    }
                  }}
                  list={options}
                  placeholder={alwaysInsuredToggle === true ? "Com seguro" : "Escolha com ou sem seguro"}
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
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'auto 1fr',
          gridColumnGap: '5px',
          // alignItems: 'center', 
          padding: window.innerWidth < 400 ? '15px 10px' : '20px 15px', 
          borderRadius: '8px', 
          marginTop: '20px', 
          boxShadow: 'rgba(34, 34, 34, 0.4) 0px 2px 12px -4px',
          placeItems: 'center'
        }}>
          <div style={{ 
            display: 'grid', 
            backgroundColor: 'rgba(0,0,0,0.05)', 
            padding: window.innerWidth < 400 ? '10px' : '12px', 
            borderRadius: '50%', 
          }}>
            <Icon type="search" size={window.innerWidth < 400 ? 15 : 17} />
          </div>
          <div style={{ display: 'grid', gridRowGap: '2px' }}>
            <label style={{ fontSize: window.innerWidth < 400 ? '1.3rem' : '1.4rem', opacity: '0.85' }}>
              {window.innerWidth < 400 ? 'Deseja mais confiança nas vendas?' : 'Deseja mais confiabilidade em suas vendas?'}
            </label>
            <label style={{ fontSize: window.innerWidth < 400 ? '1.3rem' : '1.4rem', opacity: '0.85' }}>
              {window.innerWidth < 400 ? 'Consulte CPF/CNPJ do cliente ' : 'Consulte agora o CPF/CNPJ do seu cliente '} 
              <label onClick={() => setLocation('/consulta')} style={{ cursor: 'pointer', color: primaryColor, fontSize: window.innerWidth < 400 ? '1.3rem' : '1.4rem', fontFamily: fontTitle, textDecoration: 'underline', marginTop: '2px' }}>
                {window.innerWidth < 400 ? 'aqui' : 'clicando aqui'}
              </label>.
            </label>
          </div>
        </div>
      </div>
    ) : (
      <div>
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
                    const checkValue = toInteger >= 1 && toInteger <= 12 && toInteger
                    setInstallmentsMax(maskInput(checkValue, '##', true));
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
                  disabled={!hasSellerZoopPlan || checkoutWithoutRegister || alwaysInsuredToggle === true}
                  value={insurenceDropdownValue || (alwaysInsuredToggle === true && afterBackend === false ? 'Com seguro' : '')}
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
                    } else if (alwaysInsuredToggle === true) {
                      setInsurance(true);
                      setInsurenceDropdownValue('Com seguro');
                    } else {
                      setInsurance(null);
                      setInsurenceDropdownValue('');
                    }
                  }}
                  onChangeKeyboard={element => {
                    if(element === null){
                      return
                    }else{
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
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          padding: window.innerWidth < 400 ? '2rem' : '3rem', 
          borderRadius: '10px', 
          marginTop: '2rem', 
          boxShadow: 'rgba(34, 34, 34, 0.4) 0px 3px 11px -4px' 
        }}>
          <div style={{ 
            display: 'flex', 
            backgroundColor: 'rgba(0,0,0,0.05)', 
            padding: window.innerWidth < 400 ? '6px' : '20px', 
            borderRadius: '50%', 
            marginRight: window.innerWidth < 400 ? '10px' : '23px'
          }}>
            <Icon type="search" size={window.innerWidth < 400 ? 15 : 17} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{ fontSize: window.innerWidth < 400 ? '1.3rem' : '1.4rem' }}>Deseja mais confiabilidade em suas vendas?</label>
            <label style={{ fontSize: window.innerWidth < 400 ? '1.3rem' : '1.4rem' }}>Consulte CPF/CNPJ do seu cliente <label onClick={() => setLocation('/consulta')} style={{ cursor: 'pointer', color: primaryColor, fontSize: window.innerWidth < 400 ? '1.3rem' : '1.4rem', fontFamily: fontTitle, textDecoration: 'underline', marginTop: '2px' }}>aqui</label>.</label>
          </div>
        </div>
      </div>
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
