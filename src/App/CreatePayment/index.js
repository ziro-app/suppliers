import React, { useState, useContext } from 'react';
import maskInput from '@ziro/mask-input';
import sendToBackend from './sendToBackend';
import capitalize from '@ziro/capitalize';
import Form from '@bit/vitorbarbosa19.ziro.form';
import FormInput from '@bit/vitorbarbosa19.ziro.form-input';
import InputText from '@bit/vitorbarbosa19.ziro.input-text';
import InputMoney from '@bit/vitorbarbosa19.ziro.input-money';
import { userContext } from '../appContext';

const CreatePayment = () => {
    const { fantasy, zoopId, docId, role, fname, brand } = useContext(userContext);
    const [charge, setCharge] = useState('');
    const [maxInstallments, setMaxInstallments] = useState('');
    const [observations, setObservations] = useState('');
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
    };

    const validations = [
        {
            name: 'charge',
            validation: value => value > 9 && value <= 3000000,
            value: charge,
            message: 'Deve ser entre 0,10 e 30mil',
        },
        {
            name: 'maxInstallments',
            validation: value => (brand ? parseInt(value) > 0 && parseInt(value) < 5 : parseInt(value) > 0 && parseInt(value) <= 10),
            value: maxInstallments,
            message: brand ? 'Deve ser entre 1 e 4' : 'Deve ser entre 1 e 10',
        },
    ];
    return (
        <Form
            validations={validations}
            sendToBackend={sendToBackend ? sendToBackend(state) : () => null}
            inputs={[
                <FormInput
                    name="charge"
                    label="Valor a cobrar"
                    input={
                        <InputMoney
                            value={charge}
                            setValue={setCharge}
                        />
                    }
                />,
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
