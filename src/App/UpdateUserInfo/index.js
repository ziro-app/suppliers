import React, { useState, useContext, useEffect } from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import InputEdit from '@bit/vitorbarbosa19.ziro.input-edit';
import capitalize from '@ziro/capitalize';
import maskInput from '@ziro/mask-input';
import Error from '@bit/vitorbarbosa19.ziro.error';
import Spinner from '@bit/vitorbarbosa19.ziro.spinner-with-div';
import { userContext } from '../appContext';
import sendToBackend from './sendToBackend';
import GetCnpj from './GetCnpj'
import { help, helpLink } from './style';
import fetch from './fetch';

const UpdateUserInfo = () => {

  const {fname, lname, cpf, cnpj, birthdate, whatsApp, phone, address, neighborhood, cep, city, cityState, userPos, fantasy, reason, zoopId, typeRegister } = useContext(userContext);

  // Part 1
  const [newCnpj, setNewCnpj] = useState(cnpj !== 'undefined' ? cnpj : '');
  const [errorCnpj, setErrorCnpj] = useState('');
  const [loadingCnpj, setLoadingCnpj] = useState(false);
  
  const [newReason, setNewReason] = useState(reason !== 'undefined' ? reason : '');
  const [errorReason, setErrorReason] = useState('');
  const [loadingReason, setLoadingReason] = useState(false);

  const [newFantasy, setNewFantasy] = useState(fantasy !== 'undefined' ? fantasy : '');
  const [errorFantasy, setErrorFantasy] = useState('');
  const [loadingFantasy, setLoadingFantasy] = useState(false);

  const [newCep, setNewCep] = useState(cep !== 'undefined' ? cep : '');
  const [errorCep, setErrorCep] = useState('');
  const [loadingCep, setLoadingCep] = useState(false);
  
  const [newAddress, setNewAddress] = useState(address !== 'undefined' ? address : '');
  const [errorAddress, setErrorAddress] = useState('');
  const [loadingAddress, setLoadingAddress] = useState(false);

  const [street, setStreet] = useState(address.split(',')[0]);
  const [errorStreet, setErrorStreet] = useState('');
  const [loadingStreet, setLoadingStreet] = useState(false);

  const [number, setNumber] = useState(address.split(',')[1]);
  const [errorNumber, setErrorNumber] = useState('');
  const [loadingNumber, setLoadingNumber] = useState(false);

  const [complement, setComplement] = useState(address.split(',')[2]);
  const [errorComplement, setErrorComplement] = useState('');
  const [loadingComplement, setLoadingComplement] = useState(false);

  const [newNeighborhood, setNewNeighborhood] = useState(neighborhood !== 'undefined' ? neighborhood : '');
  const [errorNeighborhood, setErrorNeighborhood] = useState('');
  const [loadingNeighborhood, setLoadingNeighborhood] = useState(false);

  const [newCity, setNewCity] = useState(city !== 'undefined' ? city : '');
  const [errorCity, setErrorCity] = useState('');
  const [loadingCity, setLoadingCity] = useState(false);

  const [newCityState, setNewCityState] = useState(cityState !== 'undefined' ? cityState : '');
  const [errorCityState, setErrorCityState] = useState('');
  const [loadingCityState, setLoadingCityState] = useState(false);

  // const [newPhone, setNewPhone] = useState(phone !== 'undefined' ? phone : '');
  const [newPhone, setNewPhone] = useState(phone && phone.startsWith('55 ') ? phone.replace('55 ', '') : phone);
  const [errorPhone, setErrorPhone] = useState('');
  const [loadingPhone, setLoadingPhone] = useState(false);
  
  // Part 2
  const [newFName, setNewFName] = useState(fname !== 'undefined' ? fname : '');
  const [errorFName, setErrorFName] = useState('');
  const [loadingFName, setLoadingFName] = useState(false);
  
  const [newLName, setNewLName] = useState(lname !== 'undefined' ? lname : '');
  const [errorLName, setErrorLName] = useState('');
  const [loadingLName, setLoadingLName] = useState(false);

  const [newCpf, setNewCpf] = useState(cpf !== 'undefined' ? cpf : '');
  const [errorCpf, setErrorCpf] = useState('');
  const [loadingCpf, setLoadingCpf] = useState(false);

  const [newBirthdate, setNewBirthdate] = useState(birthdate !== 'undefined' ? birthdate : '');
  const [errorBirthdate, setErrorBirthdate] = useState('');
  const [loadingBirthdate, setLoadingBirthdate] = useState(false);

  const [newWhatsApp, setNewWhatsApp] = useState(whatsApp && whatsApp.startsWith('55 ') ? whatsApp.replace('55 ', '') : whatsApp);
  const [errorWhatsApp, setErrorWhatsApp] = useState('');
  const [loadingWhatsApp, setLoadingWhatsApp] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  const supportNumber = require('./supportNumber');
  const [, setLocation] = useLocation();

  const setNewStates = {
    setNewReason, setNewFantasy, setNewCep, setNewAddress, setNewNeighborhood, setNewCity, setNewCityState
  };

  const state = { cnpj, setIsLoading, setIsError, setNewReason, setNewFantasy, setNewCep, setNewAddress, setNewNeighborhood, setNewCity, setNewCityState, setNewPhone, setNewFName, setNewLName, setNewCpf, setNewBirthdate, setNewWhatsApp };
  
  const backendParams = {
    newPhone,
    cnpj,
    newCpf,
    newLName,
    newFName,
    newBirthdate,
    newWhatsApp,
    zoopId,
    setIsLoading,
    typeRegister
  } 

  useEffect(() => {
    fetch(state);
  }, []);

  const validateReason = () => {
    if (newReason !== '') {
      setErrorReason('');
      return true;
    } 
      setErrorReason('Valor inválido');
      return false;
    
  };
  const validateFantasy = () => {
    if (newFantasy !== '') {
      setErrorFantasy('');
      return true;
    } 
      setErrorFantasy('Valor inválido');
      return false;
    
  };
  const validateCep = () => {
    if (/(^\d{5}\-\d{3}$)/.test(newCep)) {
      setErrorCep('');
      return true;
    } 
      setErrorCep('Valor inválido');
      return false;
    
  };
  const validateAddress = () => {
    if (newAddress !== '') {
      setErrorAddress('');
      return true;
    } 
      setErrorAddress('Valor inválido');
      return false;
    
  };
  const validateNeighborhood = () => {
    if (newNeighborhood !== '') {
      setErrorNeighborhood('');
      return true;
    } 
      setErrorNeighborhood('Valor inválido');
      return false;
    
  };
  const validateCity = () => {
    if (newCity !== '') {
      setErrorCity('');
      return true;
    } 
      setErrorCity('Valor inválido');
      return false;
    
  };
  const validateCityState = () => {
    if (newCityState !== '') {
      setErrorCityState('');
      return true;
    } 
      setErrorCityState('Valor inválido');
      return false;
    
  };
  const validatePhone = () => {
    if (newPhone.length <= 14 && newPhone !== "" ? /(^\(\d{2}\) \d{4}\-\d{4}$)/.test(newPhone) : newPhone.length === 15 ? /(^\(\d{2}\) \d{5}\-\d{4}$)/.test(newPhone) : true) {
      setErrorPhone('');
      return true;
    } 
      setErrorPhone('Valor inválido');
      return false;
    
  };
  const validateFName = () => {
    if (newFName !== '') {
      setErrorFName('');
      return true;
    } 
      setErrorFName('Valor inválido');
      return false;
    
  };
  const validateLName = () => {
    if (newLName !== '') {
      setErrorLName('');
      return true;
    } 
      setErrorLName('Valor inválido');
      return false;
    
  };
  const validateCpf = () => {
    if (/(^\d{3}\.\d{3}\.\d{3}\-\d{2}$)/.test(newCpf)) {
      setErrorCpf('');
      return true;
    } 
      setErrorCpf('Valor inválido');
      return false;
    
  };
  const validateBirthdate = () => {
    if (/^(?:(?:31(\/)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/.test(newBirthdate)) {
      setErrorBirthdate('');
      return true;
    } 
      setErrorBirthdate('Valor inválido');
      return false;
    
  };
  const validateWhatsApp = () => {
    if (/(^\(\d{2}\) \d{5}\-\d{4}$)/.test(newWhatsApp)) {
      setErrorWhatsApp('');
      return true;
    } 
      setErrorWhatsApp('Valor inválido');
      return false;
    
  };

  useEffect(() => {
    setNewAddress(!complement ? `${street},${number}` : `${street},${number},${complement}`)
  }, [complement,street,number]);

  const zoopParams = { newReason, street, number, complement, newNeighborhood, newCity, newCityState, newCep };

  if(isError) return <Error />
  if(isLoading) return <Spinner />

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      style={{
        display: 'grid',
        gridTemplateRows: '1fr auto',
        gridRowGap: '5px',
        justifyContent: 'center',
        alignContent: 'center',
      }}
    >
      <label style={{ fontSize: '1.5rem', marginBottom: '10px', textAlign: 'center' }}>Você pode atualizar dados do seu CNPJ pelo botão abaixo, caso já estejam na Receita Federal</label>

      <div style={{ marginBottom: '20px' }}>
        <GetCnpj cnpj={cnpj} setState={setNewStates} setErrorMsg={setErrorMsg} zoopId={zoopId} />
      </div>

      <InputEdit
        name="CNPJ"
        value={newCnpj}
        setError={() => { }}
        editable={false}
      />
      <InputEdit
        name="Razão Social"
        value={newReason}
        onChange={({ target: { value } }) => setNewReason(capitalize(value))}
        validateInput={validateReason}
        setError={() => { }}
        error={errorReason}
        editable={false}
        isLoading={loadingReason}
      />
      <InputEdit
        name="Nome Fantasia"
        value={newFantasy}
        onChange={({ target: { value } }) => setNewFantasy(capitalize(value))}
        validateInput={validateFantasy}
        setError={() => { }}
        error={errorFantasy}
        editable={false}
        isLoading={loadingFantasy}
      />
      <InputEdit
        name="CEP"
        value={newCep}
        onChange={({ target: { value } }) => setNewCep(value)}
        validateInput={validateCep}
        setError={() => { }}
        error={errorCep}
        editable={false}
        isLoading={loadingCep}
      />
      <InputEdit
        name="Rua"
        value={newAddress.split(',')[0]}
        setError={() => { }}
        error={errorStreet}
        editable={false}
        isLoading={loadingStreet}
      />
      <InputEdit
        name="Número"
        value={number && number.startsWith(' ') ? newAddress.split(',')[1].trim() : newAddress.split(',')[1]}
        setError={() => { }}
        error={errorNumber}
        editable={false}
        isLoading={loadingNumber}
      />
      <InputEdit
        name="Complemento"
        value={complement && complement.startsWith(' ') ? newAddress.split(',')[2].trim() : newAddress.split(',')[2]}
        setError={() => { }}
        error={errorComplement}
        editable={false}
        isLoading={loadingComplement}
      />
      <InputEdit
        name="Bairro"
        value={newNeighborhood}
        onChange={({ target: { value } }) => setNewNeighborhood(capitalize(value))}
        validateInput={validateNeighborhood}
        setError={() => { }}
        error={errorNeighborhood}
        editable={false}
        isLoading={loadingNeighborhood}
      />
      <InputEdit
        name="Cidade"
        value={newCity}
        onChange={({ target: { value } }) => setNewCity(capitalize(value))}
        validateInput={validateCity}
        setError={() => { }}
        error={errorCity}
        editable={false}
        isLoading={loadingCity}
      />
      <InputEdit
        name="Estado"
        value={newCityState}
        onChange={({ target: { value } }) => setNewCityState(capitalize(value))}
        validateInput={validateCityState}
        setError={() => { }}
        error={errorCityState}
        editable={false}
        isLoading={loadingCityState}
      />
      <InputEdit
        name="Telefone"
        value={newPhone}
        onChange={({ target: { value } }) => setNewPhone(maskInput(value, value.length <= 14 ? '(##) ####-####' : '(##) #####-####', true))}
        validateInput={validatePhone}
        submit={sendToBackend({...backendParams, setError: setErrorPhone}, zoopParams)}
        setError={() => { }}
        error={errorPhone}
        editable
        isLoading={loadingPhone}
      />
      <InputEdit
        name="Nome"
        value={newFName}
        onChange={({ target: { value } }) => setNewFName(capitalize(value))}
        validateInput={validateFName}
        submit={sendToBackend({...backendParams, setError: setErrorFName}, zoopParams)}
        setError={() => { }}
        error={errorFName}
        editable
        isLoading={loadingFName}
      />
      <InputEdit
        name="Sobrenome"
        value={newLName}
        onChange={({ target: { value } }) => setNewLName(capitalize(value))}
        validateInput={validateLName}
        submit={sendToBackend({...backendParams, setError: setErrorLName}, zoopParams)}
        setError={() => { }}
        error={errorLName}
        editable
        isLoading={loadingLName}
      />
      {typeRegister === "Completo" ?
        <>
          <InputEdit
            name="CPF"
            value={newCpf}
            onChange={({ target: { value } }) => setNewCpf(maskInput(value, '###.###.###-##', true))}
            validateInput={validateCpf}
            submit={sendToBackend({...backendParams, setError: setErrorCpf}, zoopParams)}
            setError={() => { }}
            error={errorCpf}
            editable
            isLoading={loadingCpf}
          />
          <InputEdit
            name="Data de nascimento"
            value={newBirthdate}
            onChange={({ target: { value } }) => setNewBirthdate(maskInput(value, '##/##/####', true))}
            validateInput={validateBirthdate}
            submit={sendToBackend({...backendParams, setError: setErrorBirthdate}, zoopParams)}
            setError={() => { }}
            error={errorBirthdate}
            editable
            isLoading={loadingBirthdate}
          />
        </>
      : null }
      <InputEdit
        name="WhatsApp"
        value={newWhatsApp}
        onChange={({ target: { value } }) => setNewWhatsApp(maskInput(value, '(##) #####-####', true))}
        validateInput={validateWhatsApp}
        submit={sendToBackend({...backendParams, setError: setErrorWhatsApp}, zoopParams)}
        setError={() => { }}
        error={errorWhatsApp}
        editable
        isLoading={loadingWhatsApp}
      />

      <div style={{ paddingTop: '25px' }}>
        <div style={{ padding: '5px 0px', textAlign: 'left' }}>
          <label style={help}>Atualizar o CNPJ, <label onClick={() => window.open(`https://api.whatsapp.com/send?phone=${supportNumber.supportPhoneNumber.replace(/\+|\s|\(|\)|-/g, "")}`, "_blank")}style={helpLink}>fale com suporte</label>.</label>
        </div>

        <div style={{ padding: '5px 0px', textAlign: 'left' }}>
          <label style={help}>Atualizar email/senha, <label onClick={() => setLocation('/minha-conta')} style={helpLink}>acesse aqui</label>.</label>
        </div>

        <div style={{ padding: '5px 0px', textAlign: 'left' }}>
          <label style={help}>Atualizar dados bancários, <label onClick={() => setLocation('/recebiveis/dados-bancarios')}style={helpLink}>acesse aqui</label>.</label>
        </div>
      </div>

    </motion.div>
  );
};

export default UpdateUserInfo;