import React, { useContext, useEffect, useState } from 'react';
import { db, fs } from '../../Firebase/index';

import Button from '@bit/vitorbarbosa19.ziro.button';
import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown';
import maskInput from '@ziro/mask-input';
import sendToBackend from './sendToBackend';
import { userContext } from '../appContext';
import TooltipHelp from '@bit/vitorbarbosa19.ziro.tooltip-help';
import ToggleButton from '@bit/vitorbarbosa19.ziro.toggle-button';
import { container, successColor, alertColor } from '@ziro/theme';
import { tooltipSeguro, tooltipParcelamento, tituloSeguro, tituloParcelamento } from './utils/tooltipMessages';

const Preferences = () => {
  const { docId, role, maxInstallments, paymentsInsurance, fantasy } = useContext(userContext);
  const [isError, setIsError] = useState(false);
  const [unavailableAlwaysInsured, setUnavailableAlwaysInsured] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Seguro
  const [insuranceValue, setInsuranceValue] = useState(paymentsInsurance);

  // Parcela
  const [installments, setInstallments] = useState(maxInstallments);
  const allInstallments = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"];

  const state = {
    insuranceValue,
    docId,
    installments,
    isError,
    setIsError,
    setUnavailableAlwaysInsured,
    isSuccess,
    setIsSuccess,
    allInstallments
  };

  useEffect(() => {
    async function getAlwaysInsuredOption() {
      await db
        .collection('suppliers')
        .where('fantasia', '==', fantasy.toUpperCase())
        .onSnapshot(snap => {
          if (!snap.empty) {
            snap.forEach(doc => {
                setInsuranceValue(doc.data().alwaysInsured);
            });
          }
        });
    }
    getAlwaysInsuredOption();
  }, []);

  useEffect(() => {
    isSuccess && setIsSuccess(false);
  }, [installments, insuranceValue]);

  useEffect(() => {
    isError && setIsError(false)
  }, [installments, insuranceValue]);
  
  const handleToggle = () => {
    setInsuranceValue(!insuranceValue);
  };

  return (
    role === '' &&
      <div>
        <div style={{ display: 'grid', gridTemplateColumns: '75% auto', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <label style={{ fontSize: window.innerWidth < 400 ? '1.4rem' : '1.6rem' }}>Forçar vendas com seguro</label>
            <div style={{ display: 'inline-block', marginLeft: '8px' }}>
              <TooltipHelp
                body={tooltipSeguro}
                title={tituloSeguro}
                illustration='security'
              />
            </div>
          </div>
          <div>
            <ToggleButton 
              active={insuranceValue}
              onClick={handleToggle} 
              size={30}
              template="primary"
            />
          </div>
        </div>
        
        <div>
          <div style={{ marginTop: '30px' }}>
            <label style={{ fontSize: window.innerWidth < 400 ? '1.4rem' : '1.6rem' }}>Parcelamento máximo por venda</label>
            <div style={{ display: 'inline-block', marginLeft: '8px' }}>
              <TooltipHelp
                body={tooltipParcelamento}
                title={tituloParcelamento}
                illustration='creditCard'
              />
            </div>
          </div>
          <div style={{ marginTop: '15px' }}>
            <Dropdown
              readOnly={false}
              value={installments}
              onChange={({ target: { value } }) => {
                const toInteger = parseInt(value, 10);
                const checkValue = toInteger >= 1 && toInteger <= 12 && toInteger
                setInstallments(maskInput(checkValue, '##', true));
              }}
              onChangeKeyboard={element => {
                if(element === null || element.value === null){
                  return setIsError(true);
                }else{

                  if(element === '1' || element.value === '1') setInstallments('1')
                  if(element === '2' || element.value === '2') setInstallments('2')
                  if(element === '3' || element.value === '3') setInstallments('3')
                  if(element === '4' || element.value === '4') setInstallments('4')
                  if(element === '5' || element.value === '5') setInstallments('5')
                  if(element === '6' || element.value === '6') setInstallments('6')
                  if(element === '7' || element.value === '7') setInstallments('7')
                  if(element === '8' || element.value === '8') setInstallments('8')
                  if(element === '9' || element.value === '9') setInstallments('9')
                  if(element === '10' || element.value === '10') setInstallments('10')
                  if(element === '11' || element.value === '11') setInstallments('11')
                  if(element === '12' || element.value === '12') setInstallments('12')
                }
              }}
              list={allInstallments}
              placeholder='Escolha uma opção'
              inputMode='numeric'
            />
          </div>
        </div>

        <div style={{ paddingTop: '30px' }}>
          <Button
            type="button"
            cta="Salvar preferências"
            click={sendToBackend(state)}
            />
        </div>
        
        {isError ? 
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <label style={{ color: alertColor }}>Escolha entre 1 e 12 parcelas.</label>
            </div>
          : isSuccess ? 
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <label style={{ color: successColor }}>Preferências atualizadas com sucesso!</label>
            </div>
          : null
        }
        
        {unavailableAlwaysInsured && 
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <label style={{ color: alertColor }}>Erro ao atualizar seguro. Entre em contato com o suporte.</label>
          </div>
        }
      
      </div>
  )
};

export default Preferences;
