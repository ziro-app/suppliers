import React, { useContext, useEffect, useState } from 'react';
import { db, fs } from '../../Firebase/index';

import { motion } from 'framer-motion';
import Button from '@bit/vitorbarbosa19.ziro.button';
import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown';
import Form from '@bit/vitorbarbosa19.ziro.form';
import FormInput from '@bit/vitorbarbosa19.ziro.form-input';
import sendToBackend from './sendToBackend';
import { userContext } from '../appContext';
import TooltipHelp from '@bit/vitorbarbosa19.ziro.tooltip-help';
import ToggleButton from '@bit/vitorbarbosa19.ziro.toggle-button';
import { container } from '@ziro/theme';
import { tooltipSeguro, tooltipParcelamento } from './utils/tooltipMessages';

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
    setIsSuccess
  };

  useEffect(() => {
    async function getAlwaysInsuredOption() {
      await db
        .collection('suppliers')
        .where('fantasia', '==', fantasy.toUpperCase())
        .onSnapshot(snap => {
          if (!snap.empty) {
            snap.forEach(doc => {
                setInsuranceValue(doc.data().alwaysInsured || null);
            });
          }
        });
    }
    getAlwaysInsuredOption();
  }, []);
  
  const handleToggle = () => {
    setInsuranceValue(!insuranceValue);
  };

  return (
    role === '' &&
      <div style={container}>
        <div style={{ display: 'grid', gridTemplateColumns: '75% auto', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <label>Forçar seguro em todas as transações</label>
            <div style={{ display: 'inline-block', marginLeft: '8px' }}>
              <TooltipHelp
                body={tooltipSeguro}
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
            <label>Parcelamento máximo para o cliente</label>
            <div style={{ display: 'inline-block', marginLeft: '8px' }}>
              <TooltipHelp
                body={tooltipParcelamento}
              />
            </div>
          </div>
          <div style={{ marginTop: '15px' }}>
            <Dropdown
              readOnly={false}
              value={installments}
              onChange={({ target: { value } }) => setInstallments(value)}
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
              <label style={{ color: 'red' }}>Escolha entre 1 e 12 parcelas.</label>
            </div>
          : isSuccess ? 
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <label style={{ color: 'green' }}>Preferências atualizadas com sucesso!</label>
            </div>
          : null
        }
        
        {unavailableAlwaysInsured && 
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <label style={{ color: 'red' }}>Erro ao atualizar seguro. Entre em contato com o suporte.</label>
          </div>
        }
      
      </div>
  )
};

export default Preferences;
