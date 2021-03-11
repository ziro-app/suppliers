/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable no-nested-ternary */
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useRoute } from 'wouter';
import { motion } from 'framer-motion';
import Form from '@bit/vitorbarbosa19.ziro.form';
import FormInput from '@bit/vitorbarbosa19.ziro.form-input';
import InputText from '@bit/vitorbarbosa19.ziro.input-text';
import Spinner from '@bit/vitorbarbosa19.ziro.spinner';
import Error from '@bit/vitorbarbosa19.ziro.error';
import Button from '@bit/vitorbarbosa19.ziro.button';
import Illustration from '@bit/vitorbarbosa19.ziro.illustration';
import { alertColor } from '@ziro/theme';
//import { Menu } from '../Menu';
import { userContext } from '../appContext';
import fetch from './fetch';
import { apiErrorContainer, box1, box2, header, wrapper } from './styles';
import BuyCreditBackgroundCheck from './BuyCreditBackgroundCheck';

const CheckoutBackgroundCheck = () => {
  const { docId, role, ownerId } = useContext(userContext);
  const [isLoading, setIsLoading] = useState(true);
  const [customError, setCustomError] = useState(false);
  const [errorLoading, setErrorLoading] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [freeRequests, setFreeRequests] = useState(0);
  const [paidRequests, setPaidRequests] = useState(0);
  const [quantity, setQuantity] = useState('');
  const isCollaborator = role !== '';

  const [_, setLocation] = useLocation();
  const [match, params] = useRoute('/comprar-consulta/cartao/:quantity');
  console.log(params);
  const setState = { setFreeRequests, setApiError, setPaidRequests };
  const state = { docId, isCollaborator, ownerId, document, freeRequests, ...setState };
  const validations = [
    {
      name: 'quantity',
      validation: value => (value ? Number(value) > 0 : false),
      value: quantity,
      message: quantity === '' ? 'Quantidade inválida' : Number(quantity) === 0 ? 'Não pode ser zero' : true,
    },
  ];

  useEffect(() => fetch(setIsLoading, setErrorLoading, docId, isCollaborator, ownerId, setCustomError, setState), []);
  if (isLoading)
    return (
      <div style={{ display: 'grid', justifyItems: 'center' }}>
        <Spinner size="5.5rem" />
      </div>
    );
  if (errorLoading) return <Error />;
  if (apiError)
    return (
      <div style={apiErrorContainer}>
        <div style={{ justifySelf: 'center' }}>
          <Illustration type="paymentError" />
        </div>
        <label style={header}>Erro na API</label>
        <label>Ocorreu um erro ao consultar o documento. Tente novamente ou contate suporte</label>
        <Button type="button" cta="Voltar" click={() => setApiError(false)} />
      </div>
    );
  return (
    <>
      {match ? (
        <BuyCreditBackgroundCheck setPaidRequests={setPaidRequests} {...params} />
      ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div style={{ display: 'grid', textAlign: 'center', justifyContent: 'center', paddingBottom: '20px' }}>
              <strong style={{ fontSize: '1.5rem', fontFamily: 'Rubik', color: freeRequests || paidRequests > 0 ? '#000' : alertColor }}>
                {freeRequests || paidRequests ? `${freeRequests+paidRequests} crédito(s) em conta` : 'Créditos esgotados'}
              </strong>
            </div>

            <Form
              buttonOnTop
              buttonName="Pagar"
              validations={validations}
              sendToBackend={() => setLocation(`/comprar-consulta/cartao/${quantity}`) /* sendToBackend ? sendToBackend({ ...state }) : () => null */}
              inputs={[
                <FormInput
                  name="quantity"
                  label="Quantidade desejada"
                  input={
                    <InputText
                      value={quantity}
                      onChange={({ target: { value } }) => {
                        const re = /^[0-9\b]+$/;
                        if (value === '' || re.test(value)) {
                            setQuantity(value);
                         }
                      }}
                      placeholder="5"
                      inputMode="numeric"
                      maxLength="3"
                    />
                  }
                />,
              ]}
            />
          </motion.div>
      )}
    </>
  );
};

export default CheckoutBackgroundCheck;
