import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import Form from '@bit/vitorbarbosa19.ziro.form';
import FormInput from '@bit/vitorbarbosa19.ziro.form-input';
import InputText from '@bit/vitorbarbosa19.ziro.input-text';
import Details from '@bit/vitorbarbosa19.ziro.details';
import Spinner from '@bit/vitorbarbosa19.ziro.spinner';
import Error from '@bit/vitorbarbosa19.ziro.error';
import ScoreCircle from '@bit/vitorbarbosa19.ziro.score-circle';
import Button from '@bit/vitorbarbosa19.ziro.button';
import Illustration from '@bit/vitorbarbosa19.ziro.illustration';
import maskInput from '@ziro/mask-input';
import { alertColor } from '@ziro/theme';
import validateDocuments from '../utils/validateDocuments';
import { userContext } from '../appContext';
import { Menu } from '../Menu';
import PendencyDetails from './PendencyDetails';
import PartnersDetails from './PartnersDetails';
import fetch from './fetch';
import sendToBackend from './sendToBackend';
import { apiErrorContainer, box1, box2, header, wrapper } from './styles';

const BackgroundCheck = () => {
    const { docId, role, ownerId } = useContext(userContext);
    const [isLoading, setIsLoading] = useState(true);
    const [errorLoading, setErrorLoading] = useState(false);
    const [apiError, setApiError] = useState(false);
    const [document, setDocument] = useState('');
    const [freeRequests, setFreeRequests] = useState(0);
    const [pendency, setPendency] = useState(null);
    const [partner, setPartner] = useState(null);
    const [scoreValue, setScoreValue] = useState(0);
    const [blockPF, setBlockPF] = useState([]);
    const [blockPJ, setBlockPJ] = useState([]);
    const isCollaborator = role !== '';
    const DEFAULT_STEP_COLORS = ['#a50a0a', '#bc0b0b', '#eb0e0e', '#e68c06', '#ff9b07', '#f8d823', '#ebeb09', '#5deb3e', '#35e60e', '#2fcc0c'];
    const setState = { setDocument, setFreeRequests, setScoreValue, setBlockPF, setBlockPJ, setPendency, setPartner, setApiError };
    const state = { docId, isCollaborator, ownerId, document, freeRequests, ...setState };
    const validations = [
        {
            name: 'document',
            validation: value => process.env.HOMOLOG ? true : validateDocuments(value),
            value: document,
            message: document === '' ? 'Documento inválido' : document.length === 14 ? 'CPF inválido' : 'CNPJ inválido',
        }
    ];

    const clearInfo = () => {
        setBlockPF([]);
        setBlockPJ([]);
    };

    useEffect(() => fetch(setIsLoading, setErrorLoading, docId, isCollaborator, ownerId, setState), []);

    if (isLoading)
        return (
            <div style={{ display: 'grid', justifyItems: 'center' }}>
                <Spinner size="5.5rem" />
            </div>
        );
    if (errorLoading) return <Error />;

    if (apiError) return <div style={apiErrorContainer}>
        <div style={{ justifySelf: 'center' }}>
            <Illustration type='paymentError' />
        </div>
        <label style={header}>Erro na API</label>
        <label>Ocorreu um erro ao consultar o documento. Tente novamente ou contate suporte</label>
        <Button type='button' cta='Voltar' click={() => setApiError(false)} />
    </div>

    if (pendency) return <PendencyDetails pendency={pendency} setPendency={setPendency} />;

    if (partner) return <PartnersDetails partners={partner} setPartners={setPartner} />

    return (
        <Menu title="Consultar CPF ou CNPJ">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div style={{ display: 'grid', justifyContent: 'center', paddingBottom: '20px' }}>
                    <strong style={{ fontSize: '1.5rem', fontFamily: 'Rubik', color: freeRequests ? '#000' : alertColor }} >{freeRequests ? `${freeRequests} consultas gratuitas restantes` : 'Consultas gratuitas esgotadas'}</strong>
                </div>

                <Form
                    buttonOnTop
                    buttonName="Consultar"
                    validations={validations}
                    sendToBackend={sendToBackend ? sendToBackend({ ...state, clearInfo }) : () => null}
                    inputs={[
                        <FormInput name='document' label='CPF ou CNPJ' input={
                            <InputText
                                value={document}
                                onChange={({ target: { value } }) => {
                                    let mask = value.length <= 14 ? '###.###.###-##' : '##.###.###/####-##';
                                    setDocument(maskInput(value, mask, true));
                                }}
                                placeholder='000.000.000-00'
                                inputMode='numeric'
                            />
                        } />
                    ]}
                />
                {blockPF.length > 0 &&
                    <div style={wrapper}>
                        <div style={box1}>
                            <ScoreCircle
                                value={scoreValue}
                                maxValue={1000}
                                width={200}
                                lineWidth={20}
                                lineSpacing={1}
                                lineGap={1}
                                maxAngle={210}
                                rotation={90}
                                stepsColors={DEFAULT_STEP_COLORS}
                                fadedOpacity={25}
                            />
                        </div>
                        <div style={box2}>
                            <Details blocks={blockPF} blockGap='20px' />
                        </div>
                    </div>
                }
                {blockPJ.length > 0 &&
                    <Details blocks={blockPJ} blockGap='20px' />
                }
            </motion.div>
        </Menu>
    )
}

export default BackgroundCheck;
