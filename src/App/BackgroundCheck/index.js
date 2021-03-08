import React, { useContext, useEffect, useState } from 'react';
import { alertColor, fontTitle, primaryColor, shadow } from '@ziro/theme';

import Button from '@bit/vitorbarbosa19.ziro.button';
import Details from '@bit/vitorbarbosa19.ziro.details';
import Error from '@bit/vitorbarbosa19.ziro.error';
import Form from '@bit/vitorbarbosa19.ziro.form';
import FormInput from '@bit/vitorbarbosa19.ziro.form-input';
import Icon from '@bit/vitorbarbosa19.ziro.icon';
import Illustration from '@bit/vitorbarbosa19.ziro.illustration';
import InputText from '@bit/vitorbarbosa19.ziro.input-text';
import ScoreCircle from '@bit/vitorbarbosa19.ziro.score-circle';
import Spinner from '@bit/vitorbarbosa19.ziro.spinner';
import maskInput from '@ziro/mask-input';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import { Menu } from '../Menu';
import PartnersDetails from './PartnersDetails';
import PendencyDetails from './PendencyDetails';
import { db } from '../../Firebase/index';
import fetch from './fetch';
import sendToBackend from './sendToBackend';
import { apiErrorContainer, box1, box2, consultasContainer, header, saldosLabel, valorH1, wrapper } from './styles';
import { userContext } from '../appContext';
import validateDocuments from '../utils/validateDocuments';

const BackgroundCheck = () => {
  const supportNumber = require('./supportNumber');
  const [, setLocation] = useLocation();

  const { docId, role, ownerId, backgroundCheckRequests, backgroundCheckRequestsPaid, fantasy } = useContext(userContext);
  const [isLoading, setIsLoading] = useState(true);
  const [errorLoading, setErrorLoading] = useState(false);
  const [apiError, setApiError] = useState(false);
  const [document, setDocument] = useState('');
  const [freeRequests, setFreeRequests] = useState(0);
  const [paidRequests, setPaidRequests] = useState(0);
  const [pendency, setPendency] = useState(null);
  const [partner, setPartner] = useState(null);
  const [scoreValue, setScoreValue] = useState(0);
  const [blockPF, setBlockPF] = useState([]);
  const [blockPJ, setBlockPJ] = useState([]);

  const [isErrorBgCheck, setIsErrorBgCheck] = useState(false);

  const [freeBgCheck, setFreeBgCheck] = useState(backgroundCheckRequests);
  const [paidBgCheck, setPaidBgCheck] = useState(backgroundCheckRequestsPaid);
  const [backgroundPaidCollaborator, setBackgroundPaidCollaborator] = useState();
  const [backgroundFreeCollaborator, setBackgroundFreeCollaborator] = useState();

  const isCollaborator = role !== '';
  const DEFAULT_STEP_COLORS = ['#a50a0a', '#bc0b0b', '#eb0e0e', '#e68c06', '#ff9b07', '#f8d823', '#ebeb09', '#5deb3e', '#35e60e', '#2fcc0c'];
  const setState = { setPaidRequests, setDocument, setFreeRequests, setScoreValue, setBlockPF, setBlockPJ, setPendency, setPartner, setApiError };
  const state = { docId, isCollaborator, ownerId, document, freeRequests, ...setState };
  const validations = [
    {
      name: 'document',
      validation: value => (process.env.HOMOLOG ? true : validateDocuments(value)),
      value: document,
      message: document === '' ? 'Documento inválido' : document.length === 14 ? 'CPF inválido' : 'CNPJ inválido',
    },
  ];

  const clearInfo = () => {
    setBlockPF([]);
    setBlockPJ([]);
  };

  const checkWidth = () => (window.innerWidth < 400 ? '70%' : '35%');
  const checkWidth2 = () => (window.innerWidth < 400 ? '80%' : '41%');
  const checkGap = () => (window.innerWidth < 400 ? '4rem' : '9rem');

  // Somente usar função se for conta de vendedor
  const getBackgroundPaidCollab = async () => {
    const resultPaidCollab = await getBackgroundRequestsPaid(ownerId);
    return setBackgroundPaidCollaborator(resultPaidCollab);
  };

  // Somente usar função se for conta de vendedor
  const getBackgroundFreeCollab = async () => {
    const resultFreeCollab = await getBackgroundRequestsFree(ownerId);
    return setBackgroundFreeCollaborator(resultFreeCollab);
  };

  useEffect(() => {
    async function getFreeBgCheck() {
      await db
        .collection('suppliers')
        .where('fantasia', '==', fantasy.toUpperCase())
        .onSnapshot(snap => {
          if (!snap.empty) {
            snap.forEach(doc => {
              setFreeBgCheck(doc.data().backgroundCheckRequestsAvailable);
            });
          }
        });
    }

    async function getPaidBgCheck() {
      await db
        .collection('suppliers')
        .where('fantasia', '==', fantasy.toUpperCase())
        .onSnapshot(snap => {
          if (!snap.empty) {
            snap.forEach(doc => {
              setPaidBgCheck(doc.data().backgroundCheckRequestsAvailablePaid);
            });
          }
        });
    }
    getFreeBgCheck();
    getPaidBgCheck();
  }, []);

  useEffect(() => fetch(setIsLoading, setErrorLoading, docId, isCollaborator, ownerId, setState), []);
  useEffect(() => {
    // Busca as consultas caso conta for de vendedor
    {
      role !== '' && getBackgroundPaidCollab();
    }
    {
      role !== '' && getBackgroundFreeCollab();
    }
  }, []);

  const runErrorBgCheck = () => {
    return (
      <Error
        title="Erro ao buscar consultas"
        message="Entre em contato com o suporte para verificar suas consultas."
        type="noData"
        btnMsg="Falar com suporte"
        style={{ display: 'grid', placeItems: 'center', textAlign: 'center', height: '300px', gap: '7px' }}
        backRouteFunction={() => window.open(`https://api.whatsapp.com/send?phone=${supportNumber.supportPhoneNumber.replace(/\+|\s|\(|\)|-/g, '')}`, '_blank')}
      />
    );
  };

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

  if (pendency) return <PendencyDetails pendency={pendency} setPendency={setPendency} />;

  if (partner) return <PartnersDetails partners={partner} setPartners={setPartner} />;

  return (
    <Menu title="Consultar CPF ou CNPJ">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div style={consultasContainer}>
          {!isErrorBgCheck ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%',
                borderRadius: '10px',
                marginBottom: '-22px',
                boxShadow: 'rgba(34, 34, 34, 0.4) 0px 3px 11px -4px',
                justifyContent: 'space-evenly',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'center', gap: checkGap(), padding: '2rem' }}>
                <div style={{ textAlign: 'center' }}>
                  <label style={saldosLabel}>Consultas pagas</label>
                  <h1 style={valorH1}>{role === '' && paidBgCheck !== '' ? paidBgCheck : role === '' && paidBgCheck === '' ? '0' : backgroundPaidCollaborator}</h1>
                </div>

                <div>
                  <label style={saldosLabel}>Consultas gratuitas</label>
                  <h1 style={valorH1}>{role === '' && freeBgCheck !== '' ? freeBgCheck : role === '' && freeBgCheck === '' ? '0' : backgroundFreeCollaborator}</h1>
                </div>
              </div>

              {backgroundCheckRequests + backgroundCheckRequestsPaid <= 2 && (
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '2rem', borderTop: '1px solid rgba(0, 0, 0, 0.07)' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <label style={{ textAlign: 'center' }}>Atenção! Seus créditos estão acabando. Clique no botão abaixo para adquirir mais.</label>
                    <div
                      onClick={() => setLocation('/creditos')}
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        padding: '10px',
                        border: '1px solid rgba(34, 34, 34, 0.2)',
                        width: checkWidth2(),
                        marginTop: '2rem',
                        borderRadius: '25px',
                        cursor: 'pointer',
                        backgroundColor: primaryColor,
                        boxShadow: shadow,
                      }}
                    >
                      <Icon type="plusCircle" size={21} color="#fafafa" style={{ marginRight: '10px' }} />
                      <label style={{ cursor: 'pointer', color: '#fafafa', fontSize: '1.3rem', fontFamily: fontTitle }}>Adquirir créditos</label>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            runErrorBgCheck()
          )}
        </div>

        <Form
          buttonOnTop
          buttonName="Consultar"
          validations={validations}
          sendToBackend={sendToBackend ? sendToBackend({ ...state, clearInfo }) : () => null}
          inputs={[
            <FormInput
              name="document"
              label="CPF ou CNPJ"
              input={
                <InputText
                  value={document}
                  onChange={({ target: { value } }) => {
                    const mask = value.length <= 14 ? '###.###.###-##' : '##.###.###/####-##';
                    setDocument(maskInput(value, mask, true));
                  }}
                  placeholder="000.000.000-00"
                  inputMode="numeric"
                />
              }
            />,
          ]}
        />
        {blockPF.length > 0 && (
          <div style={wrapper}>
            <div style={box1}>
              <ScoreCircle value={scoreValue} maxValue={1000} width={200} lineWidth={20} lineSpacing={1} lineGap={1} maxAngle={210} rotation={90} stepsColors={DEFAULT_STEP_COLORS} fadedOpacity={25} />
            </div>
            <div style={box2}>
              <Details blocks={blockPF} blockGap="20px" />
            </div>
          </div>
        )}
        {blockPJ.length > 0 && <Details blocks={blockPJ} blockGap="20px" />}
      </motion.div>
    </Menu>
  );
};

export default BackgroundCheck;
