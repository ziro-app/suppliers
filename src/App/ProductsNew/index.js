import React, { useState, useContext } from 'react';
import Form from '../Componentsv2/Form';
import Title from '../Componentsv2/Title';
import Button from '../Componentsv2/Button';
import { ModalFactory } from '../Componentsv2/Modal';
import { InputText } from '../Componentsv2/Input';
import { userContext } from '../appContext';
import { fs, db, storage } from '../../Firebase/index';

const configModalFactory = { name: 'modal', initialState: { userInput: false } };
const { render: Modal, useState: factoryModalState } = ModalFactory(configModalFactory);

const onSubmit = async state => {
  const successModal = () => (
    <Modal showCloseButton>
      <div style={{ display: 'grid', gridRowGap: '10px' }}>
        <Title>Enviado</Title>
      </div>
    </Modal>
  );
  const failureModal = () => (
    <Modal showCloseButton>
      <div style={{ display: 'grid', gridRowGap: '10px' }}>
        <Title>Erro</Title>
      </div>
    </Modal>
  );
  const { description, price, reference, colors, sizes, uid, Modal, modalState, setModalState } = state;
  const now = fs.FieldValue.serverTimestamp();
  try {
    const docRef = await db.collection('suppliers').doc(uid).collection('products').add({
      dateCreated: now,
      dateUpdated: now,
      supplierUid: uid,
      information: {
        description,
        //   discount,
        //   images,
        price,
        reference,
      },
      variations: {
        colors,
        sizes,
      },
    });
    console.log(docRef);
    return [successModal(), modalState, setModalState];
  } catch (error) {
    console.log(error);
    if (error.response) console.log(error.response);
    return [failureModal(), modalState, setModalState];
  }
};

const Products = () => {
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [reference, setReference] = useState('');
  const [colors, setColors] = useState('');
  const [sizes, setSizes] = useState('');
  const { uid } = useContext(userContext);
  const [modalState, setModalState] = factoryModalState();
  const state = { description, price, reference, colors, sizes, uid, Modal, modalState, setModalState };
  const validations = [
    {
      inputName: 'description',
      validation: value => value.length > 0,
      value: description,
      message: 'Descrição não pode ser vazia',
    },
  ];
  return (
    <Form validations={validations} onSubmit={() => onSubmit(state)}>
      <div>
        <Title size="smallMedium">Descrição</Title>
        <InputText inputName="description" value={description} setValue={setDescription} placeholder="Blusa com alça" />
        <Title size="smallMedium">Preço</Title>
        <InputText inputName="price" value={price} setValue={setPrice} placeholder="R$100,00" />
        <Title size="smallMedium">Referência</Title>
        <InputText inputName="reference" value={reference} setValue={setReference} placeholder="Blusa com alça" />
        <Title size="smallMedium">Cores</Title>
        <InputText inputName="colors" value={colors} setValue={setColors} placeholder="Amarelo,azul" />
        <Title size="smallMedium">Tamanhos</Title>
        <InputText inputName="sizes" value={sizes} setValue={setSizes} placeholder="P,M,G" />
        <Button type="submit" isLoading={false}>
          Enviar produto
        </Button>
      </div>
    </Form>
  );
};

export default Products;
