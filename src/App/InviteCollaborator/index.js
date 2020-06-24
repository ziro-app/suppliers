import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import Form from '@bit/vitorbarbosa19.ziro.form';
import FormInput from '@bit/vitorbarbosa19.ziro.form-input';
import InputText from '@bit/vitorbarbosa19.ziro.input-text';
import capitalize from '@ziro/capitalize';
import { userContext } from '../appContext';
import sendToBackend from './sendToBackend';
import { block, title } from './styles';

const InviteCollaborator = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const { uid, fantasy } = useContext(userContext);
    const state = { uid, supplier: capitalize(fantasy), name, email, setName, setEmail };
    const validations = [
        {
            name: 'email',
            validation: value => /^\S+@\S+\.\S+$/g.test(value),
            value: email,
            message: 'Email inválido'
        }
    ];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'grid', gridTemplateRows: 'auto 1rm', gridRowGap: '20px' }}>
            <div style={block}>
                <label style={title}>Como funciona</label>
                <label>Insira o nome e o melhor email da pessoa que deseja adicionar como seu colaborador. Ele receberá um convite e ao realizar o cadastro terá acesso ao aplicativo com privilégios de Colaborador.</label>
            </div>
            <Form
                validations={validations}
                sendToBackend={sendToBackend ? sendToBackend(state) : () => null}
                inputs={[
                    <FormInput name='name' label='Nome' input={
                        <InputText
                            value={name}
                            onChange={({ target: { value } }) => setName(capitalize(value))}
                            placeholder='Nome do colaborador'
                        />
                    } />,
                    <FormInput name='email' label='Email' input={
                        <InputText
                            value={email}
                            onChange={({ target: { value } }) => setEmail(value.toLowerCase())}
                            placeholder='ex@exemplo.com'
                            inputMode='email'
                            autoComplete='email'
                        />
                    } />
                ]}
            />
        </motion.div>
    );
};

export default InviteCollaborator;
