import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import Form from '@bit/vitorbarbosa19.ziro.form';
import FormInput from '@bit/vitorbarbosa19.ziro.form-input';
import InputText from '@bit/vitorbarbosa19.ziro.input-text';
import Dropdown from '@bit/vitorbarbosa19.ziro.dropdown';
import capitalize from '@ziro/capitalize';
import { userContext } from '../appContext';
import sendToBackend from './sendToBackend';

const InviteCollaborator = () => {
    const [fname, setFName] = useState('');
    const [lname, setLName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const roleList = ['Vendedor'];
    const { uid, fantasy } = useContext(userContext);
    const state = { uid, supplier: capitalize(fantasy), fname, lname, email, role, setFName, setLName, setEmail, setRole };
    const validations = [
        {
            name: 'fname',
            validation: value => !!value,
            value: fname,
            message: 'Campo obrigatório'
        }, {
            name: 'lname',
            validation: value => !!value,
            value: lname,
            message: 'Campo obrigatório'
        }, {
            name: 'email',
            validation: value => /^\S+@\S+\.\S+$/g.test(value),
            value: email,
            message: 'Email inválido'
        }, {
            name: 'role',
            validation: value => roleList.includes(value),
            value: role,
            message: 'Campo obrigatório'
        }
    ];

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'grid', gridTemplateRows: 'auto 1rm', gridRowGap: '20px' }}>
            <Form
                validations={validations}
                sendToBackend={sendToBackend ? sendToBackend(state) : () => null}
                inputs={[
                    <FormInput name='fname' label='Nome' input={
                        <InputText
                            value={fname}
                            onChange={({ target: { value } }) => setFName(capitalize(value))}
                            placeholder='Nome do colaborador'
                        />
                    } />,
                    <FormInput name='lname' label='Sobrenome' input={
                        <InputText
                            value={lname}
                            onChange={({ target: { value } }) => setLName(capitalize(value))}
                            placeholder='Sobrenome do colaborador'
                        />
                    } />,
                    <FormInput name='role' label='Permissão' input={
                        <Dropdown
                            value={role}
                            onChange={({ target: { value } }) => setRole(value)}
                            onChangeKeyboard={element => element ? setRole(element.value) : null}
                            list={roleList}
                            placeholder="Nível de permissão"
                            readOnly={true}
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
